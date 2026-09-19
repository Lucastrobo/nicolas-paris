import Link from "next/link";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-black py-12 text-white">
      <div className="site-shell flex items-center justify-between gap-10 max-md:flex-col max-md:items-start max-md:gap-8">
        <Link href="/" aria-label="Nicolas Paris" className="block h-[30px] w-[217px] max-md:w-[170px]">
          <img src="/images/figma/logo-horizontal.svg" alt="Nicolas Paris" className="h-full w-full object-contain object-left invert" />
        </Link>
        <div className="flex gap-[42px] text-[22px] leading-[1.17] tracking-[-0.03em] max-md:text-base">
          <a href="https://www.instagram.com/nicolasparis.dg/" target="_blank" rel="noreferrer" className="hover:underline">
            Instagram
          </a>
          <a href="https://www.behance.net/nicolasparis" target="_blank" rel="noreferrer" className="hover:underline">
            Behance
          </a>
          <a href="https://ar.linkedin.com/in/nicolas-paris-designer" target="_blank" rel="noreferrer" className="hover:underline">
            LinkedIn
          </a>
        </div>
        <p className="text-[22px] leading-[1.17] tracking-[-0.03em] max-md:text-base">{"\u00a9"} {year}</p>
      </div>
    </footer>
  );
}
