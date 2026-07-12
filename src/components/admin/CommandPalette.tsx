"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { Search, LayoutDashboard, FileText, Settings, Users, Briefcase, Mail, BarChart3, Image as ImageIcon, Sparkles, LogOut, GraduationCap, Moon, Sun, Laptop } from "lucide-react";
import { useTheme } from "next-themes";
import { signOut } from "next-auth/react";

export function AdminCommandPalette({ open, setOpen }: { open: boolean, setOpen: (open: boolean) => void }) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(true);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setOpen]);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm flex justify-center items-start pt-24" onClick={() => setOpen(false)}>
      <div 
        className="w-full max-w-xl bg-[var(--card)] rounded-2xl shadow-2xl border border-[var(--border-color)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <Command label="Command Menu" className="flex flex-col w-full h-full rounded-2xl bg-transparent">
          <div className="flex items-center border-b border-[var(--border-color)] px-4">
            <Search className="w-5 h-5 text-[var(--text-muted)] mr-2" />
            <Command.Input 
              autoFocus 
              className="flex-1 bg-transparent py-4 text-base outline-none placeholder-[var(--text-muted)] text-[var(--text-main)]" 
              placeholder="Type a command or search..." 
            />
            <div className="text-xs text-[var(--text-muted)] bg-[var(--background)] px-2 py-1 rounded-md border border-[var(--border-color)]">
              ESC
            </div>
          </div>
          
          <Command.List className="max-h-[350px] overflow-y-auto p-2 scroll-smooth">
            <Command.Empty className="py-6 text-center text-sm text-[var(--text-muted)]">No results found.</Command.Empty>

            <Command.Group heading="Navigation" className="px-2 py-2 text-xs font-semibold text-[var(--text-muted)]">
              {[
                { name: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
                { name: "Content Studio", icon: FileText, href: "/admin/posts" },
                { name: "Projects", icon: Briefcase, href: "/admin/projects" },
                { name: "Media Gallery", icon: ImageIcon, href: "/admin/gallery" },
                { name: "Learning Hub", icon: GraduationCap, href: "/admin/learning" },
                { name: "Users", icon: Users, href: "/admin/users" },
                { name: "Messages", icon: Mail, href: "/admin/messages" },
                { name: "Analytics", icon: BarChart3, href: "/admin/analytics" },
                { name: "Contact Settings", icon: Mail, href: "/admin/contact" },
                { name: "Settings", icon: Settings, href: "/admin/settings" },
              ].map((item) => (
                <Command.Item 
                  key={item.name}
                  onSelect={() => runCommand(() => router.push(item.href))}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-sm font-medium text-[var(--text-main)] hover:bg-[var(--primary)]/10 hover:text-[var(--primary)] aria-selected:bg-[var(--primary)]/10 aria-selected:text-[var(--primary)] transition-colors"
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Command.Item>
              ))}
            </Command.Group>

            <Command.Separator className="h-px bg-[var(--border-color)] my-1" />
            
            <Command.Group heading="Theme" className="px-2 py-2 text-xs font-semibold text-[var(--text-muted)]">
              <Command.Item 
                onSelect={() => runCommand(() => setTheme("light"))}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-sm font-medium text-[var(--text-main)] hover:bg-[var(--primary)]/10 hover:text-[var(--primary)] aria-selected:bg-[var(--primary)]/10 aria-selected:text-[var(--primary)]"
              >
                <Sun className="w-4 h-4" /> Light Mode
              </Command.Item>
              <Command.Item 
                onSelect={() => runCommand(() => setTheme("dark"))}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-sm font-medium text-[var(--text-main)] hover:bg-[var(--primary)]/10 hover:text-[var(--primary)] aria-selected:bg-[var(--primary)]/10 aria-selected:text-[var(--primary)]"
              >
                <Moon className="w-4 h-4" /> Dark Mode
              </Command.Item>
              <Command.Item 
                onSelect={() => runCommand(() => setTheme("system"))}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-sm font-medium text-[var(--text-main)] hover:bg-[var(--primary)]/10 hover:text-[var(--primary)] aria-selected:bg-[var(--primary)]/10 aria-selected:text-[var(--primary)]"
              >
                <Laptop className="w-4 h-4" /> System Theme
              </Command.Item>
            </Command.Group>

            <Command.Separator className="h-px bg-[var(--border-color)] my-1" />

            <Command.Group heading="Actions" className="px-2 py-2 text-xs font-semibold text-[var(--text-muted)]">
              <Command.Item 
                onSelect={() => runCommand(() => signOut({ callbackUrl: "/login" }))}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-sm font-medium text-[var(--error)] hover:bg-[var(--error)]/10 aria-selected:bg-[var(--error)]/10"
              >
                <LogOut className="w-4 h-4" /> Log Out
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
