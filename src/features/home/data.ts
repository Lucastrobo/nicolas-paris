import { createSupabaseServerClient } from "@/lib/supabase";

export const homeContent = {
  heroTitleLight: "DISEÑO MARCAS E IDENTIDADES VISUALES CON",
  heroTitleStrong: "IMPACTO Y DIRECCIÓN",
  heroSubtitle:
    "Trabajo junto a marcas y proyectos que buscan verse con claridad, diferenciarse y construir una presencia consistente.",
};

export async function getHomeContent() {
  const supabase = createSupabaseServerClient();
  if (!supabase) return homeContent;

  const { data } = await supabase
    .from("home_content")
    .select("hero_title_light, hero_title_strong, hero_subtitle")
    .eq("id", "00000000-0000-0000-0000-000000000001")
    .maybeSingle();

  if (!data) return homeContent;

  return {
    heroTitleLight: data.hero_title_light,
    heroTitleStrong: data.hero_title_strong,
    heroSubtitle: data.hero_subtitle,
  };
}

export const methodSteps = [
  {
    number: "01",
    title: "Entender",
    text: "Conocemos el contexto, los objetivos y las personas a las que la marca necesita llegar.",
  },
  {
    number: "02",
    title: "Definir",
    text: "Ordenamos la estrategia, las ideas y los criterios que le darán personalidad al sistema visual.",
  },
  {
    number: "03",
    title: "Activar",
    text: "Construimos una identidad lista para expresarse con coherencia en cada punto de contacto.",
  },
];
