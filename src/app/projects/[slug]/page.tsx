import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ExternalLink, Calendar } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await prisma.project.findUnique({ where: { slug } });
  if (!project) return { title: "Project Not Found" };
  return {
    title: project.title,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  if (!slug) notFound();

  const project = await prisma.project.findUnique({
    where: { slug, published: true },
  });

  if (!project) notFound();

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header Section */}
        <div className="space-y-6">
          {project.coverImage && (
            <div className="w-full aspect-video relative rounded-2xl overflow-hidden border border-[var(--border-color)] shadow-2xl">
              <Image src={project.coverImage} alt={project.title} fill className="object-cover" priority />
            </div>
          )}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-glow">
                {project.title}
              </h1>
              <p className="text-xl text-[var(--text-secondary)]">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {project.technologies.map(tech => (
                  <span key={tech} className="px-3 py-1 bg-[var(--primary)]/10 text-[var(--primary)] rounded-full text-sm font-medium border border-[var(--primary)]/20">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex gap-3 shrink-0">
              {project.githubUrl && (
                <Button variant="outline" asChild>
                  <Link href={project.githubUrl} target="_blank">
                    <FaGithub className="w-4 h-4 mr-2" /> GitHub
                  </Link>
                </Button>
              )}
              {project.liveUrl && (
                <Button asChild>
                  <Link href={project.liveUrl} target="_blank">
                    <ExternalLink className="w-4 h-4 mr-2" /> Live Demo
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            {project.content && (
              <section className="glass-card p-6 md:p-8 rounded-2xl space-y-4">
                <h2 className="text-2xl font-bold border-b border-[var(--border-color)] pb-2">Overview</h2>
                <div 
                  className="prose prose-invert max-w-none text-[var(--text-secondary)] leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: project.content }} 
                />
              </section>
            )}

            {project.features && (
              <section className="glass-card p-6 md:p-8 rounded-2xl space-y-4">
                <h2 className="text-2xl font-bold border-b border-[var(--border-color)] pb-2">Key Features</h2>
                <div 
                  className="prose prose-invert max-w-none text-[var(--text-secondary)] leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: project.features }} 
                />
              </section>
            )}

            {project.demoVideo && (
              <section className="space-y-4">
                <h2 className="text-2xl font-bold">Demo Video</h2>
                <div className="w-full aspect-video rounded-xl overflow-hidden border border-[var(--border-color)]">
                  <video src={project.demoVideo} controls className="w-full h-full object-cover" />
                </div>
              </section>
            )}

            {project.images.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-2xl font-bold">Screenshots</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.images.map((img, idx) => (
                    <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-[var(--border-color)] group">
                      <Image src={img} alt={`Screenshot ${idx + 1}`} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
          
          <div className="space-y-6">
            <div className="glass-card p-6 rounded-xl space-y-4">
              <h3 className="font-bold text-lg border-b border-[var(--border-color)] pb-2">Project Details</h3>
              {project.startDate && (
                <div>
                  <span className="text-sm text-[var(--text-secondary)] block">Timeline</span>
                  <span className="flex items-center text-sm mt-1">
                    <Calendar className="w-4 h-4 mr-2 text-[var(--primary)]" />
                    {new Date(project.startDate).toLocaleDateString()} - {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Present'}
                  </span>
                </div>
              )}
            </div>

            {project.challenges && (
              <div className="glass-card p-6 rounded-xl space-y-3 bg-[var(--error)]/5 border-[var(--error)]/20">
                <h3 className="font-bold text-[var(--error)]">Challenges</h3>
                <div 
                  className="prose prose-invert max-w-none text-sm text-[var(--text-secondary)]"
                  dangerouslySetInnerHTML={{ __html: project.challenges }} 
                />
              </div>
            )}

            {project.lessonsLearned && (
              <div className="glass-card p-6 rounded-xl space-y-3 bg-[var(--primary)]/5 border-[var(--primary)]/20">
                <h3 className="font-bold text-[var(--primary)]">Lessons Learned</h3>
                <div 
                  className="prose prose-invert max-w-none text-sm text-[var(--text-secondary)]"
                  dangerouslySetInnerHTML={{ __html: project.lessonsLearned }} 
                />
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
