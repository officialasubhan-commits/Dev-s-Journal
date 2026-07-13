"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Megaphone, 
  BookOpen, 
  Briefcase, 
  Image as ImageIcon, 
  GraduationCap,
  Settings,
  Trash2,
  Check,
  Bell
} from "lucide-react";
interface NotificationData {
  id: string;
  type: string;
  title?: string | null;
  message: string;
  link?: string | null;
  read: boolean;
  createdAt: string | Date;
}

interface NotificationItemProps {
  notification: NotificationData;
  onUpdate: () => void;
}

export function NotificationItem({ notification, onUpdate }: NotificationItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const getIcon = () => {
    switch (notification.type) {
      case "JOURNAL": return <BookOpen className="w-5 h-5 text-blue-500" />;
      case "PROJECT": return <Briefcase className="w-5 h-5 text-purple-500" />;
      case "GALLERY": return <ImageIcon className="w-5 h-5 text-pink-500" />;
      case "LEARNING": return <GraduationCap className="w-5 h-5 text-green-500" />;
      case "ANNOUNCEMENT": return <Megaphone className="w-5 h-5 text-yellow-500" />;
      default: return <Bell className="w-5 h-5 text-gray-400" />;
    }
  };

  const handleMarkAsRead = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await fetch(`/api/notifications/${notification.id}`, { method: "PATCH" });
      onUpdate();
      window.dispatchEvent(new Event("notifications-updated"));
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDeleting(true);
    try {
      await fetch(`/api/notifications/${notification.id}`, { method: "DELETE" });
      onUpdate();
      window.dispatchEvent(new Event("notifications-updated"));
    } catch (error) {
      console.error(error);
      setIsDeleting(false);
    }
  };

  const formattedDate = new Date(notification.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const innerContent = (
    <>
      <div className="flex-shrink-0 mt-1">
        {getIcon()}
      </div>
      
      <div className="flex-1 min-w-0">
        {notification.title && (
          <h4 className={`text-sm font-semibold mb-1 ${!notification.read ? "text-white" : "text-[var(--text-secondary)]"}`}>
            {notification.title}
          </h4>
        )}
        <p className="text-sm text-[var(--text-secondary)]">
          {notification.message}
        </p>
        <span className="text-xs text-[var(--text-secondary)]/70 mt-2 block">
          {formattedDate}
        </span>
      </div>

      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {!notification.read && (
          <button
            onClick={handleMarkAsRead}
            className="p-2 bg-[var(--background)] hover:bg-[var(--primary)]/10 text-[var(--primary)] rounded-full transition-colors"
            title="Mark as read"
          >
            <Check className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="p-2 bg-[var(--background)] hover:bg-[var(--error)]/10 text-[var(--error)] rounded-full transition-colors disabled:opacity-50"
          title="Delete notification"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`group relative overflow-hidden rounded-xl border ${
        notification.read ? "border-[var(--border-color)] bg-[var(--card)]/50 opacity-70" : "border-[var(--primary)]/30 bg-[var(--card)] shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)]"
      } transition-all hover:bg-[var(--card)]`}
    >
      {notification.link && notification.link !== "" ? (
        <Link href={`/notifications/redirect?url=${encodeURIComponent(notification.link)}`} className="flex items-start p-5 gap-4">
          {innerContent}
        </Link>
      ) : (
        <div className="flex items-start p-5 gap-4">
          {innerContent}
        </div>
      )}
    </motion.div>
  );
}
