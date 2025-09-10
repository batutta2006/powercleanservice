
// "use client" // ← nur im app/ Router nötig
export default function Footer() {
  const year = new Date().getFullYear();

  // Mail mit Betreff + Body vorbefüllt
  const mailHref = [
    "mailto:info@powercleanservice.de",
    "?subject=" + encodeURIComponent("Anfrage Power Clean-Service"),
    "&body=" + encodeURIComponent(
      "Hallo Power Clean-Service,%0D%0A%0D%0A" +
      "Bitte kontaktieren Sie mich.%0D%0A%0D%0A" +
      "Name:%0D%0ATelefon:%0D%0AAdresse:%0D%0ALeistungen:"
    )
  ].join("");

  return (
    <footer
      id="kontakt"
      className="relative bg-[#1D8EF6] bg-cover bg-center text-white"
      style={{ backgroundImage: "url('/images/hero/herofooter.jpg')" }} // ← führender Slash
    >
      <div className="absolute inset-0 bg-black/15" />

      <div className="relative max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-2 gap-8">
        <div>
          <a href="/" className="text-2xl font-extrabold tracking-tight">
            <span className="text-red-600">POWER</span>
            <span className="text-white"> CLEAN-SERVICE</span>
          </a>
          <p className="mt-2">Deutsches Handwerk seit 2009.</p>
        </div>

        <div>
          <p className="font-semibold">Kontakt</p>
          <p>
            Ali Fakih<br />
            Baldurstraße 5, 30657 Hannover
          </p>
          <p>
            Tel.:{" "}
            <a href="tel:+491749254925" className="underline hover:no-underline">
              0174&nbsp;9254&nbsp;925
            </a>
          </p>
          <p>
            E-Mail:{" "}
            <a href={mailHref} className="underline hover:no-underline">
              info@powercleanservice.de
            </a>
          </p>

          <div className="flex gap-3 mt-3">
            <a
              className="bg-white text-[#1D8EF6] px-3 py-1 rounded"
              href="https://wa.me/491749254925"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp Chat starten"
            >
              WhatsApp
            </a>
            <a
              className="bg-white text-[#1D8EF6] px-3 py-1 rounded"
              href="tel:+491749254925"
              aria-label="Jetzt anrufen"
            >
              Anruf
            </a>
          </div>
        </div>
      </div>

      <div className="relative text-center text-sm text-white/90 pb-6">
        © {year} PowerCleanService
      </div>
    </footer>
  );
}
// Ende "use client"

