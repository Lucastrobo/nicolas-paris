import type { ProjectImage } from "@/features/projects/types";
import { cn } from "@/lib/utils";
import { ImageWithSkeleton } from "./image-with-skeleton";

const spanClass = {
  "1x1": "",
  "1x2": "md:row-span-2",
  "2x1": "md:col-span-2",
  "2x2": "md:col-span-2 md:row-span-2",
  "3x2": "md:col-span-3 md:row-span-2",
};

const mobileAspectClass = {
  "1x1": "max-md:aspect-square",
  "1x2": "max-md:aspect-[1/2]",
  "2x1": "max-md:aspect-[2/1]",
  "2x2": "max-md:aspect-square",
  "3x2": "max-md:aspect-[3/2]",
};

export function ProjectMosaic({ images }: { images: ProjectImage[] }) {
  return (
    <div className="project-mosaic-container">
      <div className="project-mosaic">
        {images.map((image) => (
          <ImageWithSkeleton
            key={image.id}
            src={image.src}
            alt={image.alt}
            className={cn(
              "min-h-0 min-w-0",
              mobileAspectClass[image.span],
              spanClass[image.span],
            )}
          />
        ))}
      </div>
    </div>
  );
}
