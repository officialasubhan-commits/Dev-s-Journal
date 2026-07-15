import { getSiteSettings } from "../settings/actions";
import { NotificationSettingsForm } from "./NotificationSettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminNotificationsSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-heading text-[var(--text-main)] tracking-tight">Notifications Settings</h1>
        <p className="text-[var(--text-secondary)] mt-1">Configure automated system notifications, welcome banners, and preferences.</p>
      </div>

      <NotificationSettingsForm settings={settings as any} />
    </div>
  );
}
