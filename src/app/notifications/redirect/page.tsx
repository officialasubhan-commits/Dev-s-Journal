"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Megaphone, Home, BookOpen, Briefcase, Mail, Loader2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

import { useSession } from "next-auth/react";

function RedirectPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";
  
  let link = searchParams.get("url") || "";

  // Rewrite admin routes for non-admin visitors to safe public routes
  if (link.startsWith("/admin") && !isAdmin) {
    if (link.startsWith("/admin/posts")) {
      link = "/journal";
    } else if (link.startsWith("/admin/projects")) {
      link = "/projects";
    } else if (link.startsWith("/admin/gallery")) {
      link = "/gallery";
    } else if (link.startsWith("/admin/learning")) {
      link = "/learning";
    } else {
      link = "/";
    }
  }

  const [status, setStatus] = useState<"checking" | "valid" | "invalid">("checking");

  useEffect(() => {
    if (!link) {
      router.replace("/");
      return;
    }

    const checkLink = async () => {
      try {
        const res = await fetch(`/api/notifications/validate-link?link=${encodeURIComponent(link)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.valid) {
            setStatus("valid");
            // If valid, redirect immediately
            router.replace(link);
          } else {
            setStatus("invalid");
          }
        } else {
          setStatus("invalid");
        }
      } catch (error) {
        setStatus("invalid");
      }
    };

    checkLink();
  }, [link, router]);

  if (status === "checking" || status === "valid") {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-[var(--primary)]" />
        <p className="text-[var(--text-secondary)] text-sm animate-pulse">Verifying linked content...</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="max-w-md w-full glass-card border border-[var(--border-color)] p-8 rounded-2xl shadow-2xl text-center space-y-6"
    >
      <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
        <AlertCircle className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold font-heading text-[var(--text-main)]">Content Unavailable</h2>
        <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
          This content is no longer available. The post, project, or resource you are trying to view has been moved or deleted.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2">
        <Button variant="outline" className="flex items-center justify-center gap-1.5" onClick={() => router.push("/")}>
          <Home className="w-4 h-4" /> Go Home
        </Button>
        <Button variant="outline" className="flex items-center justify-center gap-1.5" onClick={() => router.push("/projects")}>
          <Briefcase className="w-4 h-4" /> View Projects
        </Button>
        <Button variant="outline" className="flex items-center justify-center gap-1.5" onClick={() => router.push("/journal")}>
          <BookOpen className="w-4 h-4" /> View Journal
        </Button>
        <Button variant="default" className="flex items-center justify-center gap-1.5" onClick={() => router.push("/contact")}>
          <Mail className="w-4 h-4" /> Contact Me
        </Button>
      </div>
    </motion.div>
  );
}

export default function NotificationRedirectPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] px-4">
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-[var(--primary)]" />
          <p className="text-[var(--text-secondary)] text-sm animate-pulse">Loading redirect page...</p>
        </div>
      }>
        <RedirectPageContent />
      </Suspense>
    </div>
  );
}
