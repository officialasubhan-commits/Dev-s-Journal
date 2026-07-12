"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Image from "next/image";
import { ImageUploadCropper } from "@/components/ui/ImageUploadCropper";

interface MediaUploaderProps {
  value: string | string[];
  onChange: (url: string) => void;
  onRemove: (url: string) => void;
  multiple?: boolean;
  aspect?: number;
}

export function MediaUploader({ value, onChange, onRemove, multiple = false, aspect }: MediaUploaderProps) {
  const currentValues = Array.isArray(value) ? value : (value ? [value] : []);

  return (
    <div className="space-y-4 mb-4">
      <div className="flex flex-wrap gap-4">
        {currentValues.map((url) => (
          <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden border border-[var(--border-color)] bg-[var(--background)] flex items-center justify-center">
            <div className="absolute top-2 right-2 z-10">
              <Button type="button" onClick={() => onRemove(url)} variant="destructive" size="icon" className="h-6 w-6">
                <X className="h-4 w-4" />
              </Button>
            </div>
            {url.match(/\.(mp4|webm|ogg)$/i) ? (
              <video src={url} className="object-cover w-full h-full" controls />
            ) : (
              <Image fill className="object-contain" alt="Image" src={url} />
            )}
          </div>
        ))}
      </div>

      {(!multiple && currentValues.length > 0) ? null : (
        <ImageUploadCropper 
          value={undefined}
          onChange={onChange}
          aspect={aspect}
          accept="image/*,video/mp4,video/webm"
          label="Upload Media"
        />
      )}
    </div>
  );
}
