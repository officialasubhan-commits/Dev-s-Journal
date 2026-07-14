import prisma from "@/lib/prisma";
import Link from "next/link";
import { ArrowRight, Code, BookOpen, Camera, Globe, Target, Terminal, Calendar, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SafeImage } from "@/components/ui/SafeImage";
import { SlideUp, StaggerContainer, FadeIn } from "@/components/ui/animations";
import { WelcomePopup } from "@/components/WelcomePopup";

export const dynamic = "force-dynamic";

export default async function Home() {
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
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 2
    }),
    prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 3
    }),
    prisma.course.findMany({
      orderBy: { progress: "desc" },
      take: 3
    }),
    prisma.galleryImage.findMany({
      orderBy: { createdAt: "desc" },
      take: 4
    }),
    prisma.post.count({ where: { published: true } }),
    prisma.project.count({ where: { published: true } }),
    prisma.course.count(),
    prisma.galleryImage.count()
  ]);

  return (
    <div className="min-h-screen bg-[var(--background)] py-12 md:py-20 relative overflow-hidden">
      {/* Soft elegant top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-[var(--primary)]/5 to-transparent rounded-full blur-[140px] pointer-events-none" />

      <div className="container max-w-5xl mx-auto px-6 space-y-28 md:space-y-36 relative z-10">
        
        {/* HERO SECTION */}
        <section className="pt-16 pb-6 text-center md:text-left md:flex md:items-center md:justify-between gap-12">
          <div className="max-w-2xl space-y-6 md:space-y-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--secondary-bg)] border border-[var(--border-color)] text-xs font-semibold text-[var(--secondary)] tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-ping" />
              <span>Available for New Projects</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[var(--text-main)] font-heading leading-tight">
              Designing simple, <br />
              <span className="text-[var(--primary)] bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent">warm & premium</span> digital experiences.
            </h1>
            
            <p className="text-lg md:text-xl text-[var(--text-secondary)] font-normal leading-relaxed max-w-xl">
              I am a Software Engineer and UI/UX Designer. This is my digital space where I log my daily learnings, showcase craft projects, and write summaries.
            </p>

            <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4 pt-2">
              <Button size="lg" className="h-12 px-6 text-sm font-semibold rounded-xl bg-[var(--primary)] text-white hover:bg-[var(--secondary)] hover:-translate-y-0.5 transition-all shadow-md shadow-primary/10 cursor-pointer" asChild>
                <Link href="/projects" className="flex items-center gap-2">
                  Explore Projects <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-6 text-sm font-semibold rounded-xl border-[var(--border-color)] hover:bg-[var(--secondary-bg)] hover:-translate-y-0.5 transition-all cursor-pointer" asChild>
                <Link href="/journal">
                  Read Journal
                </Link>
              </Button>
            </div>
          </div>

          {/* Quick Info / Avatar Card */}
          <div className="hidden md:block w-72 h-80 relative shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/10 to-[var(--secondary)]/10 rounded-3xl border border-[var(--border-color)] p-6 flex flex-col justify-between shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-[#27272A] border border-[var(--border-color)] flex items-center justify-center shadow-inner">
                <Globe className="w-6 h-6 text-[var(--primary)]" />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold font-heading text-lg text-[var(--text-main)]">Abdus Subhan</h3>
                <p className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed">
                  Based in India. Focuses on Next.js 16, React 19, TypeScript, and modern clean interface details.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* STATISTICS SECTION */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6 border-y border-[var(--border-color)]/60 py-10">
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
              <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">{stat.label}</p>
              <p className="text-[10px] text-[var(--text-muted)] font-medium">{stat.desc}</p>
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
                <div className="group bg-[var(--card)] border border-[var(--border-color)] rounded-2xl overflow-hidden hover:shadow-xl hover:border-[var(--primary)]/20 transition-all duration-300 flex flex-col h-full">
                  {project.coverImage && (
                    <div className="aspect-video relative overflow-hidden bg-[var(--secondary-bg)] border-b border-[var(--border-color)]">
                      <SafeImage 
                        src={project.coverImage} 
                        alt={project.title} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    </div>
                  )}
                  <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-bold text-xl font-heading text-[var(--text-main)] group-hover:text-[var(--primary)] transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-2">
                        {project.description}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <span key={tech} className="px-2 py-0.5 text-[10px] font-semibold bg-[var(--secondary-bg)] border border-[var(--border-color)] text-[var(--text-secondary)] rounded-md">
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
                  className="block p-5 bg-[var(--card)] hover:bg-[var(--secondary-bg)] border border-[var(--border-color)] hover:border-[var(--primary)]/20 rounded-2xl transition-all duration-200 group"
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
                <div className="bg-[var(--card)] border border-[var(--border-color)] p-6 rounded-2xl flex flex-col justify-between h-full space-y-4">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--primary)] bg-[var(--primary)]/10 px-2 py-0.5 rounded-full">
                      {course.platform}
                    </span>
                    <h3 className="font-bold text-base text-[var(--text-main)] line-clamp-2 leading-snug">
                      {course.title}
                    </h3>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-[var(--text-secondary)]">
                      <span>Progress</span>
                      <span className="font-semibold">{course.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[var(--secondary-bg)] rounded-full overflow-hidden border border-[var(--border-color)]/30">
                      <div 
                        className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-full transition-all duration-500" 
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
                <div className="aspect-square relative rounded-2xl overflow-hidden border border-[var(--border-color)] group bg-[var(--secondary-bg)] shadow-sm">
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
            <div className="bg-gradient-to-br from-[var(--secondary-bg)] to-[var(--background)] border border-[var(--border-color)] rounded-3xl p-8 md:p-12 text-center space-y-6 relative overflow-hidden shadow-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 to-transparent pointer-events-none" />
              <div className="max-w-xl mx-auto space-y-4 relative z-10">
                <h2 className="text-2xl md:text-3xl font-bold font-heading text-[var(--text-main)] tracking-tight">Let's craft code together</h2>
                <p className="text-sm md:text-base text-[var(--text-secondary)] leading-relaxed">
                  Have an interesting project proposal, contract opening, or just want to chat about developer tooling? Feel free to drop a message.
                </p>
                <div className="pt-2">
                  <Button size="lg" className="h-12 px-6 text-sm font-semibold rounded-xl bg-[var(--primary)] text-white hover:bg-[var(--secondary)] cursor-pointer" asChild>
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
