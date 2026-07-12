"use client";

import React, { useState, useCallback, useRef } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '@/lib/cropImage';
import { Button } from '@/components/ui/button';
import { UploadCloud, X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadCropperProps {
  value?: string;
  onChange: (url: string) => void;
  aspect?: number; // undefined means free ratio
  circularCrop?: boolean;
  label?: string;
  className?: string;
  accept?: string;
  maxSizeMB?: number;
  onRemove?: () => void;
}

export function ImageUploadCropper({
  value,
  onChange,
  aspect,
  circularCrop = false,
  label = "Upload Image",
  className,
  accept = "image/jpeg, image/png, image/webp",
  maxSizeMB = 5,
  onRemove,
}: ImageUploadCropperProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // File Size Validation
      if (file.size > maxSizeMB * 1024 * 1024) {
        alert(`File size exceeds ${maxSizeMB}MB limit.`);
        e.target.value = '';
        return;
      }
      
      // File Type Validation (Optional fallback if accept doesn't catch it)
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
      if (!validTypes.includes(file.type) && accept.includes('image')) {
        alert("Only JPG, JPEG, PNG, and WEBP image formats are allowed.");
        e.target.value = '';
        return;
      }

      setFileName(file.name);
      
      // If it's a video, bypass cropping and upload directly
      if (file.type.startsWith('video/')) {
        setIsUploading(true);
        try {
          const formData = new FormData();
          formData.append('file', file);
          const res = await fetch('/api/upload', { method: 'POST', body: formData });
          const data = await res.json();
          if (data.url) onChange(data.url);
        } catch (error) {
          console.error(error);
          alert("Failed to upload video");
        } finally {
          setIsUploading(false);
          e.target.value = '';
        }
        return;
      }
      
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageSrc(reader.result?.toString() || null);
      });
      reader.readAsDataURL(file);
      e.target.value = ''; // reset input
    }
  };

  const handleSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    
    setIsUploading(true);
    try {
      const croppedBlob = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation
      );
      
      if (!croppedBlob) throw new Error("Cropping failed");

      const formData = new FormData();
      formData.append('file', croppedBlob, fileName || 'image.webp');
      
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      const data = await res.json();
      if (data.url) {
        onChange(data.url);
        setImageSrc(null);
        setZoom(1);
        setRotation(0);
      } else {
        throw new Error(data.error || "Upload failed");
      }
    } catch (e) {
      console.error(e);
      alert("Failed to crop and upload image");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <div className={`relative ${className || ''}`}>
        <input 
          type="file" 
          accept={accept}
          onChange={handleFileChange} 
          ref={fileInputRef} 
          className="hidden" 
        />
        {value ? (
           <div className="relative group rounded-xl overflow-hidden border border-[var(--border-color)] flex items-center justify-center bg-[var(--background)]">
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img 
               src={value} 
               alt="Uploaded" 
               className={`w-full max-h-[300px] object-contain ${circularCrop ? 'rounded-full aspect-square object-cover' : ''}`}
             />
             <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button type="button" onClick={() => fileInputRef.current?.click()} variant="secondary" size="sm">
                  Change Image
                </Button>
                {onRemove && (
                  <Button type="button" onClick={onRemove} variant="destructive" size="sm">
                    Remove
                  </Button>
                )}
             </div>
           </div>
        ) : (
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-32 border-dashed border-2 flex flex-col items-center justify-center space-y-2 text-[var(--text-secondary)] hover:text-[var(--primary)] hover:border-[var(--primary)] bg-[var(--background)]/50"
          >
            <UploadCloud className="h-6 w-6" />
            <span>{label}</span>
          </Button>
        )}
      </div>

      {imageSrc && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[var(--card)] w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden flex flex-col h-[85vh]">
            <div className="p-4 border-b border-[var(--border-color)] flex justify-between items-center">
              <h3 className="text-lg font-semibold">Crop Image</h3>
              <Button type="button" variant="ghost" size="icon" onClick={() => setImageSrc(null)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="relative flex-1 bg-black/10 min-h-[300px]">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={aspect}
                cropShape={circularCrop ? "round" : "rect"}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                onRotationChange={setRotation}
              />
            </div>
            
            <div className="p-6 border-t border-[var(--border-color)] bg-[var(--card)] space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--text-secondary)] flex items-center gap-1"><ZoomOut className="w-4 h-4"/> Zoom</span>
                    <span className="text-[var(--text-secondary)] flex items-center gap-1"><ZoomIn className="w-4 h-4"/></span>
                  </div>
                  <input
                    type="range"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    aria-labelledby="Zoom"
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full accent-[var(--primary)]"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--text-secondary)] flex items-center gap-1"><RotateCcw className="w-4 h-4"/> Rotation</span>
                    <span className="text-[var(--text-secondary)]">{rotation}°</span>
                  </div>
                  <input
                    type="range"
                    value={rotation}
                    min={0}
                    max={360}
                    step={1}
                    aria-labelledby="Rotation"
                    onChange={(e) => setRotation(Number(e.target.value))}
                    className="w-full accent-[var(--primary)]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => { setZoom(1); setRotation(0); }}>
                  Reset
                </Button>
                <Button type="button" variant="outline" onClick={() => setImageSrc(null)}>
                  Cancel
                </Button>
                <Button type="button" onClick={handleSave} disabled={isUploading}>
                  {isUploading ? "Processing..." : "Crop & Save"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
