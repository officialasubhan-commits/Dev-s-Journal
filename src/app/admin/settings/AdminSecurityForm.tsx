"use client";

import { useState } from "react";
import { updateAdminSecurity } from "./securityActions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldAlert, CheckCircle } from "lucide-react";

export function AdminSecurityForm({ currentEmail }: { currentEmail: string }) {
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const inputCls = "w-full bg-[var(--background)] border border-[var(--border-color)] rounded-lg px-4 py-2.5 text-[var(--text-main)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all";
  const labelCls = "block text-sm font-semibold text-[var(--text-secondary)] mb-1.5";
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const result = await updateAdminSecurity(formData);
    
    if (result.error) {
      setMessage({ type: "error", text: result.error });
    } else if (result.success) {
      setMessage({ type: "success", text: result.success });
      // Reset sensitive fields
      (e.target as HTMLFormElement).reset();
    }
    
    setIsLoading(false);
  };

  return (
    <Card id="security" className="border-[var(--border-color)] overflow-hidden border-orange-200">
      <CardHeader className="bg-orange-50/50 border-b border-orange-100">
        <CardTitle className="flex items-center gap-2 text-xl font-heading text-orange-600"><ShieldAlert className="w-5 h-5" /> Admin Security</CardTitle>
        <CardDescription className="text-orange-500/70">Securely update your admin email and password.</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {message && (
            <div className={`p-3 rounded text-sm ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {message.text}
            </div>
          )}

          <div>
            <label className={labelCls}>Current Password (Required)</label>
            <input name="currentPassword" type="password" required className={inputCls} placeholder="Enter current password to authorize changes" />
          </div>

          <hr className="border-[var(--border-color)] my-4" />

          <div>
            <label className={labelCls}>New Admin Email</label>
            <input name="newEmail" type="email" defaultValue={currentEmail} className={inputCls} placeholder="New email address" />
          </div>

          <div>
            <label className={labelCls}>New Password</label>
            <input name="newPassword" type="password" className={inputCls} placeholder="Leave blank to keep current password" />
            <p className="text-xs text-[var(--text-muted)] mt-1">Must be at least 8 characters long.</p>
          </div>

          <Button type="submit" disabled={isLoading} className="mt-2 bg-orange-600 text-white hover:bg-orange-700 px-6 transition-all flex items-center gap-2">
            <CheckCircle className="w-4 h-4" /> 
            {isLoading ? "Saving..." : "Save Security Settings"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
