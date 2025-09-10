// frontend/components/FloatingActions.tsx
import React from "react";

const phoneE164 = "+491749254925"; // internationale Schreibweise für tel:
const phoneHuman = "0174 9254 925";
const whatsappLink = `https://wa.me/491749254925?text=${encodeURIComponent(
  "Hallo PowerCleanService, ich hätte eine Anfrage."
)}`;

export default function FloatingActions() {
  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col gap-3">
      {/* Anrufen */}
      <a
        href={`tel:${phoneE164}`}
        aria-label={`Jetzt anrufen: ${phoneHuman}`}
        className="rounded-full shadow-lg border bg-white hover:bg-gray-50 px-4 py-3 flex items-center gap-2"
      >
        {/* Telefon-Icon (SVG) */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
             viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M2.25 6.75c0 7.004 5.996 12.75 13.391 12.75a3 3 0 002.241-.993l1.293-1.437a1.5 1.5 0 00-.137-2.106l-2.034-1.694a1.5 1.5 0 00-1.937.01l-.9.734a9.75 9.75 0 01-4.197-4.197l.734-.9a1.5 1.5 0 00.01-1.937L8.786 3.46a1.5 1.5 0 00-2.106-.137L5.243 4.616A3 3 0 004.25 6.857" />
        </svg>
        <span className="font-medium">Anrufen</span>
      </a>

      {/* WhatsApp */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp Nachricht senden"
        className="rounded-full shadow-lg border bg-green-500 text-white hover:opacity-90 px-4 py-3 flex items-center gap-2"
      >
        {/* WhatsApp-Icon (SVG) */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"
             viewBox="0 0 32 32" fill="currentColor">
          <path d="M19.11 17.63c-.31-.16-1.84-.91-2.12-1.02-.29-.11-.5-.16-.72.16-.22.31-.83 1.02-1.02 1.24-.19.22-.37.25-.69.09-.31-.16-1.3-.48-2.47-1.52-.91-.81-1.52-1.81-1.69-2.12-.16-.31-.02-.48.14-.64.14-.14.31-.37.47-.56.16-.19.22-.31.34-.53.11-.22.06-.41-.03-.56-.09-.16-.72-1.73-.99-2.37-.26-.63-.53-.55-.72-.56-.19-.01-.41-.01-.63-.01-.22 0-.56.08-.86.41-.31.34-1.17 1.14-1.17 2.78 0 1.64 1.2 3.22 1.36 3.44.16.22 2.35 3.6 5.68 5.05.79.34 1.41.54 1.89.69.79.25 1.51.21 2.08.13.63-.09 1.84-.75 2.1-1.48.26-.73.26-1.36.18-1.48-.08-.12-.28-.2-.59-.36z"/>
          <path d="M26.7 5.3C23.9 2.5 20.1 1 16.1 1 8.3 1 2 7.3 2 15.1c0 2.5.7 5 2 7.2L2 31l8.8-2.3c2.2 1.2 4.6 1.9 7.2 1.9 7.8 0 14.1-6.3 14.1-14.1 0-3.9-1.5-7.7-4.3-10.5zM16 28c-2.4 0-4.7-.7-6.7-1.9l-.5-.3-5.1 1.3 1.4-5-.3-.5C3.7 19.6 3 17.4 3 15.1 3 8.9 8 4 14.2 4c3.2 0 6.2 1.2 8.5 3.5S26.2 13 26.2 16.2C26.2 22.4 21.3 28 16 28z"/>
        </svg>
        <span className="font-medium">WhatsApp</span>
      </a>
    </div>
  );
}
