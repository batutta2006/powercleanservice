
# PowerCleanService – Komplettpaket

Dieses Zip enthält **Frontend (Next.js)** und **Backend (FastAPI)** inkl. fertiger Konfiguration.

## Schnellstart lokal

### Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env  # Variablen anpassen
uvicorn main:app --reload --port 8000
```
API: http://localhost:8000/health

### Frontend
```bash
cd ../frontend
npm install
cp .env.local.example .env.local
npm run dev
```

## Deployment (Render)
- Backend als **Web Service** deployen, Start Command: `uvicorn main:app --host 0.0.0.0 --port 10000`
- Frontend als **Static Site** deployen, Build Command: `npm install && npm run build`, Publish: `out`
- Umgebungsvariablen im Backend setzen: `DATABASE_URL`, `ALLOW_ORIGIN`, `ADMIN_TOKEN`, `NOTIFY_EMAIL`
- Domains: `www.powercleanservice.de` → Frontend, `api.powercleanservice.de` → Backend
