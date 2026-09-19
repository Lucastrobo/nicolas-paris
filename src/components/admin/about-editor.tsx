"use client";

import { useEffect, useState } from "react";
import { aboutContent, aboutContentId } from "@/features/about/data";
import { createSupabaseBrowserClient } from "@/lib/supabase";

type AboutContentRow = {
  id: string;
  title: string;
  portrait_url: string;
  portrait_alt: string;
  intro: string;
  paragraphs: string[];
};

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function AboutEditor() {
  const [content, setContent] = useState<AboutContentRow>({
    id: aboutContentId,
    title: aboutContent.title,
    portrait_url: aboutContent.portraitUrl,
    portrait_alt: aboutContent.portraitAlt,
    intro: aboutContent.intro,
    paragraphs: aboutContent.paragraphs,
  });
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;

    supabase
      .from("about_content")
      .select("id, title, portrait_url, portrait_alt, intro, paragraphs")
      .eq("id", aboutContentId)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setContent(data);
      });
  }, []);

  async function uploadPortrait(file: File) {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) throw new Error("Faltan variables de Supabase.");

    const path = `sobre-mi/${file.lastModified}-${slugify(file.name)}`;
    const { error } = await supabase.storage.from("project-images").upload(path, file, { upsert: true });
    if (error) throw error;

    const { data } = supabase.storage.from("project-images").getPublicUrl(path);
    return data.publicUrl;
  }

  async function onPortraitChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage("Subiendo foto...");
    try {
      const url = await uploadPortrait(file);
      setContent((value) => ({ ...value, portrait_url: url }));
      setMessage("Foto cargada. Guardá los cambios para publicarla.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo cargar la foto.");
    } finally {
      setUploading(false);
    }
  }

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

    const { error } = await supabase.from("about_content").upsert({
      id: aboutContentId,
      title: content.title,
      portrait_url: content.portrait_url,
      portrait_alt: content.portrait_alt,
      intro: content.intro,
      paragraphs: content.paragraphs.filter((paragraph) => paragraph.trim().length > 0),
      updated_at: new Date().toISOString(),
    });

    setSaving(false);
    setMessage(error ? error.message : "Sobre mí actualizado.");
  }

  return (
    <form onSubmit={onSubmit} className="grid max-w-4xl gap-5 rounded border border-[#181717]/20 bg-white p-6">
      {message ? <p className="border border-[#181717]/20 bg-[#f4f4f1] px-4 py-3 text-sm text-[#606060]">{message}</p> : null}

      <label className="admin-field">
        <span>Título</span>
        <input value={content.title} onChange={(event) => setContent((value) => ({ ...value, title: event.target.value }))} />
      </label>

      <div className="grid gap-5 md:grid-cols-[220px_1fr]">
        {content.portrait_url ? <img src={content.portrait_url} alt="" className="h-[280px] w-[180px] object-cover" /> : null}
        <div className="grid content-start gap-5">
          <label className="admin-field">
            <span>Foto</span>
            <input type="file" accept="image/*" onChange={onPortraitChange} disabled={uploading} />
          </label>
          <label className="admin-field">
            <span>Texto alternativo</span>
            <input value={content.portrait_alt} onChange={(event) => setContent((value) => ({ ...value, portrait_alt: event.target.value }))} />
          </label>
        </div>
      </div>

      <label className="admin-field">
        <span>Texto principal</span>
        <textarea value={content.intro} onChange={(event) => setContent((value) => ({ ...value, intro: event.target.value }))} rows={4} />
      </label>

      <div className="grid gap-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-3xl">Párrafos</h2>
          <button type="button" onClick={() => setContent((value) => ({ ...value, paragraphs: [...value.paragraphs, ""] }))} className="border border-[#181717]/30 px-4 py-2">
            Agregar párrafo
          </button>
        </div>
        {content.paragraphs.map((paragraph, index) => (
          <div key={`paragraph-${index}`} className="grid gap-2">
            <label className="admin-field">
              <span>Párrafo {index + 1}</span>
              <textarea
                value={paragraph}
                onChange={(event) => setContent((value) => ({
                  ...value,
                  paragraphs: value.paragraphs.map((item, itemIndex) => itemIndex === index ? event.target.value : item),
                }))}
                rows={4}
              />
            </label>
            {content.paragraphs.length > 1 ? (
              <button
                type="button"
                onClick={() => setContent((value) => ({ ...value, paragraphs: value.paragraphs.filter((_, itemIndex) => itemIndex !== index) }))}
                className="w-fit border border-[#181717]/30 px-3 py-2 text-sm"
              >
                Quitar párrafo
              </button>
            ) : null}
          </div>
        ))}
      </div>

      <button className="w-fit bg-black px-5 py-3 text-white disabled:opacity-50" disabled={saving || uploading}>
        {saving ? "Guardando..." : "Guardar cambios"}
      </button>
    </form>
  );
}
