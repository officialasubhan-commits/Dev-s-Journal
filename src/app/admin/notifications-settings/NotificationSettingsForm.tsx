"use client";

import { useState } from "react";
import { saveNotificationSettings } from "../settings/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, Loader2, Bell } from "lucide-react";

export function NotificationSettingsForm({ settings }: { settings: any }) {
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setToast(null);

    const formData = new FormData(e.currentTarget);
    try {
      const res = await saveNotificationSettings(formData);
      if (res?.error) {
        setToast({ type: "error", text: res.error });
      } else {
        setToast({ type: "success", text: res?.success || "Notification settings saved successfully!" });
        setTimeout(() => setToast(null), 4000);
      }
    } catch (error: any) {
      console.error(error);
      setToast({ type: "error", text: error?.message || "Failed to save Notification settings." });
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
        <CardTitle className="flex items-center gap-2 text-xl font-heading"><Bell className="w-5 h-5 text-[var(--primary)]" /> System Alerts</CardTitle>
        <CardDescription>Configure notifications and top banner broadcast announcements.</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div>
            <label className={labelCls}>Automated Welcome Notification</label>
            <input 
              name="welcomeNotification" 
              type="text"
              defaultValue={settings.welcomeNotification || "Welcome to your Admin Dashboard!"} 
              required 
              className={inputCls} 
            />
            <p className="text-xs text-[var(--text-muted)] mt-1">Generated and sent to new registrants upon system setup.</p>
          </div>

          <div>
            <label className={labelCls}>Announcement Banner Broadcast message</label>
            <textarea 
              name="announcementBanner" 
              rows={3}
              defaultValue={settings.announcementBanner || ""} 
              className={inputCls} 
              placeholder="e.g. Major UI Redesign Update Released!"
            />
            <p className="text-xs text-[var(--text-muted)] mt-1">Text shown inside a top-bar banner alert broadcasted site-wide.</p>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input 
              id="bannerEnabled" 
              name="bannerEnabled" 
              type="checkbox" 
              defaultChecked={settings.bannerEnabled || false} 
              className="w-4 h-4 rounded border-[var(--border-color)] text-[var(--primary)] focus:ring-[var(--primary)] accent-[var(--primary)] cursor-pointer"
            />
            <label htmlFor="bannerEnabled" className="text-xs font-semibold text-[var(--text-secondary)] cursor-pointer select-none">
              Enable Announcement Banner Site-Wide
            </label>
          </div>

          <Button type="submit" disabled={isSaving} className={saveBtnCls}>
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Alerts...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" /> 
                <span>Save Notification Settings</span>
              </>
            )}
          </Button>

        </form>
      </CardContent>
    </Card>
  );
}
