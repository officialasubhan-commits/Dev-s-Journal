"use client";

import { useState, useTransition } from "react";
import { createBackup, deleteBackup, restoreBackup } from "./actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, Download, Trash2, Plus, Play, CheckCircle, AlertCircle, Clock, Archive, Eye } from "lucide-react";
import { Backup } from "@prisma/client";

export function BackupManagerClient({ initialBackups }: { initialBackups: Backup[] }) {
  const [backups, setBackups] = useState<Backup[]>(initialBackups);
  const [isPending, startTransition] = useTransition();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [activePreview, setActivePreview] = useState<any | null>(null);
  
  const totalFootprint = backups.reduce((acc, b) => acc + b.size, 0);

  const triggerToast = (type: "success" | "error", text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;
    
    startTransition(async () => {
      const res = await createBackup({ name: newName, description: newDesc });
      if (res?.error) {
        triggerToast("error", res.error);
      } else {
        triggerToast("success", res.success || "Backup created!");
        setShowCreateModal(false);
        setNewName("");
        setNewDesc("");
        window.location.reload();
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this backup snapshot?")) return;
    
    startTransition(async () => {
      const res = await deleteBackup(id);
      if (res?.error) {
        triggerToast("error", res.error);
      } else {
        triggerToast("success", res.success || "Backup deleted.");
        window.location.reload();
      }
    });
  };

  const handleRestore = async (backupItem: Backup) => {
    if (!confirm(`WARNING: Restoring the database to "${backupItem.name}" will overwrite all current website content. A safety restore checkpoint auto-backup will be created. Do you want to proceed?`)) return;

    startTransition(async () => {
      const res = await restoreBackup(backupItem.id);
      if (res?.error) {
        triggerToast("error", res.error);
      } else {
        triggerToast("success", res.success || "Website restored!");
        window.location.reload();
      }
    });
  };

  const previewBackup = (backupItem: Backup) => {
    try {
      const data = JSON.parse(backupItem.payload);
      setActivePreview({
        name: backupItem.name,
        date: new Date(backupItem.createdAt).toLocaleString(),
        summary: {
          settings: data.brandSettings?.length || 0,
          posts: data.post?.length || 0,
          categories: data.category?.length || 0,
          comments: data.comment?.length || 0,
          projects: data.project?.length || 0,
          skills: data.skill?.length || 0,
          courses: data.course?.length || 0,
          books: data.book?.length || 0,
          certifications: data.certification?.length || 0,
          albums: data.album?.length || 0,
          images: data.galleryImage?.length || 0,
          messages: data.message?.length || 0,
          notifications: data.notification?.length || 0,
          maintenanceLogs: data.maintenanceLog?.length || 0,
          users: data.user?.length || 0,
        }
      });
    } catch (error) {
      triggerToast("error", "Failed to parse backup contents.");
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const inputCls = "w-full bg-[var(--background)] border border-[var(--border-color)] rounded-lg px-4 py-2.5 text-[var(--text-main)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all font-sans";
  const textareaCls = `${inputCls} resize-none`;
  const labelCls = "block text-sm font-semibold text-[var(--text-secondary)] mb-1.5 font-sans";

  return (
    <div className="space-y-8 relative">
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

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]">Backup & Recovery</h1>
          <p className="text-[var(--text-secondary)] mt-1 text-sm">Create and restore database backup snapshot states instantly. Database rollbacks are transactional.</p>
        </div>
        <Button 
          onClick={() => setShowCreateModal(true)} 
          disabled={isPending}
          className="bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 px-5 transition-all flex items-center gap-2 cursor-pointer font-sans font-medium h-11 rounded-lg self-start sm:self-center"
        >
          <Plus className="w-5 h-5" />
          Create Backup
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="border-[var(--border-color)]">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)]">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Total Backups</p>
              <p className="text-2xl font-bold text-[var(--text-main)] mt-1">{backups.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[var(--border-color)]">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--secondary)]/10 flex items-center justify-center text-[var(--secondary)]">
              <Archive className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Storage Footprint</p>
              <p className="text-2xl font-bold text-[var(--text-main)] mt-1">{formatBytes(totalFootprint)}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[var(--border-color)]">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-600 dark:text-green-400">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Last Backup Created</p>
              <p className="text-sm font-bold text-[var(--text-main)] mt-1.5">
                {backups.length > 0 ? new Date(backups[0].createdAt).toLocaleString() : "Never"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-[var(--border-color)] overflow-hidden">
        <CardHeader className="bg-[var(--background)]/50 border-b border-[var(--border-color)]">
          <CardTitle className="text-xl font-heading flex items-center gap-2">Backup History</CardTitle>
          <CardDescription>All manual and automatic backups stored in your Neon database.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-[var(--text-muted)] uppercase bg-[var(--background)]/50 border-b border-[var(--border-color)] font-sans">
                <tr>
                  <th className="px-6 py-4 font-semibold">Snapshot Name</th>
                  <th className="px-6 py-4 font-semibold">Date Created</th>
                  <th className="px-6 py-4 font-semibold">Size</th>
                  <th className="px-6 py-4 font-semibold">Origin</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {backups.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-[var(--text-muted)] font-sans">
                      No backups found. Click "Create Backup" to generate your first snapshot.
                    </td>
                  </tr>
                ) : (
                  backups.map((b) => (
                    <tr key={b.id} className="hover:bg-[var(--background)]/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-[var(--text-main)] font-sans">{b.name}</div>
                        {b.description && (
                          <div className="text-xs text-[var(--text-secondary)] mt-0.5 max-w-sm truncate">{b.description}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-[var(--text-secondary)] font-sans">
                        {new Date(b.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-[var(--text-secondary)] font-sans font-medium">
                        {formatBytes(b.size)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold font-sans ${
                          b.isAuto 
                            ? "bg-purple-100 text-purple-800 dark:bg-purple-950/30 dark:text-purple-300 border border-purple-200 dark:border-purple-900/30" 
                            : "bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-300 border border-blue-200 dark:border-blue-900/30"
                        }`}>
                          {b.isAuto ? "Auto" : "Manual"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold font-sans ${
                          b.status === "SUCCESS" 
                            ? "bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-300 border border-green-200 dark:border-green-900/30" 
                            : "bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-300 border border-red-200 dark:border-red-900/30"
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => previewBackup(b)}
                            className="h-8 w-8 p-0"
                            title="Preview Content"
                          >
                            <Eye className="w-4 h-4 text-[var(--text-secondary)]" />
                          </Button>
                          <a 
                            href={`/api/admin/backups/${b.id}/download`}
                            download
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0"
                            title="Download JSON Snapshot"
                          >
                            <Download className="w-4 h-4 text-blue-500" />
                          </a>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleRestore(b)}
                            disabled={isPending}
                            className="h-8 w-8 p-0"
                            title="Restore Snapshot"
                          >
                            <Play className="w-4 h-4 text-green-500" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDelete(b.id)}
                            disabled={isPending}
                            className="h-8 w-8 p-0"
                            title="Delete Snapshot"
                          >
                            <Trash2 className="w-4 h-4 text-[var(--error)]" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md border-[var(--border-color)]">
            <CardHeader>
              <CardTitle className="text-xl font-heading">Create Snapshot</CardTitle>
              <CardDescription>Store the current website state as a restorable snapshot.</CardDescription>
            </CardHeader>
            <form onSubmit={handleCreate}>
              <CardContent className="space-y-4">
                <div>
                  <label className={labelCls}>Backup Name</label>
                  <input 
                    value={newName} 
                    onChange={(e) => setNewName(e.target.value)} 
                    placeholder="e.g. Pre-Launch Checkpoint" 
                    required 
                    className={inputCls} 
                  />
                </div>
                <div>
                  <label className={labelCls}>Description (Optional)</label>
                  <textarea 
                    value={newDesc} 
                    onChange={(e) => setNewDesc(e.target.value)} 
                    placeholder="Brief notes about this snapshot..." 
                    rows={3} 
                    className={textareaCls} 
                  />
                </div>
              </CardContent>
              <div className="flex justify-end gap-3 p-6 border-t border-[var(--border-color)] bg-[var(--background)]/30">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowCreateModal(false)}
                  className="font-sans"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isPending || !newName}
                  className="bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 font-sans"
                >
                  {isPending ? "Generating..." : "Generate Backup"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {activePreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <Card className="w-full max-w-lg border-[var(--border-color)] animate-in fade-in zoom-in-95 duration-150">
            <CardHeader className="border-b border-[var(--border-color)]">
              <CardTitle className="text-xl font-heading flex items-center gap-2">
                <Eye className="w-5 h-5 text-[var(--primary)]" />
                Snapshot Preview
              </CardTitle>
              <CardDescription>Content summaries in "{activePreview.name}"</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 max-h-[350px] overflow-y-auto space-y-3 font-sans">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-[var(--background)] rounded-lg border border-[var(--border-color)]">
                  <span className="block font-semibold text-[var(--text-secondary)] uppercase text-[10px]">Settings</span>
                  <span className="text-lg font-bold">{activePreview.summary.settings} Rows</span>
                </div>
                <div className="p-3 bg-[var(--background)] rounded-lg border border-[var(--border-color)]">
                  <span className="block font-semibold text-[var(--text-secondary)] uppercase text-[10px]">Journal Posts</span>
                  <span className="text-lg font-bold">{activePreview.summary.posts} Posts</span>
                </div>
                <div className="p-3 bg-[var(--background)] rounded-lg border border-[var(--border-color)]">
                  <span className="block font-semibold text-[var(--text-secondary)] uppercase text-[10px]">Projects</span>
                  <span className="text-lg font-bold">{activePreview.summary.projects} Projects</span>
                </div>
                <div className="p-3 bg-[var(--background)] rounded-lg border border-[var(--border-color)]">
                  <span className="block font-semibold text-[var(--text-secondary)] uppercase text-[10px]">Gallery Images</span>
                  <span className="text-lg font-bold">{activePreview.summary.images} Photos</span>
                </div>
                <div className="p-3 bg-[var(--background)] rounded-lg border border-[var(--border-color)]">
                  <span className="block font-semibold text-[var(--text-secondary)] uppercase text-[10px]">Contact Messages</span>
                  <span className="text-lg font-bold">{activePreview.summary.messages} Inbox</span>
                </div>
                <div className="p-3 bg-[var(--background)] rounded-lg border border-[var(--border-color)]">
                  <span className="block font-semibold text-[var(--text-secondary)] uppercase text-[10px]">Registered Users</span>
                  <span className="text-lg font-bold">{activePreview.summary.users} Accounts</span>
                </div>
                <div className="p-3 bg-[var(--background)] rounded-lg border border-[var(--border-color)] col-span-2">
                  <span className="block font-semibold text-[var(--text-secondary)] uppercase text-[10px]">Other Entities</span>
                  <span className="font-semibold text-xs text-[var(--text-muted)]">
                    Comments ({activePreview.summary.comments}) | Skills ({activePreview.summary.skills}) | Courses ({activePreview.summary.courses}) | Books ({activePreview.summary.books}) | Certs ({activePreview.summary.certifications}) | Notifications ({activePreview.summary.notifications})
                  </span>
                </div>
              </div>
            </CardContent>
            <div className="flex justify-end p-6 border-t border-[var(--border-color)] bg-[var(--background)]/30">
              <Button 
                onClick={() => setActivePreview(null)}
                className="bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 font-sans"
              >
                Close Preview
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
