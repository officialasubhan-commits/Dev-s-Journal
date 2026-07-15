import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Download, Phone, CheckCircle, Clock, XCircle } from "lucide-react";
import { FaGithub, FaLinkedin, FaInstagram, FaFacebook, FaYoutube, FaDiscord, FaTelegram, FaWhatsapp } from "react-icons/fa";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with me.",
};

import { getSiteSettings } from "@/app/admin/settings/actions";

export default async function ContactPage() {
  const settings = await getSiteSettings();

  const locationParts = [settings?.city, settings?.state, settings?.country].filter(Boolean);
  const locationText = settings?.fullAddress || (locationParts.length > 0 ? locationParts.join(", ") : "");
  
  // Parse availability status
  const availability = settings?.availabilityStatus || "Available";
  let StatusIcon = CheckCircle;
  let statusColor = "text-green-500";
  if (availability === "Busy") {
    StatusIcon = Clock;
    statusColor = "text-yellow-500";
  } else if (availability === "Not Available") {
    StatusIcon = XCircle;
    statusColor = "text-red-500";
  }

  const socialLinks = [
    { url: settings?.githubUrl, icon: FaGithub, label: "GitHub" },
    { url: settings?.linkedinUrl, icon: FaLinkedin, label: "LinkedIn" },
    { url: settings?.instagramUrl, icon: FaInstagram, label: "Instagram" },
    { url: settings?.facebookUrl, icon: FaFacebook, label: "Facebook" },
    { url: settings?.youtubeUrl, icon: FaYoutube, label: "YouTube" },
    { url: settings?.discordUsername, icon: FaDiscord, label: "Discord" },
    { url: settings?.telegramUsername, icon: FaTelegram, label: "Telegram" },
  ].filter(link => link.url);

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-5xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-glow">
            {settings?.contactHeading || (
              <>Get In <span className="text-[var(--accent)]">Touch</span></>
            )}
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            {settings?.contactDescription || "Have a project in mind, want to collaborate, or just want to say hi? Send me a message!"}
          </p>
          {settings?.availabilityStatus && (
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--background)] border border-[var(--border-color)] text-sm font-medium ${statusColor} mt-4`}>
              <StatusIcon className="w-4 h-4" />
              {availability}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold">Contact Information</h2>
            <div className="space-y-6">
              
              {settings?.contactEmail && (
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[var(--primary)]/10 rounded-full flex items-center justify-center text-[var(--primary)] shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-[var(--text-secondary)]">Email</p>
                    <a href={`mailto:${settings.contactEmail}`} className="text-lg font-medium hover:text-[var(--primary)] transition-colors break-all">
                      {settings.contactEmail}
                    </a>
                  </div>
                </div>
              )}

              {settings?.phoneNumber && (
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[var(--primary)]/10 rounded-full flex items-center justify-center text-[var(--primary)] shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-[var(--text-secondary)]">Phone</p>
                    <a href={`tel:${settings.phoneNumber}`} className="text-lg font-medium hover:text-[var(--primary)] transition-colors">
                      {settings.phoneNumber}
                    </a>
                  </div>
                </div>
              )}

              {settings?.whatsappNumber && (
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[var(--primary)]/10 rounded-full flex items-center justify-center text-[var(--primary)] shrink-0">
                    <FaWhatsapp className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-[var(--text-secondary)]">WhatsApp</p>
                    <a href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-lg font-medium hover:text-[var(--primary)] transition-colors">
                      {settings.whatsappNumber}
                    </a>
                  </div>
                </div>
              )}

              {locationText && (
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[var(--primary)]/10 rounded-full flex items-center justify-center text-[var(--primary)] shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-[var(--text-secondary)]">Location</p>
                    <p className="text-lg font-medium">{locationText}</p>
                    {settings?.googleMapsUrl && (
                      <a href={settings.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--primary)] hover:underline mt-1 inline-block">
                        View on Map
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {settings?.resumePdf && (
              <div className="pt-4 space-y-4">
                <h3 className="font-semibold text-lg">Looking for my resume?</h3>
                <Button variant="outline" className="w-full sm:w-auto" asChild>
                  <a href={settings.resumePdf} target="_blank" rel="noopener noreferrer">
                    <Download className="w-4 h-4 mr-2" /> Download Resume
                  </a>
                </Button>
              </div>
            )}

            {socialLinks.length > 0 && (
              <div className="pt-4 space-y-4">
                <h3 className="font-semibold text-lg">Social Profiles</h3>
                <div className="flex gap-4 flex-wrap">
                  {socialLinks.map((link, idx) => {
                    const Icon = link.icon;
                    return (
                      <a 
                        key={idx} 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        title={link.label}
                        className="p-3 bg-[var(--background)] border border-[var(--border-color)] rounded-full hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all shadow-sm"
                      >
                        <Icon className="w-5 h-5" />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Contact Form */}
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
