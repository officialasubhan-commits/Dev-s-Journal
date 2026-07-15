import prisma from "@/lib/prisma";
import Link from "next/link";
import { ArrowRight, Code, BookOpen, Camera, Globe, Target, Terminal, Calendar, Clock, Sparkles } from "lucide-react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { SafeImage } from "@/components/ui/SafeImage";
import { SlideUp, StaggerContainer, FadeIn } from "@/components/ui/animations";
import { WelcomePopup } from "@/components/WelcomePopup";

export const dynamic = "force-dynamic";

import { getSiteSettings } from "@/app/admin/settings/actions";

export default async function Home() {
  const settings = await getSiteSettings();

  const projectIds = settings?.featuredProjects || [];
  const postIds = settings?.featuredPosts || [];

  const [
    featuredProjects,
    latestPosts,
    learningProgress,
    galleryImages,
    totalPosts,
    totalProjects,
    totalCourses,
    totalGallery
  ] = await Promise.all([
    prisma.project.findMany({
      where: projectIds.length > 0 ? { id: { in: projectIds } } : { published: true },
      orderBy: { createdAt: "desc" },
      take: 2
    }),
    prisma.post.findMany({
      where: postIds.length > 0 ? { id: { in: postIds } } : { published: true },
      orderBy: { createdAt: "desc" },
      take: 3
    }),
    prisma.userLearning.findMany({
      orderBy: { progress: "desc" },
      take: 3
    }),
    prisma.galleryImage.findMany({
      orderBy: { createdAt: "desc" },
      take: 4
    }),
    prisma.post.count({ where: { published: true } }),
    prisma.project.count({ where: { published: true } }),
    prisma.userLearning.count(),
    prisma.galleryImage.count()
  ]);

  const renderHeroTitle = () => {
    const title = settings?.heroTitle || "Designing simple, warm & premium digital experiences.";
    const highlight = settings?.heroHighlighted || "warm & premium";
    
    if (!highlight || !title.includes(highlight)) {
      return title;
    }
    const index = title.indexOf(highlight);
    const before = title.substring(0, index);
    const after = title.substring(index + highlight.length);
    return (
      <>
        {before}
        <span className="text-[var(--primary)]">{highlight}</span>
        {after}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-[var(--background)] py-12 md:py-20 relative overflow-hidden">
      {/* Soft warm top glow */}
      {settings?.heroBgDecor !== "none" && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[550px] bg-[var(--primary)]/5 rounded-full blur-[130px] pointer-events-none" />
      )}

      <div className="container max-w-5xl mx-auto px-6 space-y-24 md:space-y-32 relative z-10">
        
        {/* HERO SECTION */}
        <section className="pt-12 pb-4 text-center md:text-left md:flex md:items-center md:justify-between gap-12">
          <div className="max-w-2xl space-y-6 md:space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--secondary-bg)] border border-[var(--border-color)]/70 text-[10px] font-bold text-[var(--secondary)] tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-ping" />
              <span>{settings?.availabilityStatus || "Available"}</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[var(--text-main)] font-heading leading-[1.1]">
              {renderHeroTitle()}
            </h1>
            
            <p className="text-base md:text-lg text-[var(--text-secondary)] font-normal leading-relaxed max-w-xl">
              {settings?.heroDescription || "I am a Software Engineer and UI/UX Designer. This is my digital space where I log my daily learnings, showcase craft projects, and write summaries."}
            </p>

            <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4 pt-2">
              <Button size="lg" className="h-11 px-6 text-sm font-semibold rounded-xl bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 cursor-pointer shadow-sm" asChild>
                <Link href={settings?.heroBtnPrimaryLink || "/projects"} className="flex items-center gap-2">
                  {settings?.heroBtnPrimaryText || "Explore Projects"} <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-11 px-6 text-sm font-semibold rounded-xl border-[var(--border-color)] hover:bg-[var(--secondary-bg)] cursor-pointer" asChild>
                <Link href={settings?.heroBtnSecondaryLink || "/journal"}>
                  {settings?.heroBtnSecondaryText || "Read Journal"}
                </Link>
              </Button>
            </div>
          </div>

          {/* Quick Info / Dynamic Profile Card */}
          <div className="hidden md:block w-80 relative shrink-0">
            <div className="bg-[var(--card)] rounded-3xl border border-[var(--border-color)]/80 p-6 flex flex-col gap-6 shadow-md hover:shadow-lg transition-all duration-300 group">
              
              {/* Profile Image container */}
              <div className="aspect-square relative w-full rounded-2xl overflow-hidden bg-[var(--secondary-bg)] border border-[var(--border-color)]/60">
                <SafeImage
                  src={settings?.heroProfileImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=300&auto=format&fit=crop"}
                  alt={settings?.authorName || "Profile Avatar"}
                  fill
                  className="object-cover group-hover:scale-[1.01] transition-transform duration-500"
                />
              </div>

              {/* Details */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="font-extrabold font-heading text-lg text-[var(--text-main)] truncate">
                    {settings?.authorName || "Abdus Subhan"}
                  </h3>
                  <p className="text-xs font-bold text-[var(--primary)]">
                    {settings?.authorTitle || "Software Engineer & UI/UX Designer"}
                  </p>
                </div>

                <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-normal line-clamp-3">
                  {settings?.authorBio || "Based in India. Focuses on Next.js 16, React 19, TypeScript, and modern clean interface details."}
                </p>

                {/* Meta Location / Status */}
                <div className="border-y border-[var(--border-color)]/60 py-3 flex items-center justify-between text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                  <span className="flex items-center gap-1">📍 {settings?.city ? `${settings.city}, ` : ""}{settings?.country || "India"}</span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse" />
                    {settings?.availabilityStatus || "Available"}
                  </span>
                </div>

                {/* Social links & Resume */}
                <div className="flex items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                    {settings?.githubUrl && (
                      <a href={settings.githubUrl} className="hover:text-[var(--primary)] transition-colors" target="_blank" rel="noreferrer">
                        <FaGithub className="w-4 h-4" />
                      </a>
                    )}
                    {settings?.linkedinUrl && (
                      <a href={settings.linkedinUrl} className="hover:text-[var(--primary)] transition-colors" target="_blank" rel="noreferrer">
                        <FaLinkedin className="w-4 h-4" />
                      </a>
                    )}
                    {settings?.twitterUrl && (
                      <a href={settings.twitterUrl} className="hover:text-[var(--primary)] transition-colors" target="_blank" rel="noreferrer">
                        <FaTwitter className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  {settings?.resumePdf && (
                    <Button variant="outline" size="sm" className="h-8 rounded-lg text-[9px] font-bold px-3 border-[var(--border-color)] cursor-pointer" asChild>
                      <a href={settings.resumePdf} download>Download CV</a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STATISTICS SECTION */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 px-6 bg-[var(--secondary-bg)]/40 rounded-2xl border border-[var(--border-color)]/30 backdrop-blur-sm">
          {[
            { label: "Articles Published", value: totalPosts, desc: "Journal entries" },
            { label: "Live Projects", value: totalProjects, desc: "Showcased work" },
            { label: "Completed Courses", value: totalCourses, desc: "Learning records" },
            { label: "Gallery Assets", value: totalGallery, desc: "Captured frames" }
          ].map((stat, idx) => (
            <div key={idx} className="text-center md:text-left space-y-1">
              <span className="text-3xl md:text-4xl font-extrabold text-[var(--text-main)] font-heading tracking-tight">
                {stat.value}
              </span>
              <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">{stat.label}</p>
              <p className="text-[10px] text-[var(--text-muted)] font-normal">{stat.desc}</p>
            </div>
          ))}
        </section>

        {/* FEATURED PROJECTS */}
        <section className="space-y-10">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight font-heading text-[var(--text-main)]">Featured Projects</h2>
              <p className="text-sm text-[var(--text-secondary)]">A selected list of my design and engineering projects.</p>
            </div>
            <Link href="/projects" className="text-sm font-semibold text-[var(--primary)] hover:text-[var(--secondary)] transition-colors flex items-center gap-1 group">
              All Projects <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredProjects.map((project) => (
              <SlideUp key={project.id}>
                <div className="group bg-[var(--card)] border border-[var(--border-color)]/70 rounded-2xl overflow-hidden hover:shadow-md hover:border-[var(--primary)]/20 transition-all duration-300 flex flex-col h-full">
                  {project.coverImage && (
                    <div className="aspect-video relative overflow-hidden bg-[var(--secondary-bg)] border-b border-[var(--border-color)]/60">
                      <SafeImage 
                        src={project.coverImage} 
                        alt={project.title} 
                        fill 
                        className="object-cover group-hover:scale-[1.02] transition-transform duration-500" 
                      />
                    </div>
                  )}
                  <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-bold text-lg font-heading text-[var(--text-main)] group-hover:text-[var(--primary)] transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-2">
                        {project.description}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <span key={tech} className="px-2.5 py-0.5 text-[10px] font-semibold bg-[var(--secondary-bg)] border border-[var(--border-color)]/75 text-[var(--text-secondary)] rounded-md">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </SlideUp>
            ))}
          </StaggerContainer>
        </section>

        {/* LATEST JOURNAL POSTS */}
        <section className="space-y-10">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight font-heading text-[var(--text-main)]">Latest Journal Entries</h2>
              <p className="text-sm text-[var(--text-secondary)]">Thoughts, summaries, and stories about web engineering.</p>
            </div>
            <Link href="/journal" className="text-sm font-semibold text-[var(--primary)] hover:text-[var(--secondary)] transition-colors flex items-center gap-1 group">
              Read More <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="space-y-4">
            {latestPosts.map((post) => (
              <SlideUp key={post.id}>
                <Link 
                  href={`/journal/${post.slug}`}
                  className="block p-5 bg-[var(--card)] hover:bg-[var(--secondary-bg)] border border-[var(--border-color)]/80 hover:border-[var(--primary)]/20 rounded-2xl transition-all duration-200 group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="font-bold text-lg text-[var(--text-main)] group-hover:text-[var(--primary)] transition-colors font-sans">
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)]">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {post.readingTime} min read
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center text-xs font-semibold text-[var(--text-secondary)] group-hover:text-[var(--primary)] transition-colors shrink-0">
                      Read Entry <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              </SlideUp>
            ))}
          </div>
        </section>

        {/* LEARNING HUB */}
        <section className="space-y-10">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight font-heading text-[var(--text-main)]">Learning Progress</h2>
              <p className="text-sm text-[var(--text-secondary)]">Tracking courses and educational materials currently active.</p>
            </div>
            <Link href="/learning" className="text-sm font-semibold text-[var(--primary)] hover:text-[var(--secondary)] transition-colors flex items-center gap-1 group">
              View Hub <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {learningProgress.map((course) => (
              <SlideUp key={course.id}>
                <div className="bg-[var(--card)] border border-[var(--border-color)]/70 p-6 rounded-2xl flex flex-col justify-between h-full space-y-4 shadow-sm">
                  <div className="space-y-2">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--primary)] bg-[var(--primary)]/10 px-2 py-0.5 rounded-full">
                      {course.platform}
                    </span>
                    <h3 className="font-bold text-sm text-[var(--text-main)] line-clamp-2 leading-snug">
                      {course.title}
                    </h3>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-[var(--text-secondary)]">
                      <span>Progress</span>
                      <span className="font-semibold text-[var(--text-main)]">{course.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[var(--secondary-bg)] rounded-full overflow-hidden border border-[var(--border-color)]/30">
                      <div 
                        className="h-full bg-[var(--primary)] rounded-full transition-all duration-500" 
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </SlideUp>
            ))}
          </div>
        </section>

        {/* GALLERY PREVIEW */}
        <section className="space-y-10">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight font-heading text-[var(--text-main)]">Gallery Snaps</h2>
              <p className="text-sm text-[var(--text-secondary)]">Visual frames and highlights representing daily storytelling.</p>
            </div>
            <Link href="/gallery" className="text-sm font-semibold text-[var(--primary)] hover:text-[var(--secondary)] transition-colors flex items-center gap-1 group">
              View Gallery <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryImages.map((img) => (
              <SlideUp key={img.id}>
                <div className="aspect-square relative rounded-2xl overflow-hidden border border-[var(--border-color)]/80 group bg-[var(--secondary-bg)] shadow-sm">
                  <SafeImage 
                    src={img.url} 
                    alt={img.caption || "Gallery Image"} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <span className="text-xs font-semibold text-white truncate w-full">{img.caption}</span>
                  </div>
                </div>
              </SlideUp>
            ))}
          </div>
        </section>

        {/* CONTACT CTA BANNER */}
        <section>
          <SlideUp>
            <div className="bg-[var(--card)] border border-[var(--border-color)]/80 rounded-3xl p-8 md:p-12 text-center space-y-6 relative overflow-hidden shadow-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 to-transparent pointer-events-none" />
              <div className="max-w-xl mx-auto space-y-4 relative z-10">
                <h2 className="text-2xl md:text-3xl font-bold font-heading text-[var(--text-main)] tracking-tight">Let's craft code together</h2>
                <p className="text-sm md:text-base text-[var(--text-secondary)] leading-relaxed">
                  Have an interesting project proposal, contract opening, or just want to chat about developer tooling? Feel free to drop a message.
                </p>
                <div className="pt-2">
                  <Button size="lg" className="h-11 px-6 text-sm font-semibold rounded-xl bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 cursor-pointer" asChild>
                    <Link href="/contact">
                      Get In Touch
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </SlideUp>
        </section>

      </div>

      <WelcomePopup />
    </div>
  );
}
