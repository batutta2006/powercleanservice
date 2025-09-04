// frontend/pages/index.tsx
import React, { useMemo, useRef, useState, useEffect } from "react";

// Wenn du Header/Footer-Komponenten hast, nutze sie – sonst weglassen.
import Header from "../components/Header";
import Footer from "../components/Footer";

/* Leistungen (Kurzliste für Chips) */
const SERVICES = [
  { slug: "baureinigung", title: "Baureinigung" },
  { slug: "industriereinigung", title: "Industriereinigung" },
  { slug: "fassadenreinigung", title: "Fassadenreinigung" },
  { slug: "glasreinigung", title: "Fenster- & Glasreinigung" },
  { slug: "unterhaltsreinigung", title: "Unterhaltsreinigung" },
  { slug: "bueroreinigung", title: "Büroreinigung" },
  { slug: "facility-management", title: "Facility Management" },
  { slug: "hausmeisterdienste", title: "Hausmeisterdienste" },
  { slug: "graffitientfernung", title: "Graffitientfernung" },
  { slug: "eventreinigung", title: "Eventmanagement (Reinigung)" },
  { slug: "aussenflaechen", title: "Grün- & Außenflächenpflege" },
  { slug: "fahrzeugreinigung", title: "Fahrzeugreinigung (Abhol- & Bringservice)" },
  { slug: "pv-dachreinigung", title: "Dach- & Photovoltaikreinigung" },
  { slug: "baustellenueberwachung", title: "Baustellenüberwachung" },
] as const;

const apiBase = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api").replace(/\/$/, "");
const label = "block text-sm text-gray-700";
const input = "mt-1 w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-black/60 focus:border-black/60";

/* ---------- Chips-Komponente ---------- */
function ServicePicker({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (s: string[]) => void;
}) {
  const toggle = (slug: string) => {
    const set = new Set(selected);
    set.has(slug) ? set.delete(slug) : set.add(slug);
    onChange(Array.from(set));
  };

  return (
    <div className="flex flex-wrap gap-2">
      {SERVICES.map((s) => {
        const active = selected.includes(s.slug);
        return (
          <button
            key={s.slug}
            type="button"
            onClick={() => toggle(s.slug)}
            className={[
              "px-3 py-2 rounded-full text-sm border transition",
              active
                ? "bg-black text-white border-black"
                : "bg-white text-gray-700 border-gray-300 hover:border-black",
            ].join(" ")}
            aria-pressed={active}
          >
            {s.title}
          </button>
        );
      })}
    </div>
  );
}

/* ---------- Formular ---------- */
function BookingForm({ initial }: { initial: string[] }) {
  const [services, setServices] = useState<string[]>(initial);
  // 👉 Synchronisiere, wenn sich initial ändert (Fix für „oben klicken → unten übernehmen“)
  useEffect(() => setServices(initial), [initial]);

  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    message: "",
    date: "",
    time: "",
    consent: false,
  });
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");

  const selectedNames = useMemo(
    () =>
      services
        .map((slug) => SERVICES.find((s) => s.slug === slug)?.title)
        .filter(Boolean)
        .join(", "),
    [services]
  );

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!data.name || !data.email || services.length === 0 || !data.consent) {
      setStatus("error");
      return;
    }
    setStatus("sending");

    const payload: Record<string, unknown> = {
      name: data.name,
      email: data.email,
      phone: data.phone || undefined,
      address: data.address || undefined,
      services,
      message: data.message || undefined,
    };
    if (data.date || data.time) {
      const dt = `${data.date || new Date().toISOString().slice(0, 10)}T${data.time || "09:00"}:00`;
      payload.appointment = dt;
    }

    const r = await fetch(`${apiBase}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setStatus(r.ok ? "ok" : "error");
    if (r.ok) {
      setData({ name: "", email: "", phone: "", address: "", message: "", date: "", time: "", consent: false });
      setServices([]);
    }
  }

  return (
    <section id="anfrage" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <h2 className="text-2xl md:text-3xl font-bold">Anfrage starten</h2>
        <p className="text-gray-600 mt-1">Wählen Sie Leistungen, Termin & senden Sie Ihre Anfrage in Sekunden.</p>

        <div className="mt-4">
          <p className={label}>Leistungen*</p>
          <ServicePicker selected={services} onChange={setServices} />
          {selectedNames && <p className="text-xs text-gray-500 mt-2">Ausgewählt: {selectedNames}</p>}
        </div>

        <form onSubmit={submit} className="mt-6 grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 grid gap-6">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className={label}>Name*</label>
                <input className={input} value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} placeholder="Max Mustermann" />
              </div>
              <div>
                <label className={label}>E-Mail*</label>
                <input type="email" className={input} value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} placeholder="max@example.com" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className={label}>Telefon</label>
                <input className={input} value={data.phone} onChange={(e) => setData({ ...data, phone: e.target.value })} placeholder="+49 …" />
              </div>
              <div>
                <label className={label}>Adresse</label>
                <input className={input} value={data.address} onChange={(e) => setData({ ...data, address: e.target.value })} placeholder="Straße Nr., PLZ Ort" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className={label}>Wunschtermin (Datum)</label>
                <input type="date" className={input} value={data.date} onChange={(e) => setData({ ...data, date: e.target.value })} />
              </div>
              <div>
                <label className={label}>Uhrzeit</label>
                <input type="time" className={input} value={data.time} onChange={(e) => setData({ ...data, time: e.target.value })} />
              </div>
            </div>

            <div>
              <label className={label}>Objektbeschreibung (optional)</label>
              <textarea className={input} rows={5} value={data.message} onChange={(e) => setData({ ...data, message: e.target.value })} placeholder="Größe, Besonderheiten, Zugang, Fotos etc." />
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={data.consent} onChange={(e) => setData({ ...data, consent: e.target.checked })} />
              Ich stimme zu, dass meine Daten zur Kontaktaufnahme verwendet werden.
            </label>

            <div className="flex items-center gap-3">
              <button type="submit" disabled={status === "sending"} className="px-5 py-3 rounded-xl bg-black text-white hover:opacity-90 disabled:opacity-60">
                Anfrage senden
              </button>
              {status === "ok" && <span className="text-green-600 text-sm">Vielen Dank! Wir melden uns.</span>}
              {status === "error" && <span className="text-red-600 text-sm">Bitte Pflichtfelder prüfen & mindestens eine Leistung wählen.</span>}
            </div>
          </div>

          <aside className="space-y-4">
            <div className="border border-gray-200 rounded-2xl p-4">
              <p className="font-semibold">Warum wir?</p>
              <ul className="mt-2 text-sm text-gray-600 list-disc pl-5 space-y-1">
                <li>Transparente Prozesse & schneller Rückruf</li>
                <li>Deutsches Handwerk seit 2009</li>
                <li>Versichert, zuverlässig, professionell</li>
              </ul>
            </div>
            <div className="border border-gray-200 rounded-2xl p-4">
              <p className="font-semibold">Direktkontakt</p>
              <p className="text-sm text-gray-600 mt-1">
                Tel.: 0174 9254 925<br />E-Mail: info@powercleanservice.de
              </p>
            </div>
          </aside>
        </form>
      </div>
    </section>
  );
}

/* ---------- Seite ---------- */
export default function Home() {
  const [selected, setSelected] = useState<string[]>([]);
  const formRef = useRef<HTMLDivElement>(null);
  const goToForm = () => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <main>
      {/* Verwende genau EINE Navi/Footerkombination — hier über Komponenten */}
      <Header />

      {/* HERO */}
<section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
  <div
    className="relative rounded-3xl overflow-hidden p-6 sm:p-10"
    style={{
      backgroundImage: "url('/images/hero/hero.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
    {/* Overlay für Lesbarkeit */}
    <div className="absolute inset-0 bg-black/25"></div>

    {/* Inhalt */}
    <div className="relative">
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">
        Glanz. Hygiene. <span className="text-red-500">Power.</span>
      </h1>
      <p className="text-white/90 mt-3 max-w-2xl">
        Wählen Sie Leistungen, Termin & senden Sie Ihre Anfrage in Sekunden unverbindlich.
      </p>

      <div className="mt-4">
        <ServicePicker selected={selected} onChange={setSelected} />
      </div>

      <div className="mt-6 flex gap-3">
        <button onClick={goToForm} className="px-5 py-3 rounded-xl bg-black/80 text-white backdrop-blur hover:bg-black">
          Jetzt Angebot anfragen
        </button>
        <a href="#leistungen" className="px-5 py-3 rounded-xl bg-white/90 border hover:bg-white">
          Leistungen ansehen
        </a>
      </div>
    </div>
  </div>
</section>

          {/* Langjährige zufriedene Kunden */}
          <section id="kunden" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Langjährige zufriedene Kunden</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 items-center">
                  <img src="/images/logos/KiK.png" alt="KiK" className="max-h-24 mx-auto object-contain" />
                  <img src="/images/logos/VZF.png" alt="Verein zur Förderung" className="max-h-24 mx-auto object-contain" />
                  <img src="/images/logos/Goldbeck.png" alt="Goldbeck" className="max-h-24 mx-auto object-contain" />
                  <img src="/images/logos/Leonhard.png" alt="Leonhard" className="max-h-24 mx-auto object-contain" />
                  <img src="/images/logos/CleanGarant.png" alt="CleanGarant" className="max-h-24 mx-auto object-contain" />
              </div>
          </section>



      {/* Leistungs-Grid mit Bildern */}
      <section id="leistungen" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl md:text-3xl font-bold">Unsere Leistungen</h2>
        <p className="text-gray-600 mt-1">Triff eine Auswahl – unten im Formular ist sie bereits eingetragen.</p>

        <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {SERVICES.map((s) => (
            <a key={s.slug} href={`/services/${s.slug}`} className="block border rounded-2xl overflow-hidden hover:shadow">
              <img
                src={`/images/services/${s.slug}.jpg`}
                alt={s.title}
                className="w-full h-44 object-cover"
                onError={(e) => ((e.currentTarget.src = "/images/placeholder.jpg"), (e.currentTarget.onerror = null))}
              />
              <div className="p-4">
                <p className="font-semibold">{s.title}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* FORMULAR */}
      <div ref={formRef}>
        <BookingForm initial={selected} />
      </div>

      <Footer />
    </main>
  );
}

