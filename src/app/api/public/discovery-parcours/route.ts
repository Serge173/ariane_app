import { getDiscoveryParcoursSettings } from "@/lib/discovery-parcours-settings";

export async function GET() {
  const settings = await getDiscoveryParcoursSettings();
  return Response.json(settings);
}
