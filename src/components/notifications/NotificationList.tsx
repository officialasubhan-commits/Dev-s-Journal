"use client";

import { motion, AnimatePresence } from "framer-motion";
import { NotificationItem } from "./NotificationItem";
import { BellOff } from "lucide-react";

interface Notification {
  id: string;
  type: string;
  title?: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

interface NotificationListProps {
  notifications: Notification[];
  onUpdate: () => void;
}

export function NotificationList({ notifications, onUpdate }: NotificationListProps) {
  if (!notifications || notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-[var(--text-secondary)] border border-[var(--border-color)] border-dashed rounded-xl bg-[var(--card)]/50">
        <BellOff className="w-12 h-12 mb-4 text-[var(--border-color)]" />
        <h3 className="text-xl font-medium text-white mb-2">No notifications found</h3>
        <p>You're all caught up!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {notifications.map((notification) => (
          <NotificationItem 
            key={notification.id} 
            notification={notification} 
            onUpdate={onUpdate} 
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
