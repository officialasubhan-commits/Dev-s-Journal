"use client";

import { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";

// A light warm gray 1x1 png base64 pixel matching the theme
const defaultBlurDataURL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

export function SafeImage({ src, alt, ...props }: ImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setImgSrc(src);
    setIsLoaded(false); // Reset load state when source changes
  }, [src]);

  const fallbackSrc = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'><rect width='100%' height='100%' fill='%23F8F1E8'/><text x='50%' y='50%' font-family='sans-serif' font-size='24' fill='%239A8F84' dominant-baseline='middle' text-anchor='middle'>Image Unavailable</text></svg>";

  const isBlurRequired = !props.placeholder && typeof imgSrc === "string" && !imgSrc.startsWith("data:");

  return (
    <Image
      placeholder={isBlurRequired ? "blur" : props.placeholder}
      blurDataURL={isBlurRequired ? defaultBlurDataURL : props.blurDataURL}
      {...props}
      src={imgSrc}
      alt={alt}
      onLoad={() => setIsLoaded(true)}
      onError={() => {
        setImgSrc(fallbackSrc);
        setIsLoaded(true); // Treat fallback load as resolved
      }}
      className={`transition-all duration-700 ease-out ${
        isLoaded ? "opacity-100 scale-100 blur-0" : "opacity-0 scale-95 blur-md"
      } ${props.className || ""}`}
    />
  );
}
