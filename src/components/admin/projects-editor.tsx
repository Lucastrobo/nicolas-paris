"use client";

import { useCallback, useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { projects as fallbackProjects } from "@/features/projects/data";
import type { GridSpan } from "@/features/projects/types";

type ProjectRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  cover_image_url: string | null;
  order_index: number;
  is_published: boolean;
};

type ProjectImageRow = {
  id: string;
  project_id: string;
  image_url: string;
  alt_text: string;
  order_index: number;
  grid_span: GridSpan;
};

type StatusTone = "neutral" | "success" | "error";

const spanOptions: GridSpan[] = ["1x1", "1x2", "2x1", "2x2", "3x2"];
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function emptyProject(): ProjectRow {
  return {
    id: "",
    slug: "",
    title: "",
    description: "",
    cover_image_url: "",
    order_index: 1,
    is_published: true,
  };
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isPersistedId(id: string) {
  return uuidPattern.test(id);
}

function fallbackRows(): ProjectRow[] {
  return fallbackProjects.map((project) => ({
    id: project.id,
    slug: project.slug,
    title: project.title,
    description: project.description,
    cover_image_url: project.cover,
    order_index: project.order,
    is_published: project.published,
  }));
}

function orderedRows(rows: ProjectRow[]) {
  return [...rows].sort((a, b) => a.order_index - b.order_index);
}

export function ProjectsEditor() {
  const initialProjects = orderedRows(fallbackRows());
  const [projects, setProjects] = useState<ProjectRow[]>(initialProjects);
  const [selectedId, setSelectedId] = useState(initialProjects[0]?.id ?? "");
  const [draft, setDraft] = useState<ProjectRow>(initialProjects[0] ?? emptyProject());
  const [images, setImages] = useState<ProjectImageRow[]>([]);
  const [draggedId, setDraggedId] = useState("");
  const [dragTargetId, setDragTargetId] = useState("");
  const [orderDirty, setOrderDirty] = useState(false);
  const [message, setMessage] = useState("");
  const [tone, setTone] = useState<StatusTone>("neutral");
  const [saving, setSaving] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);

  function setStatus(nextMessage: string, nextTone: StatusTone = "neutral") {
    setMessage(nextMessage);
    setTone(nextTone);
  }

  const loadImages = useCallback(async (projectId: string) => {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;

    const { data } = await supabase.from("project_images").select("*").eq("project_id", projectId).order("order_index", { ascending: true });
    setImages(data ?? []);
  }, []);

  const loadProjects = useCallback(async (preferredId?: string) => {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;

    const { data, error } = await supabase.from("projects").select("*").order("order_index", { ascending: true });
    if (error || !data) {
      if (error) setStatus(error.message, "error");
      return;
    }

    if (data.length === 0) {
      setStatus("Todavía no hay proyectos en Supabase. Podés editar uno de base y guardarlo para crearlo.", "neutral");
      return;
    }

    const nextProjects = orderedRows(data);
    const nextProject = nextProjects.find((project) => project.id === preferredId) ?? nextProjects[0];
    setProjects(nextProjects);
    setSelectedId(nextProject.id);
    setDraft(nextProject);
    setOrderDirty(false);
    await loadImages(nextProject.id);
  }, [loadImages]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadProjects();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadProjects]);

  function newProject() {
    setSelectedId("");
    setDraft({ ...emptyProject(), order_index: projects.length + 1 });
    setImages([]);
    setStatus("");
  }

  function selectProject(project: ProjectRow) {
    setSelectedId(project.id);
    setDraft(project);
    setStatus("");
    if (isPersistedId(project.id)) {
      void loadImages(project.id);
    } else {
      setImages([]);
    }
  }

  function reorderProject(targetId: string) {
    if (!draggedId || draggedId === targetId) return;

    setProjects((current) => {
      const sourceIndex = current.findIndex((project) => project.id === draggedId);
      const targetIndex = current.findIndex((project) => project.id === targetId);
      if (sourceIndex < 0 || targetIndex < 0) return current;

      const next = [...current];
      const [moved] = next.splice(sourceIndex, 1);
      next.splice(targetIndex, 0, moved);
      const reindexed = next.map((project, index) => ({ ...project, order_index: index + 1 }));
      const selected = reindexed.find((project) => project.id === selectedId);
      if (selected) setDraft((value) => ({ ...value, order_index: selected.order_index }));
      return reindexed;
    });

    setOrderDirty(true);
    setStatus("Orden actualizado localmente. Guardá el orden para publicarlo.", "neutral");
  }

  async function saveOrder() {
    if (!orderDirty) {
      setStatus("El orden ya está guardado.", "success");
      return;
    }

    const persisted = projects.filter((project) => isPersistedId(project.id));
    if (persisted.length === 0) {
      setStatus("Primero guardá los proyectos en Supabase para poder persistir el orden.", "error");
      return;
    }

    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setStatus("Faltan variables de Supabase.", "error");
      return;
    }

    setSavingOrder(true);
    setStatus("Guardando orden...");

    for (const project of persisted) {
      const { error } = await supabase.from("projects").update({ order_index: project.order_index, updated_at: new Date().toISOString() }).eq("id", project.id);
      if (error) {
        setSavingOrder(false);
        setStatus(error.message, "error");
        return;
      }
    }

    setSavingOrder(false);
    setOrderDirty(false);
    setStatus("Orden guardado.", "success");
    await loadProjects(selectedId);
  }

  async function uploadImage(file: File, folder: string) {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) throw new Error("Faltan variables de Supabase.");

    const path = `${folder}/${file.lastModified}-${slugify(file.name)}`;
    const { error } = await supabase.storage.from("project-images").upload(path, file, { upsert: true });
    if (error) throw error;

    const { data } = supabase.storage.from("project-images").getPublicUrl(path);
    return data.publicUrl;
  }

  async function onCoverChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setStatus("Subiendo portada...");
    try {
      const url = await uploadImage(file, draft.slug || "portadas");
      setDraft((value) => ({ ...value, cover_image_url: url }));
      setStatus("Portada cargada. Guardá el proyecto para publicar el cambio.", "success");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "No se pudo cargar la portada.", "error");
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setStatus("Guardando proyecto...");

    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setSaving(false);
      setStatus("Faltan variables de Supabase.", "error");
      return;
    }

    const payload = {
      slug: draft.slug || slugify(draft.title),
      title: draft.title,
      description: draft.description,
      cover_image_url: draft.cover_image_url || null,
      order_index: Number(draft.order_index) || projects.length + 1,
      is_published: draft.is_published,
      updated_at: new Date().toISOString(),
    };

    const shouldUpdate = draft.id && isPersistedId(draft.id);
    const query = shouldUpdate
      ? supabase.from("projects").update(payload).eq("id", draft.id).select("*").single()
      : supabase.from("projects").insert(payload).select("*").single();
    const { data, error } = await query;

    setSaving(false);
    if (error || !data) {
      setStatus(error?.message ?? "No se pudo guardar.", "error");
      return;
    }

    setStatus("Proyecto guardado.", "success");
    setDraft(data);
    setSelectedId(data.id);
    await loadProjects(data.id);
  }

  async function deleteProject() {
    if (!draft.id || !isPersistedId(draft.id) || !confirm("¿Eliminar este proyecto?")) return;

    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;

    const { error } = await supabase.from("projects").delete().eq("id", draft.id);
    setStatus(error ? error.message : "Proyecto eliminado.", error ? "error" : "success");
    newProject();
    await loadProjects();
  }

  async function addProjectImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !draft.id || !isPersistedId(draft.id)) {
      setStatus("Guardá el proyecto antes de agregar imágenes.", "error");
      return;
    }

    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;

    setStatus("Subiendo imagen...");
    try {
      const imageUrl = await uploadImage(file, draft.slug || draft.id);
      const { error } = await supabase.from("project_images").insert({
        project_id: draft.id,
        image_url: imageUrl,
        alt_text: draft.title,
        order_index: images.length + 1,
        grid_span: "1x1",
      });
      if (error) throw error;
      setStatus("Imagen cargada.", "success");
      await loadImages(draft.id);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "No se pudo cargar la imagen.", "error");
    }
  }

  async function updateImage(image: ProjectImageRow) {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;

    const { error } = await supabase.from("project_images").update({
      alt_text: image.alt_text,
      order_index: Number(image.order_index) || 0,
      grid_span: image.grid_span,
    }).eq("id", image.id);

    setStatus(error ? error.message : "Imagen actualizada.", error ? "error" : "success");
    if (draft.id) await loadImages(draft.id);
  }

  async function deleteImage(imageId: string) {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;

    const { error } = await supabase.from("project_images").delete().eq("id", imageId);
    setStatus(error ? error.message : "Imagen eliminada.", error ? "error" : "success");
    if (draft.id) await loadImages(draft.id);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <aside className="rounded border border-[#181717]/20 bg-white p-4">
        <button onClick={newProject} className="mb-4 w-full bg-black px-4 py-3 text-white">Nuevo proyecto</button>
        <button
          onClick={saveOrder}
          disabled={savingOrder}
          className={`mb-2 w-full border px-4 py-3 transition-colors disabled:opacity-50 ${orderDirty ? "border-black bg-black text-white" : "border-[#181717]/30 bg-white text-black"}`}
        >
          {savingOrder ? "Guardando orden..." : orderDirty ? "Guardar nuevo orden" : "Orden guardado"}
        </button>
        <p className="mb-4 text-xs leading-tight text-[#606060]">Arrastrá los proyectos para definir en qué orden aparecen en la web.</p>
        <div className="grid gap-2">
          {projects.map((project) => (
            <button
              key={project.id}
              draggable
              onDragStart={() => setDraggedId(project.id)}
              onDragOver={(event) => {
                event.preventDefault();
                if (project.id !== dragTargetId) setDragTargetId(project.id);
              }}
              onDragLeave={() => {
                if (dragTargetId === project.id) setDragTargetId("");
              }}
              onDrop={() => {
                reorderProject(project.id);
                setDragTargetId("");
              }}
              onDragEnd={() => {
                setDraggedId("");
                setDragTargetId("");
              }}
              onClick={() => selectProject(project)}
              className={`grid cursor-grab grid-cols-[auto_1fr] gap-3 border px-3 py-2 text-left transition active:cursor-grabbing ${project.id === selectedId ? "border-black" : "border-[#181717]/20"} ${project.id === draggedId ? "opacity-45" : ""} ${project.id === dragTargetId && project.id !== draggedId ? "translate-y-0.5 bg-[#f2f2f2]" : "bg-white"}`}
            >
              <span className="select-none text-lg leading-none text-[#606060]">☰</span>
              <span>
                <span className="block text-sm text-[#606060]">Orden {project.order_index}</span>
                <strong>{project.title || "Sin título"}</strong>
              </span>
            </button>
          ))}
        </div>
      </aside>

      <div className="grid gap-6">
        {message ? (
          <p className={`border px-4 py-3 text-sm ${tone === "success" ? "border-green-700 bg-green-50 text-green-800" : tone === "error" ? "border-red-700 bg-red-50 text-red-800" : "border-[#181717]/20 bg-white text-[#606060]"}`}>
            {message}
          </p>
        ) : null}

        <form onSubmit={onSubmit} className="grid gap-5 rounded border border-[#181717]/20 bg-white p-6">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="admin-field">
              <span>Título</span>
              <input value={draft.title} onChange={(event) => setDraft((value) => ({ ...value, title: event.target.value, slug: value.slug || slugify(event.target.value) }))} required />
            </label>
            <label className="admin-field">
              <span>Slug</span>
              <input value={draft.slug} onChange={(event) => setDraft((value) => ({ ...value, slug: slugify(event.target.value) }))} required />
            </label>
          </div>
          <label className="admin-field">
            <span>Descripción</span>
            <textarea value={draft.description} onChange={(event) => setDraft((value) => ({ ...value, description: event.target.value }))} rows={4} />
          </label>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="admin-field">
              <span>Orden</span>
              <input type="number" value={draft.order_index} readOnly />
              <small className="text-xs text-[#606060]">Se cambia arrastrando el proyecto en la lista.</small>
            </label>
            <label className="admin-field">
              <span>Portada</span>
              <input type="file" accept="image/*" onChange={onCoverChange} />
            </label>
          </div>
          {draft.cover_image_url ? <img src={draft.cover_image_url} alt="" className="h-40 w-40 object-cover" /> : null}
          <label className="flex items-center gap-3">
            <input type="checkbox" checked={draft.is_published} onChange={(event) => setDraft((value) => ({ ...value, is_published: event.target.checked }))} />
            Publicado
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <button className="bg-black px-5 py-3 text-white transition disabled:opacity-50" disabled={saving}>{saving ? "Guardando..." : "Guardar proyecto"}</button>
            {draft.id && isPersistedId(draft.id) ? <button type="button" onClick={deleteProject} className="border border-[#181717]/30 px-5 py-3">Eliminar</button> : null}
            {saving ? <span className="text-sm text-[#606060]">Estamos guardando los cambios...</span> : null}
          </div>
        </form>

        {draft.id && isPersistedId(draft.id) ? (
          <section className="grid gap-4 rounded border border-[#181717]/20 bg-white p-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-display text-4xl">Imágenes del proyecto</h2>
              <label className="cursor-pointer bg-black px-4 py-3 text-white">
                Agregar imagen
                <input type="file" accept="image/*" onChange={addProjectImage} className="hidden" />
              </label>
            </div>
            <div className="grid gap-4">
              {images.map((image) => (
                <article key={image.id} className="grid grid-cols-[96px_1fr_auto] items-center gap-4 border border-[#181717]/20 p-3 max-md:grid-cols-1">
                  <img src={image.image_url} alt="" className="h-24 w-24 object-cover" />
                  <div className="grid gap-3 md:grid-cols-3">
                    <label className="admin-field">
                      <span>Alt</span>
                      <input value={image.alt_text} onChange={(event) => setImages((list) => list.map((item) => item.id === image.id ? { ...item, alt_text: event.target.value } : item))} />
                    </label>
                    <label className="admin-field">
                      <span>Orden</span>
                      <input type="number" value={image.order_index} onChange={(event) => setImages((list) => list.map((item) => item.id === image.id ? { ...item, order_index: Number(event.target.value) } : item))} />
                    </label>
                    <label className="admin-field">
                      <span>Grilla</span>
                      <select value={image.grid_span} onChange={(event) => setImages((list) => list.map((item) => item.id === image.id ? { ...item, grid_span: event.target.value as GridSpan } : item))}>
                        {spanOptions.map((span) => <option key={span}>{span}</option>)}
                      </select>
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => updateImage(image)} className="border border-[#181717]/30 px-3 py-2">Guardar</button>
                    <button type="button" onClick={() => deleteImage(image.id)} className="border border-[#181717]/30 px-3 py-2">Eliminar</button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}

      </div>
    </div>
  );
}
