"use client";

import { ArrowUpRight, Check, CircleAlert, LoaderCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [formHeight, setFormHeight] = useState(0);
  const sendingRef = useRef(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const restoreFocusRef = useRef(false);

  useEffect(() => {
    if (status === "sent") headingRef.current?.focus({ preventScroll: true });
    if (status === "idle" && restoreFocusRef.current) {
      nameRef.current?.focus({ preventScroll: true });
      restoreFocusRef.current = false;
    }
  }, [status]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sendingRef.current) return;
    sendingRef.current = true;
    setStatus("sending");
    setMessage("");

    const form = event.currentTarget;
    setFormHeight(form.getBoundingClientRect().height);
    const formData = new FormData(form);
    const response = await fetch("/api/contact", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(formData)),
      headers: { "Content-Type": "application/json" },
    }).catch(() => null);
    sendingRef.current = false;

    if (response?.ok) {
      setStatus("sent");
      form.reset();
      return;
    }

    setStatus("error");
    setMessage(
      "No se pudo enviar la consulta. Tus datos siguen acá; probá nuevamente.",
    );
  }

  return (
    <div className="w-full min-w-0 pt-[200px] max-lg:pt-6">
      {status === "sent" ? (
        <div
          className="flex flex-col items-start justify-center gap-6 py-8"
          style={{ minHeight: formHeight }}
        >
          <Check className="size-10" strokeWidth={1.5} aria-hidden="true" />
          <h3
            ref={headingRef}
            tabIndex={-1}
            className="font-display text-[40px] font-medium leading-[1.1] max-md:text-[32px]"
          >
            Gracias por escribir.
          </h3>
          <p className="max-w-md text-xl leading-relaxed">
            Tu consulta fue enviada.
            <br />
            Pronto me pondré en contacto.
          </p>
          <button
            type="button"
            onClick={() => {
              restoreFocusRef.current = true;
              setMessage("");
              setStatus("idle");
            }}
            className="mt-2 inline-flex min-h-11 items-center gap-3 bg-white px-4 py-2.5 text-[18px] font-medium text-black transition-opacity hover:opacity-80"
          >
            Enviar otra consulta{" "}
            <ArrowUpRight className="size-5 shrink-0" aria-hidden="true" />
          </button>
        </div>
      ) : (
        <form
          onSubmit={onSubmit}
          aria-busy={status === "sending"}
          className="flex w-full flex-col gap-10"
        >
          <label className="contact-field">
            <span>Nombre</span>
            <input
              ref={nameRef}
              name="name"
              required
              minLength={2}
              autoComplete="name"
              readOnly={status === "sending"}
            />
          </label>
          <label className="contact-field">
            <span>Email</span>
            <input
              name="email"
              required
              type="email"
              autoComplete="email"
              readOnly={status === "sending"}
            />
          </label>
          <label className="contact-field">
            <span>Contame sobre tu proyecto</span>
            <textarea
              name="message"
              required
              rows={3}
              readOnly={status === "sending"}
            />
          </label>
          <button
            type="submit"
            disabled={status === "sending"}
            className="inline-flex min-h-11 w-fit min-w-[200px] items-center justify-center gap-3 bg-white px-4 py-2.5 text-[18px] font-medium leading-[1.2] text-black transition-opacity hover:opacity-80 disabled:opacity-50"
          >
            {status === "sending" ? (
              <LoaderCircle
                className="size-5 shrink-0 animate-spin motion-reduce:animate-none"
                aria-hidden="true"
              />
            ) : (
              <ArrowUpRight className="size-5 shrink-0" aria-hidden="true" />
            )}
            {status === "sending"
              ? "Enviando..."
              : status === "error"
                ? "Reintentar"
                : "Enviar consulta"}
          </button>
          {message ? (
            <p role="alert" className="flex items-start gap-3 text-lg">
              <CircleAlert
                className="mt-1 size-5 shrink-0"
                aria-hidden="true"
              />
              {message}
            </p>
          ) : null}
        </form>
      )}
      <p className="sr-only" role="status">
        {status === "sending" ? "Enviando consulta." : ""}
      </p>
    </div>
  );
}
