import { ContactSection } from "@/components/public/contact-section";
import { HeroSection } from "@/components/public/hero-section";
import { HomeProjectsSection } from "@/components/public/home-projects-section";
import { MethodSection } from "@/components/public/method-section";
import { SiteFooter } from "@/components/public/site-footer";
import { SiteHeader } from "@/components/public/site-header";
import { getHomeContent } from "@/features/home/data";
import { getPublishedProjectsForSite } from "@/features/projects/data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [homeContent, projects] = await Promise.all([getHomeContent(), getPublishedProjectsForSite()]);

  return (
    <>
      <SiteHeader />
      <main>
        <HeroSection content={homeContent} />
        <HomeProjectsSection projects={projects} />
        <MethodSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </>
  );
}
