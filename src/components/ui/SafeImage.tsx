"use client";

import { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";

export function SafeImage({ src, alt, ...props }: ImageProps) {
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  const fallbackSrc = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'><rect width='100%' height='100%' fill='%23F8F1E8'/><text x='50%' y='50%' font-family='sans-serif' font-size='24' fill='%239A8F84' dominant-baseline='middle' text-anchor='middle'>Image Unavailable</text></svg>";

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={() => {
        setImgSrc(fallbackSrc);
      }}
    />
  );
}
