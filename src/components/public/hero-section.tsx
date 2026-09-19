const marqueeText = "DISE\u00d1O/CRITERIO/M\u00c9TODO/IMPACTO/";

type HeroContent = {
  heroTitleLight: string;
  heroTitleStrong: string;
  heroSubtitle: string;
};

export function HeroSection({ content }: { content: HeroContent }) {
  return (
    <section className="relative min-h-[calc(100vh-158px)] overflow-hidden pb-[84px] pt-20 max-md:min-h-[620px] max-md:pb-12 max-md:pt-10">
      <div className="marquee-bg" aria-hidden="true">
        <div className="marquee-track">
          <span>{marqueeText}</span>
          <span>{marqueeText}</span>
        </div>
      </div>
      <div className="site-shell relative z-10 min-h-[506px] max-md:min-h-[460px]">
        <h1 className="max-w-[928px] font-display text-[80px] leading-[1.06] tracking-[-0.01em] max-lg:text-[64px] max-md:text-[46px]">
          <span className="font-light">{content.heroTitleLight}</span>{" "}
          <span className="font-black">{content.heroTitleStrong}</span>
        </h1>
        <p className="mt-20 max-w-[544px] text-2xl leading-[1.17] max-md:mt-12 max-md:text-xl">{content.heroSubtitle}</p>
        <img src="/images/figma/asterisk.svg" alt="" className="spin-clockwise absolute right-0 top-[220px] size-20 max-md:right-6 max-md:top-[505px]" />
      </div>
    </section>
  );
}
