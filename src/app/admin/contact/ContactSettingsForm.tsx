"use client";

import { getSiteSettings } from "@/app/admin/settings/actions";
type SiteSettings = Awaited<ReturnType<typeof getSiteSettings>>;
import { useState } from "react";
import { saveContactSettings, resetContactSettings } from "./actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Globe, Share2, MapPin, MessageSquare, RotateCcw, AlertCircle } from "lucide-react";


export function ContactSettingsForm({ settings }: { settings: SiteSettings }) {
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [contactHeading, setContactHeading] = useState(settings.contactHeading);
  const [contactDescription, setContactDescription] = useState(settings.contactDescription);
  const [availabilityStatus, setAvailabilityStatus] = useState(settings.availabilityStatus);
  const [contactEmail, setContactEmail] = useState(settings.contactEmail);
  const [phoneNumber, setPhoneNumber] = useState(settings.phoneNumber);
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber);
  const [resumePdf, setResumePdf] = useState(settings.resumePdf);
  const [country, setCountry] = useState(settings.country);
  const [state, setState] = useState(settings.state);
  const [city, setCity] = useState(settings.city);
  const [fullAddress, setFullAddress] = useState(settings.fullAddress);
  const [googleMapsUrl, setGoogleMapsUrl] = useState(settings.googleMapsUrl);
  
  const [githubUrl, setGithubUrl] = useState(settings.githubUrl);
  const [linkedinUrl, setLinkedinUrl] = useState(settings.linkedinUrl);
  const [twitterUrl, setTwitterUrl] = useState(settings.twitterUrl);
  const [instagramUrl, setInstagramUrl] = useState(settings.instagramUrl);
  const [facebookUrl, setFacebookUrl] = useState(settings.facebookUrl);
  const [youtubeUrl, setYoutubeUrl] = useState(settings.youtubeUrl);
  const [discordUsername, setDiscordUsername] = useState(settings.discordUsername);
  const [telegramUsername, setTelegramUsername] = useState(settings.telegramUsername);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setToast(null);

    const formData = new FormData();
    formData.set("contactHeading", contactHeading);
    formData.set("contactDescription", contactDescription);
    formData.set("availabilityStatus", availabilityStatus);
    formData.set("contactEmail", contactEmail);
    formData.set("phoneNumber", phoneNumber);
    formData.set("whatsappNumber", whatsappNumber);
    formData.set("resumePdf", resumePdf);
    formData.set("country", country);
    formData.set("state", state);
    formData.set("city", city);
    formData.set("fullAddress", fullAddress);
    formData.set("googleMapsUrl", googleMapsUrl);
    formData.set("githubUrl", githubUrl);
    formData.set("linkedinUrl", linkedinUrl);
    formData.set("twitterUrl", twitterUrl);
    formData.set("instagramUrl", instagramUrl);
    formData.set("facebookUrl", facebookUrl);
    formData.set("youtubeUrl", youtubeUrl);
    formData.set("discordUsername", discordUsername);
    formData.set("telegramUsername", telegramUsername);

    try {
      const res = await saveContactSettings(formData);
      if (res?.error) {
        setToast({ type: "error", text: res.error });
      } else {
        setToast({ type: "success", text: res?.success || "Contact & Social settings saved successfully!" });
        setTimeout(() => setToast(null), 4000);
      }
    } catch (error: any) {
      console.error(error);
      setToast({ type: "error", text: error?.message || "Failed to save contact settings." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm("Are you sure you want to reset all contact and social settings to default values?")) return;
    setIsResetting(true);
    setToast(null);

    try {
      const res = await resetContactSettings();
      if (res?.error) {
        setToast({ type: "error", text: res.error });
      } else {
        setToast({ type: "success", text: res?.success || "Contact settings reset successfully!" });
        setTimeout(() => setToast(null), 4000);
        
        setContactHeading("Get In Touch");
        setContactDescription("Have a project in mind, want to collaborate, or just want to say hi? Send me a message!");
        setAvailabilityStatus("Available");
        setContactEmail("");
        setPhoneNumber("");
        setWhatsappNumber("");
        setResumePdf("");
        setCountry("");
        setState("");
        setCity("");
        setFullAddress("");
        setGoogleMapsUrl("");
        setGithubUrl("");
        setLinkedinUrl("");
        setTwitterUrl("");
        setInstagramUrl("");
        setFacebookUrl("");
        setYoutubeUrl("");
        setDiscordUsername("");
        setTelegramUsername("");
      }
    } catch (error: any) {
      console.error(error);
      setToast({ type: "error", text: error?.message || "Failed to reset settings." });
    } finally {
      setIsResetting(false);
    }
  };

  const inputCls = "w-full bg-[var(--background)] border border-[var(--border-color)] rounded-lg px-4 py-2.5 text-[var(--text-main)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all";
  const textareaCls = `${inputCls} resize-none`;
  const labelCls = "block text-sm font-semibold text-[var(--text-secondary)] mb-1.5";
  const saveBtnCls = "bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 px-6 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed font-medium h-11 rounded-lg";

  return (
    <div className="space-y-10 relative">
      {toast && (
        <div className={`fixed top-4 right-4 z-[100] flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-lg transition-all animate-in fade-in slide-in-from-top-3 ${
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

      <div className="flex justify-end -mt-20 sm:-mt-16 mb-6">
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleReset} 
          disabled={isResetting || isSaving}
          className="text-[var(--error)] border-[var(--error)]/30 hover:bg-[var(--error)]/10 font-semibold font-sans"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          {isResetting ? "Resetting..." : "Reset"}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        
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
                <input 
                  value={contactHeading} 
                  onChange={(e) => setContactHeading(e.target.value)} 
                  className={inputCls} 
                  placeholder="Get In Touch" 
                />
              </div>
              <div className="md:col-span-2">
                <label className={labelCls}>Contact Description</label>
                <textarea 
                  value={contactDescription} 
                  onChange={(e) => setContactDescription(e.target.value)} 
                  rows={3} 
                  className={textareaCls} 
                  placeholder="Have a project in mind..." 
                />
              </div>
              <div>
                <label className={labelCls}>Availability Status</label>
                <select 
                  value={availabilityStatus} 
                  onChange={(e) => setAvailabilityStatus(e.target.value)} 
                  className={inputCls}
                >
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
            <CardDescription>Email, phone numbers, and CV files.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>Contact Email</label>
                <input 
                  value={contactEmail} 
                  onChange={(e) => setContactEmail(e.target.value)} 
                  type="email" 
                  className={inputCls} 
                />
              </div>
              <div>
                <label className={labelCls}>Phone Number</label>
                <input 
                  value={phoneNumber} 
                  onChange={(e) => setPhoneNumber(e.target.value)} 
                  className={inputCls} 
                />
              </div>
              <div>
                <label className={labelCls}>WhatsApp Number</label>
                <input 
                  value={whatsappNumber} 
                  onChange={(e) => setWhatsappNumber(e.target.value)} 
                  className={inputCls} 
                  placeholder="+1 234 567 890" 
                />
              </div>
              <div>
                <label className={labelCls}>Resume PDF URL</label>
                <input 
                  value={resumePdf} 
                  onChange={(e) => setResumePdf(e.target.value)} 
                  type="url" 
                  className={inputCls} 
                  placeholder="https://..." 
                />
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
                <input 
                  value={country} 
                  onChange={(e) => setCountry(e.target.value)} 
                  className={inputCls} 
                />
              </div>
              <div>
                <label className={labelCls}>State/Region</label>
                <input 
                  value={state} 
                  onChange={(e) => setState(e.target.value)} 
                  className={inputCls} 
                />
              </div>
              <div>
                <label className={labelCls}>City</label>
                <input 
                  value={city} 
                  onChange={(e) => setCity(e.target.value)} 
                  className={inputCls} 
                />
              </div>
            </div>
            
            <div>
              <label className={labelCls}>Full Address</label>
              <textarea 
                value={fullAddress} 
                onChange={(e) => setFullAddress(e.target.value)} 
                rows={2} 
                className={textareaCls} 
              />
            </div>
            
            <div>
              <label className={labelCls}>Google Maps Embed URL</label>
              <input 
                value={googleMapsUrl} 
                onChange={(e) => setGoogleMapsUrl(e.target.value)} 
                type="url" 
                className={inputCls} 
                placeholder="https://www.google.com/maps/embed?..." 
              />
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
                <input 
                  value={githubUrl} 
                  onChange={(e) => setGithubUrl(e.target.value)} 
                  type="url" 
                  className={inputCls} 
                />
              </div>
              <div>
                <label className={labelCls}>LinkedIn URL</label>
                <input 
                  value={linkedinUrl} 
                  onChange={(e) => setLinkedinUrl(e.target.value)} 
                  type="url" 
                  className={inputCls} 
                />
              </div>
              <div>
                <label className={labelCls}>Twitter / X URL</label>
                <input 
                  value={twitterUrl} 
                  onChange={(e) => setTwitterUrl(e.target.value)} 
                  type="url" 
                  className={inputCls} 
                  placeholder="https://x.com/username"
                />
              </div>
              <div>
                <label className={labelCls}>Instagram URL</label>
                <input 
                  value={instagramUrl} 
                  onChange={(e) => setInstagramUrl(e.target.value)} 
                  type="url" 
                  className={inputCls} 
                />
              </div>
              <div>
                <label className={labelCls}>Facebook URL</label>
                <input 
                  value={facebookUrl} 
                  onChange={(e) => setFacebookUrl(e.target.value)} 
                  type="url" 
                  className={inputCls} 
                />
              </div>
              <div>
                <label className={labelCls}>YouTube URL</label>
                <input 
                  value={youtubeUrl} 
                  onChange={(e) => setYoutubeUrl(e.target.value)} 
                  type="url" 
                  className={inputCls} 
                />
              </div>
              <div>
                <label className={labelCls}>Discord Username / Invite URL</label>
                <input 
                  value={discordUsername} 
                  onChange={(e) => setDiscordUsername(e.target.value)} 
                  className={inputCls} 
                />
              </div>
              <div>
                <label className={labelCls}>Telegram Username / URL</label>
                <input 
                  value={telegramUsername} 
                  onChange={(e) => setTelegramUsername(e.target.value)} 
                  className={inputCls} 
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end sticky bottom-6 z-10 pt-4">
          <div className="bg-[var(--card)] p-2 rounded-2xl shadow-xl border border-[var(--border-color)]">
            <Button type="submit" disabled={isSaving} className={saveBtnCls}>
              <CheckCircle className="w-5 h-5" /> 
              {isSaving ? "Saving Settings..." : "Save All Changes"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
