"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useState } from "react";
import { IMAGES } from "@/lib/images";
import { isRemoteImageAllowed } from "@/lib/next-image-src";
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

  const currentSrc = !src || errored ? fallback : src.trim();
  const useNextImage = isRemoteImageAllowed(currentSrc);

  const handleError = () => {
    setErrored(true);
  };

  if (!useNextImage) {
    const { fill, sizes: _sizes, priority: _priority, ...imgProps } = props;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        {...imgProps}
        src={currentSrc}
        alt={alt}
        className={cn(fill && "absolute inset-0 h-full w-full object-cover", className)}
        onError={(event) => {
          handleError();
          onError?.(event);
        }}
      />
    );
  }

  return (
    <Image
      {...props}
      src={currentSrc}
      alt={alt}
      className={cn(className)}
      onError={(event) => {
        handleError();
        onError?.(event);
      }}
    />
  );
}
