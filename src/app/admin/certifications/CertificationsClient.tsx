"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SafeImage } from "@/components/ui/SafeImage";
import { 
  Plus, 
  Trash2, 
  Edit, 
  Link2, 
  Sparkles,
  CheckCircle2,
  XCircle,
  FileText
} from "lucide-react";
import { createCertificate, deleteCertificate, toggleCertificatePublish, updateCertificate } from "./actions";

type CertificateType = {
  id: string;
  title: string;
  issuer: string;
  date: string; // ISO string for client
  url?: string | null;
  image?: string | null;
  pdfUrl?: string | null;
  skills: string[];
  published: boolean;
};

export default function CertificationsClient({ initialCerts }: { initialCerts: CertificateType[] }) {
  const [certs, setCerts] = useState<CertificateType[]>(initialCerts);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [issuer, setIssuer] = useState("");
  const [category, setCategory] = useState("Frontend");
  const [credUrl, setCredUrl] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");

  const resetForm = () => {
    setTitle("");
    setIssuer("");
    setCategory("Frontend");
    setCredUrl("");
    setIssueDate("");
    setImageUrl("");
    setPdfUrl("");
    setEditingId(null);
    setShowAddForm(false);
  };

  const handleEdit = (cert: CertificateType) => {
    setTitle(cert.title);
    setIssuer(cert.issuer);
    setIssueDate(cert.date.substring(0, 10));
    setCredUrl(cert.url || "");
    setImageUrl(cert.image || "");
    setPdfUrl(cert.pdfUrl || "");
    setCategory(cert.skills[0] || "Frontend");
    setEditingId(cert.id);
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this certificate?")) {
      const res = await deleteCertificate(id);
      if (res.success) {
        setCerts(prev => prev.filter(c => c.id !== id));
      } else {
        alert("Failed to delete certificate.");
      }
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    const res = await toggleCertificatePublish(id, !currentStatus);
    if (res.success) {
      setCerts(prev => prev.map(c => c.id === id ? { ...c, published: !currentStatus } : c));
    } else {
      alert("Failed to toggle publish status.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !issuer.trim() || !issueDate) return;

    setIsSubmitting(true);
    try {
      const data = {
        title,
        issuer,
        date: new Date(issueDate),
        url: credUrl || undefined,
        image: imageUrl || undefined,
        pdfUrl: pdfUrl || undefined,
        skills: [category]
      };

      if (editingId) {
        const res = await updateCertificate(editingId, data);
        if (res.success) {
          setCerts(prev => prev.map(c => c.id === editingId ? { ...c, ...data, date: data.date.toISOString(), published: c.published } : c));
          resetForm();
        } else {
          alert("Failed to update.");
        }
      } else {
        const res = await createCertificate(data);
        if (res.success && res.id) {
          const newCert: CertificateType = {
            id: res.id,
            ...data,
            date: data.date.toISOString(),
            url: data.url || null,
            image: data.image || null,
            pdfUrl: data.pdfUrl || null,
            published: true
          };
          setCerts([newCert, ...certs]);
          resetForm();
        } else {
          alert("Failed to create.");
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-heading text-[var(--text-main)] tracking-tight">
            Credentials Manager
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Add, modify, or archive your professional credentials.
          </p>
        </div>

        <Button 
          onClick={() => { resetForm(); setShowAddForm(!showAddForm); }}
          className="h-10 px-5 rounded-xl bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Certificate
        </Button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-[var(--card)] border border-[var(--primary)]/20 p-5 rounded-2xl space-y-4 shadow-md max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--primary)] pb-2 border-b border-[var(--border-color)]/60">
            <Sparkles className="w-4.5 h-4.5" />
            <span>{editingId ? "Edit Certificate" : "Upload Certificate Credentials"}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--text-secondary)]">Certificate Title</label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-[var(--background)] border border-[var(--border-color)] px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-medium" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--text-secondary)]">Issuing Organization</label>
              <input type="text" required value={issuer} onChange={(e) => setIssuer(e.target.value)} className="w-full bg-[var(--background)] border border-[var(--border-color)] px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-medium" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--text-secondary)]">Verification URL (Optional)</label>
              <input type="text" value={credUrl} onChange={(e) => setCredUrl(e.target.value)} className="w-full bg-[var(--background)] border border-[var(--border-color)] px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-medium" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--text-secondary)]">Category</label>
              <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-[var(--background)] border border-[var(--border-color)] px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-medium" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--text-secondary)]">Issue Date</label>
              <input type="date" required value={issueDate} onChange={(e) => setIssueDate(e.target.value)} className="w-full bg-[var(--background)] border border-[var(--border-color)] px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-medium" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--text-secondary)]">Image URL (Optional)</label>
              <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full bg-[var(--background)] border border-[var(--border-color)] px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-medium" />
            </div>
            
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-[var(--text-secondary)]">PDF URL (Optional)</label>
              <input type="text" value={pdfUrl} onChange={(e) => setPdfUrl(e.target.value)} className="w-full bg-[var(--background)] border border-[var(--border-color)] px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-medium" />
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-2 border-t border-[var(--border-color)]/60">
            <Button variant="outline" type="button" size="sm" onClick={resetForm} className="rounded-lg text-xs font-semibold cursor-pointer">
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={isSubmitting} className="rounded-lg text-xs font-semibold cursor-pointer">
              {isSubmitting ? "Saving..." : (editingId ? "Update Certificate" : "Publish Certificate")}
            </Button>
          </div>
        </form>
      )}

      <div className="bg-[var(--card)] border border-[var(--border-color)]/80 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[var(--secondary-bg)]/40 border-b border-[var(--border-color)]/60 text-[var(--text-secondary)] font-bold">
                <th className="p-4">Certificate Details</th>
                <th className="p-4">Issuer Body</th>
                <th className="p-4">Issued Date</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)] text-[var(--text-secondary)]">
              {certs.map((c) => (
                <tr key={c.id} className={`hover:bg-[var(--secondary-bg)]/10 transition-colors ${!c.published ? "opacity-60" : ""}`}>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-10 relative rounded overflow-hidden bg-[var(--secondary-bg)] border border-[var(--border-color)]/50 shrink-0">
                        {c.image && <SafeImage src={c.image} alt={c.title} fill className="object-cover" />}
                      </div>
                      <div className="space-y-0.5 overflow-hidden">
                        <div className="font-semibold text-[var(--text-main)] truncate max-w-xs">{c.title}</div>
                        <div className="text-[9px] text-[var(--text-muted)] font-bold uppercase tracking-wider">{c.skills[0] || "General"}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-semibold text-[var(--text-main)]">{c.issuer}</td>
                  <td className="p-4">{new Date(c.date).toLocaleDateString()}</td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => handleTogglePublish(c.id, c.published)}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${c.published ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'}`}
                    >
                      {c.published ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {c.published ? 'Published' : 'Hidden'}
                    </button>
                  </td>
                  <td className="p-4 text-right space-x-1 whitespace-nowrap">
                    {c.pdfUrl && (
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg" title="View PDF" asChild>
                        <a href={c.pdfUrl} target="_blank" rel="noreferrer">
                          <FileText className="w-4 h-4 text-purple-500" />
                        </a>
                      </Button>
                    )}
                    {c.url && (
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg" title="Open Verification Link" asChild>
                        <a href={c.url} target="_blank" rel="noreferrer">
                          <Link2 className="w-4 h-4 text-blue-500" />
                        </a>
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg" title="Edit Certificate" onClick={() => handleEdit(c)}>
                      <Edit className="w-4 h-4 text-[var(--text-main)]" />
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
