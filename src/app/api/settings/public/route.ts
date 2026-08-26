import { NextResponse } from "next/server";
import { getPlatformSettings, toPublicSettings } from "@/lib/platform-settings";

export async function GET() {
  const settings = await getPlatformSettings();
  return NextResponse.json(toPublicSettings(settings));
}
