import type { Project } from "./types";
import { createSupabaseServerClient } from "@/lib/supabase";

const placeholder = "/images/figma/project-placeholder.png";
const detail = "/images/figma/detail-image.png";
const detailAlt = "/images/figma/detail-extra.png";

export const projects: Project[] = [
  {
    id: "ecotronk",
    slug: "ecotronk",
    title: "Nombre proyecto",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    cover: placeholder,
    order: 1,
    published: true,
    images: [
      { id: "1", src: detail, alt: "Imagen del proyecto", span: "1x1" },
      { id: "2", src: detail, alt: "Imagen horizontal del proyecto", span: "2x1" },
      { id: "3", src: detail, alt: "Imagen del proyecto", span: "1x1" },
      { id: "4", src: detail, alt: "Imagen del proyecto", span: "1x1" },
      { id: "5", src: detail, alt: "Imagen del proyecto", span: "1x1" },
      { id: "6", src: detailAlt, alt: "Imagen vertical del proyecto", span: "1x2" },
      { id: "7", src: detail, alt: "Imagen del proyecto", span: "1x1" },
      { id: "8", src: detail, alt: "Imagen grande del proyecto", span: "2x2" },
      { id: "9", src: detail, alt: "Imagen del proyecto", span: "1x1" },
    ],
  },
  ...Array.from({ length: 5 }, (_, index) => ({
    id: `project-${index + 2}`,
    slug: `proyecto-${index + 2}`,
    title: "Nombre proyecto",
    description:
      "Proyecto de identidad visual con foco en claridad, sistema y presencia de marca.",
    cover: placeholder,
    order: index + 2,
    published: true,
    images: [
      { id: "1", src: detail, alt: "Imagen del proyecto", span: "1x1" as const },
      { id: "2", src: detail, alt: "Imagen del proyecto", span: "2x1" as const },
      { id: "3", src: detail, alt: "Imagen del proyecto", span: "1x1" as const },
    ],
  })),
];

export function getPublishedProjects() {
  return projects.filter((project) => project.published).sort((a, b) => a.order - b.order);
}

export function getProjectBySlug(slug: string) {
  return getPublishedProjects().find((project) => project.slug === slug);
}

type ProjectRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  cover_image_url: string | null;
  order_index: number;
  is_published: boolean;
  project_images?: Array<{
    id: string;
    image_url: string;
    alt_text: string;
    grid_span: Project["images"][number]["span"];
    order_index: number;
  }>;
};

function mapProject(row: ProjectRow): Project {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    cover: row.cover_image_url || placeholder,
    order: row.order_index,
    published: row.is_published,
    images: (row.project_images ?? [])
      .sort((a, b) => a.order_index - b.order_index)
      .map((image) => ({
        id: image.id,
        src: image.image_url,
        alt: image.alt_text,
        span: image.grid_span,
      })),
  };
}

export async function getPublishedProjectsForSite() {
  const supabase = createSupabaseServerClient();
  if (!supabase) return getPublishedProjects();

  const { data } = await supabase
    .from("projects")
    .select("*, project_images(id, image_url, alt_text, grid_span, order_index)")
    .eq("is_published", true)
    .order("order_index", { ascending: true })
    .order("order_index", { referencedTable: "project_images", ascending: true });

  if (!data?.length) return getPublishedProjects();
  return (data as ProjectRow[]).map(mapProject);
}

export async function getProjectBySlugForSite(slug: string) {
  const supabase = createSupabaseServerClient();
  if (!supabase) return getProjectBySlug(slug);

  const { data } = await supabase
    .from("projects")
    .select("*, project_images(id, image_url, alt_text, grid_span, order_index)")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (!data) return getProjectBySlug(slug);
  return mapProject(data as ProjectRow);
}
