import type { Metadata } from "next";
import { ContactSection } from "@/components/public/contact-section";
import { ImageWithSkeleton } from "@/components/public/image-with-skeleton";
import { SiteFooter } from "@/components/public/site-footer";
import { SiteHeader } from "@/components/public/site-header";
import { getAboutContent } from "@/features/about/data";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getAboutContent();

  return {
    title: "Sobre mí",
    description: "Conocé a Nicolas Paris, diseñador gráfico especializado en branding, identidad visual y creación de marcas.",
    openGraph: {
      title: "Sobre mí | Nicolas Paris",
      description: content.intro,
      images: [
        {
          url: content.portraitUrl,
          width: 800,
          height: 1000,
          alt: content.portraitAlt,
        },
      ],
    },
  };
}

export default async function AboutPage() {
  const content = await getAboutContent();

  return (
    <>
      <SiteHeader />
      <main>
        <section className="site-shell py-20 max-md:py-12">
          <h1 className="mb-16 font-display text-[80px] font-medium leading-[1.06] max-md:text-[52px]">{content.title}</h1>
          <div className="relative grid max-w-[1024px] grid-cols-[256px_640px] items-center gap-32 max-lg:grid-cols-1 max-lg:gap-12">
            <img src="/images/figma/asterisk.svg" alt="" className="spin-clockwise absolute -left-10 top-[71px] z-20 size-20 max-lg:left-6 max-lg:-top-8" />
            <ImageWithSkeleton src={content.portraitUrl} alt={content.portraitAlt} className="relative z-10 h-[400px] w-[256px] max-lg:ml-16" />
            <div className="flex flex-col gap-14">
              <p className="text-[40px] leading-[1.17] max-md:text-[30px]">{content.intro}</p>
              <div className="space-y-7 text-2xl leading-[1.17] max-md:text-xl">
                {content.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </section>
        <ContactSection />
      </main>
      <SiteFooter />
    </>
  );
}
