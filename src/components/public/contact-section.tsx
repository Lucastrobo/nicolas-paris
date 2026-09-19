import { ContactForm } from "./contact-form";

export function ContactSection() {
  return (
    <section id="contacto" className="bg-black py-[140px] text-white max-md:py-20">
      <div className="site-shell grid grid-cols-[544px_448px] justify-between gap-20 max-lg:grid-cols-1">
        <div className="flex flex-col gap-10">
          <h2 className="font-display text-[80px] font-medium leading-[1.06] max-md:text-[52px]">¿Tenés un proyecto en mente?</h2>
          <p className="max-w-[448px] text-2xl leading-[1.17]">Contame un poco sobre tu proyecto y coordinamos una primera charla.</p>
          <a href="mailto:nicolasparis.dg@gmail.com" className="text-2xl leading-[1.17] tracking-[-0.03em] underline">
            nicolasparis.dg@gmail.com
          </a>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
