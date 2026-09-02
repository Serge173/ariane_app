/** Fetch session JSON safely — avoids parsing HTML error pages as JSON. */
export async function fetchSessionSafe(): Promise<Record<string, unknown> | null> {
  try {
    const res = await fetch("/api/auth/session", { credentials: "include" });
    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) return null;
    return (await res.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}
