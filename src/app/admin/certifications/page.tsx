"use client";

import { useState } from "react";
import { mockCertificates, Certificate } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { SafeImage } from "@/components/ui/SafeImage";
import { 
  Award, 
  Plus, 
  Trash2, 
  Edit, 
  Link2, 
  Calendar, 
  ShieldCheck, 
  Sparkles,
  FileText
} from "lucide-react";

export default function AdminCertificationsPage() {
  const [certs, setCerts] = useState<Certificate[]>(mockCertificates);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [newTitle, setNewTitle] = useState("");
  const [newOrg, setNewOrg] = useState("");
  const [newCategory, setNewCategory] = useState("Frontend");
  const [newCredId, setNewCredId] = useState("");
  const [newIssueDate, setNewIssueDate] = useState("2026-07-14");

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this certificate from your public portfolio?")) {
      setCerts(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleAddCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newOrg.trim()) return;

    const newCertObj: Certificate = {
      id: `cert-${Date.now()}`,
      title: newTitle,
      organization: newOrg,
      issueDate: newIssueDate,
      credentialId: newCredId || undefined,
      skillsGained: ["TypeScript", newCategory],
      imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=300&auto=format&fit=crop",
      verificationUrl: "https://verification.example.com",
      downloadUrl: "#",
      category: newCategory
    };

    setCerts(prev => [newCertObj, ...prev]);
    setNewTitle("");
    setNewOrg("");
    setNewCredId("");
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-heading text-[var(--text-main)] tracking-tight">
            Credentials Manager
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Add, modify, or archive your professional credentials, cloud badges, and PDF certifications.
          </p>
        </div>

        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="h-10 px-5 rounded-xl bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Certificate
        </Button>
      </div>

      {/* Add Certificate Form */}
      {showAddForm && (
        <form onSubmit={handleAddCert} className="bg-[var(--card)] border border-[var(--primary)]/20 p-5 rounded-2xl space-y-4 shadow-md max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--primary)] pb-2 border-b border-[var(--border-color)]/60">
            <Sparkles className="w-4.5 h-4.5" />
            <span>Upload Certificate Credentials</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--text-secondary)]" htmlFor="certTitle">Certificate Title</label>
              <input
                id="certTitle"
                type="text"
                required
                placeholder="e.g. AWS Solutions Architect"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-[var(--background)] border border-[var(--border-color)] px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--text-secondary)]" htmlFor="certOrg">Issuing Organization</label>
              <input
                id="certOrg"
                type="text"
                required
                placeholder="e.g. Amazon Web Services"
                value={newOrg}
                onChange={(e) => setNewOrg(e.target.value)}
                className="w-full bg-[var(--background)] border border-[var(--border-color)] px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--text-secondary)]" htmlFor="certCredId">Credential ID (Optional)</label>
              <input
                id="certCredId"
                type="text"
                placeholder="e.g. AWS-ASA-9988"
                value={newCredId}
                onChange={(e) => setNewCredId(e.target.value)}
                className="w-full bg-[var(--background)] border border-[var(--border-color)] px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--text-secondary)]" htmlFor="certCategory">Category</label>
              <select
                id="certCategory"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full bg-[var(--background)] border border-[var(--border-color)] px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-semibold cursor-pointer"
              >
                <option value="Frontend">Frontend</option>
                <option value="Cloud & DevOps">Cloud & DevOps</option>
                <option value="Management">Management</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--text-secondary)]" htmlFor="certIssueDate">Issue Date</label>
              <input
                id="certIssueDate"
                type="date"
                required
                value={newIssueDate}
                onChange={(e) => setNewIssueDate(e.target.value)}
                className="w-full bg-[var(--background)] border border-[var(--border-color)] px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-medium"
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-2 border-t border-[var(--border-color)]/60">
            <Button variant="outline" type="button" size="sm" onClick={() => setShowAddForm(false)} className="rounded-lg text-xs font-semibold cursor-pointer">
              Cancel
            </Button>
            <Button type="submit" size="sm" className="rounded-lg text-xs font-semibold cursor-pointer">
              Publish Certificate
            </Button>
          </div>
        </form>
      )}

      {/* Certifications Table Logs */}
      <div className="bg-[var(--card)] border border-[var(--border-color)]/80 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[var(--secondary-bg)]/40 border-b border-[var(--border-color)]/60 text-[var(--text-secondary)] font-bold">
                <th className="p-4">Certificate Details</th>
                <th className="p-4">Issuer Body</th>
                <th className="p-4">Credential ID</th>
                <th className="p-4">Issued Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)] text-[var(--text-secondary)]">
              {certs.map((c) => (
                <tr key={c.id} className="hover:bg-[var(--secondary-bg)]/10 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-10 relative rounded overflow-hidden bg-[var(--secondary-bg)] border border-[var(--border-color)]/50 shrink-0">
                        <SafeImage src={c.imageUrl} alt={c.title} fill className="object-cover" />
                      </div>
                      <div className="space-y-0.5 overflow-hidden">
                        <div className="font-semibold text-[var(--text-main)] truncate max-w-xs">{c.title}</div>
                        <div className="text-[9px] text-[var(--text-muted)] font-bold uppercase tracking-wider">{c.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-semibold text-[var(--text-main)]">{c.organization}</td>
                  <td className="p-4 font-mono font-bold text-[var(--text-secondary)]">{c.credentialId || "N/A"}</td>
                  <td className="p-4">{c.issueDate}</td>
                  <td className="p-4 text-right space-x-1 whitespace-nowrap">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg" title="Open Verification Link" asChild>
                      <a href={c.verificationUrl} target="_blank" rel="noreferrer">
                        <Link2 className="w-4 h-4 text-blue-500" />
                      </a>
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg" title="Delete Certificate" onClick={() => handleDelete(c.id)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
