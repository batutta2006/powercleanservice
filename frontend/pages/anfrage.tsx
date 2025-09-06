// frontend/pages/anfrage.tsx
import { useState } from "react";

export default function Anfrage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState("");

  const api = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api").replace(
    /\/$/,
    ""
  );

  const toggleService = (svc: string) => {
    setServices((prev) =>
      prev.includes(svc) ? prev.filter((s) => s !== svc) : [...prev, svc]
    );
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("Sende…");

    const payload: any = {
      name,
      email,
      phone: phone || undefined,
      address: address || undefined,
      services,
      message: message || undefined,
    };

    if (date || time) {
      payload.appointment = `${date || new Date().toISOString().slice(0, 10)}T${
        time || "09:00"
      }:00`;
    }

    const res = await fetch(`${api}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setStatus("✅ Anfrage erfolgreich gesendet!");
      setName("");
      setEmail("");
      setPhone("");
      setAddress("");
      setMessage("");
      setServices([]);
      setDate("");
      setTime("");
      setConsent(false);
    } else {
      const txt = await res.text();
      setStatus("❌ Fehler: " + txt);
    }
  }

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">Anfrage starten</h1>
      <form
        onSubmit={handleSubmit}
        className="grid gap-6 md:grid-cols-3 bg-white p-6 rounded-2xl shadow-sm border"
      >
        {/* Formularfelder */}
        <div className="md:col-span-2 grid gap-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm">Name*</label>
              <input
                className="w-full border rounded-xl p-3"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm">E-Mail*</label>
              <input
                type="email"
                className="w-full border rounded-xl p-3"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm">Telefon</label>
              <input
                className="w-full border rounded-xl p-3"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm">Adresse</label>
              <input
                className="w-full border rounded-xl p-3"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>

          <fieldset>
            <legend className="font-semibold">Leistungen*</legend>
            <div className="grid sm:grid-cols-2 gap-2 mt-2">
              {[
                "Baureinigung",
                "Industriereinigung",
                "Fassadenreinigung",
                "Fenster- & Glasreinigung",
                "Unterhaltsreinigung",
                "Büroreinigung",
                "Facility Management",
                "Hausmeisterdienste",
                "Graffitientfernung",
                "Eventmanagement (Reinigung)",
                "Grün- & Außenflächenpflege",
                "Fahrzeugreinigung (Abhol- & Bringservice)",
                "Dach- & Photovoltaikreinigung",
                "Baustellenüberwachung",
              ].map((svc) => (
                <label key={svc} className="block text-sm">
                  <input
                    type="checkbox"
                    checked={services.includes(svc)}
                    onChange={() => toggleService(svc)}
                  />{" "}
                  {svc}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm">Wunschtermin (Datum)</label>
              <input
                type="date"
                className="w-full border rounded-xl p-3"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm">Uhrzeit</label>
              <input
                type="time"
                className="w-full border rounded-xl p-3"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>

          <label className="block">
            Nachricht
            <textarea
              className="w-full border rounded-xl p-3 mt-1"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
            />
            Ich stimme zu, dass meine Daten zur Kontaktaufnahme verwendet werden.
          </label>

          <button
            type="submit"
            className="px-5 py-3 rounded-xl bg-black text-white"
          >
            Anfrage senden
          </button>

          {status && <p className="mt-2 text-sm">{status}</p>}
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          <div className="border p-4 rounded-xl">
            <p className="font-semibold">Warum wir?</p>
            <ul className="list-disc pl-4 text-sm text-gray-600 mt-2 space-y-1">
              <li>Deutsches Handwerk seit 2009</li>
              <li>Transparente Prozesse</li>
              <li>Zuverlässig & professionell</li>
            </ul>
          </div>
          <div className="border p-4 rounded-xl">
            <p className="font-semibold">Kontakt</p>
            <p className="text-sm text-gray-600 mt-1">
              Tel.: 0174 9254 925<br />
              E-Mail: info@powercleanservice.de
            </p>
          </div>
        </aside>
      </form>
    </main>
  );
}
