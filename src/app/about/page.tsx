import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { FaGithub, FaLinkedin, FaDiscord, FaInstagram, FaYoutube, FaFacebook } from "react-icons/fa";
import Link from "next/link";
import { GraduationCap, Briefcase, User, Star, FileText, Terminal, BarChart2 } from "lucide-react";
import { getSiteSettings } from "@/app/admin/settings/actions";

export const metadata: Metadata = {
  title: "About Me",
  description: "Learn more about who I am and what drives me.",
};

export default async function AboutPage() {
  const admin = await prisma.user.findFirst({
    where: { role: "ADMIN" },
  });

  const settings = await getSiteSettings();



  const postsCount = await prisma.post.count({ where: { published: true } });
  const projectsCount = await prisma.project.count({ where: { published: true } });
  const photosCount = await prisma.galleryImage.count();

  const name = admin?.displayName || admin?.name || "Developer";
  const bio = admin?.biography || "Hello! I'm a passionate developer building scalable, user-centric applications. This digital home is my space to document my journey, share my learnings, and showcase the projects I've built. My philosophy is simple: never stop learning.";
  const skills = admin?.skills && admin.skills.length > 0 ? admin.skills : ["Next.js", "React", "TypeScript", "Node.js", "Tailwind CSS"];
  const technologies = admin?.technologies && admin.technologies.length > 0 ? admin.technologies : ["HTML", "CSS", "JavaScript", "TypeScript", "Python", "React", "Next.js", "Node.js", "Git", "GitHub", "PostgreSQL", "Prisma", "Tailwind CSS"];
  const spokenLanguages = admin?.languages && admin.languages.length > 0 ? admin.languages : (admin?.spokenLanguages && admin.spokenLanguages.length > 0 ? admin.spokenLanguages : ["English", "Hindi", "Bengali"]);
  const image = admin?.image || settings?.siteLogo || "/placeholder-avatar.png";

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-4xl mx-auto space-y-16">
        {/* Header / Intro section */}
        <section className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden shrink-0 border border-[var(--border-color)] shadow-lg relative group">
            <img src={image} alt={name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          </div>
          <div className="flex-1 space-y-6 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-glow">
              About <span className="text-[var(--accent)]">Me</span>
            </h1>
            <h2 className="text-2xl text-[var(--text-main)] font-semibold">
              I&apos;m {name}
            </h2>
            {admin?.shortIntroduction && (
              <p className="text-xl text-[var(--primary)] font-medium">
                {admin.shortIntroduction}
              </p>
            )}
            <div className="glass-card p-6 rounded-2xl">
              <div 
                className="prose prose-sm dark:prose-invert max-w-none text-lg text-[var(--text-secondary)] leading-relaxed"
                dangerouslySetInnerHTML={{ __html: bio }}
              />
            </div>

            {/* Social Links */}
            <div className="flex flex-wrap gap-4 justify-center md:justify-start items-center">
              {settings?.githubUrl && (
                <Link href={settings.githubUrl} target="_blank" className="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors">
                  <FaGithub className="w-6 h-6" />
                </Link>
              )}
              {settings?.linkedinUrl && (
                <Link href={settings.linkedinUrl} target="_blank" className="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors">
                  <FaLinkedin className="w-6 h-6" />
                </Link>
              )}
              {settings?.discordUsername && (
                <Link href={settings.discordUsername} target="_blank" rel="noopener noreferrer" className="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors">
                  <FaDiscord className="w-6 h-6" />
                </Link>
              )}
              {settings?.instagramUrl && (
                <Link href={settings.instagramUrl} target="_blank" className="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors">
                  <FaInstagram className="w-6 h-6" />
                </Link>
              )}
              {settings?.youtubeUrl && (
                <Link href={settings.youtubeUrl} target="_blank" className="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors">
                  <FaYoutube className="w-6 h-6" />
                </Link>
              )}
              {settings?.facebookUrl && (
                <Link href={settings.facebookUrl} target="_blank" className="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors">
                  <FaFacebook className="w-6 h-6" />
                </Link>
              )}
              
              {settings?.resumePdf && (
                <a href={settings.resumePdf} target="_blank" rel="noopener noreferrer" className="ml-2 inline-flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white text-sm font-semibold rounded-full hover:bg-[var(--primary)]/90 transition-all shadow-md shadow-[var(--primary)]/20 hover:shadow-lg hover:-translate-y-0.5">
                  <FileText className="w-4 h-4" /> View Resume
                </a>
              )}
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 border-b-4 border-b-[var(--primary)]">
            <BarChart2 className="w-8 h-8 text-[var(--primary)] mb-2 opacity-80" />
            <h3 className="text-4xl font-bold font-heading">{postsCount}</h3>
            <p className="text-[var(--text-secondary)] font-medium uppercase tracking-wider text-sm">Journal Posts</p>
          </div>
          <div className="glass-card p-6 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 border-b-4 border-b-[var(--accent)]">
            <Briefcase className="w-8 h-8 text-[var(--accent)] mb-2 opacity-80" />
            <h3 className="text-4xl font-bold font-heading">{projectsCount}</h3>
            <p className="text-[var(--text-secondary)] font-medium uppercase tracking-wider text-sm">Projects</p>
          </div>
          <div className="glass-card p-6 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 border-b-4 border-b-[var(--highlight)]">
            <Star className="w-8 h-8 text-[var(--highlight)] mb-2 opacity-80" />
            <h3 className="text-4xl font-bold font-heading">{photosCount}</h3>
            <p className="text-[var(--text-secondary)] font-medium uppercase tracking-wider text-sm">Photos Captured</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Work / Education */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-[var(--primary)]" /> Experience & Education
            </h2>
            <div className="glass-card p-6 rounded-2xl space-y-6 h-[calc(100%-3rem)]">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-1">
                  <Briefcase className="w-4 h-4 text-[var(--text-secondary)]" /> Current Role
                </h3>
                <p className="text-[var(--text-main)] font-medium">{admin?.occupation || "Software Engineer"}</p>
                <p className="text-[var(--text-secondary)] text-sm">{admin?.company || "Self-Employed"}</p>
              </div>
              <div className="border-t border-[var(--border-color)]"></div>
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-1 pt-2">
                  <GraduationCap className="w-4 h-4 text-[var(--text-secondary)]" /> Education
                </h3>
                <p className="text-[var(--text-main)] font-medium">{admin?.course || "Computer Science"}</p>
                <p className="text-[var(--text-secondary)] text-sm">{admin?.college || "University"}</p>
              </div>
              {(admin?.country || admin?.city) && (
                <>
                  <div className="border-t border-[var(--border-color)]"></div>
                  <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2 mb-1 pt-2">
                      <User className="w-4 h-4 text-[var(--text-secondary)]" /> Location
                    </h3>
                    <p className="text-[var(--text-main)] font-medium">{[admin.city, admin.state, admin.country].filter(Boolean).join(", ")}</p>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Skills & Technologies */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Star className="w-6 h-6 text-[var(--accent)]" /> Skills & Expertise
            </h2>
            <div className="glass-card p-6 rounded-2xl space-y-6 h-[calc(100%-3rem)]">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
                  <Star className="w-4 h-4 text-[var(--text-secondary)]" /> Core Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill: string, i: number) => (
                    <span key={i} className="px-3 py-1 bg-[var(--background)] border border-[var(--border-color)] text-[var(--text-main)] rounded-full text-sm font-medium hover:border-[var(--primary)] transition-colors">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="border-t border-[var(--border-color)]"></div>
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-3 pt-2">
                  <Terminal className="w-4 h-4 text-[var(--text-secondary)]" /> Technologies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {technologies.map((tech: string, i: number) => (
                    <span key={i} className="px-3 py-1 bg-[var(--background)] border border-[var(--border-color)] text-[var(--text-main)] rounded-md text-sm font-medium hover:border-[var(--accent)] transition-colors">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              
              {spokenLanguages && spokenLanguages.length > 0 && (
                <>
                  <div className="border-t border-[var(--border-color)]"></div>
                  <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2 mb-3 pt-2">
                      <User className="w-4 h-4 text-[var(--text-secondary)]" /> Languages
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {spokenLanguages.map((lang: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-[var(--background)] border border-[var(--border-color)] text-[var(--text-main)] rounded-full text-sm font-medium">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </section>
        </div>


      </div>
    </div>
  );
}
