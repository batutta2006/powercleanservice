
# main.py – FastAPI + Cookie-Login + SQLite + Admin-UI + optional Resend-Mail
from fastapi import FastAPI, APIRouter, HTTPException, Response, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, PlainTextResponse
from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict
from datetime import datetime, date, time
import base64, hmac, json, time as _time
import os

# ---------- optionale Pakete ----------
try:
    import bcrypt
    HAVE_BCRYPT = True
except Exception:
    HAVE_BCRYPT = False

try:
    import resend
    HAVE_RESEND = True
except Exception:
    HAVE_RESEND = False

# =========================
# Einstellungen (.env)
# =========================
ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD_HASH = os.getenv("ADMIN_PASSWORD_HASH", "")
ADMIN_PASSWORD_PLAIN = os.getenv("ADMIN_PASSWORD", "2885")  # Demo, später ändern!
JWT_SECRET = os.getenv("JWT_SECRET", "change-me-please-32bytes-secret")
COOKIE_NAME = "pcs_session"
COOKIE_MAX_AGE = 60 * 60 * 8  # 8h
ALLOW_ORIGINS = os.getenv(
    "ALLOW_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,http://127.0.0.1:3000"
).split(",")
BRAND = os.getenv("BRAND_NAME", "PowerCleanService")

RESEND_API_KEY = os.getenv("RESEND_API_KEY", "")
NOTIFY_EMAIL = os.getenv("NOTIFY_EMAIL", "info@powercleanservice.de")
MAIL_FROM = os.getenv("MAIL_FROM", "noreply@powercleanservice.de")
if HAVE_RESEND and RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY

# =========================
# Mini-JWT (HMAC)
# =========================
def _b64url(data: bytes) -> bytes:
    return base64.urlsafe_b64encode(data).rstrip(b"=")

def _sign(payload: Dict) -> str:
    header = _b64url(json.dumps({"alg": "HS256", "typ": "JWT"}).encode())
    body = _b64url(json.dumps(payload).encode())
    msg = header + b"." + body
    sig = _b64url(hmac.new(JWT_SECRET.encode(), msg, "sha256").digest())
    return (msg + b"." + sig).decode()

def _verify(token: str) -> Optional[Dict]:
    try:
        h, b, s = token.split(".")
        msg = (h + "." + b).encode()
        expect = _b64url(hmac.new(JWT_SECRET.encode(), msg, "sha256").digest()).decode()
        if not hmac.compare_digest(expect, s):
            return None
        payload = json.loads(base64.urlsafe_b64decode(b + "=="))
        if payload.get("exp") and payload["exp"] < int(_time.time()):
            return None
        return payload
    except Exception:
        return None

# =========================
# DB: SQLite (SQLAlchemy)
# =========================
from sqlalchemy import (
    create_engine, Column, Integer, String, Date, Time, DateTime, Text
)
from sqlalchemy.orm import declarative_base, sessionmaker, Session

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./pcs.db")
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, connect_args=connect_args, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class BookingORM(Base):
    __tablename__ = "bookings"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    email = Column(String(200), nullable=False)
    phone = Column(String(120), nullable=True)
    street = Column(String(300), nullable=True)
    zip_city = Column(String(200), nullable=True)
    services = Column(Text, nullable=False, default="")  # kommasepariert
    preferred_date = Column(Date, nullable=True)
    preferred_time = Column(Time, nullable=True)
    message = Column(Text, nullable=True)
    consent = Column(Integer, nullable=False, default=0)  # 0/1
    status = Column(String(30), nullable=False, default="new")
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)

Base.metadata.create_all(bind=engine)

def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def _svc_in(items: List[str]) -> str:
    return ", ".join([s.strip() for s in (items or []) if s and s.strip()])

def _svc_out(s: str) -> List[str]:
    if not s: return []
    return [p.strip() for p in s.split(",") if p.strip()]

# =========================
# Schemas
# =========================
class BookingCreate(BaseModel):
    name: str
    email: EmailStr
    services: List[str]
    message: Optional[str] = None
    appointment: Optional[datetime] = None  # optional ISO (wird gesplittet)
    address: Optional[str] = None
    phone: Optional[str] = None

class BookingOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    phone: Optional[str] = None
    street: Optional[str] = None
    zip_city: Optional[str] = None
    services: List[str] = []
    preferred_date: Optional[date] = None
    preferred_time: Optional[time] = None
    message: Optional[str] = None
    consent: bool = False
    status: str = "new"
    created_at: datetime

class BookingStatusUpdate(BaseModel):
    status: str  # "accepted", "declined" oder "new"

def to_out(b: BookingORM) -> BookingOut:
    return BookingOut(
        id=b.id, name=b.name, email=b.email, phone=b.phone,
        street=b.street, zip_city=b.zip_city,
        services=_svc_out(b.services),
        preferred_date=b.preferred_date, preferred_time=b.preferred_time,
        message=b.message, consent=bool(b.consent),
        status=b.status, created_at=b.created_at
    )

# =========================
# Mail (optional Resend)
# =========================
def send_new_booking_email(b: BookingOut):
    if not (HAVE_RESEND and RESEND_API_KEY):
        return
    subj = "[" + BRAND + "] Neue Anfrage von " + b.name
    services = ", ".join(b.services or [])
    preferred = (b.preferred_date.isoformat() if b.preferred_date else "-")
    if b.preferred_time:
        preferred += " " + b.preferred_time.isoformat()
    msg_html = (b.message or "").replace("<", "&lt;").replace(">", "&gt;").replace("\n", "<br>")
    html = (
        "<h2>Neue Anfrage</h2>"
        "<p><strong>Name:</strong> " + b.name + "</p>"
        "<p><strong>E-Mail:</strong> " + str(b.email) + "</p>"
        "<p><strong>Telefon:</strong> " + (b.phone or "-") + "</p>"
        "<p><strong>Adresse:</strong> " + (b.street or "") + " " + (b.zip_city or "") + "</p>"
        "<p><strong>Leistungen:</strong> " + services + "</p>"
        "<p><strong>Wunschtermin:</strong> " + preferred + "</p>"
        "<p><strong>Nachricht:</strong><br>" + msg_html + "</p>"
        "<hr><small>Automatisch versandt von " + BRAND + ".</small>"
    )
    try:
        resend.Emails.send({
            "from": BRAND + " <" + MAIL_FROM + ">",
            "to": [NOTIFY_EMAIL],
            "subject": subj,
            "html": html
        })
    except Exception:
        pass

# =========================
# Auth Router
# =========================
auth = APIRouter(prefix="/auth", tags=["auth"])

def _check_password(input_password: str) -> bool:
    if ADMIN_PASSWORD_HASH:
        if not HAVE_BCRYPT:
            return False
        try:
            return bcrypt.checkpw(input_password.encode(), ADMIN_PASSWORD_HASH.encode())
        except Exception:
            return False
    return input_password == ADMIN_PASSWORD_PLAIN

@auth.post("/login")
def login(data: dict, response: Response):
    username = data.get("username") or ""
    password = data.get("password") or ""
    if username != ADMIN_USERNAME or not _check_password(password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    now = int(_time.time())
    token = _sign({"sub": username, "role": "admin", "iat": now, "exp": now + COOKIE_MAX_AGE})
    response.set_cookie(
        COOKIE_NAME, token,
        max_age=COOKIE_MAX_AGE, httponly=True, secure=False, samesite="lax", path="/"
    )
    return {"ok": True, "user": username}

@auth.post("/logout")
def logout(response: Response):
    response.delete_cookie(COOKIE_NAME, path="/")
    return {"ok": True}

@auth.get("/me")
def me(request: Request):
    token = request.cookies.get(COOKIE_NAME)
    if not token or not _verify(token):
        raise HTTPException(status_code=401, detail="Unauthorized")
    return {"ok": True}

def require_admin(request: Request):
    token = request.cookies.get(COOKIE_NAME)
    payload = _verify(token) if token else None
    if not payload or payload.get("role") != "admin":
        raise HTTPException(status_code=401, detail="Unauthorized")
    return payload

# =========================
# API Router
# =========================
api = APIRouter(prefix="/api", tags=["bookings"])

@api.post("/bookings", response_model=BookingOut, status_code=201)
def create_booking(payload: BookingCreate, db: Session = Depends(get_db)):
    preferred_date = None
    preferred_time = None
    street = None
    zip_city = None
    if payload.appointment:
        preferred_date = payload.appointment.date()
        preferred_time = payload.appointment.time()
    if payload.address:
        parts = [p.strip() for p in payload.address.split(",")]
        if parts:
            street = parts[0]
        if len(parts) > 1:
            zip_city = parts[1]

    row = BookingORM(
        name=payload.name.strip(),
        email=str(payload.email).strip(),
        phone=(payload.phone or "").strip() or None,
        street=street, zip_city=zip_city,
        services=_svc_in(payload.services),
        preferred_date=preferred_date, preferred_time=preferred_time,
        message=(payload.message or "").strip() or None,
        consent=0, status="new", created_at=datetime.utcnow()
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    out = to_out(row)
    send_new_booking_email(out)
    return out

@api.get("/bookings", response_model=List[BookingOut], dependencies=[Depends(require_admin)])
def list_bookings(db: Session = Depends(get_db)):
    rows = db.query(BookingORM).order_by(BookingORM.created_at.desc()).all()
    return [to_out(r) for r in rows]

@api.patch("/bookings/{booking_id}/status", dependencies=[Depends(require_admin)])
def update_status(booking_id: int, body: BookingStatusUpdate, db: Session = Depends(get_db)):
    row = db.query(BookingORM).filter(BookingORM.id == booking_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="not found")
    if body.status not in ("accepted", "declined", "new"):
        raise HTTPException(status_code=400, detail="invalid status")
    row.status = body.status
    db.commit()
    db.refresh(row)
    return {"ok": True}

@api.delete("/bookings/{booking_id}", status_code=204, dependencies=[Depends(require_admin)])
def delete_booking(booking_id: int, db: Session = Depends(get_db)):
    row = db.query(BookingORM).filter(BookingORM.id == booking_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="not found")
    db.delete(row)
    db.commit()

# =========================
# App + Admin-UI
# =========================
app = FastAPI(title=BRAND + " API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOW_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth)
app.include_router(api)

@app.get("/health")
def health():
    return {"ok": True}

@app.get("/favicon.ico", response_class=PlainTextResponse)
def favicon():
    return ""

# --- Admin HTML (ein Script-Block, robust) ---
INDEX_HTML = """
<!doctype html>
<html lang="de"><head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>""" + BRAND + """ • Admin</title>
  <style>
    :root{color-scheme:dark light}
    body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,'Helvetica Neue',Arial;margin:0;background:#0b0d10;color:#e9eef3}
    header{display:flex;justify-content:space-between;align-items:center;padding:16px 20px;background:#11151a;border-bottom:1px solid #1d232b}
    .wrap{padding:20px}
    .card{background:#11151a;border:1px solid #1d232b;border-radius:14px;padding:16px}
    input,button,select{font:inherit}
    input,select{background:#0b0d10;border:1px solid #2a3240;border-radius:10px;color:#e9eef3;padding:10px}
    button{background:#3b82f6;color:white;border:none;border-radius:10px;padding:10px 14px;cursor:pointer}
    button[disabled]{opacity:.6;cursor:not-allowed}
    table{width:100%;border-collapse:collapse}
    th,td{padding:10px;border-bottom:1px solid #1d232b;text-align:left;font-size:14px}
    .muted{opacity:.7}
    .row{display:flex;gap:10px;align-items:center}
    .right{margin-left:auto}
    .badge{font-size:12px;background:#1f2937;border:1px solid #2b3547;border-radius:999px;padding:3px 8px}
    .toast{position:fixed;bottom:16px;right:16px;background:#11151a;border:1px solid #1d232b;border-radius:12px;padding:12px 14px;display:none}
    .dialog{position:fixed;inset:0;background:rgba(0,0,0,.45);display:none;align-items:center;justify-content:center}
    .dialog>div{background:#0f1318;border:1px solid #202838;border-radius:14px;width:min(560px,92vw);padding:18px}
    .ellipsis{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:520px;display:inline-block}
  </style>
</head>
<body>
  <header>
    <strong>""" + BRAND + """ • Admin</strong>
    <div class="row right">
      <span id="user" class="badge">Gast</span>
      <button id="logoutBtn" style="display:none;margin-left:8px">Logout</button>
    </div>
  </header>

  <div class="wrap">
    <div id="loginCard" class="card" style="max-width:420px;display:none">
      <h3>Login</h3>
      <p class="muted" style="margin-top:-6px">Bitte Benutzername & Passwort eingeben.</p>
      <form id="loginForm" class="row" style="flex-direction:column;align-items:stretch">
        <input id="username" placeholder="Benutzername" autocomplete="username" />
        <input id="password" placeholder="Passwort" type="password" autocomplete="current-password" />
        <button id="loginBtn">Anmelden</button>
        <div id="loginErr" class="muted" style="color:#f87171;display:none">Login fehlgeschlagen</div>
      </form>
    </div>

    <div id="dash" style="display:none">
      <div class="row" style="margin-bottom:12px">
        <div class="card" style="flex:1">
          <div class="muted" style="font-size:12px">Buchungen gesamt</div>
          <div id="total" style="font-size:22px;font-weight:700">0</div>
        </div>
        <div class="card" style="flex:2">
          <div class="row">
            <input id="search" placeholder="Suche nach Name/Email/Service…" style="flex:1" />
            <select id="statusFilter">
              <option value="">Alle Status</option>
              <option value="new">Neu</option>
              <option value="accepted">Angenommen</option>
              <option value="declined">Abgelehnt</option>
            </select>
            <button id="reloadBtn">Aktualisieren</button>
          </div>
        </div>
      </div>

      <div class="card">
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Name</th><th>E-Mail</th><th>Telefon</th><th>Services</th><th>Nachricht</th><th>Eingang</th><th>Status</th><th>Aktion</th>
            </tr>
          </thead>
          <tbody id="rows"></tbody>
        </table>
      </div>
    </div>
  </div>

  <div id="dialog" class="dialog" role="dialog" aria-modal="true">
    <div>
      <div class="row">
        <strong>Nachricht</strong>
        <button onclick="document.getElementById('dialog').style.display='none'" class="right">Schließen</button>
      </div>
      <pre id="msgBox" style="white-space:pre-wrap;margin-top:10px" class="muted"></pre>
    </div>
  </div>

  <div id="toast" class="toast"></div>

  <script>
  const $ = (id)=>document.getElementById(id);
  const userEl = $("user"), logoutBtn = $("logoutBtn");
  const loginCard = $("loginCard"), dash = $("dash");
  const rows = $("rows"), total = $("total"), toast = $("toast");
  const dlg = $("dialog"), msgBox = $("msgBox");
  const search = $("search"), statusFilter = $("statusFilter");

  function showToast(t){ toast.textContent=t; toast.style.display="block"; setTimeout(()=>toast.style.display="none", 1800); }
  function showDialog(msg){ msgBox.textContent = msg || "—"; dlg.style.display="flex"; }

  async function checkAuth(){
    const r = await fetch("/auth/me", { credentials: "include" });
    const authed = r.ok;
    userEl.textContent = authed ? "Admin" : "Gast";
    logoutBtn.style.display = authed ? "" : "none";
    loginCard.style.display = authed ? "none" : "";
    dash.style.display = authed ? "" : "none";
    if (authed) loadBookings();
  }

  async function login(e){
    e.preventDefault();
    $("loginErr").style.display = "none";
    const body = { username: $("username").value, password: $("password").value };
    const r = await fetch("/auth/login", {
      method:"POST", headers:{"Content-Type":"application/json"},
      credentials:"include", body: JSON.stringify(body)
    });
    if(r.ok){ showToast("Eingeloggt"); checkAuth(); }
    else{ $("loginErr").style.display = ""; }
  }
  $("loginForm").addEventListener("submit", login);

  logoutBtn.addEventListener("click", async ()=>{
    await fetch("/auth/logout", { method:"POST", credentials:"include" });
    showToast("Ausgeloggt");
    checkAuth();
  });

  $("reloadBtn").addEventListener("click", ()=>loadBookings());

  async function loadBookings(){
    const r = await fetch("/api/bookings", { credentials:"include" });
    if(!r.ok){ showToast("Laden fehlgeschlagen"); return; }
    const data = await r.json();

    const q = (search.value || "").toLowerCase();
    const st = statusFilter.value || "";
    const filtered = data.filter(b=>{
      const hay = [b.name, b.email, (b.services||[]).join(","), b.message||""].join(" ").toLowerCase();
      const okQ = !q || hay.includes(q);
      const okS = !st || (b.status||"").toLowerCase() === st;
      return okQ && okS;
    });

    total.textContent = data.length;
    rows.innerHTML = "";
    for (const b of filtered){
      const tr = document.createElement("tr");
      const safe = (s)=>String(s||"").replaceAll('"','&quot;');
      const msgShort = b.message ? (b.message.length>60 ? b.message.slice(0,60)+"…" : b.message) : "—";
      tr.innerHTML = `
        <td>${b.id}</td>
        <td>${b.name}</td>
        <td class="muted">${b.email}</td>
        <td>${b.phone || "—"}</td>
        <td>${(b.services||[]).join(", ")}</td>
        <td><span class="ellipsis" title="${safe(b.message)}">${msgShort}</span></td>
        <td class="muted">${new Date(b.created_at).toLocaleString()}</td>
        <td><span class="badge">${b.status||"new"}</span></td>
        <td class="row">
          <button class="viewBtn" data-msg="${safe(b.message)}">Details</button>
          <button onclick="changeStatus(${b.id}, 'accepted')">Annehmen</button>
          <button onclick="changeStatus(${b.id}, 'declined')" style="background:#dc2626">Ablehnen</button>
        </td>`;
      rows.appendChild(tr);
    }

    document.querySelectorAll(".viewBtn").forEach(btn=>{
      btn.addEventListener("click", (e)=> showDialog(e.target.getAttribute("data-msg")));
    });
  }

  async function changeStatus(id, status){
    const r = await fetch(`/api/bookings/${id}/status`, {
      method: "PATCH",
      headers: {"Content-Type":"application/json"},
      credentials: "include",
      body: JSON.stringify({ status })
    });
    if (r.ok){ showToast("Status geändert: " + status); loadBookings(); }
    else { showToast("Fehler: " + (await r.text())); }
  }

  window.addEventListener("DOMContentLoaded", checkAuth);
  </script>
</body></html>
"""

@app.get("/", response_class=HTMLResponse)
def root():
    return '<meta http-equiv="refresh" content="0; url=/admin">'

@app.get("/admin", response_class=HTMLResponse)
def admin_page():
    return HTMLResponse(INDEX_HTML)

REQUEST_HTML = """
<!doctype html><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>PowerCleanService – Anfrage</title>
<style>
  body{font-family:system-ui,-apple-system,Segoe UI,Roboto;max-width:760px;margin:20px auto;padding:0 14px}
  h1{margin:0 0 10px}
  .card{background:#f7f7f8;border:1px solid #e6e6eb;border-radius:12px;padding:16px}
  label{display:block;margin:10px 0 6px}
  input,textarea,select,button{font:inherit}
  input,textarea,select{width:100%;padding:10px;border:1px solid #d0d7e2;border-radius:10px}
  textarea{min-height:100px}
  .row{display:flex;gap:8px;flex-wrap:wrap}
  .row>*{flex:1}
  .services{display:flex;gap:10px;flex-wrap:wrap}
  .chip{display:inline-flex;align-items:center;gap:6px;border:1px solid #d0d7e2;border-radius:999px;padding:6px 10px}
  .mt{margin-top:12px}
  .ok{color:#0a7b38}
  .err{color:#b91c1c}
</style>
<h1>PowerCleanService – Anfrage</h1>
<p>Wählen Sie Leistungen, geben Sie Kontakt & Terminwunsch an. Wir melden uns umgehend.</p>
<div class="card">
  <form id="f">
    <label>Name*</label><input id="name" required>
    <label>E-Mail*</label><input id="email" type="email" required>
    <div class="row">
      <div><label>Telefon</label><input id="phone"></div>
      <div><label>Termin (Datum/Zeit)</label><input id="dt" type="datetime-local"></div>
    </div>
    <label>Adresse</label><input id="addr" placeholder="Straße Hausnr, PLZ Ort">
    <label>Leistungen*</label>
    <div class="services" id="svcs"></div>
    <label>Nachricht</label><textarea id="msg" placeholder="Ihr Anliegen…"></textarea>
    <button class="mt">Anfrage senden</button>
    <div id="out" class="mt"></div>
  </form>
</div>
<script>
const S = [
 "Baureinigung","Industriereinigung","Fassadenreinigung","Fenster- und Glasreinigung",
 "Unterhaltsreinigung","Büroreinigung","Facility Management","Hausmeisterdienste",
 "Graffitientfernung","Eventmanagment","Grün- und Außenflächenpflege",
 "Fahrzeugreinigung mit Abhol- und Bringservice","Dach und Photovoltaik Reinigung","Baustellen Überwachung"
];
const svcs = document.getElementById("svcs");
S.forEach(txt=>{
  const id="s_"+txt.replace(/[^a-z0-9]/ig,"");
  svcs.insertAdjacentHTML("beforeend",
    `<label class="chip"><input type="checkbox" id="${id}" value="${txt}"> ${txt}</label>`);
});
document.getElementById("f").addEventListener("submit", async (e)=>{
  e.preventDefault();
  const selected = [...svcs.querySelectorAll("input:checked")].map(i=>i.value);
  if(!selected.length){ alert("Bitte mindestens eine Leistung auswählen."); return; }
  const body = {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    services: selected,
    message: document.getElementById("msg").value,
    appointment: document.getElementById("dt").value ? new Date(document.getElementById("dt").value).toISOString() : null,
    address: document.getElementById("addr").value,
    phone: document.getElementById("phone").value
  };
  const r = await fetch("/api/bookings", {method:"POST", headers:{ "Content-Type":"application/json"}, body: JSON.stringify(body)});
  const out = document.getElementById("out");
  if(r.ok){
    out.innerHTML = "<span class='ok'>✅ Anfrage wurde übermittelt. Vielen Dank!</span>";
    e.target.reset();
    svcs.querySelectorAll("input:checked").forEach(i=>i.checked=false);
  }else{
    out.innerHTML = "<span class='err'>❌ Fehler: "+(await r.text())+"</span>";
  }
});
</script>
"""

@app.get("/request", response_class=HTMLResponse, include_in_schema=False)
def public_request_page():
    return HTMLResponse(REQUEST_HTML)


