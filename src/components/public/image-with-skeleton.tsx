"use client";

import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";

type ImageWithSkeletonProps = {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
};

export function ImageWithSkeleton({ src, alt, className, imageClassName }: ImageWithSkeletonProps) {
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const loaded = loadedSrc === src;
  const imageRef = useCallback((image: HTMLImageElement | null) => {
    if (image?.complete && image.naturalWidth > 0) {
      setLoadedSrc(src);
    }
  }, [src]);

  return (
    <div className={cn("relative overflow-hidden", !loaded && "bg-[#d2d2d2]", className)}>
      {!loaded ? <div className="absolute inset-0 skeleton" aria-hidden="true" /> : null}
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        className={cn("relative z-10 h-full w-full object-cover transition duration-700 ease-out", imageClassName)}
        onLoad={() => setLoadedSrc(src)}
      />
    </div>
  );
}
