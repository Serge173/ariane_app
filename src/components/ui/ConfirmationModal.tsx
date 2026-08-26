"use client";

import { CheckCircle2, AlertCircle, HelpCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ConfirmationModalVariant = "success" | "error" | "confirm";

export interface ConfirmationModalProps {
  open: boolean;
  variant?: ConfirmationModalVariant;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onClose: () => void;
  onConfirm?: () => void;
}

const variantStyles: Record<
  ConfirmationModalVariant,
  {
    icon: typeof CheckCircle2;
    iconWrap: string;
    iconClass: string;
    accent: string;
    confirmBtn: string;
  }
> = {
  success: {
    icon: CheckCircle2,
    iconWrap: "bg-green-500/15 border-green-400/30",
    iconClass: "text-green-400",
    accent: "bg-green-500/80",
    confirmBtn: "btn-primary",
  },
  error: {
    icon: AlertCircle,
    iconWrap: "bg-red-500/15 border-red-400/30",
    iconClass: "text-red-400",
    accent: "bg-red-500/80",
    confirmBtn: "btn-primary",
  },
  confirm: {
    icon: HelpCircle,
    iconWrap: "bg-white/10 border-white/25",
    iconClass: "text-white/90",
    accent: "bg-white/40",
    confirmBtn: "btn-primary bg-red-700/90 hover:bg-red-800 border-red-700",
  },
};

export function ConfirmationModal({
  open,
  variant = "success",
  title,
  message,
  confirmLabel,
  cancelLabel = "Annuler",
  onClose,
  onConfirm,
}: ConfirmationModalProps) {
  if (!open) return null;

  const { icon: Icon, iconWrap, iconClass, accent, confirmBtn } = variantStyles[variant];
  const isConfirm = variant === "confirm";

  return (
    <div
      className="modal-backdrop fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-950/55 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-modal-title"
      onClick={onClose}
    >
      <div
        className="modal-panel bg-transparent backdrop-blur-xl w-full max-w-md border border-white/20 shadow-2xl shadow-black/20 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={cn("h-1 w-full", accent)} />

        <div className="flex items-start justify-between p-6 pb-0">
          <div
            className={cn(
              "flex-shrink-0 w-12 h-12 flex items-center justify-center border rounded-full",
              iconWrap
            )}
          >
            <Icon className={cn("w-6 h-6", iconClass)} strokeWidth={1.75} />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-white/50 hover:text-white transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 pt-4 text-center">
          <h3 id="confirmation-modal-title" className="font-display text-xl text-white mb-2">
            {title}
          </h3>
          <p className="text-sm text-white/75 leading-relaxed">{message}</p>
        </div>

        <div className="flex gap-3 p-6 pt-0 justify-center">
          {isConfirm && (
            <button type="button" onClick={onClose} className="btn-secondary min-w-[120px]">
              {cancelLabel}
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              if (isConfirm && onConfirm) onConfirm();
              else onClose();
            }}
            className={cn("min-w-[120px]", confirmBtn)}
          >
            {confirmLabel ?? (isConfirm ? "Confirmer" : "OK")}
          </button>
        </div>
      </div>
    </div>
  );
}
