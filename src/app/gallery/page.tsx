"use client";

import { useState, useEffect } from "react";
import { Camera, X, ZoomIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SlideUp, StaggerContainer, FadeIn } from "@/components/ui/animations";

export default function GalleryPage() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<any | null>(null);

  useEffect(() => {
    // We fetch client-side for simplicity in this transition, or we could keep it server side.
    // For the sake of the fullscreen viewer, we use a client component.
    const fetchImages = async () => {
      try {
        const res = await fetch("/api/gallery");
        if (res.ok) {
          const data = await res.json();
          setImages(data || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  return (
    <div className="container mx-auto px-4 py-16 md:py-24 max-w-7xl">
      <div className="space-y-12">
        <SlideUp className="space-y-6 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--highlight)]/10 text-sm font-medium text-[var(--highlight)] mb-2 border border-[var(--highlight)]/20">
            <Camera className="w-4 h-4" />
            <span>Photography</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[var(--text-main)] font-heading">
            Visual <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--highlight)] to-[var(--primary)]">Gallery</span>
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            A curated collection of moments, travels, and visual inspirations.
          </p>
        </SlideUp>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-[var(--primary)]/30 border-t-[var(--primary)] rounded-full animate-spin" />
          </div>
        ) : images.length === 0 ? (
          <SlideUp className="glass-card p-12 text-center text-[var(--text-muted)] italic">
            No photos have been uploaded yet.
          </SlideUp>
        ) : (
          <StaggerContainer className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6 pt-8">
            {images.map((img) => (
              <SlideUp key={img.id} className="break-inside-avoid">
                <div 
                  className="bg-[var(--card)] rounded-2xl overflow-hidden border border-[var(--border-color)] hover:border-[var(--highlight)]/50 transition-all duration-500 relative group cursor-zoom-in shadow-sm hover:shadow-xl hover:shadow-[var(--highlight)]/10"
                  onClick={() => setSelectedImage(img)}
                >
                  {img.url.match(/\.(mp4|webm|ogg)$/i) ? (
                    <video src={img.url} className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700" controls />
                  ) : (
                    <img 
                      src={img.url} 
                      alt={img.caption || "Gallery image"} 
                      loading="lazy"
                      className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700" 
                    />
                  )}
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Zoom Icon */}
                  <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <ZoomIn className="w-5 h-5 text-white" />
                  </div>

                  {img.caption && (
                    <div className="absolute bottom-0 left-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                      <p className="text-white text-sm font-medium">{img.caption}</p>
                    </div>
                  )}
                </div>
              </SlideUp>
            ))}
          </StaggerContainer>
        )}
      </div>

      {/* Fullscreen Modal Viewer */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-8"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-50"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-6 h-6" />
            </button>
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-6xl max-h-[90vh] w-full flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedImage.url.match(/\.(mp4|webm|ogg)$/i) ? (
                <video src={selectedImage.url} className="max-w-full max-h-[85vh] rounded-lg shadow-2xl" controls autoPlay />
              ) : (
                <img 
                  src={selectedImage.url} 
                  alt={selectedImage.caption} 
                  className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl" 
                />
              )}
              {selectedImage.caption && (
                <div className="absolute bottom-[-40px] left-0 right-0 text-center">
                  <p className="text-white/80 font-medium">{selectedImage.caption}</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
