"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(pathname === "/admin/login");

  useEffect(() => {
    if (pathname === "/admin/login") {
      return;
    }

    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      router.replace("/admin/login");
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace("/admin/login");
        return;
      }

      setReady(true);
    });
  }, [pathname, router]);

  if (!ready) {
    return <main className="min-h-screen bg-[#f4f4f1] p-10 text-[#181717]">Cargando admin...</main>;
  }

  return children;
}
