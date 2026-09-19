import { ProjectsGrid } from "@/components/public/projects-grid";
import type { Project } from "@/features/projects/types";

export function HomeProjectsSection({ projects }: { projects: Project[] }) {
  return (
    <section id="proyectos" className="site-shell pb-[244px] pt-20 max-md:overflow-hidden max-md:py-16">
      <h2 className="mb-12 font-display text-5xl font-medium leading-[1.06] max-md:text-[42px]">Proyectos con impacto</h2>
      <ProjectsGrid projects={projects} limit={6} />
    </section>
  );
}
