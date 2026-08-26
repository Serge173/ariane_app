"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ConfirmationModal,
  type ConfirmationModalVariant,
} from "@/components/ui/ConfirmationModal";

const SUCCESS_AUTO_DISMISS_MS = 2000;

interface ModalState {
  open: boolean;
  variant: ConfirmationModalVariant;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm?: () => void;
  onAfterClose?: () => void;
}

const closed: ModalState = {
  open: false,
  variant: "success",
  title: "",
  message: "",
};

export function useFeedbackModal() {
  const [modal, setModal] = useState<ModalState>(closed);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const close = useCallback(() => {
    clearTimer();
    setModal((prev) => {
      const cb = prev.onAfterClose;
      if (cb) queueMicrotask(cb);
      return closed;
    });
  }, [clearTimer]);

  useEffect(() => {
    if (modal.open && modal.variant === "success") {
      timerRef.current = setTimeout(close, SUCCESS_AUTO_DISMISS_MS);
      return clearTimer;
    }
    clearTimer();
  }, [modal.open, modal.variant, close, clearTimer]);

  useEffect(() => () => clearTimer(), [clearTimer]);

  const showSuccess = useCallback(
    (message: string, title = "Enregistré", onAfterClose?: () => void) => {
      clearTimer();
      setModal({
        open: true,
        variant: "success",
        title,
        message,
        confirmLabel: "OK",
        onAfterClose,
      });
    },
    [clearTimer]
  );

  const showError = useCallback((message: string, title = "Erreur") => {
    setModal({ open: true, variant: "error", title, message, confirmLabel: "OK" });
  }, []);

  const showConfirm = useCallback(
    (message: string, onConfirm: () => void, title = "Confirmer l'action") => {
      setModal({
        open: true,
        variant: "confirm",
        title,
        message,
        confirmLabel: "Confirmer",
        onConfirm: () => {
          close();
          onConfirm();
        },
      });
    },
    [close]
  );

  const FeedbackModal = (
    <ConfirmationModal
      open={modal.open}
      variant={modal.variant}
      title={modal.title}
      message={modal.message}
      confirmLabel={modal.confirmLabel}
      onClose={close}
      onConfirm={modal.onConfirm}
    />
  );

  return { showSuccess, showError, showConfirm, close, FeedbackModal };
}
