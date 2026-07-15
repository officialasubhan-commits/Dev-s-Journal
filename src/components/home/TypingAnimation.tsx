"use client";

import { useState, useEffect } from "react";

interface TypingAnimationProps {
  words: string[];
  className?: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseTime?: number;
}

export function TypingAnimation({
  words,
  className = "",
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseTime = 2000
}: TypingAnimationProps) {
  const [mounted, setMounted] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

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
    if (!mounted || prefersReducedMotion || !words || words.length === 0) return;

    const currentWord = words[currentWordIndex];
    let timer: NodeJS.Timeout;

    if (isDeleting) {
      // Deleting
      timer = setTimeout(() => {
        setCurrentText((prev) => prev.slice(0, -1));
      }, deletingSpeed);
    } else {
      // Typing
      timer = setTimeout(() => {
        setCurrentText((prev) => currentWord.slice(0, prev.length + 1));
      }, typingSpeed);
    }

    // If fully typed, pause then start deleting
    if (!isDeleting && currentText === currentWord) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, pauseTime);
    }

    // If fully erased, go to next word
    if (isDeleting && currentText === "") {
      clearTimeout(timer);
      setIsDeleting(false);
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }

    return () => clearTimeout(timer);
  }, [mounted, currentText, isDeleting, currentWordIndex, words, typingSpeed, deletingSpeed, pauseTime, prefersReducedMotion]);

  if (!mounted) {
    // Return the first word statically on the server to prevent blank layout shift and hydration mismatches
    return <span className={className}>{words[0] || ""}</span>;
  }

  if (prefersReducedMotion) {
    return <span className={className}>{words[0] || ""}</span>;
  }

  return (
    <span className={`inline-flex items-center ${className}`}>
      <span>{currentText}</span>
      <span className="w-[2px] h-[1.1em] bg-current ml-1 animate-pulse" />
    </span>
  );
}
