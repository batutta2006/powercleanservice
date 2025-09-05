
// frontend/components/Header.tsx
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-extrabold text-2xl tracking-tight">
          <span style={{ color: "var(--brand-red)" }}>Power</span>
          <span className="text-black">CleanService</span>
        </Link>

        {/* Desktop-Navi */}
        <nav className="hidden md:flex gap-6">
          <a href="/#leistungen" className="text-black hover:opacity-80">Leistungen</a>
          <a href="/#anfrage" className="text-black hover:opacity-80">Anfrage</a>
          <a href="/#kontakt" className="text-black hover:opacity-80">Kontakt</a>
        </nav>

        {/* Burger Button (nur mobil) */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col gap-1.5 focus:outline-none"
          aria-label="Menü öffnen"
        >
          <span className="w-6 h-0.5 bg-black"></span>
          <span className="w-6 h-0.5 bg-black"></span>
          <span className="w-6 h-0.5 bg-black"></span>
        </button>
      </div>

      {/* Mobile-Menü */}
      {open && (
        <nav className="md:hidden bg-white border-t px-4 py-3 flex flex-col gap-3">
          <a href="/#leistungen" className="text-black hover:opacity-80">Leistungen</a>
          <a href="/#anfrage" className="text-black hover:opacity-80">Anfrage</a>
          <a href="/#kontakt" className="text-black hover:opacity-80">Kontakt</a>
        </nav>
      )}
    </header>
  );
}

