"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/#proyectos", label: "PROYECTOS", targetId: "proyectos" },
  { href: "/#como-trabajo", label: "COMO TRABAJO", targetId: "como-trabajo" },
  { href: "/sobre-mi", label: "SOBRE MI" },
  { href: "/#contacto", label: "CONTACTO", targetId: "contacto" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isAnchorScrolling = useRef(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 80);

      if (window.location.hash && !isAnchorScrolling.current) {
        window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
      }
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function scrollCurrentHash() {
      if (window.location.pathname !== "/" || !window.location.hash) return;

      const target = document.getElementById(window.location.hash.slice(1));
      if (!target) return;

      isAnchorScrolling.current = true;
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      window.setTimeout(() => {
        isAnchorScrolling.current = false;
      }, 900);
    }

    window.setTimeout(scrollCurrentHash, 0);
    window.addEventListener("hashchange", scrollCurrentHash);
    return () => window.removeEventListener("hashchange", scrollCurrentHash);
  }, []);

  function handleAnchorClick(event: React.MouseEvent<HTMLAnchorElement>, targetId?: string) {
    setMenuOpen(false);

    if (!targetId || window.location.pathname !== "/") return;

    const target = document.getElementById(targetId);
    if (!target) return;

    event.preventDefault();
    isAnchorScrolling.current = true;
    window.history.replaceState(null, "", `#${targetId}`);
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => {
      isAnchorScrolling.current = false;
    }, 900);
  }

  function handleLogoClick(event: React.MouseEvent<HTMLAnchorElement>) {
    setMenuOpen(false);

    if (window.location.pathname !== "/") return;

    event.preventDefault();
    window.history.replaceState(null, "", "/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <header
        className="fixed left-0 top-0 z-50 h-[158px] w-full bg-white text-[#181717] transition-[background-color,height,color] duration-300 max-md:h-[86px]"
        style={
          scrolled || menuOpen
            ? {
                height: 86,
                backgroundColor: "#000000",
                color: "#ffffff",
              }
            : undefined
        }
      >
        <div
          className="site-shell flex items-start justify-between py-16 transition-[padding] duration-300 max-md:items-center max-md:py-7"
          style={scrolled ? { paddingBlock: 28 } : undefined}
        >
          <Link href="/" aria-label="Nicolas Paris" onClick={handleLogoClick} className="block h-[30px] w-[217px] max-md:w-[170px]">
            <img
              src="/images/figma/logo-horizontal.svg"
              alt="Nicolas Paris"
              className={cn("h-full w-full object-contain object-left transition-[filter] duration-300", (scrolled || menuOpen) && "invert")}
            />
          </Link>
          <nav className="flex gap-10 text-[18px] font-medium leading-[1.2] tracking-[-0.03em] max-lg:gap-6 max-md:hidden">
            {navItems.map((item) => (
              <Link key={item.label} href={item.href} onClick={(event) => handleAnchorClick(event, item.targetId)} className="transition-opacity hover:opacity-55">
                {item.label}
              </Link>
            ))}
          </nav>
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((value) => !value)}
            className="hidden text-[18px] font-medium leading-[1.2] tracking-[-0.03em] transition-opacity hover:opacity-70 max-md:block"
          >
            {menuOpen ? "CERRAR" : "MENÚ"}
          </button>
        </div>
        <nav
          id="mobile-menu"
          className={cn(
            "hidden bg-black text-white transition-[opacity,transform] duration-300 max-md:block",
            menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none -translate-y-2 opacity-0",
          )}
        >
          <div className="site-shell flex flex-col gap-8 pb-10 pt-4 font-display text-[22px] leading-[1.06]">
            {navItems.map((item) => (
              <Link key={item.label} href={item.href} onClick={(event) => handleAnchorClick(event, item.targetId)} className="transition-opacity hover:opacity-60">
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </header>
      <div className="h-[158px] max-md:h-[86px]" aria-hidden="true" />
    </>
  );
}
