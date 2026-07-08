"use client";

const WHATSAPP_LINK = "https://wa.me/972597712885";

function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M12 2C6.49 2 2 6.49 2 12c0 1.77.46 3.5 1.34 5.03L2 22l5.11-1.31A9.95 9.95 0 0 0 12 22c5.51 0 10-4.49 10-10S17.51 2 12 2Zm0 18.2c-1.5 0-2.96-.39-4.24-1.12l-.3-.17-3.03.78.81-2.95-.2-.31A8.2 8.2 0 0 1 3.8 12C3.8 7.48 7.48 3.8 12 3.8S20.2 7.48 20.2 12 16.52 20.2 12 20.2Zm4.47-6.16c-.24-.12-1.43-.7-1.65-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.95-1.2-.72-.64-1.2-1.43-1.35-1.67-.14-.24-.01-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.4-.41-.54-.42l-.46-.01c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.1 3.62.57.25 1.02.4 1.37.51.58.18 1.1.15 1.52.09.46-.07 1.43-.58 1.63-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z" />
    </svg>
  );
}

export default function WhatsAppFloatingButton() {
  return (
    <a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noreferrer"
      aria-label="تواصل عبر واتساب"
      className="group fixed bottom-6 right-6 left-auto z-[90] lg:right-auto lg:left-6"
    >
      <span className="absolute inset-0 rounded-full bg-whatsapp/40 animate-ping" aria-hidden />
      <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-whatsapp text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-0.5">
        <WhatsAppIcon className="h-8 w-8" />
      </span>
    </a>
  );
}

