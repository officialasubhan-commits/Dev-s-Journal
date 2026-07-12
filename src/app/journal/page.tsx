import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Tag, BookHeart } from "lucide-react";
import prisma from "@/lib/prisma";
import { SlideUp, StaggerContainer } from "@/components/ui/animations";

export const metadata: Metadata = {
  title: "Daily Journal",
  description: "My daily journal entries, thoughts, and reflections.",
};

export default async function JournalPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl">
      <div className="space-y-12">
        <SlideUp className="space-y-4 text-center md:text-left flex flex-col md:items-start items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--primary)]/10 text-sm font-medium text-[var(--primary)] mb-2">
            <BookHeart className="w-4 h-4" />
            <span>Personal Thoughts</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[var(--text-main)] font-heading">
            Daily <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]">Journal</span>
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl">
            A continuous record of my learning, reflections, and updates from my daily life and work.
          </p>
        </SlideUp>

        <StaggerContainer className="space-y-6 relative">
          {/* Vertical timeline line (desktop only) */}
          <div className="hidden md:block absolute left-8 top-4 bottom-4 w-px bg-gradient-to-b from-[var(--primary)]/30 via-[var(--border-color)] to-transparent z-0" />
          
          {posts.length === 0 ? (
            <SlideUp className="glass-card p-12 text-center text-[var(--text-muted)] italic">
              No journal entries found yet.
            </SlideUp>
          ) : (
            posts.map((post) => (
              <SlideUp key={post.id} className="relative z-10 md:pl-20">
                {/* Timeline node */}
                <div className="hidden md:flex absolute left-[22px] top-8 w-5 h-5 rounded-full bg-[var(--background)] border-4 border-[var(--primary)] shadow-[0_0_10px_rgba(249,115,22,0.3)] z-20" />
                
                <article className="glass-card p-6 md:p-8 rounded-3xl space-y-4 group hover:border-[var(--primary)]/30 transition-all duration-300">
                  <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-muted)]">
                    <time dateTime={post.createdAt.toISOString()} className="font-medium text-[var(--text-secondary)] bg-[var(--secondary-bg)] px-3 py-1 rounded-full">
                      {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </time>
                    <span className="flex items-center"><Clock className="w-4 h-4 mr-1.5 opacity-70" /> {post.readingTime} min read</span>
                  </div>
                  
                  <Link href={`/journal/${post.slug}`} className="block group-hover:-translate-y-0.5 transition-transform">
                    <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-main)] font-heading group-hover:text-[var(--primary)] transition-colors">
                      {post.title}
                    </h2>
                  </Link>
                  
                  <p className="text-[var(--text-secondary)] leading-relaxed line-clamp-3">
                    {post.content.replace(/<[^>]+>/g, '')}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-2 pt-4">
                    {post.tags.map(tag => (
                      <span key={tag} className="flex items-center text-xs font-medium px-2.5 py-1 bg-[var(--background)] rounded-lg border border-[var(--border-color)] text-[var(--text-secondary)]">
                        <Tag className="w-3 h-3 mr-1.5 opacity-50" /> {tag}
                      </span>
                    ))}
                  </div>
                </article>
              </SlideUp>
            ))
          )}
        </StaggerContainer>
      </div>
    </div>
  );
}
