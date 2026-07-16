import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { ExternalLink, Rocket } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/client/CardComponents";
import { SlideUp, StaggerContainer } from "@/components/ui/animations";
import { SafeImage } from "@/components/ui/SafeImage";

import { getCachedProjectsList } from "@/lib/cache";

export const metadata: Metadata = {
  title: "Projects",
  description: "A showcase of my recent projects, side-hustles, and experiments.",
};

export default async function ProjectsPage() {
  const projects = await getCachedProjectsList();

  return (
    <div className="container mx-auto px-4 py-16 md:py-24 max-w-6xl">
      <div className="space-y-16">
        <SlideUp className="space-y-6 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--secondary)]/10 text-sm font-medium text-[var(--secondary)] mb-2 border border-[var(--secondary)]/20">
            <Rocket className="w-4 h-4" />
            <span>Portfolio</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[var(--text-main)] font-heading">
            Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--secondary)] to-[var(--primary)]">Projects</span>
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            A curated selection of my recent work, ranging from full-stack applications to open-source tools and creative experiments.
          </p>
        </SlideUp>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.length === 0 ? (
            <SlideUp className="col-span-full glass-card p-12 text-center text-[var(--text-muted)] italic">
              No projects added yet.
            </SlideUp>
          ) : (
            projects.map((project) => (
              <SlideUp key={project.id} className="h-full">
                <Card className="flex flex-col h-full group overflow-hidden border-2 border-transparent hover:border-[var(--primary)]/20">
                  <div className="h-52 bg-[var(--secondary-bg)] w-full flex items-center justify-center relative overflow-hidden">
                    {project.coverImage ? (
                      <SafeImage 
                        src={project.coverImage} 
                        alt={project.title} 
                        fill
                        className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500" 
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 to-[var(--secondary)]/10 flex items-center justify-center">
                        <span className="text-[var(--text-muted)] font-medium font-heading">Project Preview</span>
                      </div>
                    )}
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--card)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <CardHeader className="pt-6 relative z-10">
                    <CardTitle className="group-hover:text-[var(--primary)] transition-colors">{project.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-between relative z-10">
                    <p className="text-[var(--text-secondary)] mb-6 text-sm leading-relaxed line-clamp-3">
                      {project.description}
                    </p>
                    <div className="space-y-6 mt-auto">
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map(tech => (
                          <span key={tech} className="px-2.5 py-1 bg-[var(--background)] border border-[var(--border-color)] text-[var(--text-main)] text-xs rounded-md font-medium">
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-3 pt-2">
                        {project.githubUrl && (
                          <Button variant="outline" size="sm" asChild className="flex-1 rounded-xl">
                            <Link href={project.githubUrl} target="_blank">
                              <FaGithub className="w-4 h-4 mr-2" /> Code
                            </Link>
                          </Button>
                        )}
                        {project.liveUrl && (
                          <Button variant="default" size="sm" asChild className="flex-1 rounded-xl">
                            <Link href={project.liveUrl} target="_blank">
                              <ExternalLink className="w-4 h-4 mr-2" /> Live Demo
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </SlideUp>
            ))
          )}
        </StaggerContainer>
      </div>
    </div>
  );
}
