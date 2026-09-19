import { AdminShell } from "@/components/admin/admin-shell";
import { ProjectsEditor } from "@/components/admin/projects-editor";

export default function AdminProjectsPage() {
  return (
    <AdminShell title="Proyectos">
      <ProjectsEditor />
    </AdminShell>
  );
}
