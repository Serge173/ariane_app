"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { isRemoteImageAllowed } from "@/lib/next-image-src";
import { computeSmartObjectPosition } from "@/lib/smart-image-position";
import { imageFillClass } from "@/lib/image-display";

type SmartFullscreenImageProps = {
  src: string;
  alt: string;
  className?: string;
  /** Plein cadre parent (absolute inset-0) */
  fillFrame?: boolean;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  kenBurns?: boolean;
  onError?: () => void;
};

function measureAndPosition(
  src: string,
  frameWidth: number,
  frameHeight: number,
  setPosition: (p: string) => void
) {
  if (!src || frameWidth <= 0 || frameHeight <= 0) return;

  const img = new window.Image();
  img.decoding = "async";
  img.src = src;
  img.onload = () => {
    setPosition(
      computeSmartObjectPosition(
        img.naturalWidth,
        img.naturalHeight,
        frameWidth,
        frameHeight
      )
    );
  };
}

/**
 * Plein écran : object-cover (jamais étiré) + object-position calculé selon le ratio image / viewport.
 */
export function SmartFullscreenImage({
  src,
  alt,
  className,
  fillFrame = true,
  sizes = "100vw",
  priority = false,
  quality = 92,
  kenBurns = false,
  onError,
}: SmartFullscreenImageProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [objectPosition, setObjectPosition] = useState("50% 40%");
  const useNext = isRemoteImageAllowed(src);

  const remeasure = useCallback(() => {
    const el = frameRef.current;
    if (!el) return;
    measureAndPosition(src, el.clientWidth, el.clientHeight, setObjectPosition);
  }, [src]);

  useEffect(() => {
    remeasure();
    const el = frameRef.current;
    if (!el) return;

    const ro = new ResizeObserver(() => remeasure());
    ro.observe(el);
    window.addEventListener("orientationchange", remeasure);
    return () => {
      ro.disconnect();
      window.removeEventListener("orientationchange", remeasure);
    };
  }, [remeasure]);

  const imgClass = cn(imageFillClass("cover"), "will-change-transform");
  const imgStyle = { objectPosition };

  const imageNode = useNext ? (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      quality={quality}
      sizes={sizes}
      className={imgClass}
      style={imgStyle}
      onLoadingComplete={(img) => {
        const el = frameRef.current;
        if (el) {
          setObjectPosition(
            computeSmartObjectPosition(
              img.naturalWidth,
              img.naturalHeight,
              el.clientWidth,
              el.clientHeight
            )
          );
        }
      }}
      onError={onError}
    />
  ) : (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={imgClass}
      style={imgStyle}
      decoding="async"
      onLoad={(e) => {
        const el = frameRef.current;
        const target = e.currentTarget;
        if (el) {
          setObjectPosition(
            computeSmartObjectPosition(
              target.naturalWidth,
              target.naturalHeight,
              el.clientWidth,
              el.clientHeight
            )
          );
        }
      }}
      onError={onError}
    />
  );

  return (
    <div
      ref={frameRef}
      className={cn(
        fillFrame && "absolute inset-0 h-full w-full overflow-hidden bg-brand-950",
        kenBurns && "animate-ken-burns",
        className
      )}
    >
      {imageNode}
    </div>
  );
}
