import { getSiteSettings } from "./actions";
import { BrandingSettingsForm } from "./BrandingSettingsForm";
import { AdminSecurityForm } from "./AdminSecurityForm";
import { MaintenanceSettingsForm } from "./MaintenanceSettingsForm";
import { GeneralSettingsForm } from "./GeneralSettingsForm";
import { SeoSettingsForm } from "./SeoSettingsForm";
import { AppearanceSettingsForm } from "./AppearanceSettingsForm";
import { FeatureFlagsForm } from "./FeatureFlagsForm";
import { AnalyticsUploadSettingsForm } from "./AnalyticsUploadSettingsForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const settings = await getSiteSettings();
  const session = await getServerSession(authOptions);
  const currentEmail = session?.user?.email || "";

  return (
    <div className="space-y-10 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold font-heading bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]">Settings</h1>
        <p className="text-[var(--text-secondary)] mt-1">Manage your website configuration. All changes are saved to the database immediately.</p>
      </div>

      <BrandingSettingsForm settings={settings} />

      <AdminSecurityForm currentEmail={currentEmail} />

      <GeneralSettingsForm settings={settings} />

      <SeoSettingsForm settings={settings} />

      <AppearanceSettingsForm settings={settings} />

      <FeatureFlagsForm settings={settings} />

      <AnalyticsUploadSettingsForm settings={settings} />

      <MaintenanceSettingsForm settings={settings} />
    </div>
  );
}
