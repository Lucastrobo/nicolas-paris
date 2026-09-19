import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContactSection } from "@/components/public/contact-section";
import { ProjectMosaic } from "@/components/public/project-mosaic";
import { ProjectsGrid } from "@/components/public/projects-grid";
import { SiteFooter } from "@/components/public/site-footer";
import { SiteHeader } from "@/components/public/site-header";
import { getProjectBySlugForSite, getPublishedProjects, getPublishedProjectsForSite } from "@/features/projects/data";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return getPublishedProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlugForSite(slug);
  if (!project) return { title: "Proyecto" };

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: `${project.title} | Nicolas Paris`,
      description: project.description,
      images: [
        {
          url: project.cover,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} | Nicolas Paris`,
      description: project.description,
      images: [project.cover],
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlugForSite(slug);

  if (!project) notFound();

  const publishedProjects = await getPublishedProjectsForSite();
  const currentIndex = publishedProjects.findIndex((item) => item.id === project.id);
  const related = currentIndex >= 0
    ? [...publishedProjects.slice(currentIndex + 1), ...publishedProjects.slice(0, currentIndex)].slice(0, 3)
    : publishedProjects.filter((item) => item.id !== project.id).slice(0, 3);

  return (
    <>
      <SiteHeader />
      <main>
        <section className="site-shell py-20 max-md:py-12">
          <div className="grid grid-cols-[414px_490px] gap-20 max-lg:grid-cols-1">
            <h1 className="font-display text-[40px] font-medium leading-[1.06]">{project.title}</h1>
            <p className="text-2xl leading-[1.17] tracking-[-0.03em] text-[#606060] max-md:text-xl">{project.description}</p>
          </div>
        </section>
        <ProjectMosaic images={project.images} />
        <section className="site-shell py-20">
          <h2 className="mb-12 font-display text-5xl font-medium leading-[1.06]">Otros proyectos</h2>
          <ProjectsGrid projects={related} />
        </section>
        <ContactSection />
      </main>
      <SiteFooter />
    </>
  );
}
