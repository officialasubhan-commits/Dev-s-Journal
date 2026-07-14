"use client";

import { useState } from "react";
import { saveSeoSettings } from "./actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Search, AlertCircle } from "lucide-react";
import { SiteSettings } from "@prisma/client";

export function SeoSettingsForm({ settings }: { settings: SiteSettings }) {
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setToast(null);

    const formData = new FormData(e.currentTarget);
    try {
      const res = await saveSeoSettings(formData);
      if (res?.error) {
        setToast({ type: "error", text: res.error });
      } else {
        setToast({ type: "success", text: res?.success || "SEO settings saved successfully!" });
        setTimeout(() => setToast(null), 4000);
      }
    } catch (error: any) {
      console.error(error);
      setToast({ type: "error", text: error?.message || "Failed to save SEO settings." });
    } finally {
      setIsSaving(false);
    }
  };

  const inputCls = "w-full bg-[var(--background)] border border-[var(--border-color)] rounded-lg px-4 py-2.5 text-[var(--text-main)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all";
  const textareaCls = `${inputCls} resize-none`;
  const labelCls = "block text-sm font-semibold text-[var(--text-secondary)] mb-1.5";
  const sectionCls = "space-y-5";
  const saveBtnCls = "mt-2 bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 px-6 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed";

  return (
    <Card id="seo" className="border-[var(--border-color)] overflow-hidden relative">
      {toast && (
        <div className={`absolute top-4 right-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-lg transition-all animate-in fade-in slide-in-from-top-3 ${
          toast.type === "success" 
            ? "bg-green-50 text-green-800 border-green-200 dark:bg-green-950/20 dark:text-green-300 dark:border-green-900/30" 
            : "bg-red-50 text-red-800 border-red-200 dark:bg-red-950/20 dark:text-red-300 dark:border-red-900/30"
        }`}>
          {toast.type === "success" ? (
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
          )}
          <span className="text-sm font-medium">{toast.text}</span>
        </div>
      )}

      <CardHeader className="bg-[var(--background)]/50 border-b border-[var(--border-color)]">
        <CardTitle className="flex items-center gap-2 text-xl font-heading"><Search className="w-5 h-5 text-[var(--highlight)]" /> SEO</CardTitle>
        <CardDescription>Search engine optimization and social sharing metadata.</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className={sectionCls}>
          <div>
            <label className={labelCls}>SEO Title</label>
            <input name="seoTitle" defaultValue={settings.seoTitle} required className={inputCls} />
            <p className="text-xs text-[var(--text-muted)] mt-1">Appears in browser tabs and search results.</p>
          </div>
          <div>
            <label className={labelCls}>SEO Meta Description</label>
            <textarea name="seoDescription" defaultValue={settings.seoDescription} required rows={3} className={textareaCls} />
          </div>
          <div>
            <label className={labelCls}>Keywords (comma separated)</label>
            <input name="seoKeywords" defaultValue={settings.seoKeywords} className={inputCls} placeholder="nextjs, portfolio, developer, journal" />
          </div>
          <div>
            <label className={labelCls}>Open Graph Image URL</label>
            <input name="ogImage" defaultValue={settings.ogImage} type="url" className={inputCls} placeholder="https://..." />
            <p className="text-xs text-[var(--text-muted)] mt-1">Displayed when your links are shared on social media. Recommended: 1200×630px.</p>
          </div>
          <Button type="submit" disabled={isSaving} className={saveBtnCls}>
            <CheckCircle className="w-4 h-4" /> 
            {isSaving ? "Saving..." : "Save SEO Settings"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
