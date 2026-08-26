import { NextResponse } from "next/server";
import { PAYMENT_PROVIDER_TEMPLATES } from "@/lib/payment-providers";
import { requireAdmin } from "@/lib/admin-api";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  return NextResponse.json(PAYMENT_PROVIDER_TEMPLATES);
}
