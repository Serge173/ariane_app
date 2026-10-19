"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { isRemoteImageAllowed } from "@/lib/next-image-src";
import { computeSmartObjectPosition } from "@/lib/smart-image-position";
import { shouldUseHeroContainFit, type HeroImageFitMode } from "@/lib/hero-image-fit";
import { imageFillClass } from "@/lib/image-display";

type SmartFullscreenImageProps = {
  src: string;
  alt: string;
  className?: string;
  fillFrame?: boolean;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  kenBurns?: boolean;
  onError?: () => void;
};

type ImageMetrics = {
  width: number;
  height: number;
};

function useNarrowViewport() {
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1024px)");
    const update = () => setNarrow(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return narrow;
}

/**
 * Hero plein écran : image entière visible (contain + fond cinéma) ou cover intelligent.
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
  const [metrics, setMetrics] = useState<ImageMetrics | null>(null);
  const [objectPosition, setObjectPosition] = useState("50% 40%");
  const [fitMode, setFitMode] = useState<HeroImageFitMode>("contain");
  const narrowViewport = useNarrowViewport();
  const useNext = isRemoteImageAllowed(src);

  const applyFit = useCallback(
    (naturalWidth: number, naturalHeight: number) => {
      const el = frameRef.current;
      if (!el) return;
      const fw = el.clientWidth;
      const fh = el.clientHeight;
      setMetrics({ width: naturalWidth, height: naturalHeight });
      const contain = shouldUseHeroContainFit(
        naturalWidth,
        naturalHeight,
        fw,
        fh,
        narrowViewport
      );
      setFitMode(contain ? "contain" : "cover");
      if (!contain) {
        setObjectPosition(
          computeSmartObjectPosition(naturalWidth, naturalHeight, fw, fh)
        );
      }
    },
    [narrowViewport]
  );

  const remeasure = useCallback(() => {
    if (!metrics) return;
    applyFit(metrics.width, metrics.height);
  }, [applyFit, metrics]);

  useEffect(() => {
    if (!src) return;
    const img = new window.Image();
    img.decoding = "async";
    img.src = src;
    img.onload = () => applyFit(img.naturalWidth, img.naturalHeight);
  }, [src, applyFit]);

  useEffect(() => {
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

  const coverClass = cn(imageFillClass("cover"), "will-change-transform");
  const containClass = cn(
    "absolute inset-0 h-full w-full max-h-full max-w-full object-contain object-center"
  );
  const backdropClass = cn(
    imageFillClass("cover"),
    "scale-110 blur-2xl opacity-45 brightness-[0.55] saturate-110"
  );

  const onMetricsFromImg = (naturalWidth: number, naturalHeight: number) => {
    applyFit(naturalWidth, naturalHeight);
  };

  const foreground = useNext ? (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      quality={quality}
      sizes={sizes}
      className={fitMode === "contain" ? containClass : coverClass}
      style={fitMode === "cover" ? { objectPosition } : undefined}
      onLoadingComplete={(img) => onMetricsFromImg(img.naturalWidth, img.naturalHeight)}
      onError={onError}
    />
  ) : (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={fitMode === "contain" ? containClass : coverClass}
      style={fitMode === "cover" ? { objectPosition } : undefined}
      decoding="async"
      onLoad={(e) =>
        onMetricsFromImg(e.currentTarget.naturalWidth, e.currentTarget.naturalHeight)
      }
      onError={onError}
    />
  );

  const backdrop =
    fitMode === "contain" &&
    (useNext ? (
      <Image
        src={src}
        alt=""
        aria-hidden
        fill
        priority={false}
        quality={60}
        sizes={sizes}
        className={backdropClass}
      />
    ) : (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt="" aria-hidden className={backdropClass} decoding="async" />
    ));

  return (
    <div
      ref={frameRef}
      className={cn(
        fillFrame && "absolute inset-0 h-full w-full overflow-hidden bg-black",
        fitMode === "cover" && kenBurns && "animate-ken-burns",
        className
      )}
    >
      {backdrop}
      {foreground}
    </div>
  );
}
