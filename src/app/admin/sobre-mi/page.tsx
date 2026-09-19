import { AboutEditor } from "@/components/admin/about-editor";
import { AdminShell } from "@/components/admin/admin-shell";

export default function AdminAboutPage() {
  return (
    <AdminShell title="Sobre mí">
      <AboutEditor />
    </AdminShell>
  );
}
