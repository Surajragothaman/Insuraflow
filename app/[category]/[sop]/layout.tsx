"use client";

import { use } from "react";
import { notFound, usePathname } from "next/navigation";
import { getAppBySlug } from "@/lib/mock-data";
import { AppSidebar } from "@/components/layout/sidebar";
import { AppHeader } from "@/components/layout/topbar";

export default function SopLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ category: string; sop: string }>;
}) {
  const { category, sop } = use(params);
  const pathname = usePathname();
  const app = getAppBySlug(category, sop);
  if (!app) notFound();

  const basePath = `/${category}/${sop}`;

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar currentPath={pathname} basePath={basePath} appName={app.name} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader />
        <main className="flex-1 overflow-hidden bg-background">{children}</main>
      </div>
    </div>
  );
}
