
# PowerCleanService – Backend (FastAPI)

## Lokal starten
```bash
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env  # Variablen anpassen
uvicorn main:app --reload --port 8000
```
API: http://localhost:8000/health
Admin: http://localhost:8000/admin (mit Header Authorization: Bearer <ADMIN_TOKEN>)
