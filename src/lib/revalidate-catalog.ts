import { revalidatePath } from "next/cache";

/** Invalide les pages catalogue après modification produit en admin. */
export function revalidateProductCatalog(slug?: string) {
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/offres");
  revalidatePath("/boutique");
  if (slug) {
    revalidatePath(`/offres/${slug}`);
    revalidatePath(`/boutique/${slug}`);
  }
}
