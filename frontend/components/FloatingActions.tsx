
import { MessageCircle, Phone } from "lucide-react";

export default function FloatingActions() {
  return (
    <div
      className="
        fixed right-4 bottom-4 z-50
        flex flex-col gap-3
        [@supports(padding:max(0px))]:right-[max(1rem,env(safe-area-inset-right))]
        [@supports(padding:max(0px))]:bottom-[max(1rem,env(safe-area-inset-bottom))]
      "
    >
      {/* Telefon */}
      <a
        href="tel:01749254925"
        aria-label="Anrufen"
        className="
          group inline-flex items-center gap-2
          rounded-full px-5 py-3
          bg-white/95 text-gray-900
          shadow-lg shadow-black/10 ring-1 ring-black/5
          backdrop-blur
          hover:bg-white transition
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20
        "
      >
        <span
          className="
            grid place-items-center size-6 rounded-full
            bg-gray-900 text-white
            group-hover:scale-110 transition
          "
        >
          <Phone className="size-4" />
        </span>
        <span className="font-semibold tracking-tight">Anrufen</span>
      </a>

      {/* WhatsApp */}
      <a
        href="https://wa.me/491749254925?text=Hallo%20PowerCleanService%2C%20ich%20habe%20eine%20Anfrage."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp Nachricht"
        className="
          group inline-flex items-center gap-2
          rounded-full px-5 py-3
          text-white
          bg-gradient-to-b from-[#25D366] to-[#1EBE59]
          shadow-lg shadow-[#1EBE59]/30 ring-1 ring-white/20
          hover:brightness-[1.05] transition
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40
        "
      >
        <span
          className="
            grid place-items-center size-6 rounded-full bg-white/15
            group-hover:bg-white/20 transition
          "
        >
          <MessageCircle className="size-4 text-white" />
        </span>
        <span className="font-semibold tracking-tight">WhatsApp</span>
      </a>
    </div>
  );
}
