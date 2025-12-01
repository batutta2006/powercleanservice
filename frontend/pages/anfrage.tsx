import { useState } from "react";

type FormState = {
  name: string;
  email: string;
  phone: string;
  address: string;
  services: string[];
  message: string;
  appointment?: string | null;
  consent: boolean;
};

const SERVICES = [
  "Baureinigung",
  "Industriereinigung",
  "Fassadenreinigung",
  "Fenster- und Glasreinigung",
  "Unterhaltsreinigung",
  "Büroreinigung",
  "Facility Management",
  "Hausmeisterdienste",
  "Graffitientfernung",
  "Eventmanagment",
  "Grün- und Außenflächenpflege",
  "Fahrzeugreinigung mit Abhol- und Bringservice",
  "Dach und Photovoltaik Reinigung",
  "Baustellen Überwachung",
];

export default function Anfrage() {
  const [state, setState] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    address: "",
    services: [],
    message: "",
    appointment: null,
    consent: false,
  });
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<null | { ok: boolean; err?: string }>(null);

  const toggleService = (s: string) =>
    setState((p) => ({
      ...p,
      services: p.services.includes(s)
        ? p.services.filter((x) => x !== s)
        : [...p.services, s],
    }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setResult(null);

    // Client-Validierung
    if (!state.name.trim() || !state.email.trim() || !state.phone.trim() || !state.address.trim()) {
      setResult({ ok: false, err: "Bitte alle Pflichtfelder ausfüllen." });
      return;
    }
    if (state.services.length === 0) {
      setResult({ ok: false, err: "Bitte mindestens eine Leistung wählen." });
      return;
    }
    if (!state.consent) {
      setResult({ ok: false, err: "Bitte der Datenverarbeitung zustimmen." });
      return;
    }

    const api = process.env.NEXT_PUBLIC_API_URL!;
    const payload = {
      name: state.name.trim(),
      email: state.email.trim(),
      phone: state.phone.trim(),
      address: state.address.trim(),
      services: state.services,
      message: state.message?.trim() || "",
      appointment: state.appointment ? new Date(state.appointment).toISOString() : null,
    };

    try {
      setSending(true);
      const r = await fetch(`${api}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (r.ok) {
        setResult({ ok: true });
        // Formular zurücksetzen
        setState({
          name: "",
          email: "",
          phone: "",
          address: "",
          services: [],
          message: "",
          appointment: null,
          consent: false,
        });
      } else {
        // Versuche JSON zu parsen, falls das Backend { detail: "..." } schickt
        let errMsg = "Fehler beim Senden.";
        try {
          const json = await r.json();
          if (json.detail) {
            errMsg = json.detail;
          } else if (json.error) {
            errMsg = json.error;
          }
        } catch (e) {
          // Fallback auf Text, falls kein JSON
          const text = await r.text();
          if (text) errMsg = text;
        }
        setResult({ ok: false, err: errMsg });
      }
    } catch (err: any) {
      setResult({ ok: false, err: err?.message || String(err) });
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-3">Anfrage</h1>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Name*</label>
          <input className="w-full border rounded p-2"
            value={state.name}
            onChange={(e) => setState({ ...state, name: e.target.value })} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1">E-Mail*</label>
            <input type="email" className="w-full border rounded p-2"
              value={state.email}
              onChange={(e) => setState({ ...state, email: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm mb-1">Telefon*</label>
            <input className="w-full border rounded p-2"
              value={state.phone}
              onChange={(e) => setState({ ...state, phone: e.target.value })} />
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">Adresse*</label>
          <input className="w-full border rounded p-2"
            placeholder="Straße Hausnr, PLZ Ort"
            value={state.address}
            onChange={(e) => setState({ ...state, address: e.target.value })} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1">Wunschtermin (optional)</label>
            <input type="datetime-local" className="w-full border rounded p-2"
              value={state.appointment ?? ""}
              onChange={(e) => setState({ ...state, appointment: e.target.value || null })} />
          </div>
        </div>

        <div>
          <label className="block text-sm mb-2">Leistungen* (mind. 1)</label>
          <div className="flex flex-wrap gap-2">
            {SERVICES.map((s) => (
              <label key={s} className="inline-flex items-center gap-2 border rounded-full px-3 py-1 text-sm">
                <input type="checkbox"
                  checked={state.services.includes(s)}
                  onChange={() => toggleService(s)} />
                {s}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">Nachricht</label>
          <textarea className="w-full border rounded p-2 min-h-[120px]"
            value={state.message}
            onChange={(e) => setState({ ...state, message: e.target.value })} />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox"
            checked={state.consent}
            onChange={(e) => setState({ ...state, consent: e.target.checked })} />
          Ich stimme zu, dass meine Daten zur Kontaktaufnahme verwendet werden.
        </label>

        <button disabled={sending}
          className="bg-black text-white px-4 py-2 rounded disabled:opacity-60">
          {sending ? "Senden…" : "Anfrage senden"}
        </button>

        {result && result.ok && (
          <p className="text-green-700 mt-2">✅ Anfrage wurde übermittelt. Vielen Dank!</p>
        )}
        {result && !result.ok && (
          <p className="text-red-700 mt-2">❌ {result.err}</p>
        )}
      </form>
    </main>
  );
}
