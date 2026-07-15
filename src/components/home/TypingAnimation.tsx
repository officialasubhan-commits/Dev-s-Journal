"use client";

import { useState, useEffect } from "react";

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

  // Parse configurations with fallback defaults
  const resolved = {
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
  };

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

  useEffect(() => {
    if (!mounted || prefersReducedMotion || !words || words.length === 0 || !resolved.animationEnabled) {
      if (words && words.length > 0) {
        setCurrentText(words[0]);
      }
      return;
    }

    const currentWord = words[currentWordIndex];
    let timer: NodeJS.Timeout;

    if (isDeleting) {
      timer = setTimeout(() => {
        setCurrentText((prev) => prev.slice(0, -1));
      }, resolved.deleteSpeed);
    } else {
      timer = setTimeout(() => {
        setCurrentText((prev) => currentWord.slice(0, prev.length + 1));
      }, resolved.typingSpeed);
    }

    // If fully typed, pause then start deleting
    if (!isDeleting && currentText === currentWord) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, resolved.delayBetweenWords);
    }

    // If fully erased, go to next word
    if (isDeleting && currentText === "") {
      clearTimeout(timer);
      setIsDeleting(false);
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }

    return () => clearTimeout(timer);
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
