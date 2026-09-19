export type GridSpan = "1x1" | "1x2" | "2x1" | "2x2" | "3x2";

export type ProjectImage = {
  id: string;
  src: string;
  alt: string;
  span: GridSpan;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  description: string;
  cover: string;
  order: number;
  published: boolean;
  images: ProjectImage[];
};
