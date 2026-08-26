"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";

const FALLBACK_PHONE = "+2250749526194";

export function WhatsAppButton() {
  const [phone, setPhone] = useState(
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || FALLBACK_PHONE
  );

  useEffect(() => {
    fetch("/api/settings/public")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.whatsappNumber) setPhone(data.whatsappNumber);
      })
      .catch(() => {});
  }, []);

  const message = encodeURIComponent(
    "Bonjour, je souhaite en savoir plus sur vos accompagnements en conseil en image."
  );
  const url = `https://wa.me/${phone.replace(/\D/g, "")}?text=${message}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-300"
      aria-label="Contacter via WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
    </a>
  );
}
