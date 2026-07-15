import { getSiteSettings } from "../settings/actions";
import { GallerySettingsForm } from "./GallerySettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminGallerySettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-heading text-[var(--text-main)] tracking-tight">Gallery Settings</h1>
        <p className="text-[var(--text-secondary)] mt-1">Configure layout banners and hero overlays for the media grid page.</p>
      </div>

      <GallerySettingsForm settings={settings as any} />
    </div>
  );
}
