import { getSiteSettings } from "../settings/actions";
import { saveContactSettings, resetContactSettings } from "./actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Globe, Share2, MapPin, MessageSquare, RotateCcw, ExternalLink } from "lucide-react";
import Link from "next/link";

export default async function ContactSettingsPage() {
  const settings = await getSiteSettings();

  const inputCls = "w-full bg-[var(--background)] border border-[var(--border-color)] rounded-lg px-4 py-2.5 text-[var(--text-main)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all";
  const textareaCls = `${inputCls} resize-none`;
  const labelCls = "block text-sm font-semibold text-[var(--text-secondary)] mb-1.5";
  const sectionCls = "space-y-5";
  const saveBtnCls = "bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 px-6 transition-all flex items-center gap-2";

  return (
    <div className="space-y-10 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]">Contact Settings</h1>
          <p className="text-[var(--text-secondary)] mt-1">Manage all contact and location information for your portfolio.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/contact" target="_blank" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
            <ExternalLink className="w-4 h-4 mr-2" />
            Preview
          </Link>
          <form action={resetContactSettings}>
            <Button variant="outline" type="submit" className="text-[var(--error)] border-[var(--error)]/30 hover:bg-[var(--error)]/10">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </form>
        </div>
      </div>

      <form action={saveContactSettings} className="space-y-10">
        
        {/* General Contact Info */}
        <Card className="border-[var(--border-color)] overflow-hidden">
          <CardHeader className="bg-[var(--background)]/50 border-b border-[var(--border-color)]">
            <CardTitle className="flex items-center gap-2 text-xl font-heading"><MessageSquare className="w-5 h-5 text-[var(--primary)]" /> Header & Status</CardTitle>
            <CardDescription>Primary messaging on your contact page.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className={labelCls}>Contact Heading</label>
                <input name="contactHeading" defaultValue={settings.contactHeading} className={inputCls} placeholder="Get In Touch" />
              </div>
              <div className="md:col-span-2">
                <label className={labelCls}>Contact Description</label>
                <textarea name="contactDescription" defaultValue={settings.contactDescription} rows={3} className={textareaCls} placeholder="Have a project in mind..." />
              </div>
              <div>
                <label className={labelCls}>Availability Status</label>
                <select name="availabilityStatus" defaultValue={settings.availabilityStatus} className={inputCls}>
                  <option value="Available">Available for new projects</option>
                  <option value="Busy">Currently busy but taking inquiries</option>
                  <option value="Not Available">Not currently available</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Direct Contact */}
        <Card className="border-[var(--border-color)] overflow-hidden">
          <CardHeader className="bg-[var(--background)]/50 border-b border-[var(--border-color)]">
            <CardTitle className="flex items-center gap-2 text-xl font-heading"><Globe className="w-5 h-5 text-[var(--accent)]" /> Direct Contact</CardTitle>
            <CardDescription>Email and phone numbers.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>Contact Email</label>
                <input name="contactEmail" defaultValue={settings.contactEmail} type="email" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Phone Number</label>
                <input name="phoneNumber" defaultValue={settings.phoneNumber} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>WhatsApp Number</label>
                <input name="whatsappNumber" defaultValue={settings.whatsappNumber} className={inputCls} placeholder="+1 234 567 890" />
              </div>
              <div>
                <label className={labelCls}>Resume PDF URL</label>
                <input name="resumePdf" defaultValue={settings.resumePdf} type="url" className={inputCls} placeholder="https://..." />
                <p className="text-xs text-[var(--text-muted)] mt-1">Direct link to your CV or Resume PDF.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location Settings */}
        <Card className="border-[var(--border-color)] overflow-hidden">
          <CardHeader className="bg-[var(--background)]/50 border-b border-[var(--border-color)]">
            <CardTitle className="flex items-center gap-2 text-xl font-heading"><MapPin className="w-5 h-5 text-[var(--highlight)]" /> Location</CardTitle>
            <CardDescription>Where you are based.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className={labelCls}>Country</label>
                <input name="country" defaultValue={settings.country} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>State/Region</label>
                <input name="state" defaultValue={settings.state} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>City</label>
                <input name="city" defaultValue={settings.city} className={inputCls} />
              </div>
            </div>
            
            <div>
              <label className={labelCls}>Full Address</label>
              <textarea name="fullAddress" defaultValue={settings.fullAddress} rows={2} className={textareaCls} />
            </div>
            
            <div>
              <label className={labelCls}>Google Maps Embed URL</label>
              <input name="googleMapsUrl" defaultValue={settings.googleMapsUrl} type="url" className={inputCls} placeholder="https://www.google.com/maps/embed?..." />
              <p className="text-xs text-[var(--text-muted)] mt-1">Paste the 'src' link from a Google Maps embed iframe.</p>
            </div>
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card className="border-[var(--border-color)] overflow-hidden">
          <CardHeader className="bg-[var(--background)]/50 border-b border-[var(--border-color)]">
            <CardTitle className="flex items-center gap-2 text-xl font-heading"><Share2 className="w-5 h-5 text-blue-500" /> Social Profiles</CardTitle>
            <CardDescription>Links to your various social media platforms.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>GitHub URL</label>
                <input name="githubUrl" defaultValue={settings.githubUrl} type="url" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>LinkedIn URL</label>
                <input name="linkedinUrl" defaultValue={settings.linkedinUrl} type="url" className={inputCls} />
              </div>

              <div>
                <label className={labelCls}>Instagram URL</label>
                <input name="instagramUrl" defaultValue={settings.instagramUrl} type="url" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Facebook URL</label>
                <input name="facebookUrl" defaultValue={settings.facebookUrl} type="url" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>YouTube URL</label>
                <input name="youtubeUrl" defaultValue={settings.youtubeUrl} type="url" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Discord Username / Invite URL</label>
                <input name="discordUsername" defaultValue={settings.discordUsername} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Telegram Username / URL</label>
                <input name="telegramUsername" defaultValue={settings.telegramUsername} className={inputCls} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end sticky bottom-6 z-10 pt-4">
          <div className="bg-[var(--card)] p-2 rounded-2xl shadow-xl border border-[var(--border-color)]">
            <Button type="submit" className={saveBtnCls}>
              <CheckCircle className="w-5 h-5" /> 
              Save All Changes
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
