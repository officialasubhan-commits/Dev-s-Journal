"use client";

import { ImageUploadCropper } from "@/components/ui/ImageUploadCropper";
import { uploadImages } from "./actions";
import { useState } from "react";

export function GalleryUploadButton() {
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadSuccess = async (url: string) => {
    setIsUploading(true);
    // Just upload a single image for now
    await uploadImages([url], null);
    setIsUploading(false);
  };

  return (
    <div className="w-[200px]">
      <ImageUploadCropper 
        value={undefined}
        onChange={handleUploadSuccess}
        accept="image/*,video/mp4,video/webm"
        label="Upload Media"
      />
    </div>
  );
}
