import Link from "next/link";
import type { Project } from "@/features/projects/types";
import { ImageWithSkeleton } from "./image-with-skeleton";

export function ProjectsGrid({ projects, limit }: { projects: Project[]; limit?: number }) {
  const visible = limit ? projects.slice(0, limit) : projects;

  return (
    <div className="home-projects-grid">
      {visible.map((project) => (
        <Link key={project.id} href={`/proyectos/${project.slug}`} className="project-card group">
          <ImageWithSkeleton src={project.cover} alt={project.title} className="h-[300px] w-full max-md:aspect-square max-md:h-auto" imageClassName="group-hover:scale-[1.045]" />
          <h3 className="text-2xl font-medium leading-[1.06]">{project.title}</h3>
        </Link>
      ))}
    </div>
  );
}
