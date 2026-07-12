"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Code, BookOpen, Camera, Sparkles } from "lucide-react";
import { SlideUp, StaggerContainer } from "@/components/ui/animations";
import { TypewriterEffect } from "@/components/ui/typewriter";
import { motion } from "framer-motion";

export default function Home() {
  const words = [
    { text: "Never Stops.", className: "text-[var(--primary)]" },
    { text: "Is Just Beginning.", className: "text-[var(--accent)]" },
    { text: "Inspires Others.", className: "text-[var(--highlight)]" },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] relative overflow-hidden bg-[var(--background)]">
      {/* Animated background glow and particles */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[var(--primary)]/20 to-[var(--accent)]/20 rounded-full blur-[100px] pointer-events-none" 
      />
      
      {/* Floating particles (simplified representation) */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ 
            y: [0, -20, 0], 
            opacity: [0, 1, 0],
            scale: [0.8, 1, 0.8]
          }}
          transition={{ 
            duration: 3 + i, 
            repeat: Infinity, 
            delay: i * 0.5,
            ease: "easeInOut" 
          }}
          className="absolute"
          style={{
            top: `${[25, 45, 65, 30, 70][i]}%`,
            left: `${[15, 80, 25, 65, 85][i]}%`,
          }}
        >
          <Sparkles className="w-4 h-4 text-[var(--secondary)] opacity-40" />
        </motion.div>
      ))}
      
      <div className="container px-4 md:px-6 relative z-10 flex flex-col items-center text-center space-y-10 py-24">
        
        <SlideUp className="space-y-6 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-[var(--primary)]/30 text-sm font-medium text-[var(--primary)] shadow-sm mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Welcome to my digital home</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-[var(--text-main)] font-heading leading-tight">
            My Journey <br className="hidden md:block" />
            <TypewriterEffect words={words} />
          </h1>
          
          <p className="mx-auto max-w-2xl text-[var(--text-secondary)] text-lg md:text-xl/relaxed lg:text-xl/relaxed font-medium">
            A carefully curated space where I document my learning, showcase my projects, and share my creative endeavors with the world.
          </p>
        </SlideUp>

        <SlideUp delay={0.2} className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" className="h-14 px-8 text-lg" asChild>
            <Link href="/projects">
              Explore Work <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button variant="secondary" size="lg" className="h-14 px-8 text-lg" asChild>
            <Link href="/journal">Read Journal</Link>
          </Button>
        </SlideUp>
        
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 w-full max-w-5xl">
          <SlideUp className="glass-card p-8 flex flex-col items-center space-y-4 group">
            <div className="p-4 bg-gradient-to-br from-[var(--primary)]/10 to-[var(--primary)]/5 rounded-2xl group-hover:scale-110 group-hover:bg-[var(--primary)]/20 transition-all duration-300">
              <Code className="h-8 w-8 text-[var(--primary)]" />
            </div>
            <h3 className="font-bold text-xl font-heading text-[var(--text-main)]">Crafting Code</h3>
            <p className="text-center text-[var(--text-secondary)] leading-relaxed">
              Building scalable, beautiful applications with modern web technologies.
            </p>
          </SlideUp>
          
          <SlideUp className="glass-card p-8 flex flex-col items-center space-y-4 group">
            <div className="p-4 bg-gradient-to-br from-[var(--accent)]/10 to-[var(--accent)]/5 rounded-2xl group-hover:scale-110 group-hover:bg-[var(--accent)]/20 transition-all duration-300">
              <BookOpen className="h-8 w-8 text-[var(--accent)]" />
            </div>
            <h3 className="font-bold text-xl font-heading text-[var(--text-main)]">Continuous Learning</h3>
            <p className="text-center text-[var(--text-secondary)] leading-relaxed">
              Exploring new paradigms, architectures, and design philosophies.
            </p>
          </SlideUp>
          
          <SlideUp className="glass-card p-8 flex flex-col items-center space-y-4 group">
            <div className="p-4 bg-gradient-to-br from-[var(--highlight)]/10 to-[var(--highlight)]/5 rounded-2xl group-hover:scale-110 group-hover:bg-[var(--highlight)]/20 transition-all duration-300">
              <Camera className="h-8 w-8 text-[var(--highlight)]" />
            </div>
            <h3 className="font-bold text-xl font-heading text-[var(--text-main)]">Visual Storytelling</h3>
            <p className="text-center text-[var(--text-secondary)] leading-relaxed">
              Capturing moments, sharing memories, and expressing creativity.
            </p>
          </SlideUp>
        </StaggerContainer>
      </div>
    </div>
  );
}
