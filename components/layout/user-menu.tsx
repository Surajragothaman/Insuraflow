"use client";

import Link from "next/link";
import {
  History,
  ScrollText,
  Users,
  Settings,
  LogOut,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2.5 pl-3 pr-2 h-10 border-l border-border cursor-pointer hover:bg-accent/50 transition-colors select-none rounded-r-md focus:outline-none"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
            DF
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-sm font-medium text-foreground leading-tight">Demo User</span>
            <span className="text-[10px] text-muted-foreground leading-none">Operator</span>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Demo User</p>
            <p className="text-xs leading-none text-muted-foreground">
              demo@decisionfoundry.com
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/history" className="cursor-pointer">
            <History className="mr-2 h-4 w-4" />
            History
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/audit-log" className="cursor-pointer">
            <ScrollText className="mr-2 h-4 w-4" />
            Audit Log
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/users" className="cursor-pointer">
            <Users className="mr-2 h-4 w-4" />
            Users
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
          onClick={() => alert("Logout (demo)")}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
