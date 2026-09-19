"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type ImageWithSkeletonProps = {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
};

export function ImageWithSkeleton({ src, alt, className, imageClassName }: ImageWithSkeletonProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={cn("relative overflow-hidden bg-[#d2d2d2]", className)}>
      {!loaded ? <div className="absolute inset-0 skeleton" aria-hidden="true" /> : null}
      <img
        src={src}
        alt={alt}
        className={cn("relative z-10 h-full w-full object-cover transition duration-700 ease-out", imageClassName)}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
