"use client";

import { getSiteSettings } from "@/app/admin/settings/actions";
type SiteSettings = Awaited<ReturnType<typeof getSiteSettings>>;
import { useState, useRef } from "react";
import { saveBrandingSettings } from "./actions";
import { Button } from "@/components/ui/button";
import { CheckCircle, Image as ImageIcon, Upload } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUploadCropper } from "@/components/ui/ImageUploadCropper";


export function BrandingSettingsForm({ settings }: { settings: SiteSettings }) {
  const [logoPreview, setLogoPreview] = useState(settings.siteLogo || "");
  const [faviconPreview, setFaviconPreview] = useState(settings.siteFavicon || "");
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Upload handling is now delegated to ImageUploadCropper

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg("");
    
    const formData = new FormData(e.currentTarget);
    formData.set("siteLogo", logoPreview);
    formData.set("siteFavicon", faviconPreview);
    
    await saveBrandingSettings(formData);
    
    setIsSaving(false);
    setSuccessMsg("Branding settings saved successfully!");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const inputCls = "w-full bg-[var(--background)] border border-[var(--border-color)] rounded-lg px-4 py-2.5 text-[var(--text-main)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all";
  const textareaCls = `${inputCls} resize-none`;
  const labelCls = "block text-sm font-semibold text-[var(--text-secondary)] mb-1.5";
  const saveBtnCls = "mt-2 bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 px-6 transition-all flex items-center gap-2";

  return (
    <Card id="branding" className="border-[var(--border-color)] overflow-hidden">
      <CardHeader className="bg-[var(--background)]/50 border-b border-[var(--border-color)]">
        <CardTitle className="flex items-center gap-2 text-xl font-heading"><ImageIcon className="w-5 h-5 text-[var(--primary)]" /> Branding</CardTitle>
        <CardDescription>Customize the core branding, logo, and identity of your website.</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelCls}>Website Name</label>
              <input name="siteTitle" defaultValue={settings.siteTitle} className={inputCls} required />
            </div>
            <div>
              <label className={labelCls}>Website Tagline</label>
              <input name="siteTagline" defaultValue={settings.siteTagline} className={inputCls} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Website Description</label>
            <textarea name="siteDescription" defaultValue={settings.siteDescription} rows={3} className={textareaCls} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelCls}>Website Logo</label>
              <div className="mt-2 w-48">
                <ImageUploadCropper 
                  value={logoPreview} 
                  onChange={setLogoPreview} 
                  label="Upload Logo" 
                  aspect={undefined} // Free ratio
                />
              </div>
              <input type="hidden" name="siteLogo" value={logoPreview} />
            </div>

            <div>
              <label className={labelCls}>Website Favicon</label>
              <div className="mt-2 w-48">
                <ImageUploadCropper 
                  value={faviconPreview} 
                  onChange={setFaviconPreview} 
                  label="Upload Favicon" 
                  aspect={1} // 1:1 Square
                />
              </div>
              <input type="hidden" name="siteFavicon" value={faviconPreview} />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button type="submit" disabled={isSaving} className={saveBtnCls}>
              <CheckCircle className="w-4 h-4" /> 
              {isSaving ? "Saving..." : "Save Branding Settings"}
            </Button>
            {successMsg && <span className="text-sm font-medium text-green-500">{successMsg}</span>}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
