"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

import { useSiteSettings } from "@/components/providers/SiteSettingsProvider";

export function WelcomePopup() {
  const [showWelcome, setShowWelcome] = useState(false);
  const { siteTitle } = useSiteSettings();

  useEffect(() => {
    const welcomeSeen = localStorage.getItem("welcome_notif_seen") === "true";
    if (!welcomeSeen) {
      const timer = setTimeout(() => {
        setShowWelcome(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const handleUpdate = () => {
      const welcomeSeen = localStorage.getItem("welcome_notif_seen") === "true";
      if (welcomeSeen) {
        setShowWelcome(false);
      }
    };
    window.addEventListener("notifications-updated", handleUpdate);
    return () => window.removeEventListener("notifications-updated", handleUpdate);
  }, []);

  const handleDismiss = () => {
    localStorage.setItem("welcome_notif_seen", "true");
    setShowWelcome(false);
    window.dispatchEvent(new Event("notifications-updated"));
  };

  return (
    <AnimatePresence>
      {showWelcome && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] bg-[var(--card)] border border-[var(--border-color)] shadow-2xl p-6 rounded-2xl flex flex-col gap-3 backdrop-blur-md"
        >
          <div className="flex justify-between items-start">
            <h4 className="font-bold text-base font-heading text-[var(--text-main)] flex items-center gap-1.5">
              👋 Welcome to {siteTitle}!
            </h4>
            <button 
              onClick={handleDismiss}
              className="p-1 rounded-full text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--secondary-bg)] transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="text-sm text-[var(--text-secondary)] space-y-2 leading-relaxed font-sans">
            <p>Welcome to my personal portfolio and learning journal.</p>
            <p>Here you can explore my projects, daily learning, achievements, and my journey toward becoming a Software Engineer.</p>
            <p>Thank you for visiting my website. I hope you enjoy exploring my work!</p>
          </div>
          <div className="flex justify-end pt-2">
            <Button size="sm" onClick={handleDismiss} className="px-4 font-sans font-semibold rounded-lg">
              Get Started
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
