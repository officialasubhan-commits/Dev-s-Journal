"use client";

import { useState, useEffect } from "react";
import { ImageUploadCropper } from "@/components/ui/ImageUploadCropper";

interface ImageManagerProps {
  name: string;
  defaultValue?: string;
  label?: string;
  aspect?: number;
  circularCrop?: boolean;
}

export function ImageManager({ 
  name, 
  defaultValue = "", 
  label = "Upload Image", 
  aspect, 
  circularCrop 
}: ImageManagerProps) {
  const [url, setUrl] = useState(defaultValue);

  useEffect(() => {
    setUrl(defaultValue);
  }, [defaultValue]);

  return (
    <div className="space-y-2">
      {/* Hidden input to submit the image url string via FormData */}
      <input type="hidden" name={name} value={url} />
      
      <ImageUploadCropper
        value={url}
        onChange={(newUrl) => setUrl(newUrl)}
        onRemove={() => setUrl("")}
        aspect={aspect}
        circularCrop={circularCrop}
        label={label}
        className="w-full"
      />
    </div>
  );
}
