"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useCartStore } from "@/lib/store/cart";
import { DURATION, EASE_COUTURE, RISE_PX } from "@/lib/motion";

export function CartToast() {
  const toastAt = useCartStore((s) => s.toastAt);
  const message = useCartStore((s) => s.toastMessage);
  const [visible, setVisible] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!toastAt) return;
    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), 2200);
    return () => window.clearTimeout(timer);
  }, [toastAt]);

  return (
    <AnimatePresence>
      {visible && message && (
        <motion.div
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: reduced ? 0 : RISE_PX }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: reduced ? 0.15 : DURATION.short,
            ease: EASE_COUTURE,
          }}
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 bg-brand-950 text-white font-sans text-xs uppercase tracking-wide"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
