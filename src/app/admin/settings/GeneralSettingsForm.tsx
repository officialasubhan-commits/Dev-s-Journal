"use client";

import { getSiteSettings } from "@/app/admin/settings/actions";
type SiteSettings = Awaited<ReturnType<typeof getSiteSettings>>;
import { useState } from "react";
import { saveGeneralSettings } from "./actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Globe, AlertCircle } from "lucide-react";


export function GeneralSettingsForm({ settings }: { settings: SiteSettings }) {
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setToast(null);

    const formData = new FormData(e.currentTarget);
    try {
      const res = await saveGeneralSettings(formData);
      if (res?.error) {
        setToast({ type: "error", text: res.error });
      } else {
        setToast({ type: "success", text: res?.success || "General settings saved successfully!" });
        setTimeout(() => setToast(null), 4000);
      }
    } catch (error: any) {
      console.error(error);
      setToast({ type: "error", text: error?.message || "Failed to save general settings." });
    } finally {
      setIsSaving(false);
    }
  };

  const inputCls = "w-full bg-[var(--background)] border border-[var(--border-color)] rounded-lg px-4 py-2.5 text-[var(--text-main)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all";
  const labelCls = "block text-sm font-semibold text-[var(--text-secondary)] mb-1.5";
  const sectionCls = "space-y-5";
  const saveBtnCls = "mt-2 bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 px-6 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed";

  const defaultLaunchDate = settings.launchedAt 
    ? new Date(settings.launchedAt).toISOString().split('T')[0] 
    : new Date().toISOString().split('T')[0];

  return (
    <Card id="general" className="border-[var(--border-color)] overflow-hidden relative">
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
        <CardTitle className="flex items-center gap-2 text-xl font-heading"><Globe className="w-5 h-5 text-[var(--primary)]" /> General</CardTitle>
        <CardDescription>Core website identity and contact information.</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className={sectionCls}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelCls}>Site URL</label>
              <input name="siteUrl" defaultValue={settings.siteUrl} type="url" required className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Website Launch Date</label>
              <input name="launchedAt" defaultValue={defaultLaunchDate} type="date" required className={inputCls} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelCls}>Author Name</label>
              <input name="authorName" defaultValue={settings.authorName} required className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Author Email</label>
              <input name="authorEmail" defaultValue={settings.authorEmail} type="email" required className={inputCls} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Default Language</label>
            <select name="defaultLanguage" defaultValue={settings.defaultLanguage} className={inputCls}>
              <option value="en">English (US)</option>
              <option value="en-gb">English (UK)</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="hi">Hindi</option>
              <option value="ar">Arabic</option>
            </select>
          </div>
          <Button type="submit" disabled={isSaving} className={saveBtnCls}>
            <CheckCircle className="w-4 h-4" /> 
            {isSaving ? "Saving..." : "Save General Settings"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
