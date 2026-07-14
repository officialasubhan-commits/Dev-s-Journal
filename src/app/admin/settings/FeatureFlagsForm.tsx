"use client";

import { useState } from "react";
import { saveFeatureFlags } from "./actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Zap, AlertCircle } from "lucide-react";
import { SiteSettings } from "@prisma/client";

export function FeatureFlagsForm({ settings }: { settings: SiteSettings }) {
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setToast(null);

    const formData = new FormData(e.currentTarget);
    try {
      const res = await saveFeatureFlags(formData);
      if (res?.error) {
        setToast({ type: "error", text: res.error });
      } else {
        setToast({ type: "success", text: res?.success || "Feature flags saved successfully!" });
        setTimeout(() => setToast(null), 4000);
      }
    } catch (error: any) {
      console.error(error);
      setToast({ type: "error", text: error?.message || "Failed to save feature flags." });
    } finally {
      setIsSaving(false);
    }
  };

  const saveBtnCls = "mt-2 bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 px-6 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed";

  return (
    <Card id="features" className="border-[var(--border-color)] overflow-hidden relative">
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
        <CardTitle className="flex items-center gap-2 text-xl font-heading"><Zap className="w-5 h-5 text-[var(--secondary)]" /> Feature Flags</CardTitle>
        <CardDescription>Enable or disable platform features globally.</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {[
            { name: "enableComments", label: "Enable Comments", description: "Allow visitors to comment on journal posts.", defaultChecked: settings.enableComments },
            { name: "enableGallery", label: "Enable Gallery", description: "Show the public gallery page.", defaultChecked: settings.enableGallery },
            { name: "enableLearning", label: "Enable Learning Dashboard", description: "Show the public learning page.", defaultChecked: settings.enableLearning },
            { name: "enableNotifications", label: "Enable Notifications", description: "Send notifications to registered users.", defaultChecked: settings.enableNotifications },
          ].map(flag => (
            <label key={flag.name} className="flex items-start gap-4 p-4 rounded-xl bg-[var(--background)] border border-[var(--border-color)] cursor-pointer hover:border-[var(--primary)]/40 transition-colors group select-none">
              <input type="checkbox" name={flag.name} defaultChecked={flag.defaultChecked} className="mt-1 w-4 h-4 accent-[var(--primary)] cursor-pointer" />
              <div>
                <p className="font-semibold text-[var(--text-main)] group-hover:text-[var(--primary)] transition-colors">{flag.label}</p>
                <p className="text-sm text-[var(--text-secondary)] mt-0.5">{flag.description}</p>
              </div>
            </label>
          ))}
          <Button type="submit" disabled={isSaving} className={saveBtnCls}>
            <CheckCircle className="w-4 h-4" /> 
            {isSaving ? "Saving..." : "Save Feature Flags"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
