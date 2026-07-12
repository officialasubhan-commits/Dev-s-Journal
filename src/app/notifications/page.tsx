"use client";

import { useState, useEffect } from "react";
import { NotificationList } from "@/components/notifications/NotificationList";
import { Button } from "@/components/ui/button";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

export default function NotificationsPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== "all") params.append("filter", filter);
      if (debouncedSearch) params.append("search", debouncedSearch);
      params.append("page", page.toString());
      params.append("limit", "10");

      const res = await fetch(`/api/notifications?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setTotalPages(data.totalPages || 1);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
     
    fetchNotifications();

    // Poll every 30 seconds
    const interval = setInterval(() => {
       
      fetchNotifications();
    }, 30000);

    // Listen for updates from other components
    const handleUpdateEvent = () => {
       
      fetchNotifications();
    };
    window.addEventListener("notifications-updated", handleUpdateEvent);

    return () => {
      clearInterval(interval);
      window.removeEventListener("notifications-updated", handleUpdateEvent);
    };
  }, [filter, debouncedSearch, page]);

  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications/read-all", { method: "POST" });
      fetchNotifications();
      window.dispatchEvent(new Event("notifications-updated"));
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const filters = [
    { id: "all", label: "All" },
    { id: "unread", label: "Unread" },
    { id: "read", label: "Read" },
    { id: "journal", label: "Journals" },
    { id: "project", label: "Projects" },
    { id: "gallery", label: "Gallery" },
    { id: "learning", label: "Learning" },
    { id: "announcement", label: "Announcements" },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-glow">Notifications</h1>
          <p className="text-[var(--text-secondary)] mt-1">Stay updated with new content and announcements.</p>
        </div>
        <Button variant="outline" onClick={markAllAsRead}>
          Mark all as read
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
            <input 
              type="text" 
              placeholder="Search notifications..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1); // Reset page on search
              }}
              className="w-full bg-[var(--card)] border border-[var(--border-color)] rounded-md pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-[var(--primary)]"
            />
          </div>

          <div className="space-y-1">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => {
                  setFilter(f.id);
                  setPage(1); // Reset page on filter change
                }}
                className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                  filter === f.id
                    ? "bg-[var(--primary)]/10 text-[var(--primary)] font-medium"
                    : "text-[var(--text-secondary)] hover:bg-[var(--card)] hover:text-white"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="md:col-span-3 space-y-6">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-[var(--card)] rounded-xl animate-pulse border border-[var(--border-color)]"></div>
              ))}
            </div>
          ) : (
            <NotificationList notifications={notifications} onUpdate={fetchNotifications} />
          )}

          {/* Pagination Controls */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-4 border-t border-[var(--border-color)]">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Previous
              </Button>
              <span className="text-sm text-[var(--text-secondary)]">
                Page {page} of {totalPages}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={page >= totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
