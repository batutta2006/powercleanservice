
export default function Footer() {
  return (
    <footer
      id="kontakt"
      className="relative bg-[#1D8EF6] bg-cover bg-center text-white"
      style={{ backgroundImage: "url('images/hero/herofooter.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/15"></div>

      <div className="relative max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-2 gap-8">
        <div>
          <a href="/" className="text-2xl font-extrabold tracking-tight">
            <span className="text-red-600">Power</span>
            <span className="text-white">CleanService</span>
          </a>
          <p className="mt-2">Deutsches Handwerk seit 2009.</p>
        </div>

        <div>
          <p className="font-semibold">Kontakt</p>
          <p>Ali Fakih<br/>Baldurstraße 5, 30657 Hannover</p>
          <p>Tel.: 0174 9254 925</p>
          <p>E-Mail: info@powercleanservice.de</p>
          <div className="flex gap-3 mt-3">
            <a className="bg-white text-[#1D8EF6] px-3 py-1 rounded" href="https://wa.me/491749254925">WhatsApp</a>
            <a className="bg-white text-[#1D8EF6] px-3 py-1 rounded" href="tel:01749254925">Anruf</a>
          </div>
        </div>
      </div>

      <div className="relative text-center text-sm text-white/90 pb-6">
        © {new Date().getFullYear()} PowerCleanService
      </div>
    </footer>
  );
}


