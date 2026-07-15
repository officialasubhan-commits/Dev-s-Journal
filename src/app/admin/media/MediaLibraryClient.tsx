"use client";

import { useState, useRef } from "react";
import { deleteMediaAsset } from "./actions";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Search, Trash2, Copy, Check, UploadCloud, FileText, Image as ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";

interface MediaAsset {
  id: string;
  url: string;
  filename: string;
  fileSize: number;
  mimeType: string;
  createdAt: Date;
}

export function MediaLibraryClient({ initialAssets }: { initialAssets: MediaAsset[] }) {
  const router = useRouter();
  const [assets, setAssets] = useState(initialAssets);
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Synchronize when initialAssets change
  useState(() => {
    setAssets(initialAssets);
  });

  const handleCopy = (id: string, url: string) => {
    // Construct full URL if relative path
    const fullUrl = url.startsWith("http") ? url : `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this media asset? This action is permanent.")) return;
    setIsDeletingId(id);
    try {
      const res = await deleteMediaAsset(id);
      if (res?.success) {
        setAssets(assets.filter(a => a.id !== id));
        router.refresh();
      } else {
        alert(res?.error || "Failed to delete asset");
      }
    } catch (err: any) {
      alert(err?.message || "Failed to delete asset");
    } finally {
      setIsDeletingId(null);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsUploading(true);

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Upload failed");
      }

      const data = await res.json();
      // Reload assets
      router.refresh();
      window.location.reload(); // Refresh client view to fetch new row
    } catch (err: any) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const filteredAssets = assets.filter(a =>
    a.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.mimeType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-6">
      
      {/* Top Search & Upload Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search assets by name or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[var(--card)] border border-[var(--border-color)]/80 pl-10 pr-4 py-2.5 rounded-xl text-xs focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] shadow-sm"
          />
        </div>

        {/* Upload Trigger */}
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*,video/mp4,video/webm"
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="h-10 px-5 rounded-xl bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-sm w-full md:w-auto"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4.5 h-4.5 animate-spin" />
                <span>Uploading Asset...</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-4.5 h-4.5" />
                <span>Upload Media</span>
              </>
            )}
          </Button>
        </div>

      </div>

      {/* Media Grid */}
      {filteredAssets.length === 0 ? (
        <div className="border-2 border-dashed border-[var(--border-color)]/80 rounded-2xl p-12 text-center text-[var(--text-muted)] space-y-2 bg-[var(--card)]/40">
          <ImageIcon className="w-10 h-10 mx-auto text-[var(--text-muted)]/60" />
          <h3 className="font-semibold text-xs text-[var(--text-main)]">No media assets found</h3>
          <p className="text-[10px]">Try uploading a new image or file using the button above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredAssets.map(asset => (
            <div key={asset.id} className="bg-[var(--card)] border border-[var(--border-color)]/85 rounded-2xl overflow-hidden group hover:border-[var(--primary)]/30 transition-all flex flex-col shadow-sm">
              
              {/* Asset Box */}
              <div className="aspect-square relative bg-[var(--secondary-bg)] border-b border-[var(--border-color)]/70 flex items-center justify-center overflow-hidden">
                {asset.mimeType.startsWith("image/") ? (
                  <Image
                    src={asset.url}
                    alt={asset.filename}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-[var(--text-muted)]">
                    <FileText className="w-10 h-10 text-[var(--text-muted)]/60" />
                    <span className="text-[9px] font-bold tracking-wider uppercase">{asset.mimeType.split("/")[1] || "File"}</span>
                  </div>
                )}

                {/* Overlays actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    onClick={() => handleCopy(asset.id, asset.url)}
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8 rounded-lg"
                    title="Copy URL"
                  >
                    {copiedId === asset.id ? (
                      <Check className="h-4.5 w-4.5 text-green-500" />
                    ) : (
                      <Copy className="h-4.5 w-4.5" />
                    )}
                  </Button>
                  <Button
                    onClick={() => handleDelete(asset.id)}
                    disabled={isDeletingId === asset.id}
                    size="icon"
                    variant="destructive"
                    className="h-8 w-8 rounded-lg"
                    title="Delete Asset"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </Button>
                </div>
              </div>

              {/* Title Info */}
              <div className="p-3.5 space-y-1 bg-[var(--card)] flex-1 flex flex-col justify-between">
                <p className="text-[11px] font-semibold text-[var(--text-main)] truncate" title={asset.filename}>
                  {asset.filename}
                </p>
                <div className="flex justify-between items-center text-[9px] text-[var(--text-secondary)] font-medium">
                  <span>{formatSize(asset.fileSize)}</span>
                  <span>{new Date(asset.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
