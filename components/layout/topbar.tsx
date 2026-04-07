"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { categories } from "@/lib/mock-data";

export function AppHeader() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const category = categories.find((c) => c.slug === segments[0]);
  const app = category?.apps.find((a) => a.slug === segments[1]);
  const stage = segments[2]; // intake, actions, output, history

  return (
    <header className="flex h-12 shrink-0 items-center border-b bg-card px-4">
      <nav className="flex items-center gap-1 text-sm">
        <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
          <Home className="h-4 w-4" />
        </Link>
        {category && (
          <>
            <ChevronRight className="h-3 w-3 text-muted-foreground" />
            <Link
              href={`/${category.slug}`}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {category.name}
            </Link>
          </>
        )}
        {app && (
          <>
            <ChevronRight className="h-3 w-3 text-muted-foreground" />
            <Link
              href={`/${category!.slug}/${app.slug}/intake`}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {app.name}
            </Link>
          </>
        )}
        {stage && (
          <>
            <ChevronRight className="h-3 w-3 text-muted-foreground" />
            <span className="font-medium capitalize">{stage}</span>
          </>
        )}
      </nav>
    </header>
  );
}
