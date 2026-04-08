"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  History,
  ScrollText,
  Users,
  Settings,
  LogOut,
} from "lucide-react";

export function UserMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 pl-3 border-l border-border cursor-pointer hover:opacity-80 transition-opacity"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
          DF
        </div>
        <div className="hidden md:flex flex-col text-left">
          <span className="text-sm font-medium text-foreground leading-tight">Demo User</span>
          <span className="text-[10px] text-muted-foreground leading-none">Operator</span>
        </div>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full mt-2 w-48 rounded-lg border border-border bg-card shadow-lg z-50 py-1" style={{ right: "-8px" }}>
          {/* User info header */}
          <div className="px-3 py-2.5 border-b border-border/50">
            <p className="text-sm font-medium text-foreground">Demo User</p>
            <p className="text-xs text-muted-foreground">demo@decisionfoundry.com</p>
          </div>

          {/* Menu items */}
          <div className="py-1">
            <Link
              href="/history"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <History className="h-4 w-4" />
              History
            </Link>
            <Link
              href="/audit-log"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <ScrollText className="h-4 w-4" />
              Audit Log
            </Link>
            <Link
              href="/users"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <Users className="h-4 w-4" />
              Users
            </Link>
            <Link
              href="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </div>

          {/* Logout */}
          <div className="border-t border-border/50 py-1">
            <button
              onClick={() => { setOpen(false); alert("Logout (demo)"); }}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
