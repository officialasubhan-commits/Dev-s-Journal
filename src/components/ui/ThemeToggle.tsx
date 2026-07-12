"use client";
import { useState, useEffect } from "react";
import { Sun, Moon, Monitor } from "lucide-react";

type Theme = "light" | "dark" | "system";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = (localStorage.getItem("theme") as Theme) || "light";
    setTheme(stored);
    applyTheme(stored);
  }, []);

  function applyTheme(t: Theme) {
    const isDark = t === "dark" || (t === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  }

  function cycle() {
    const order: Theme[] = ["light", "dark", "system"];
    const next = order[(order.indexOf(theme) + 1) % order.length];
    setTheme(next);
    localStorage.setItem("theme", next);
    applyTheme(next);
  }

  if (!mounted) return <div className="w-9 h-9" />;

  return (
    <button
      onClick={cycle}
      title={`Theme: ${theme}`}
      className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[var(--background)] border border-[var(--border-color)] transition-all hover:border-[var(--primary)]/40 text-[var(--text-secondary)] hover:text-[var(--primary)]"
    >
      {theme === "dark" ? <Moon className="w-4 h-4" /> : theme === "system" ? <Monitor className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
    </button>
  );
}
