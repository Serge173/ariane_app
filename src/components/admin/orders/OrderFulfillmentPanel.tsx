"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useFeedbackModal } from "@/hooks/useFeedbackModal";
import { FULFILLMENT_STATUS_LABELS } from "@/lib/utils";
import { fulfillmentStatusTone } from "@/lib/admin-status";
import { StatusDot } from "@/components/admin/ui/StatusDot";

const FULFILLMENT_OPTIONS = [
  "PENDING",
  "PREPARING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

interface OrderFulfillmentPanelProps {
  orderId: string;
  initialStatus: string | null;
  initialTrackingNumber: string | null;
  initialShippingCarrier: string | null;
  isShopOrder: boolean;
}

export function OrderFulfillmentPanel({
  orderId,
  initialStatus,
  initialTrackingNumber,
  initialShippingCarrier,
  isShopOrder,
}: OrderFulfillmentPanelProps) {
  const router = useRouter();
  const { showSuccess, showError, FeedbackModal } = useFeedbackModal();
  const [status, setStatus] = useState(initialStatus ?? "PENDING");
  const [trackingNumber, setTrackingNumber] = useState(initialTrackingNumber ?? "");
  const [shippingCarrier, setShippingCarrier] = useState(initialShippingCarrier ?? "");
  const [loading, setLoading] = useState(false);

  if (!isShopOrder) return null;

  const save = async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fulfillmentStatus: status,
        trackingNumber: trackingNumber.trim() || null,
        shippingCarrier: shippingCarrier.trim() || null,
      }),
    });
    setLoading(false);
    if (res.ok) {
      showSuccess("Statut de livraison mis à jour.", "Commande boutique");
      router.refresh();
    } else {
      const data = await res.json().catch(() => null);
      showError(data?.error || "Erreur lors de la mise à jour");
    }
  };

  return (
    <>
      {FeedbackModal}
      <section className="admin-detail-card">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 className="admin-detail-card-title mb-0">Livraison boutique</h2>
          {status && (
            <StatusDot
              label={FULFILLMENT_STATUS_LABELS[status] ?? status}
              tone={fulfillmentStatusTone(status)}
            />
          )}
        </div>
        <div className="space-y-4">
          <div>
            <label className="label-field">Statut fulfillment</label>
            <select className="input-field" value={status} onChange={(e) => setStatus(e.target.value)}>
              {FULFILLMENT_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {FULFILLMENT_STATUS_LABELS[opt]}
                </option>
              ))}
            </select>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label-field">Transporteur</label>
              <input className="input-field" value={shippingCarrier} onChange={(e) => setShippingCarrier(e.target.value)} placeholder="DHL, coursier..." />
            </div>
            <div>
              <label className="label-field">N° de suivi</label>
              <input className="input-field" value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} placeholder="Tracking" />
            </div>
          </div>
          <button type="button" onClick={save} disabled={loading} className="btn-primary text-xs inline-flex items-center gap-2">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Enregistrer la livraison
          </button>
        </div>
      </section>
    </>
  );
}
