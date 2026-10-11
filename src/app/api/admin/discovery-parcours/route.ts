import { NextRequest } from "next/server";
import { requireAdmin, jsonError } from "@/lib/admin-api";
import {
  getDiscoveryParcoursSettings,
  parseDiscoveryParcoursSettings,
  updateDiscoveryParcoursSettings,
} from "@/lib/discovery-parcours-settings";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  const settings = await getDiscoveryParcoursSettings();
  return Response.json(settings);
}

export async function PATCH(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await req.json();
    const patch = parseDiscoveryParcoursSettings(body);
    const settings = await updateDiscoveryParcoursSettings(patch);
    return Response.json(settings);
  } catch (e) {
    console.error("discovery-parcours PATCH:", e);
    return jsonError("Enregistrement impossible", 500);
  }
}
