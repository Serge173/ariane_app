export type AdminStatusTone = "attention" | "ink" | "muted" | "neutral";

export function orderStatusTone(status: string): AdminStatusTone {
  if (status === "PENDING_PAYMENT") return "attention";
  if (status === "CANCELLED" || status === "REFUNDED") return "muted";
  if (["PAID", "COMPLETED", "APPOINTMENT_CONFIRMED", "COACHING_COMPLETED"].includes(status)) {
    return "ink";
  }
  return "neutral";
}

export function paymentStatusTone(status: string): AdminStatusTone {
  if (status === "PENDING" || status === "PROCESSING") return "attention";
  if (status === "FAILED" || status === "REFUNDED") return "muted";
  if (status === "SUCCESS") return "ink";
  return "neutral";
}

export function appointmentStatusTone(status: string): AdminStatusTone {
  if (status === "SCHEDULED") return "attention";
  if (status === "CANCELLED" || status === "NO_SHOW") return "muted";
  if (status === "CONFIRMED" || status === "COMPLETED") return "ink";
  return "neutral";
}
