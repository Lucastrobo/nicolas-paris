import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { getPublishedProjects } from "@/features/projects/data";

export default function AdminPage() {
  const projects = getPublishedProjects();

  return (
    <AdminShell title="Panel">
      <div className="grid gap-6 md:grid-cols-2">
        <Link href="/admin/proyectos" className="admin-card">
          <p className="text-sm uppercase tracking-[0.12em] text-[#606060]">Proyectos</p>
          <strong className="text-5xl">{projects.length}</strong>
          <span>Crear, ordenar, publicar y editar imágenes.</span>
        </Link>
        <Link href="/admin/home" className="admin-card">
          <p className="text-sm uppercase tracking-[0.12em] text-[#606060]">Home</p>
          <strong className="text-2xl">Header editable</strong>
          <span>Títulos y bajada principal.</span>
        </Link>
        <Link href="/admin/sobre-mi" className="admin-card">
          <p className="text-sm uppercase tracking-[0.12em] text-[#606060]">Sobre mí</p>
          <strong className="text-2xl">Bio editable</strong>
          <span>Foto, título, texto principal y párrafos.</span>
        </Link>
      </div>
    </AdminShell>
  );
}
