"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useState } from "react";
import { IMAGES } from "@/lib/images";
import { cn } from "@/lib/utils";

type ProductImageProps = Omit<ImageProps, "src" | "alt"> & {
  src?: string | null;
  alt: string;
  fallback?: string;
};

/** Image with automatic fallback when the source URL fails (404, etc.). */
export function ProductImage({
  src,
  alt,
  fallback = IMAGES.productFallback,
  className,
  onError,
  ...props
}: ProductImageProps) {
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    setErrored(false);
  }, [src]);

  const currentSrc = !src || errored ? fallback : src;

  return (
    <Image
      {...props}
      src={currentSrc}
      alt={alt}
      className={cn(className)}
      onError={(event) => {
        setErrored(true);
        onError?.(event);
      }}
    />
  );
}
