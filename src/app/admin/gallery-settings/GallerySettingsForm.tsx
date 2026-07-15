"use client";

import { useState } from "react";
import { saveGallerySettings } from "../settings/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageManager } from "@/components/admin/ImageManager";
import { CheckCircle, AlertCircle, Loader2, Image as ImageIcon } from "lucide-react";

export function GallerySettingsForm({ settings }: { settings: any }) {
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setToast(null);

    const formData = new FormData(e.currentTarget);
    try {
      const res = await saveGallerySettings(formData);
      if (res?.error) {
        setToast({ type: "error", text: res.error });
      } else {
        setToast({ type: "success", text: res?.success || "Gallery settings saved successfully!" });
        setTimeout(() => setToast(null), 4000);
      }
    } catch (error: any) {
      console.error(error);
      setToast({ type: "error", text: error?.message || "Failed to save Gallery settings." });
    } finally {
      setIsSaving(false);
    }
  };

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
        <CardTitle className="flex items-center gap-2 text-xl font-heading"><ImageIcon className="w-5 h-5 text-[var(--primary)]" /> Gallery Assets</CardTitle>
        <CardDescription>Configure gallery headers, ambient banners, and active covers.</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-1.5">Gallery Hero Cover Banner</label>
            <div className="w-full max-w-md">
              <ImageManager 
                name="galleryBanner" 
                defaultValue={settings.galleryBanner || ""} 
                label="Upload Gallery Banner"
                aspect={2.5}
              />
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-1">Stretched across the top background of your public /gallery path. Recommended aspect: 2.5:1.</p>
          </div>

          <Button type="submit" disabled={isSaving} className={saveBtnCls}>
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Gallery...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" /> 
                <span>Save Gallery Settings</span>
              </>
            )}
          </Button>

        </form>
      </CardContent>
    </Card>
  );
}
