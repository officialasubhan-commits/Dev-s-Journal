"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  getNotificationsList, 
  createNotificationAction, 
  updateNotificationAction, 
  deleteNotificationAction, 
  togglePublishAction, 
  togglePinAction, 
  toggleArchiveAction, 
  duplicateNotificationAction, 
  bulkDeleteAction, 
  bulkPublishAction 
} from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Plus, Search, Edit2, Trash2, Megaphone, Check, X, 
  Archive, Copy, Pin, Loader2, Filter, AlertCircle, 
  Calendar, ChevronLeft, ChevronRight, Eye, EyeOff, RotateCcw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type NotificationData = {
  id: string;
  type: string;
  title: string | null;
  message: string;
  link: string | null;
  read: boolean;
  published: boolean;
  priority: string;
  pinned: boolean;
  archived: boolean;
  publishedAt: string | null;
  updatedAt: string;
  createdAt: string;
  isValidLink?: boolean;
};

type Stats = {
  total: number;
  published: number;
  draft: number;
  pinned: number;
  archived: number;
};

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, published: 0, draft: 0, pinned: 0, archived: 0 });
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [pinnedFilter, setPinnedFilter] = useState<"all" | "pinned" | "unpinned">("all");
  const [archivedFilter, setArchivedFilter] = useState<"all" | "archived" | "active">("active"); // default to active (non-archived)
  const [priorityFilter, setPriorityFilter] = useState<"all" | "LOW" | "MEDIUM" | "HIGH">("all");

  // Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingNotification, setEditingNotification] = useState<NotificationData | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isBulkDeleteConfirmOpen, setIsBulkDeleteConfirmOpen] = useState(false);

  // Form states
  const [formTitle, setFormTitle] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [formType, setFormType] = useState("ANNOUNCEMENT");
  const [formPriority, setFormPriority] = useState("MEDIUM");
  const [formPublished, setFormPublished] = useState(true);
  const [formPinned, setFormPinned] = useState(false);
  const [formLink, setFormLink] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const loadNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getNotificationsList({
        search: debouncedSearch,
        status: statusFilter,
        pinned: pinnedFilter,
        archived: archivedFilter,
        priority: priorityFilter,
        page,
        limit: 10
      });
      setNotifications(result.notifications);
      setTotalCount(result.totalCount);
      setTotalPages(result.totalPages);
      setStats(result.stats);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, statusFilter, pinnedFilter, archivedFilter, priorityFilter, page]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Bulk selectors
  const toggleSelectAll = () => {
    if (selectedIds.length === notifications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(notifications.map(n => n.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Actions
  const handleTogglePublish = async (id: string) => {
    try {
      await togglePublishAction(id);
      loadNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleTogglePin = async (id: string) => {
    try {
      await togglePinAction(id);
      loadNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleArchive = async (id: string) => {
    try {
      await toggleArchiveAction(id);
      loadNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      await duplicateNotificationAction(id);
      loadNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotificationAction(id);
      setDeleteConfirmId(null);
      loadNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  // Bulk actions
  const handleBulkDelete = async () => {
    try {
      await bulkDeleteAction(selectedIds);
      setSelectedIds([]);
      setIsBulkDeleteConfirmOpen(false);
      loadNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleBulkPublish = async (publish: boolean) => {
    try {
      await bulkPublishAction(selectedIds, publish);
      setSelectedIds([]);
      loadNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  // Modal resets
  const openCreateModal = () => {
    setFormTitle("");
    setFormMessage("");
    setFormType("ANNOUNCEMENT");
    setFormPriority("MEDIUM");
    setFormPublished(true);
    setFormPinned(false);
    setFormLink("");
    setFormError("");
    setIsCreateModalOpen(true);
  };

  const openEditModal = (n: NotificationData) => {
    setEditingNotification(n);
    setFormTitle(n.title || "");
    setFormMessage(n.message);
    setFormType(n.type);
    setFormPriority(n.priority);
    setFormPublished(n.published);
    setFormPinned(n.pinned);
    setFormLink(n.link || "");
    setFormError("");
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formMessage.trim()) {
      setFormError("Title and Message are required.");
      return;
    }
    setIsSubmitting(true);
    try {
      await createNotificationAction({
        title: formTitle,
        message: formMessage,
        type: formType,
        priority: formPriority,
        published: formPublished,
        pinned: formPinned,
        link: formLink || undefined
      });
      setIsCreateModalOpen(false);
      loadNotifications();
    } catch (err: any) {
      setFormError(err.message || "Failed to create notification.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNotification) return;
    if (!formTitle.trim() || !formMessage.trim()) {
      setFormError("Title and Message are required.");
      return;
    }
    setIsSubmitting(true);
    try {
      await updateNotificationAction(editingNotification.id, {
        title: formTitle,
        message: formMessage,
        type: formType,
        priority: formPriority,
        published: formPublished,
        pinned: formPinned,
        link: formLink || undefined
      });
      setEditingNotification(null);
      loadNotifications();
    } catch (err: any) {
      setFormError(err.message || "Failed to update notification.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]">Notification Manager</h1>
          <p className="text-[var(--text-secondary)] mt-1">Manage public site announcements, alerts, and content feed notifications.</p>
        </div>
        <Button onClick={openCreateModal} className="flex items-center gap-2 shadow-md hover:shadow-lg transition-all self-start md:self-auto">
          <Plus className="w-4 h-4" /> Create Notification
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Total Alerts", value: stats.total, color: "from-blue-500/10 to-blue-500/5", border: "border-blue-500/20", icon: Megaphone },
          { label: "Published", value: stats.published, color: "from-green-500/10 to-green-500/5", border: "border-green-500/20", icon: Eye },
          { label: "Drafts", value: stats.draft, color: "from-yellow-500/10 to-yellow-500/5", border: "border-yellow-500/20", icon: EyeOff },
          { label: "Pinned", value: stats.pinned, color: "from-purple-500/10 to-purple-500/5", border: "border-purple-500/20", icon: Pin },
          { label: "Archived", value: stats.archived, color: "from-gray-500/10 to-gray-500/5", border: "border-gray-500/20", icon: Archive },
        ].map((stat, i) => (
          <Card key={i} className={`bg-gradient-to-br ${stat.color} ${stat.border} border shadow-md rounded-xl`}>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-[var(--text-secondary)]">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <stat.icon className="w-8 h-8 opacity-20" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <Card className="bg-[var(--card)] border-[var(--border-color)] p-4 shadow-lg rounded-xl">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            
            {/* Search */}
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
              <input 
                type="text"
                placeholder="Search by title or content..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[var(--primary)]"
              />
            </div>

            {/* Quick Resets */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1"><Filter className="w-3 h-3" /> Filters:</span>
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value as any); setPage(1); }}
                className="bg-[var(--background)] border border-[var(--border-color)] rounded-lg px-2.5 py-1 text-xs outline-none focus:border-[var(--primary)]"
              >
                <option value="all">All Statuses</option>
                <option value="published">Published</option>
                <option value="draft">Drafts</option>
              </select>

              <select
                value={pinnedFilter}
                onChange={(e) => { setPinnedFilter(e.target.value as any); setPage(1); }}
                className="bg-[var(--background)] border border-[var(--border-color)] rounded-lg px-2.5 py-1 text-xs outline-none focus:border-[var(--primary)]"
              >
                <option value="all">All Pinned</option>
                <option value="pinned">Pinned Only</option>
                <option value="unpinned">Unpinned Only</option>
              </select>

              <select
                value={archivedFilter}
                onChange={(e) => { setArchivedFilter(e.target.value as any); setPage(1); }}
                className="bg-[var(--background)] border border-[var(--border-color)] rounded-lg px-2.5 py-1 text-xs outline-none focus:border-[var(--primary)]"
              >
                <option value="active">Active (Unarchived)</option>
                <option value="archived">Archived Only</option>
                <option value="all">All (Active & Archived)</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => { setPriorityFilter(e.target.value as any); setPage(1); }}
                className="bg-[var(--background)] border border-[var(--border-color)] rounded-lg px-2.5 py-1 text-xs outline-none focus:border-[var(--primary)]"
              >
                <option value="all">All Priorities</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Bulk Operations Toolbar */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-3 bg-[var(--primary)]/10 border border-[var(--primary)]/20 rounded-xl flex items-center justify-between gap-4 shadow-md"
          >
            <span className="text-sm font-semibold text-[var(--primary)]">
              {selectedIds.length} items selected
            </span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => handleBulkPublish(true)} className="h-8 text-xs">
                Bulk Publish
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleBulkPublish(false)} className="h-8 text-xs">
                Bulk Unpublish
              </Button>
              <Button size="sm" variant="destructive" onClick={() => setIsBulkDeleteConfirmOpen(true)} className="h-8 text-xs flex items-center gap-1">
                <Trash2 className="w-3.5 h-3.5" /> Delete Selected
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notifications Table */}
      <Card className="bg-[var(--card)] border-[var(--border-color)] shadow-xl overflow-hidden rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-color)] bg-[var(--background)]/50">
                <th className="p-4 w-12 text-center">
                  <input 
                    type="checkbox"
                    checked={notifications.length > 0 && selectedIds.length === notifications.length}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 cursor-pointer accent-[var(--primary)] rounded"
                  />
                </th>
                <th className="p-4 font-medium text-sm text-[var(--text-secondary)]">Notification Details</th>
                <th className="p-4 font-medium text-sm text-[var(--text-secondary)]">Type</th>
                <th className="p-4 font-medium text-sm text-[var(--text-secondary)]">Priority</th>
                <th className="p-4 font-medium text-sm text-[var(--text-secondary)]">Status / Pinned</th>
                <th className="p-4 font-medium text-sm text-[var(--text-secondary)]">Timestamps</th>
                <th className="p-4 font-medium text-sm text-[var(--text-secondary)] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[var(--text-secondary)]">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-[var(--primary)]" />
                      Loading notifications history...
                    </div>
                  </td>
                </tr>
              ) : notifications.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-[var(--text-secondary)]">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-[var(--background)] flex items-center justify-center">
                        <Megaphone className="w-6 h-6 text-[var(--primary)]/50" />
                      </div>
                      <p>No notifications found. Create a new alert to announce changes!</p>
                    </div>
                  </td>
                </tr>
              ) : (
                notifications.map((n) => (
                  <tr key={n.id} className={`hover:bg-[var(--background)]/30 transition-colors group ${n.archived ? 'opacity-60' : ''}`}>
                    <td className="p-4 text-center">
                      <input 
                        type="checkbox"
                        checked={selectedIds.includes(n.id)}
                        onChange={() => toggleSelect(n.id)}
                        className="w-4 h-4 cursor-pointer accent-[var(--primary)] rounded"
                      />
                    </td>
                    <td className="p-4 max-w-xs md:max-w-md">
                      <div className="flex flex-wrap items-center gap-2">
                        {n.pinned && <Pin className="w-3.5 h-3.5 text-purple-500 fill-purple-500 shrink-0" />}
                        <p className="font-semibold text-[var(--text-main)] truncate">{n.title || "Announcement"}</p>
                        {n.isValidLink === false && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-red-500/10 text-red-500 border border-red-500/20 px-1.5 py-0.5 rounded">
                            <AlertCircle className="w-3 h-3 text-red-500" /> Broken Link
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mt-0.5">{n.message}</p>
                      {n.link && (
                        <p className={`text-xs mt-1 truncate ${n.isValidLink === false ? 'text-red-500 font-medium' : 'text-[var(--primary)] hover:underline'}`}>
                          {n.link}
                        </p>
                      )}
                    </td>
                    <td className="p-4 text-sm font-medium">
                      <span className="px-2 py-0.5 rounded bg-[var(--secondary-bg)] border border-[var(--border-color)] text-xs">
                        {n.type}
                      </span>
                    </td>
                    <td className="p-4 text-sm">
                      <span className={`inline-flex items-center px-2 py-0.5 text-xs rounded font-medium ${
                        n.priority === "HIGH" 
                          ? "bg-red-500/10 text-red-500" 
                          : n.priority === "LOW" 
                          ? "bg-blue-500/10 text-blue-500" 
                          : "bg-yellow-500/10 text-yellow-500"
                      }`}>
                        {n.priority}
                      </span>
                    </td>
                    <td className="p-4 text-sm space-y-1">
                      <div className="flex gap-1.5 items-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full font-medium ${
                          n.published 
                            ? 'bg-green-500/10 text-green-500' 
                            : 'bg-yellow-500/10 text-yellow-500'
                        }`}>
                          {n.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          {n.published ? 'Published' : 'Draft'}
                        </span>
                        {n.archived && (
                          <span className="bg-gray-500/10 text-gray-500 text-xs px-2 py-0.5 rounded-full font-medium">
                            Archived
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-xs text-[var(--text-secondary)] space-y-0.5">
                      <p className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-[var(--text-muted)]" /> Created: {new Date(n.createdAt).toLocaleDateString()}</p>
                      {n.publishedAt && <p>Published: {new Date(n.publishedAt).toLocaleDateString()}</p>}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleTogglePin(n.id)}
                          className={`h-8 w-8 p-0 ${n.pinned ? 'text-purple-500 hover:text-purple-600' : 'text-[var(--text-muted)] hover:text-purple-500'}`}
                          title={n.pinned ? "Unpin Notification" : "Pin Notification"}
                        >
                          <Pin className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleTogglePublish(n.id)}
                          className="h-8 w-8 p-0 text-[var(--text-muted)] hover:text-[var(--primary)]"
                          title={n.published ? "Unpublish (Save Draft)" : "Publish Alert"}
                        >
                          {n.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDuplicate(n.id)}
                          className="h-8 w-8 p-0 text-[var(--text-muted)] hover:text-[var(--primary)]"
                          title="Duplicate Announcement"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleToggleArchive(n.id)}
                          className={`h-8 w-8 p-0 ${n.archived ? 'text-orange-500' : 'text-[var(--text-muted)] hover:text-orange-500'}`}
                          title={n.archived ? "Restore Alert" : "Archive Alert"}
                        >
                          <Archive className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => openEditModal(n)}
                          className="h-8 w-8 p-0 text-[var(--text-muted)] hover:text-[var(--primary)]"
                          title="Edit Notification"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setDeleteConfirmId(n.id)}
                          className="h-8 w-8 p-0 text-[var(--text-muted)] hover:text-[var(--danger)]"
                          title="Delete Alert"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paging */}
        {!isLoading && totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-[var(--border-color)] bg-[var(--background)]/20 p-4">
            <p className="text-sm text-[var(--text-secondary)]">Showing page {page} of {totalPages} ({totalCount} total alerts)</p>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Prev
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
              >
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Modals & Dialogs (AnimatePresence) */}
      <AnimatePresence>
        
        {/* Create Modal */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[var(--card)] border border-[var(--border-color)] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-5 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--secondary-bg)]/50">
                <h3 className="font-bold text-lg text-[var(--text-main)] flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-[var(--primary)]" />
                  Create Notification
                </h3>
                <button onClick={() => setIsCreateModalOpen(false)} className="text-[var(--text-secondary)] hover:text-white p-1 rounded-full"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleCreateSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
                {formError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold rounded-lg flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 shrink-0" /> {formError}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--text-secondary)]">Title (Optional)</label>
                  <input 
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. 🎉 New Blog Post Released!"
                    className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--text-secondary)]">Message</label>
                  <textarea 
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                    placeholder="Enter notification detail description..."
                    rows={3}
                    className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-[var(--primary)] resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[var(--text-secondary)]">Type</label>
                    <select
                      value={formType}
                      onChange={(e) => setFormType(e.target.value)}
                      className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--primary)]"
                    >
                      <option value="ANNOUNCEMENT">Announcement</option>
                      <option value="INFO">Info</option>
                      <option value="SUCCESS">Success</option>
                      <option value="WARNING">Warning</option>
                      <option value="ERROR">Error</option>
                      <option value="JOURNAL">Journal</option>
                      <option value="PROJECT">Project</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[var(--text-secondary)]">Priority</label>
                    <select
                      value={formPriority}
                      onChange={(e) => setFormPriority(e.target.value)}
                      className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--primary)]"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--text-secondary)]">Redirect Link (Optional)</label>
                  <input 
                    type="text"
                    value={formLink}
                    onChange={(e) => setFormLink(e.target.value)}
                    placeholder="e.g. /journal/my-post"
                    className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-4 bg-[var(--background)] p-3 rounded-lg border border-[var(--border-color)]">
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="formPublished"
                      checked={formPublished}
                      onChange={(e) => setFormPublished(e.target.checked)}
                      className="w-4 h-4 cursor-pointer accent-[var(--primary)] rounded" 
                    />
                    <label htmlFor="formPublished" className="text-xs font-medium cursor-pointer">Publish immediately</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="formPinned"
                      checked={formPinned}
                      onChange={(e) => setFormPinned(e.target.checked)}
                      className="w-4 h-4 cursor-pointer accent-[var(--primary)] rounded" 
                    />
                    <label htmlFor="formPinned" className="text-xs font-medium cursor-pointer">Pin to top</label>
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-[var(--border-color)]">
                  <Button variant="outline" type="button" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Alert"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Edit Modal */}
        {editingNotification && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[var(--card)] border border-[var(--border-color)] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-5 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--secondary-bg)]/50">
                <h3 className="font-bold text-lg text-[var(--text-main)] flex items-center gap-2">
                  <Edit2 className="w-5 h-5 text-[var(--primary)]" />
                  Edit Notification
                </h3>
                <button onClick={() => setEditingNotification(null)} className="text-[var(--text-secondary)] hover:text-white p-1 rounded-full"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleEditSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
                {formError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold rounded-lg flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 shrink-0" /> {formError}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--text-secondary)]">Title</label>
                  <input 
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. 🎉 New Blog Post Released!"
                    className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--text-secondary)]">Message</label>
                  <textarea 
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                    placeholder="Enter notification detail description..."
                    rows={3}
                    className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-[var(--primary)] resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[var(--text-secondary)]">Type</label>
                    <select
                      value={formType}
                      onChange={(e) => setFormType(e.target.value)}
                      className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--primary)]"
                    >
                      <option value="ANNOUNCEMENT">Announcement</option>
                      <option value="INFO">Info</option>
                      <option value="SUCCESS">Success</option>
                      <option value="WARNING">Warning</option>
                      <option value="ERROR">Error</option>
                      <option value="JOURNAL">Journal</option>
                      <option value="PROJECT">Project</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[var(--text-secondary)]">Priority</label>
                    <select
                      value={formPriority}
                      onChange={(e) => setFormPriority(e.target.value)}
                      className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--primary)]"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--text-secondary)]">Redirect Link (Optional)</label>
                  <input 
                    type="text"
                    value={formLink}
                    onChange={(e) => setFormLink(e.target.value)}
                    placeholder="e.g. /journal/my-post"
                    className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-4 bg-[var(--background)] p-3 rounded-lg border border-[var(--border-color)]">
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="formPublished"
                      checked={formPublished}
                      onChange={(e) => setFormPublished(e.target.checked)}
                      className="w-4 h-4 cursor-pointer accent-[var(--primary)] rounded" 
                    />
                    <label htmlFor="formPublished" className="text-xs font-medium cursor-pointer">Published</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="formPinned"
                      checked={formPinned}
                      onChange={(e) => setFormPinned(e.target.checked)}
                      className="w-4 h-4 cursor-pointer accent-[var(--primary)] rounded" 
                    />
                    <label htmlFor="formPinned" className="text-xs font-medium cursor-pointer">Pinned to top</label>
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-[var(--border-color)]">
                  <Button variant="outline" type="button" onClick={() => setEditingNotification(null)}>Cancel</Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirmId && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[var(--card)] border border-[var(--border-color)] rounded-2xl w-full max-w-sm shadow-2xl p-6 flex flex-col gap-4 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-lg text-[var(--text-main)]">Delete Notification?</h4>
                <p className="text-sm text-[var(--text-secondary)] mt-1.5">This action is permanent and cannot be undone. Are you sure?</p>
              </div>
              <div className="flex gap-3 justify-center pt-2">
                <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
                <Button variant="destructive" onClick={() => handleDelete(deleteConfirmId)}>Confirm Delete</Button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Bulk Delete Confirmation Modal */}
        {isBulkDeleteConfirmOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[var(--card)] border border-[var(--border-color)] rounded-2xl w-full max-w-sm shadow-2xl p-6 flex flex-col gap-4 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-lg text-[var(--text-main)]">Delete {selectedIds.length} Notifications?</h4>
                <p className="text-sm text-[var(--text-secondary)] mt-1.5">You are about to delete {selectedIds.length} notifications permanently. This cannot be undone.</p>
              </div>
              <div className="flex gap-3 justify-center pt-2">
                <Button variant="outline" onClick={() => setIsBulkDeleteConfirmOpen(false)}>Cancel</Button>
                <Button variant="destructive" onClick={handleBulkDelete}>Yes, Delete All</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
