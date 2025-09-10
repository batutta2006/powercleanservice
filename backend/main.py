# main.py – SMTP-only Mail API (keine DB, kein Admin)
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, field_validator
from typing import List, Optional
from datetime import datetime
import os, smtplib, ssl
from email.message import EmailMessage

from fastapi.responses import FileResponse
import os

@app.get("/favicon.ico")
def favicon():
    return FileResponse(os.path.join("frontend", "public", "favicon.ico"))

# ----- Konfiguration über ENV -----
BRAND     = os.getenv("BRAND_NAME", "PowerCleanService")
MAIL_TO   = os.getenv("MAIL_TO", "info@powercleanservice.de")             # Empfänger
MAIL_FROM = os.getenv("MAIL_FROM", "info@powercleanservice.de")           # Absender
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.ionos.de")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "info@powercleanservice.de")
SMTP_PASS = os.getenv("SMTP_PASS", "")

allow_origins = [o.strip() for o in os.getenv("ALLOW_ORIGINS", "").split(",") if o.strip()]
app = FastAPI(title=f"{BRAND} Mail API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----- Schemas & Validatoren -----
class BookingIn(BaseModel):
    name: str
    email: EmailStr
    phone: str
    address: str
    services: List[str]
    message: Optional[str] = None
    appointment: Optional[str] = None  # ISO-String, z.B. "2025-09-10T12:00:00Z"

    @field_validator("name", "phone", "address")
    @classmethod
    def _not_empty(cls, v: str):
        if not (v or "").strip():
            raise ValueError("Pflichtfeld")
        return v

    @field_validator("services")
    @classmethod
    def _one_service(cls, v: List[str]):
        if not v or len([s for s in v if s and s.strip()]) == 0:
            raise ValueError("Mindestens eine Leistung wählen")
        return v

# ----- Mailversand -----
def send_booking_mail(b: BookingIn):
    if not (SMTP_HOST and SMTP_USER and SMTP_PASS and MAIL_TO and MAIL_FROM):
        raise RuntimeError("SMTP ist nicht konfiguriert")

    subj = f"[{BRAND}] Neue Anfrage von {b.name}"
    lines = [
        f"Neue Anfrage ({datetime.utcnow().isoformat(timespec='seconds')} UTC)\n",
        f"Name: {b.name}",
        f"E-Mail: {b.email}",
        f"Telefon: {b.phone}",
        f"Adresse: {b.address}",
        f"Leistungen: {', '.join(b.services)}",
        f"Wunschtermin: {b.appointment or '-'}",
        "",
        "Nachricht:",
        b.message or "-",
    ]

    msg = EmailMessage()
    msg["From"] = f"{BRAND} <{MAIL_FROM}>"
    msg["To"] = MAIL_TO
    msg["Subject"] = subj
    msg.set_content("\n".join(lines))

    ctx = ssl.create_default_context()
    with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=20) as s:
        s.starttls(context=ctx)
        s.login(SMTP_USER, SMTP_PASS)
        s.send_message(msg)

# ----- Routen -----
@app.get("/health")
def health():
    return {"ok": True, "service": BRAND}

@app.post("/api/bookings")
@app.post("/bookings")
def create_booking(payload: BookingIn):
    try:
        send_booking_mail(payload)
        return {"ok": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
