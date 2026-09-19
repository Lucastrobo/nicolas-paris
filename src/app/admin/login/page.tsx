import { AdminShell } from "@/components/admin/admin-shell";
import { LoginForm } from "@/components/admin/login-form";

export default function LoginPage() {
  return (
    <AdminShell title="Login">
      <LoginForm />
    </AdminShell>
  );
}
