"use client";

import { useState } from "react";
import { saveFooterSettings } from "../settings/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageManager } from "@/components/admin/ImageManager";
import { CheckCircle, AlertCircle, Loader2, Layout } from "lucide-react";

export function FooterSettingsForm({ settings }: { settings: any }) {
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setToast(null);

    const formData = new FormData(e.currentTarget);
    try {
      const res = await saveFooterSettings(formData);
      if (res?.error) {
        setToast({ type: "error", text: res.error });
      } else {
        setToast({ type: "success", text: res?.success || "Footer settings saved successfully!" });
        setTimeout(() => setToast(null), 4000);
      }
    } catch (error: any) {
      console.error(error);
      setToast({ type: "error", text: error?.message || "Failed to save Footer settings." });
    } finally {
      setIsSaving(false);
    }
  };

  const inputCls = "w-full bg-[var(--background)] border border-[var(--border-color)] rounded-lg px-4 py-2.5 text-[var(--text-main)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all";
  const labelCls = "block text-sm font-semibold text-[var(--text-secondary)] mb-1.5";
  const saveBtnCls = "mt-2 bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 px-6 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed";

  return (
    <Card className="border-[var(--border-color)] overflow-hidden relative max-w-2xl shadow-sm">
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
        <CardTitle className="flex items-center gap-2 text-xl font-heading"><Layout className="w-5 h-5 text-[var(--primary)]" /> Footer Details</CardTitle>
        <CardDescription>Configure footer copyright details and secondary branding assets.</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div>
            <label className={labelCls}>Copyright Label</label>
            <input 
              name="copyright" 
              type="text"
              defaultValue={settings.copyright || `© ${new Date().getFullYear()} Boss Journal. All rights reserved.`} 
              required 
              className={inputCls} 
            />
            <p className="text-xs text-[var(--text-muted)] mt-1">Appears at the bottom of all public site paths.</p>
          </div>

          <div className="space-y-3">
            <label className={labelCls}>Footer Brand Logo</label>
            <div className="w-48">
              <ImageManager 
                name="footerLogo" 
                defaultValue={settings.footerLogo || ""} 
                label="Upload Footer Logo"
              />
            </div>
          </div>

          <Button type="submit" disabled={isSaving} className={saveBtnCls}>
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Footer...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" /> 
                <span>Save Footer Settings</span>
              </>
            )}
          </Button>

        </form>
      </CardContent>
    </Card>
  );
}
