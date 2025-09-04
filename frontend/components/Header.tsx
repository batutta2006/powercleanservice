
import Link from "next/link";

export default function Header(){
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-extrabold text-2xl tracking-tight">
          <span style={{color:"var(--brand-red)"}}>Power</span><span className="text-black">CleanService</span>
        </Link>

        <nav className="flex gap-6">
          {/* einfache Anker-Links – funktioniert von überall */}
          <a href="/#leistungen" className="text-black hover:opacity-80">Leistungen</a>
          <a href="/#anfrage"    className="text-black hover:opacity-80">Anfrage</a>
          <a href="/#kontakt"    className="text-black hover:opacity-80">Kontakt</a>
        </nav>
      </div>
    </header>
  );
}
