import { ProductImage } from "@/components/ui/ProductImage";
import { IMAGES } from "@/lib/images";

export function ConnexionPageBackdrop({
  image,
  imageAlt,
  fallback = "cream",
}: {
  image: string;
  imageAlt: string;
  fallback?: "cream" | "dark";
}) {
  const src = image.trim();

  if (!src) {
    if (fallback === "dark") {
      return <div className="connexion-page__fallback fixed inset-0 z-0 bg-brand-950" aria-hidden />;
    }
    return (
      <div
        className="connexion-page__fallback fixed inset-0 z-0 bg-[#f9f7f2]"
        aria-hidden
        style={{
          background: "linear-gradient(180deg, #f9f7f2 0%, #ffffff 55%)",
        }}
      />
    );
  }

  return (
    <>
      <div className="connexion-page__media fixed inset-0 z-0 overflow-hidden">
        <ProductImage
          src={src}
          fallback={IMAGES.coaching.gold.replace(/w=\d+/, "w=1920")}
          alt={imageAlt}
          fill
          fit="cover"
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
      <div
        className="connexion-page__scrim fixed inset-0 z-0 bg-gradient-to-b from-black/50 via-black/35 to-black/55"
        aria-hidden
      />
    </>
  );
}