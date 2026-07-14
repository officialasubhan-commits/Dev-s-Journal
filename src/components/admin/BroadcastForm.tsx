"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/client/CardComponents";
import { broadcastAnnouncement } from "@/app/admin/actions";
import { Megaphone, Loader2 } from "lucide-react";

export function BroadcastForm() {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [targetType, setTargetType] = useState<"ALL" | "ROLE" | "USER">("ALL");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");

    const formData = new FormData(e.currentTarget);
    try {
      const res = await broadcastAnnouncement(formData);
      if (res.error) {
        setError(res.error);
      } else {
        setSuccessMsg(`Successfully notified ${res.notifiedCount} users. (Created: ${res.createdCount}, Failed: ${res.failedCount})`);
        (e.target as HTMLFormElement).reset();
        setTargetType("ALL");
      }
    } catch (err) {
      setError("Failed to broadcast announcement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-[var(--card)] border-[var(--border-color)]">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-[var(--primary)]" />
          <CardTitle>Send Notification</CardTitle>
        </div>
        <CardDescription>Send targeted notifications to your users.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-red-500 text-sm bg-red-500/10 p-2 rounded">{error}</div>}
          {successMsg && <div className="text-green-500 text-sm bg-green-500/10 p-2 rounded">{successMsg}</div>}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Target Audience</label>
              <select 
                name="targetType"
                value={targetType}
                onChange={(e) => setTargetType(e.target.value as "ALL" | "ROLE" | "USER")}
                className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[var(--primary)]"
              >
                <option value="ALL">All Users</option>
                <option value="ROLE">By Role</option>
                <option value="USER">Specific User</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Notification Type</label>
              <select 
                name="type"
                defaultValue="INFO"
                className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[var(--primary)]"
              >
                <option value="INFO">Info</option>
                <option value="SUCCESS">Success</option>
                <option value="WARNING">Warning</option>
                <option value="ERROR">Error</option>
                <option value="ANNOUNCEMENT">Announcement</option>
              </select>
            </div>
          </div>

          {targetType === "ROLE" && (
            <div>
              <label className="text-sm font-medium mb-1 block">Select Role</label>
              <select 
                name="targetRole"
                className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[var(--primary)]"
              >
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          )}

          {targetType === "USER" && (
            <div>
              <label className="text-sm font-medium mb-1 block">User Email or ID</label>
              <input 
                type="text" 
                name="targetUserId"
                required
                placeholder="user@example.com"
                className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[var(--primary)]"
              />
            </div>
          )}

          <div>
            <label className="text-sm font-medium mb-1 block">Title (e.g. 🎉 Website Announcement)</label>
            <input 
              type="text" 
              name="title" 
              required 
              className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[var(--primary)]"
              placeholder="Enter announcement title..."
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Message</label>
            <textarea 
              name="message" 
              required 
              rows={3}
              className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[var(--primary)]"
              placeholder="What do you want to announce?"
            ></textarea>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Link (Optional)</label>
            <input 
              type="text" 
              name="link" 
              className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[var(--primary)]"
              placeholder="/blog/new-feature"
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Send Notification"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
