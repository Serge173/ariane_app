export async function parseJsonResponse<T = unknown>(res: Response): Promise<T | null> {
  try {
    const text = await res.text();
    if (!text) return null;
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

export async function readApiError(res: Response, fallback = "Erreur serveur"): Promise<string> {
  const data = await parseJsonResponse<{ error?: string }>(res);
  return data?.error || `${fallback} (${res.status})`;
}
