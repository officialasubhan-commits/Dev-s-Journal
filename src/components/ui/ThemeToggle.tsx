"use client";
import { useState, useEffect } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  function cycle() {
    const order = ["light", "dark", "system"];
    const currentTheme = theme || "light";
    const next = order[(order.indexOf(currentTheme) + 1) % order.length];
    setTheme(next);
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
