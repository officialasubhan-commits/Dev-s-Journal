import { getSiteSettings } from "../settings/actions";
import { ContactSettingsForm } from "./ContactSettingsForm";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ContactSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-10 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]">Contact Settings</h1>
          <p className="text-[var(--text-secondary)] mt-1">Manage all contact, location, and social profile information for your portfolio.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/contact" target="_blank" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 font-sans font-medium">
            <ExternalLink className="w-4 h-4 mr-2" />
            Preview Page
          </Link>
        </div>
      </div>

      <ContactSettingsForm settings={settings} />
    </div>
  );
}
