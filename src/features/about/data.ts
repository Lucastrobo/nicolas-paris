import { createSupabaseServerClient } from "@/lib/supabase";

export const aboutContent = {
  title: "SOBRE MÍ",
  portraitUrl: "/images/figma/about-portrait.png",
  portraitAlt: "Retrato de Nicolas Paris",
  intro: "Soy Nico París, Licenciado en Diseño y diseñador gráfico especializado en branding e identidad visual.",
  paragraphs: [
    "Trabajo con marcas que buscan construir, renovar o consolidar su identidad, combinando estrategia y diseño para desarrollar sistemas visuales claros, coherentes y con personalidad.",
    "Mi enfoque parte de entender cada proyecto, su contexto y lo que necesita comunicar. A partir de ahí, desarrollo identidades pensadas para funcionar más allá del logo: desde el concepto y la dirección visual hasta las distintas aplicaciones que construyen la marca.",
    "Trabajo de manera independiente con proyectos de diferentes rubros y escalas, buscando que cada solución tenga una lógica propia y responda a necesidades reales de la marca.",
  ],
};

export type AboutContent = typeof aboutContent;

export const aboutContentId = "00000000-0000-0000-0000-000000000001";

type AboutContentRow = {
  title: string;
  portrait_url: string;
  portrait_alt: string;
  intro: string;
  paragraphs: string[];
};

export async function getAboutContent(): Promise<AboutContent> {
  const supabase = createSupabaseServerClient();
  if (!supabase) return aboutContent;

  const { data } = await supabase
    .from("about_content")
    .select("title, portrait_url, portrait_alt, intro, paragraphs")
    .eq("id", aboutContentId)
    .maybeSingle<AboutContentRow>();

  if (!data) return aboutContent;

  return {
    title: data.title || aboutContent.title,
    portraitUrl: data.portrait_url || aboutContent.portraitUrl,
    portraitAlt: data.portrait_alt || aboutContent.portraitAlt,
    intro: data.intro || aboutContent.intro,
    paragraphs: data.paragraphs?.length ? data.paragraphs : aboutContent.paragraphs,
  };
}
