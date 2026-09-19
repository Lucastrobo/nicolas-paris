import { AdminShell } from "@/components/admin/admin-shell";
import { HomeEditor } from "@/components/admin/home-editor";

export default function AdminHomePage() {
  return (
    <AdminShell title="Home">
      <HomeEditor />
    </AdminShell>
  );
}
