"use client";

import { useEffect, useRef } from "react";
import { methodSteps } from "@/features/home/data";

export function MethodSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const parallaxRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const parallax = parallaxRef.current;
    const image = imageRef.current;
    if (!section || !parallax || !image) return;
    const parallaxNode = parallax;
    const imageNode = image;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    let frame = 0;
    let current = 0;

    function update() {
      const rect = parallaxNode.getBoundingClientRect();
      const isMobile = window.innerWidth < 900;
      const viewportAnchor = window.innerHeight * (isMobile ? 0.82 : 0.5);
      const parallaxCenter = rect.top + rect.height / 2;
      const rawTarget = (viewportAnchor - parallaxCenter) * (isMobile ? 0.46 : 0.36);
      const maxTravel = isMobile ? 118 : 150;
      const target = Math.max(-maxTravel, Math.min(maxTravel, rawTarget));

      current += (target - current) * (isMobile ? 0.12 : 0.085);
      imageNode.style.transform = `translate3d(0, ${current.toFixed(2)}px, 0) scale(1.16)`;
      frame = requestAnimationFrame(update);
    }

    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <section ref={sectionRef} id="como-trabajo" className="relative overflow-hidden bg-black text-white">
      <div ref={parallaxRef} className="method-parallax relative -mb-px h-[400px] overflow-hidden max-md:h-[268px]">
        <img ref={imageRef} src="/images/figma/home-extra-1.png" alt="" className="method-parallax-image" />
        <div className="site-shell relative z-10 flex h-full items-end pb-10 max-md:hidden">
          <h2 className="font-display text-[60px] font-medium leading-[1.06] text-black max-md:text-[44px]">
            <span className="font-black">Una mirada,</span>
            <br />
            <span className="font-light">tres etapas.</span>
          </h2>
        </div>
      </div>
      <div className="site-shell relative grid grid-cols-3 gap-8 py-20 max-md:flex max-md:flex-col max-md:gap-16 max-md:py-20">
        <h2 className="hidden font-display text-[44px] font-medium leading-[1.06] text-[#f8f8f1] max-md:block">
          <span className="font-black">Una mirada,</span>
          <br />
          <span className="font-light">tres etapas.</span>
        </h2>
        {methodSteps.map((step) => (
          <article key={step.number} className="flex flex-col gap-5">
            <p className="text-base leading-[1.06] text-[#f8f8f1]">{step.number}</p>
            <h3 className="font-display text-[40px] leading-[1.06] text-[#f8f8f1]">{step.title}</h3>
            <p className="max-w-[352px] text-xl leading-[1.06] text-[#f8f8f1]">{step.text}</p>
          </article>
        ))}
        <img src="/images/figma/asterisk.svg" alt="" className="spin-clockwise absolute -top-10 right-0 size-20 invert max-md:hidden" />
      </div>
    </section>
  );
}
