"use client";

import { getSiteSettings } from "@/app/admin/settings/actions";
type SiteSettings = Awaited<ReturnType<typeof getSiteSettings>>;
import { useState } from "react";
import { saveCertificateSettings } from "./actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Award, AlertCircle } from "lucide-react";

export function CertificateSettingsForm({ settings }: { settings: SiteSettings }) {
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setToast(null);

    const formData = new FormData(e.currentTarget);
    try {
      const res = await saveCertificateSettings(formData);
      if (res?.error) {
        setToast({ type: "error", text: res.error });
      } else {
        setToast({ type: "success", text: res?.success || "Certificate settings saved successfully!" });
        setTimeout(() => setToast(null), 4000);
      }
    } catch (error: any) {
      console.error(error);
      setToast({ type: "error", text: error?.message || "Failed to save certificate settings." });
    } finally {
      setIsSaving(false);
    }
  };

  const saveBtnCls = "mt-4 bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 px-6 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed";

  return (
    <Card id="certificate" className="border-[var(--border-color)] overflow-hidden relative">
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
        <CardTitle className="flex items-center gap-2 text-xl font-heading"><Award className="w-5 h-5 text-[var(--primary)]" /> Certificate Settings</CardTitle>
        <CardDescription>Configure certification display and verification options.</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          
          <label className="flex items-center gap-4 p-4 border border-[var(--border-color)] rounded-xl hover:bg-[var(--background)]/50 transition-colors cursor-pointer">
            <input 
              type="checkbox" 
              name="enableVerification" 
              defaultChecked={settings.enableVerification}
              className="w-5 h-5 accent-[var(--primary)]" 
            />
            <div>
              <span className="block text-sm font-bold text-[var(--text-main)]">Enable Verification Badge</span>
              <span className="block text-xs text-[var(--text-secondary)] mt-0.5">Show a verification tick mark on certificates.</span>
            </div>
          </label>

          <Button type="submit" disabled={isSaving} className={saveBtnCls}>
            <CheckCircle className="w-4 h-4" /> 
            {isSaving ? "Saving..." : "Save Certificate Settings"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
