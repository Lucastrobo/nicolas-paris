"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { homeContent } from "@/features/home/data";

type HomeContentRow = {
  id: string;
  hero_title_light: string;
  hero_title_strong: string;
  hero_subtitle: string;
};

const homeId = "00000000-0000-0000-0000-000000000001";

export function HomeEditor() {
  const [content, setContent] = useState<HomeContentRow>({
    id: homeId,
    hero_title_light: homeContent.heroTitleLight,
    hero_title_strong: homeContent.heroTitleStrong,
    hero_subtitle: homeContent.heroSubtitle,
  });
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;

    supabase
      .from("home_content")
      .select("id, hero_title_light, hero_title_strong, hero_subtitle")
      .eq("id", homeId)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setContent(data);
      });
  }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setSaving(false);
      setMessage("Faltan variables de Supabase.");
      return;
    }

    const { error } = await supabase.from("home_content").upsert({
      id: homeId,
      hero_title_light: content.hero_title_light,
      hero_title_strong: content.hero_title_strong,
      hero_subtitle: content.hero_subtitle,
      updated_at: new Date().toISOString(),
    });

    setSaving(false);
    setMessage(error ? error.message : "Home actualizado.");
  }

  return (
    <form onSubmit={onSubmit} className="grid max-w-3xl gap-5 rounded border border-[#181717]/20 bg-white p-6">
      <label className="admin-field">
        <span>Título claro</span>
        <textarea value={content.hero_title_light} onChange={(event) => setContent((value) => ({ ...value, hero_title_light: event.target.value }))} rows={2} />
      </label>
      <label className="admin-field">
        <span>Título destacado</span>
        <input value={content.hero_title_strong} onChange={(event) => setContent((value) => ({ ...value, hero_title_strong: event.target.value }))} />
      </label>
      <label className="admin-field">
        <span>Bajada</span>
        <textarea value={content.hero_subtitle} onChange={(event) => setContent((value) => ({ ...value, hero_subtitle: event.target.value }))} rows={4} />
      </label>
      <button className="w-fit bg-black px-5 py-3 text-white disabled:opacity-50" disabled={saving}>
        {saving ? "Guardando" : "Guardar cambios"}
      </button>
      {message ? <p className="text-sm text-[#606060]">{message}</p> : null}
    </form>
  );
}
