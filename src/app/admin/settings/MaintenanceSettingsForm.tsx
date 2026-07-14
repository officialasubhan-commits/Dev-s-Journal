"use client";

import { useState } from "react";
import { saveMaintenanceSettings } from "./actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ShieldCheck, AlertCircle } from "lucide-react";
import { SiteSettings } from "@prisma/client";

export function MaintenanceSettingsForm({ settings }: { settings: SiteSettings }) {
  const [isEnabled, setIsEnabled] = useState(settings.maintenanceEnabled);
  const [message, setMessage] = useState(settings.maintenanceMessage);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setToast(null);

    const formData = new FormData(e.currentTarget);
    formData.set("maintenanceEnabled", isEnabled ? "on" : "off");
    formData.set("maintenanceMessage", message);

    try {
      await saveMaintenanceSettings(formData);
      setToast({
        type: "success",
        text: `Maintenance mode successfully ${isEnabled ? "enabled" : "disabled"}!`,
      });
      setTimeout(() => setToast(null), 4000);
    } catch (error) {
      console.error(error);
      setToast({
        type: "error",
        text: "Failed to save maintenance settings.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const inputCls = "w-full bg-[var(--background)] border border-[var(--border-color)] rounded-lg px-4 py-2.5 text-[var(--text-main)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all";
  const textareaCls = `${inputCls} resize-none`;
  const labelCls = "block text-sm font-semibold text-[var(--text-secondary)] mb-1.5";
  const sectionCls = "space-y-5";

  return (
    <Card id="maintenance" className="border-[var(--border-color)] overflow-hidden border-red-200 dark:border-red-950/40 relative">
      {/* Toast Notification */}
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

      <CardHeader className="bg-red-50/30 border-b border-red-100/50 dark:bg-red-950/5 dark:border-red-900/20 flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle className="flex items-center gap-2 text-xl font-heading text-red-600 dark:text-red-400">
            <ShieldCheck className="w-5 h-5" /> Maintenance Mode
          </CardTitle>
          <CardDescription className="text-red-500/70 dark:text-red-400/60 mt-1">
            Temporarily take the site offline for visitors.
          </CardDescription>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wider shrink-0 ${
          isEnabled
            ? "bg-red-100 text-red-800 border border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900/30"
            : "bg-green-100 text-green-800 border border-green-200 dark:bg-green-950/40 dark:text-green-300 dark:border-green-900/30"
        }`}>
          {isEnabled ? "ACTIVE" : "INACTIVE"}
        </span>
      </CardHeader>

      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className={sectionCls}>
          <label className="flex items-start gap-4 p-4 rounded-xl bg-red-50/10 border border-red-200/50 dark:bg-red-950/5 dark:border-red-900/10 cursor-pointer select-none">
            <input 
              type="checkbox" 
              name="maintenanceEnabled" 
              checked={isEnabled} 
              onChange={(e) => setIsEnabled(e.target.checked)} 
              className="mt-1.5 w-4 h-4 accent-red-500 cursor-pointer" 
            />
            <div>
              <p className="font-semibold text-red-700 dark:text-red-400">Enable Maintenance Mode</p>
              <p className="text-sm text-red-500/80 dark:text-red-400/60 mt-0.5">
                Visitors will see a custom maintenance screen. Authenticated admins can still access and manage the site normally.
              </p>
            </div>
          </label>

          <div>
            <label className={labelCls}>Maintenance Message</label>
            <textarea 
              name="maintenanceMessage" 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              rows={3} 
              className={textareaCls} 
              placeholder="We'll be back soon!"
              required
            />
          </div>

          <Button 
            type="submit" 
            disabled={isSaving} 
            className="mt-2 bg-red-600 hover:bg-red-700 text-white dark:bg-red-700 dark:hover:bg-red-600 px-6 flex items-center gap-2 cursor-pointer transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <CheckCircle className="w-4 h-4" /> 
            {isSaving ? "Saving Settings..." : "Save Maintenance Settings"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
