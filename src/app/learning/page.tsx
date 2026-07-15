import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { SlideUp, StaggerContainer } from "@/components/ui/animations";
import { BrainCircuit, Book, Target } from "lucide-react";

export const metadata: Metadata = {
  title: "Learning Dashboard",
  description: "Tracking my courses, books, and skills.",
};

export default async function LearningPage() {
  // Find the admin user to show their learning data publicly
  const admin = await prisma.user.findFirst({ where: { role: "ADMIN" }, select: { id: true } });
  const adminId = admin?.id;

  const courses = await prisma.userLearning.findMany({
    where: { status: "IN_PROGRESS", ...(adminId ? { userId: adminId } : {}) },
    orderBy: { createdAt: "desc" },
  });

  const books = await prisma.book.findMany({
    where: adminId ? { userId: adminId } : {},
    orderBy: { createdAt: "desc" },
  });

  const skills = await prisma.skill.findMany({
    where: adminId ? { userId: adminId } : {},
    orderBy: { proficiency: "desc" },
  });

  return (
    <div className="container mx-auto px-4 py-16 md:py-24 max-w-6xl">
      <div className="space-y-16">
        <SlideUp className="space-y-6 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--highlight)]/10 text-sm font-medium text-[var(--highlight)] mb-2 border border-[var(--highlight)]/20">
            <BrainCircuit className="w-4 h-4" />
            <span>Knowledge Base</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[var(--text-main)] font-heading">
            Learning <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--highlight)] to-[var(--primary)]">Dashboard</span>
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl">
            A transparent view into my ongoing education, skills matrix, and reading list.
          </p>
        </SlideUp>

        <StaggerContainer className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Focus */}
          <SlideUp className="glass-card p-8 rounded-3xl space-y-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Target className="w-24 h-24 text-[var(--primary)]" />
            </div>
            
            <div className="relative z-10">
              <h2 className="text-2xl font-bold font-heading mb-6 flex items-center gap-2">
                <Target className="w-6 h-6 text-[var(--primary)]" />
                Current Focus
              </h2>
              {courses.length === 0 ? (
                <p className="text-[var(--text-muted)] italic">No courses currently in progress.</p>
              ) : (
                <div className="space-y-6">
                  {courses.map((course) => (
                    <div key={course.id} className="space-y-2">
                      <div className="flex justify-between items-end">
                        <span className="font-medium text-[var(--text-main)]">{course.title}</span>
                        <span className="text-sm font-bold text-[var(--primary)]">{course.progress}%</span>
                      </div>
                      <div className="w-full bg-[var(--background)] rounded-full h-3 border border-[var(--border-color)] overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] relative" 
                          style={{ width: `${course.progress}%` }}
                        >
                          {/* Animated sheen */}
                          <div className="absolute top-0 bottom-0 left-0 w-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </SlideUp>

          {/* Reading List */}
          <SlideUp className="glass-card p-8 rounded-3xl space-y-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Book className="w-24 h-24 text-[var(--secondary)]" />
            </div>
            
            <div className="relative z-10">
              <h2 className="text-2xl font-bold font-heading mb-6 flex items-center gap-2">
                <Book className="w-6 h-6 text-[var(--secondary)]" />
                Reading List
              </h2>
              {books.length === 0 ? (
                <p className="text-[var(--text-muted)] italic">No books in the reading list.</p>
              ) : (
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {books.map((book) => (
                    <div key={book.id} className="flex items-center space-x-4 p-3 rounded-xl hover:bg-[var(--background)]/50 transition-colors border border-transparent hover:border-[var(--border-color)] group/book">
                      <div className="w-14 h-20 bg-[var(--secondary-bg)] rounded-lg flex-shrink-0 overflow-hidden relative shadow-sm group-hover/book:shadow-md transition-shadow">
                        {book.coverImage ? (
                          <img src={book.coverImage} alt={book.title} className="object-cover w-full h-full" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-[var(--text-muted)]">
                            <Book className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-[var(--text-main)] truncate">{book.title}</h3>
                        <p className="text-sm text-[var(--text-secondary)] truncate">{book.author}</p>
                        <span className="inline-block mt-1 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-[var(--background)] border border-[var(--border-color)]">
                          {book.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </SlideUp>
        </StaggerContainer>

        {/* Skills Matrix */}
        <SlideUp className="glass-card p-8 rounded-3xl space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold font-heading">Skills Matrix</h2>
            <p className="text-[var(--text-secondary)] mt-2">Technologies and tools I work with.</p>
          </div>
          
          {skills.length === 0 ? (
            <p className="text-[var(--text-muted)] text-center italic">No skills added yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {skills.map(skill => (
                <div 
                  key={skill.id} 
                  className="bg-[var(--background)] border border-[var(--border-color)] rounded-xl p-4 flex flex-col items-center justify-center text-center hover:border-[var(--primary)] hover:shadow-[0_4px_20px_rgba(249,115,22,0.1)] transition-all duration-300 group cursor-default"
                >
                  <span className="font-medium text-[var(--text-main)] group-hover:text-[var(--primary)] transition-colors">{skill.name}</span>
                  <div className="w-full mt-3 flex gap-1 h-1.5 bg-[var(--secondary-bg)] rounded-full overflow-hidden">
                    <div 
                      className="bg-[var(--primary)] rounded-full" 
                      style={{ width: `${skill.proficiency}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </SlideUp>
      </div>
    </div>
  );
}
