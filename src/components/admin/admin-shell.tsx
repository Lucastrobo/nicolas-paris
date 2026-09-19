import Link from "next/link";
import { AdminGuard } from "./admin-guard";

export function AdminShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <AdminGuard>
      <main className="min-h-screen bg-[#f4f4f1] text-[#181717]">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-8 py-10">
          <header className="flex items-center justify-between border-b border-[#181717]/20 pb-6">
            <div>
              <p className="text-sm uppercase tracking-[0.12em] text-[#606060]">Admin</p>
              <h1 className="font-display text-5xl leading-none">{title}</h1>
            </div>
            <div className="flex gap-5 text-lg">
              <Link href="/admin" className="underline">Panel</Link>
              <Link href="/" className="underline">Ver sitio</Link>
            </div>
          </header>
          {children}
        </div>
      </main>
    </AdminGuard>
  );
}
