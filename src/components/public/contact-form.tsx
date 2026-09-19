"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/contact", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(formData)),
      headers: { "Content-Type": "application/json" },
    });

    setStatus(response.ok ? "sent" : "error");
    if (response.ok) event.currentTarget.reset();
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full flex-col gap-10 pt-[200px] max-lg:pt-6">
      <label className="contact-field">
        <span>Nombre</span>
        <input name="name" required autoComplete="name" />
      </label>
      <label className="contact-field">
        <span>Email</span>
        <input name="email" required type="email" autoComplete="email" />
      </label>
      <label className="contact-field">
        <span>Contame sobre tu proyecto</span>
        <textarea name="message" required rows={3} />
      </label>
      <button type="submit" disabled={status === "sending"} className="w-fit bg-white px-4 py-2.5 text-[18px] font-medium leading-[1.2] tracking-[-0.03em] text-black transition-opacity hover:opacity-80 disabled:opacity-50">
        {status === "sending" ? "Enviando" : "Enviar consulta"}
      </button>
      {status === "sent" ? <p className="text-lg">Consulta enviada.</p> : null}
      {status === "error" ? <p className="text-lg">No se pudo enviar. Probá nuevamente.</p> : null}
    </form>
  );
}
