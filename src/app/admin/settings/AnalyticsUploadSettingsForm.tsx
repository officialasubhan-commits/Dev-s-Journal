"use client";

import { useState } from "react";
import { saveAnalyticsUploadSettings } from "./actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Cpu, AlertCircle } from "lucide-react";
import { SiteSettings } from "@prisma/client";

export function AnalyticsUploadSettingsForm({ settings }: { settings: SiteSettings }) {
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setToast(null);

    const formData = new FormData(e.currentTarget);
    try {
      const res = await saveAnalyticsUploadSettings(formData);
      if (res?.error) {
        setToast({ type: "error", text: res.error });
      } else {
        setToast({ type: "success", text: res?.success || "Analytics & Upload settings saved successfully!" });
        setTimeout(() => setToast(null), 4000);
      }
    } catch (error: any) {
      console.error(error);
      setToast({ type: "error", text: error?.message || "Failed to save settings." });
    } finally {
      setIsSaving(false);
    }
  };

  const inputCls = "w-full bg-[var(--background)] border border-[var(--border-color)] rounded-lg px-4 py-2.5 text-[var(--text-main)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all";
  const labelCls = "block text-sm font-semibold text-[var(--text-secondary)] mb-1.5";
  const sectionCls = "space-y-5";
  const saveBtnCls = "mt-2 bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 px-6 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed";

  const isCloudinaryActive = !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  return (
    <Card id="analytics-uploads" className="border-[var(--border-color)] overflow-hidden relative">
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
        <CardTitle className="flex items-center gap-2 text-xl font-heading"><Cpu className="w-5 h-5 text-[var(--primary)]" /> Analytics & Uploads</CardTitle>
        <CardDescription>Configure site analytics and file upload policies.</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className={sectionCls}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelCls}>Google Analytics Measurement ID</label>
              <input 
                name="googleAnalyticsId" 
                defaultValue={settings.googleAnalyticsId} 
                className={inputCls} 
                placeholder="G-XXXXXXXXXX" 
              />
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Enables global Google Analytics tracking across all public pages.
              </p>
            </div>
            <div>
              <label className={labelCls}>Maximum Image Upload Size (MB)</label>
              <input 
                name="maxUploadSizeMb" 
                type="number" 
                defaultValue={settings.maxUploadSizeMb || 5} 
                min={1} 
                max={50} 
                className={inputCls} 
              />
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Maximum file size allowed for uploaded logos, favicons, and projects.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl border bg-[var(--background)]/50 space-y-2">
            <h4 className="font-semibold text-sm">Upload Infrastructure Status</h4>
            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <span>Active Provider:</span>
              <span className={`px-2 py-0.5 rounded text-xs font-semibold ${isCloudinaryActive ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>
                {isCloudinaryActive ? 'Cloudinary (Cloud Provider)' : 'Local File System (Dev Fallback)'}
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              {isCloudinaryActive 
                ? 'Cloudinary is configured and active. Uploaded branding assets will survive Vercel serverless teardowns.' 
                : 'Warning: Cloudinary credentials are not configured. Uploaded images will use local filesystem storage (suitable for localhost, but not persistent on Vercel).'}
            </p>
          </div>

          <Button type="submit" disabled={isSaving} className={saveBtnCls}>
            <CheckCircle className="w-4 h-4" /> 
            {isSaving ? "Saving..." : "Save Settings"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
