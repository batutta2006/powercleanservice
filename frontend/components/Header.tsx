
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-extrabold tracking-tight text-2xl md:text-3xl">
          <span style={{ color: "var(--brand-red)" }}>Power</span>
          <span className="text-black">Clean Service</span>
        </Link>

        {/* Desktop-Navi */}
        <nav className="hidden md:flex items-center gap-6 pr-1">
          <a href="#leistungen" className="text-black/90 hover:opacity-80">Leistungen</a>
          <a href="#anfrage" className="text-black/90 hover:opacity-80">Anfrage</a>
          <a href="#kontakt" className="text-black/90 hover:opacity-80">Kontakt</a>
        </nav>

        {/* Burger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col gap-1.5 focus:outline-none"
          aria-label="Menü öffnen"
        >
          <span className="w-6 h-0.5 bg-black" />
          <span className="w-6 h-0.5 bg-black" />
          <span className="w-6 h-0.5 bg-black" />
        </button>
      </div>

      {/* Mobile-Menü */}
      {open && (
        <nav className="md:hidden bg-white border-t">
          <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-3">
            <a href="#leistungen" className="text-black/90 hover:opacity-80" onClick={() => setOpen(false)}>Leistungen</a>
            <a href="#anfrage" className="text-black/90 hover:opacity-80" onClick={() => setOpen(false)}>Anfrage</a>
            <a href="#kontakt" className="text-black/90 hover:opacity-80" onClick={() => setOpen(false)}>Kontakt</a>
          </div>
        </nav>
      )}
    </header>
  );
}


