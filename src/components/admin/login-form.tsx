"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase";

type Status = "idle" | "missing-env" | "loading" | "error";

export function LoginForm() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setStatus("missing-env");
      setMessage("Faltan NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY.");
      return;
    }

    setStatus("loading");
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="max-w-md space-y-5 rounded border border-[#181717]/20 bg-white p-6">
      <label className="admin-field">
        <span>Email</span>
        <input name="email" type="email" placeholder="admin@email.com" required />
      </label>
      <label className="admin-field">
        <span>Contraseña</span>
        <input name="password" type="password" placeholder="Contraseña" required />
      </label>
      <button className="bg-black px-5 py-3 text-white disabled:opacity-50" disabled={status === "loading"}>
        {status === "loading" ? "Entrando" : "Entrar"}
      </button>
      {message ? <p className="text-sm text-[#606060]">{message}</p> : null}
    </form>
  );
}
