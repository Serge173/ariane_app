/** Téléverse une image admin (FormData field `image`). */
export async function uploadAdminImage(
  endpoint: string,
  file: File
): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(endpoint, { method: "POST", body: formData });
  const data = (await res.json()) as { url?: string; error?: string };

  if (!res.ok) {
    throw new Error(data.error || "Erreur lors de l'upload");
  }
  if (!data.url?.trim()) {
    throw new Error("Réponse serveur invalide (URL manquante)");
  }

  return { url: data.url.trim() };
}
