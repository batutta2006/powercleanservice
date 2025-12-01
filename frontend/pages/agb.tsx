import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AgbPage() {
  return (
    <>
      <Header />

      <main className="bg-white text-black px-6 py-12 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          Allgemeine Geschäftsbedingungen (AGB)
        </h1>

        <p className="mb-6">
          <strong>
            Power Clean-Service
            <br />
            Ali Fakih
            <br />
            Baldurstraße 5, 30657 Hannover
          </strong>
        </p>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">1. Geltungsbereich</h2>
          <p>
            Diese Allgemeinen Geschäftsbedingungen gelten für alle
            Dienstleistungen, die von Power Clean-Service angeboten werden.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">2. Vertragsabschluss</h2>
          <p>
            Ein Vertrag kommt durch die Bestätigung eines Angebots in Textform
            (z. B. E-Mail) zustande.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">3. Leistungen</h2>
          <p>
            Der Umfang der Leistungen richtet sich nach der individuellen
            Vereinbarung mit dem Kunden.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">4. Preise und Zahlung</h2>
          <p>
            Alle Preise verstehen sich inkl. der gesetzlichen Mehrwertsteuer.
            Zahlungen sind nach Rechnungsstellung sofort fällig.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">5. Haftung</h2>
          <p>
            Power Clean-Service haftet nur für Vorsatz und grobe Fahrlässigkeit.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">6. Schlussbestimmungen</h2>
          <p>
            Es gilt das Recht der Bundesrepublik Deutschland. Gerichtsstand ist
            Hannover.
          </p>
        </section>

        <p>
          <a href="/" className="underline hover:no-underline text-blue-600">
            Zurück zur Startseite
          </a>
        </p>
      </main>

      <Footer />
    </>
  );
}

