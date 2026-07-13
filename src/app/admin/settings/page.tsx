import { getSiteSettings, saveGeneralSettings, saveSeoSettings, saveAppearanceSettings, saveFeatureFlags, saveMaintenanceSettings, saveContactSettings } from "./actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Globe, Palette, Search, Share2, Cpu, ShieldCheck, Wrench, Bell, Zap } from "lucide-react";
import { BrandingSettingsForm } from "./BrandingSettingsForm";
import { AdminSecurityForm } from "./AdminSecurityForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function SettingsPage() {
  const settings = await getSiteSettings();
  const session = await getServerSession(authOptions);
  const currentEmail = session?.user?.email || "";

  const inputCls = "w-full bg-[var(--background)] border border-[var(--border-color)] rounded-lg px-4 py-2.5 text-[var(--text-main)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all";
  const textareaCls = `${inputCls} resize-none`;
  const labelCls = "block text-sm font-semibold text-[var(--text-secondary)] mb-1.5";
  const sectionCls = "space-y-5";
  const saveBtnCls = "mt-2 bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 px-6 transition-all flex items-center gap-2";

  return (
    <div className="space-y-10 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold font-heading bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]">Settings</h1>
        <p className="text-[var(--text-secondary)] mt-1">Manage your website configuration. All changes are saved to the database immediately.</p>
      </div>

      <BrandingSettingsForm settings={settings} />

      {/* Admin Security */}
      <AdminSecurityForm currentEmail={currentEmail} />

      {/* General Settings */}
      <Card id="general" className="border-[var(--border-color)] overflow-hidden">
        <CardHeader className="bg-[var(--background)]/50 border-b border-[var(--border-color)]">
          <CardTitle className="flex items-center gap-2 text-xl font-heading"><Globe className="w-5 h-5 text-[var(--primary)]" /> General</CardTitle>
          <CardDescription>Core website identity and contact information.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form action={saveGeneralSettings} className={sectionCls}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>Site URL</label>
                <input name="siteUrl" defaultValue={settings.siteUrl} type="url" className={inputCls} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>Author Name</label>
                <input name="authorName" defaultValue={settings.authorName} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Author Email</label>
                <input name="authorEmail" defaultValue={settings.authorEmail} type="email" className={inputCls} />
              </div>
            </div>
            <Button type="submit" className={saveBtnCls}><CheckCircle className="w-4 h-4" /> Save General Settings</Button>
          </form>
        </CardContent>
      </Card>

      {/* SEO Settings */}
      <Card id="seo" className="border-[var(--border-color)] overflow-hidden">
        <CardHeader className="bg-[var(--background)]/50 border-b border-[var(--border-color)]">
          <CardTitle className="flex items-center gap-2 text-xl font-heading"><Search className="w-5 h-5 text-[var(--highlight)]" /> SEO</CardTitle>
          <CardDescription>Search engine optimization and social sharing metadata.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form action={saveSeoSettings} className={sectionCls}>
            <div>
              <label className={labelCls}>SEO Title</label>
              <input name="seoTitle" defaultValue={settings.seoTitle} className={inputCls} />
              <p className="text-xs text-[var(--text-muted)] mt-1">Appears in browser tabs and search results.</p>
            </div>
            <div>
              <label className={labelCls}>SEO Meta Description</label>
              <textarea name="seoDescription" defaultValue={settings.seoDescription} rows={3} className={textareaCls} />
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
            <Button type="submit" className={saveBtnCls}><CheckCircle className="w-4 h-4" /> Save SEO Settings</Button>
          </form>
        </CardContent>
      </Card>



      {/* Appearance */}
      <Card id="appearance" className="border-[var(--border-color)] overflow-hidden">
        <CardHeader className="bg-[var(--background)]/50 border-b border-[var(--border-color)]">
          <CardTitle className="flex items-center gap-2 text-xl font-heading"><Palette className="w-5 h-5 text-[var(--secondary)]" /> Appearance</CardTitle>
          <CardDescription>Default theme and visual preferences.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form action={saveAppearanceSettings} className={sectionCls}>
            <div>
              <label className={labelCls}>Default Theme</label>
              <select name="defaultTheme" defaultValue={settings.defaultTheme} className={inputCls}>
                <option value="light">Light (Warm)</option>
                <option value="dark">Dark</option>
                <option value="system">System (Follows OS)</option>
              </select>
            </div>
            <Button type="submit" className={saveBtnCls}><CheckCircle className="w-4 h-4" /> Save Appearance</Button>
          </form>
        </CardContent>
      </Card>



      {/* Feature Flags */}
      <Card id="features" className="border-[var(--border-color)] overflow-hidden">
        <CardHeader className="bg-[var(--background)]/50 border-b border-[var(--border-color)]">
          <CardTitle className="flex items-center gap-2 text-xl font-heading"><Zap className="w-5 h-5 text-[var(--secondary)]" /> Feature Flags</CardTitle>
          <CardDescription>Enable or disable platform features globally.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form action={saveFeatureFlags} className={sectionCls}>
            {[
              { name: "enableComments", label: "Enable Comments", description: "Allow visitors to comment on journal posts.", defaultChecked: settings.enableComments },
              { name: "enableGallery", label: "Enable Gallery", description: "Show the public gallery page.", defaultChecked: settings.enableGallery },
              { name: "enableLearning", label: "Enable Learning Dashboard", description: "Show the public learning page.", defaultChecked: settings.enableLearning },
              { name: "enableNotifications", label: "Enable Notifications", description: "Send notifications to registered users.", defaultChecked: settings.enableNotifications },
            ].map(flag => (
              <label key={flag.name} className="flex items-start gap-4 p-4 rounded-xl bg-[var(--background)] border border-[var(--border-color)] cursor-pointer hover:border-[var(--primary)]/40 transition-colors group">
                <input type="checkbox" name={flag.name} defaultChecked={flag.defaultChecked} className="mt-1 w-4 h-4 accent-[var(--primary)] cursor-pointer" />
                <div>
                  <p className="font-semibold text-[var(--text-main)] group-hover:text-[var(--primary)] transition-colors">{flag.label}</p>
                  <p className="text-sm text-[var(--text-secondary)] mt-0.5">{flag.description}</p>
                </div>
              </label>
            ))}
            <Button type="submit" className={saveBtnCls}><CheckCircle className="w-4 h-4" /> Save Feature Flags</Button>
          </form>
        </CardContent>
      </Card>

      {/* Maintenance */}
      <Card id="maintenance" className="border-[var(--border-color)] overflow-hidden border-red-200">
        <CardHeader className="bg-red-50/50 border-b border-red-100">
          <CardTitle className="flex items-center gap-2 text-xl font-heading text-red-600"><ShieldCheck className="w-5 h-5" /> Maintenance Mode</CardTitle>
          <CardDescription className="text-red-500/70">Temporarily take the site offline for visitors.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form action={saveMaintenanceSettings} className={sectionCls}>
            <label className="flex items-start gap-4 p-4 rounded-xl bg-red-50/50 border border-red-200 cursor-pointer">
              <input type="checkbox" name="maintenanceMode" defaultChecked={settings.maintenanceMode} className="mt-1 w-4 h-4 accent-red-500 cursor-pointer" />
              <div>
                <p className="font-semibold text-red-700">Enable Maintenance Mode</p>
                <p className="text-sm text-red-500/80 mt-0.5">Visitors will see the maintenance message. Admins can still log in.</p>
              </div>
            </label>
            <div>
              <label className={labelCls}>Maintenance Message</label>
              <textarea name="maintenanceMessage" defaultValue={settings.maintenanceMessage} rows={2} className={textareaCls} />
            </div>
            <Button type="submit" className="mt-2 bg-red-600 text-white hover:bg-red-700 px-6 flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Save Maintenance Settings</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
