"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Check } from "lucide-react";
import Image from "next/image";

export function PhotoManager() {
  const [images, setImages] = useState<{url: string, alt: string}[]>([]);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setLoading(true);
    // Simulate upload delay
    await new Promise(r => setTimeout(r, 1000));
    
    const newImage = {
      url: URL.createObjectURL(e.target.files[0]),
      alt: ""
    };
    
    setImages(prev => [...prev, newImage]);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-[var(--border-color)] rounded-xl p-12 text-center bg-[var(--background)] hover:border-[var(--primary)] transition-colors relative">
        <input 
          type="file" 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleUpload}
          accept="image/*"
        />
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 bg-[var(--primary)]/10 rounded-full flex items-center justify-center text-[var(--primary)]">
            <Upload className="w-8 h-8" />
          </div>
          <div>
            <p className="text-lg font-medium">Drag & Drop images here</p>
            <p className="text-sm text-[var(--text-secondary)]">or click to browse your computer</p>
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex items-center space-x-3 text-[var(--text-secondary)] animate-pulse">
          <span>Processing image...</span>
        </div>
      )}

      {images.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Uploaded Media</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {images.map((img, i) => (
              <div key={i} className="flex bg-[var(--card)] border border-[var(--border-color)] rounded-lg overflow-hidden">
                <div className="w-32 h-32 bg-[var(--border-color)] flex-shrink-0 relative">
                  <Image src={img.url} alt={img.alt || "Uploaded image"} fill className="object-cover" />
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <label className="text-xs font-medium text-[var(--text-secondary)] flex items-center space-x-1">
                      <span>Alt Text</span>
                    </label>
                    <textarea 
                      className="w-full text-sm bg-transparent border-b border-[var(--border-color)] focus:outline-none focus:border-[var(--primary)] resize-none mt-1"
                      defaultValue={img.alt}
                      rows={2}
                      placeholder="Describe this image..."
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button size="sm" variant="outline" className="h-7 text-xs text-[var(--error)] border-[var(--error)] hover:bg-[var(--error)]/10">Remove</Button>
                    <Button size="sm" className="h-7 text-xs"><Check className="w-3 h-3 mr-1" /> Save</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
