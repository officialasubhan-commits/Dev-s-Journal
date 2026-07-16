"use client";

import { useState, useEffect, useMemo, useRef } from "react";

interface TypingAnimationProps {
  words: string[];
  className?: string;
  config?: {
    textColor?: string;
    cursorColor?: string;
    cursorWidth?: string;
    cursorBlinkSpeed?: string;
    typingSpeed?: number;
    deleteSpeed?: number;
    delayBetweenWords?: number;
    fontWeight?: string;
    fontSize?: string;
    textTransform?: string;
    letterSpacing?: string;
    gradientEnabled?: boolean;
    gradientStart?: string;
    gradientEnd?: string;
    shadowEnabled?: boolean;
    animationEnabled?: boolean;
    fontFamily?: string;
    lineHeight?: string;
    wordSpacing?: string;
  };
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseTime?: number;
}

export function TypingAnimation({
  words,
  className = "",
  config,
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseTime = 2000
}: TypingAnimationProps) {
  const [mounted, setMounted] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Memoize configuration with fallback defaults to avoid re‑creation on each render
  const resolved = useMemo(() => ({
    textColor: config?.textColor || "#F97316",
    cursorColor: config?.cursorColor || "#F97316",
    cursorWidth: config?.cursorWidth || "3px",
    cursorBlinkSpeed: config?.cursorBlinkSpeed || "1s",
    typingSpeed: config?.typingSpeed !== undefined ? Number(config.typingSpeed) : typingSpeed,
    deleteSpeed: config?.deleteSpeed !== undefined ? Number(config.deleteSpeed) : deletingSpeed,
    delayBetweenWords: config?.delayBetweenWords !== undefined ? Number(config.delayBetweenWords) : pauseTime,
    fontWeight: config?.fontWeight || "700",
    fontSize: config?.fontSize || "inherit",
    textTransform: config?.textTransform || "none",
    letterSpacing: config?.letterSpacing || "normal",
    gradientEnabled: config?.gradientEnabled ?? false,
    gradientStart: config?.gradientStart || "#F97316",
    gradientEnd: config?.gradientEnd || "#FB7185",
    shadowEnabled: config?.shadowEnabled ?? false,
    animationEnabled: config?.animationEnabled ?? true,
    fontFamily: config?.fontFamily || "inherit",
    lineHeight: config?.lineHeight || "normal",
    wordSpacing: config?.wordSpacing || "normal"
  }), [
    config,
    typingSpeed,
    deletingSpeed,
    pauseTime
  ]);

  useEffect(() => {
    setMounted(true);
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Use a ref to hold the active timeout so we can clear it reliably across renders
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!mounted || prefersReducedMotion || !words?.length || !resolved.animationEnabled) {
      // Show first word instantly on mount or if animation is disabled
      if (words?.length) setCurrentText(words[0]);
      return;
    }

    const currentWord = words[currentWordIndex];

    if (isDeleting) {
      timerRef.current = setTimeout(() => {
        setCurrentText((prev) => prev.slice(0, -1));
      }, resolved.deleteSpeed);
    } else {
      timerRef.current = setTimeout(() => {
        setCurrentText((prev) => currentWord.slice(0, prev.length + 1));
      }, resolved.typingSpeed);
    }

    // When the word is fully typed, pause before deleting (only if there is more than 1 word)
    if (!isDeleting && currentText === currentWord) {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (words.length > 1) {
        timerRef.current = setTimeout(() => setIsDeleting(true), resolved.delayBetweenWords);
      }
    }

    // When the word is fully erased, move to the next word
    if (isDeleting && currentText === "") {
      if (timerRef.current) clearTimeout(timerRef.current);
      setIsDeleting(false);
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [
    mounted,
    currentText,
    isDeleting,
    currentWordIndex,
    words,
    prefersReducedMotion,
    resolved.typingSpeed,
    resolved.deleteSpeed,
    resolved.delayBetweenWords,
    resolved.animationEnabled
  ]);

  const textStyle: React.CSSProperties = {
    fontFamily: resolved.fontFamily !== "inherit" ? resolved.fontFamily : undefined,
    fontWeight: resolved.fontWeight,
    fontSize: resolved.fontSize !== "inherit" ? resolved.fontSize : undefined,
    textTransform: resolved.textTransform as any,
    letterSpacing: resolved.letterSpacing !== "normal" ? resolved.letterSpacing : undefined,
    wordSpacing: resolved.wordSpacing !== "normal" ? resolved.wordSpacing : undefined,
    lineHeight: resolved.lineHeight !== "normal" ? resolved.lineHeight : undefined,
    textShadow: resolved.shadowEnabled ? "2px 2px 4px rgba(0, 0, 0, 0.15)" : undefined,
    transition: "all 0.2s ease",
  };

  if (resolved.gradientEnabled) {
    textStyle.backgroundImage = `linear-gradient(to right, ${resolved.gradientStart}, ${resolved.gradientEnd})`;
    textStyle.WebkitBackgroundClip = "text";
    textStyle.WebkitTextFillColor = "transparent";
    textStyle.display = "inline-block";
  } else {
    textStyle.color = resolved.textColor;
  }

  // Prevent server layout shifts by returning first word statically during SSR
  if (!mounted) {
    return (
      <span className={className} style={textStyle}>
        {words[0] || ""}
      </span>
    );
  }

  if (prefersReducedMotion || !resolved.animationEnabled) {
    return (
      <span className={className} style={textStyle}>
        {words[0] || ""}
      </span>
    );
  }

  return (
    <>
      <style>{`
        @keyframes typing-cursor-blink {
          50% { opacity: 0; }
        }
        .typing-cursor-animated {
          animation: typing-cursor-blink var(--blink-duration, 1s) step-end infinite;
        }
      `}</style>
      <span className={`inline-flex items-center ${className}`} style={textStyle}>
        <span>{currentText}</span>
        <span 
          className="typing-cursor-animated inline-block rounded" 
          style={{
            width: resolved.cursorWidth,
            height: "1.1em",
            backgroundColor: resolved.cursorColor,
            marginLeft: "6px", // Small premium gap from text
            verticalAlign: "middle",
            display: "inline-block",
            ["--blink-duration" as any]: resolved.cursorBlinkSpeed
          }}
        />
      </span>
    </>
  );
}
