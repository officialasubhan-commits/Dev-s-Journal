"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Bell, Check, Megaphone, BookOpen, Briefcase, Image as ImageIcon, GraduationCap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";

type NotificationData = {
  id: string;
  type: string;
  title?: string;
  message: string;
  link?: string;
  createdAt: string;
  read: boolean;
};

export function NotificationDropdown({ isPublicMode = false }: { isPublicMode?: boolean }) {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentNotifications, setRecentNotifications] = useState<NotificationData[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const failureCountRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchQuickNotifications = async () => {
    try {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      const endpoint = isPublicMode ? "/api/notifications?public=true&limit=5" : "/api/notifications?limit=5";
      const res = await fetch(endpoint, {
        signal: abortControllerRef.current.signal
      });
      
      if (res.ok) {
        const data = await res.json();
        let notifs = data.notifications || [];

        // Prepend local welcome notification if not dismissed
        const welcomeSeen = typeof window !== 'undefined' && localStorage.getItem("welcome_notif_seen") === "true";
        let localWelcomeCount = 0;
        if (!welcomeSeen) {
          const welcomeNotif: NotificationData = {
            id: "welcome-local",
            type: "INFO",
            title: "👋 Welcome to Boss Journal!",
            message: "Welcome to my personal portfolio and learning journal.",
            link: "/",
            createdAt: new Date().toISOString(),
            read: false
          };
          notifs = [welcomeNotif, ...notifs];
          localWelcomeCount = 1;
        }

        if (isPublicMode) {
          // Calculate local read state for public notifications
          const lastReadDateStr = typeof window !== 'undefined' ? localStorage.getItem("last_read_notif_date") : null;
          const lastReadDate = lastReadDateStr ? new Date(lastReadDateStr).getTime() : 0;
          
          let unread = 0;
          const processedNotifs = notifs.map((n: NotificationData) => {
            if (n.id === "welcome-local") {
              if (!n.read) unread++;
              return n;
            }
            const isRead = new Date(n.createdAt).getTime() <= lastReadDate;
            if (!isRead) unread++;
            return { ...n, read: isRead };
          });
          
          setRecentNotifications(processedNotifs);
          setUnreadCount(unread);
        } else {
          setUnreadCount((data.unreadCount || 0) + localWelcomeCount);
          setRecentNotifications(notifs);
        }
        
        failureCountRef.current = 0; // Reset on success
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "AbortError") return;
      
      failureCountRef.current += 1;
      
      // Only show a toast/log if the failure persists
      if (failureCountRef.current === 3) {
        console.warn("Notification sync failing persistently.", error);
      }
    }
  };

  useEffect(() => {
    fetchQuickNotifications();

    // Poll every 30 seconds
    const interval = setInterval(() => {
      fetchQuickNotifications();
    }, 30000);

    // Listen for updates from other components
    const handleUpdateEvent = () => {
      fetchQuickNotifications();
    };
    window.addEventListener("notifications-updated", handleUpdateEvent);

    return () => {
      clearInterval(interval);
      window.removeEventListener("notifications-updated", handleUpdateEvent);
    };
  }, [isPublicMode, status, session]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (id === "welcome-local") {
      localStorage.setItem("welcome_notif_seen", "true");
      fetchQuickNotifications();
      window.dispatchEvent(new Event("notifications-updated"));
      return;
    }

    if (isPublicMode) {
      const notif = recentNotifications.find(n => n.id === id);
      if (notif) {
        localStorage.setItem("last_read_notif_date", notif.createdAt);
        fetchQuickNotifications();
      }
      return;
    }
    
    try {
      await fetch(`/api/notifications/${id}`, { method: "PATCH" });
      fetchQuickNotifications();
      window.dispatchEvent(new Event("notifications-updated"));
    } catch (error) {
      console.error(error);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "JOURNAL": return <BookOpen className="w-4 h-4 text-blue-500" />;
      case "PROJECT": return <Briefcase className="w-4 h-4 text-purple-500" />;
      case "GALLERY": return <ImageIcon className="w-4 h-4 text-pink-500" />;
      case "LEARNING": return <GraduationCap className="w-4 h-4 text-green-500" />;
      case "ANNOUNCEMENT": return <Megaphone className="w-4 h-4 text-yellow-500" />;
      default: return <Bell className="w-4 h-4 text-[var(--text-muted)]" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors outline-none"
      >
        <Bell className="w-5 h-5" />
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute top-1 right-1 w-2.5 h-2.5 bg-[var(--danger)] rounded-full border-2 border-[var(--card)]"
            />
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 glass-card overflow-hidden z-50"
          >
            <div className="p-4 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--secondary-bg)]/50">
              <span className="font-semibold text-sm text-[var(--text-main)]">Notifications</span>
              {unreadCount > 0 && (
                <span className="bg-[var(--danger)]/10 text-[var(--danger)] text-xs px-2 py-0.5 rounded-full font-medium">
                  {unreadCount} unread
                </span>
              )}
            </div>
            
            <div className="max-h-80 overflow-y-auto">
              {recentNotifications.length === 0 ? (
                <div className="p-6 text-center text-sm text-[var(--text-muted)]">
                  {isPublicMode ? "No new notifications." : "No notifications yet."}
                </div>
              ) : (
                <div className="divide-y divide-[var(--border-color)]">
                  {recentNotifications.map((notif) => {
                    const innerContent = (
                      <>
                        <div className="mt-0.5 flex-shrink-0 bg-white p-2 rounded-full shadow-sm border border-[var(--border-color)]">
                          {getIcon(notif.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${!notif.read ? 'text-[var(--text-main)] font-semibold' : 'text-[var(--text-secondary)]'}`}>
                            {notif.title || notif.message}
                          </p>
                          <p className="text-xs text-[var(--text-muted)] mt-1 truncate">
                            {notif.title ? notif.message : new Date(notif.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </>
                    );

                    const isAdmin = session?.user?.role === "ADMIN";
                    let safeLink = notif.link;
                    if (safeLink && safeLink.startsWith("/admin") && !isAdmin) {
                      if (safeLink.startsWith("/admin/posts")) {
                        safeLink = "/journal";
                      } else if (safeLink.startsWith("/admin/projects")) {
                        safeLink = "/projects";
                      } else if (safeLink.startsWith("/admin/gallery")) {
                        safeLink = "/gallery";
                      } else if (safeLink.startsWith("/admin/learning")) {
                        safeLink = "/learning";
                      } else {
                        safeLink = "/";
                      }
                    }

                    return (
                      <div key={notif.id} className={`group relative block p-3 transition-colors hover:bg-[var(--secondary-bg)] ${notif.read ? 'opacity-70' : 'bg-[var(--primary)]/5'}`}>
                        {safeLink ? (
                          <Link href={`/notifications/redirect?url=${encodeURIComponent(safeLink)}`} className="flex items-start gap-3" onClick={() => setIsOpen(false)}>
                            {innerContent}
                          </Link>
                        ) : (
                          <div className="flex items-start gap-3" onClick={() => setIsOpen(false)}>
                            {innerContent}
                          </div>
                        )}
                        {!notif.read && (
                          <button 
                            onClick={(e) => handleMarkAsRead(notif.id, e)}
                            className="absolute top-1/2 -translate-y-1/2 right-3 p-2 rounded-full text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 opacity-0 group-hover:opacity-100 transition-all"
                            title="Mark as read"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {!isPublicMode && (
              <div className="p-2 border-t border-[var(--border-color)] bg-[var(--secondary-bg)]/50">
                <Link 
                  href="/notifications" 
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center py-2 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors rounded-md hover:bg-white"
                >
                  View all notifications
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
