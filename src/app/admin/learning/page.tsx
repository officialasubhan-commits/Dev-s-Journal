import prisma from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";
import { BookOpen, GraduationCap, Brain, Plus, Trash2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createCourseForm, deleteCourse, createBookForm, deleteBook, createSkillForm, deleteSkill } from "./actions";

export default async function AdminLearningPage() {
  const [courses, books, skills] = await Promise.all([
    prisma.userLearning.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.book.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.skill.findMany({ orderBy: { proficiency: "desc" } }),
  ]);

  const inputCls = "bg-[var(--background)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--primary)] transition-all";

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-bold font-heading bg-clip-text text-transparent bg-gradient-to-r from-[var(--highlight)] to-[var(--primary)]">Learning Management</h1>
        <p className="text-[var(--text-secondary)] mt-1">Manage courses, books, and skills. Changes appear on the public Learning page.</p>
      </div>

      {/* Courses */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold font-heading flex items-center gap-2"><GraduationCap className="w-5 h-5 text-[var(--primary)]" /> Courses & Programs</h2>
        <div className="glass-card rounded-2xl overflow-hidden">
          <form action={createCourseForm} className="p-4 border-b border-[var(--border-color)] bg-[var(--background)]/50 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
            <div>
              <label className="text-xs font-medium text-[var(--text-muted)] block mb-1">Course Title</label>
              <input name="title" required placeholder="e.g. Next.js Advanced" className={`${inputCls} w-full`} />
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--text-muted)] block mb-1">Platform</label>
              <input name="platform" required placeholder="e.g. Udemy, YouTube" className={`${inputCls} w-full`} />
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--text-muted)] block mb-1">Progress %</label>
              <input name="progress" type="number" min="0" max="100" defaultValue="0" className={`${inputCls} w-full`} />
            </div>
            <Button type="submit" className="bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Course
            </Button>
          </form>
          <div className="divide-y divide-[var(--border-color)]">
            {courses.length === 0 ? (
              <p className="p-6 text-[var(--text-muted)] italic text-center">No courses added yet.</p>
            ) : courses.map(course => (
              <div key={course.id} className="p-4 flex items-center gap-4 hover:bg-[var(--background)]/50 transition-colors">
                <div className="flex-1">
                  <p className="font-semibold text-[var(--text-main)]">{course.title}</p>
                  <p className="text-xs text-[var(--text-muted)]">{course.platform}</p>
                </div>
                <div className="w-32 hidden sm:block">
                  <div className="flex justify-between text-xs text-[var(--text-muted)] mb-1">
                    <span>Progress</span><span className="font-bold text-[var(--primary)]">{course.progress}%</span>
                  </div>
                  <div className="h-2 bg-[var(--background)] rounded-full border border-[var(--border-color)] overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] rounded-full" style={{ width: `${course.progress}%` }} />
                  </div>
                </div>
                <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${course.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {course.status === 'COMPLETED' ? 'Done' : 'In Progress'}
                </span>
                <form action={deleteCourse.bind(null, course.id)}>
                  <Button type="submit" variant="ghost" size="sm" className="text-[var(--error)] hover:bg-[var(--error)]/10 h-8 w-8 p-0">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Books */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold font-heading flex items-center gap-2"><BookOpen className="w-5 h-5 text-[var(--accent)]" /> Reading List</h2>
        <div className="glass-card rounded-2xl overflow-hidden">
          <form action={createBookForm} className="p-4 border-b border-[var(--border-color)] bg-[var(--background)]/50 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
            <div>
              <label className="text-xs font-medium text-[var(--text-muted)] block mb-1">Book Title</label>
              <input name="title" required placeholder="Book title" className={`${inputCls} w-full`} />
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--text-muted)] block mb-1">Author</label>
              <input name="author" required placeholder="Author name" className={`${inputCls} w-full`} />
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--text-muted)] block mb-1">Status</label>
              <select name="status" className={`${inputCls} w-full`}>
                <option value="READING">Reading</option>
                <option value="COMPLETED">Completed</option>
                <option value="WANT_TO_READ">Want to Read</option>
              </select>
            </div>
            <Button type="submit" className="bg-[var(--accent)] text-white hover:bg-[var(--accent)]/90 flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Book
            </Button>
          </form>
          <div className="divide-y divide-[var(--border-color)]">
            {books.length === 0 ? (
              <p className="p-6 text-[var(--text-muted)] italic text-center">No books added yet.</p>
            ) : books.map(book => (
              <div key={book.id} className="p-4 flex items-center gap-4 hover:bg-[var(--background)]/50 transition-colors">
                <div className="flex-1">
                  <p className="font-semibold text-[var(--text-main)]">{book.title}</p>
                  <p className="text-xs text-[var(--text-muted)]">by {book.author}</p>
                </div>
                <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${
                  book.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                  book.status === 'READING' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                }`}>{book.status.replace('_', ' ')}</span>
                <form action={deleteBook.bind(null, book.id)}>
                  <Button type="submit" variant="ghost" size="sm" className="text-[var(--error)] hover:bg-[var(--error)]/10 h-8 w-8 p-0">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold font-heading flex items-center gap-2"><Brain className="w-5 h-5 text-[var(--highlight)]" /> Skills Matrix</h2>
        <div className="glass-card rounded-2xl overflow-hidden">
          <form action={createSkillForm} className="p-4 border-b border-[var(--border-color)] bg-[var(--background)]/50 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
            <div>
              <label className="text-xs font-medium text-[var(--text-muted)] block mb-1">Skill Name</label>
              <input name="name" required placeholder="e.g. TypeScript" className={`${inputCls} w-full`} />
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--text-muted)] block mb-1">Category</label>
              <input name="category" required placeholder="e.g. Frontend" className={`${inputCls} w-full`} />
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--text-muted)] block mb-1">Proficiency (0-100)</label>
              <input name="proficiency" type="number" min="0" max="100" defaultValue="75" className={`${inputCls} w-full`} />
            </div>
            <Button type="submit" className="bg-[var(--highlight)] text-white hover:bg-[var(--highlight)]/90 flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Skill
            </Button>
          </form>
          <div className="divide-y divide-[var(--border-color)]">
            {skills.length === 0 ? (
              <p className="p-6 text-[var(--text-muted)] italic text-center">No skills added yet.</p>
            ) : skills.map(skill => (
              <div key={skill.id} className="p-4 flex items-center gap-4 hover:bg-[var(--background)]/50 transition-colors">
                <div className="flex-1">
                  <p className="font-semibold text-[var(--text-main)]">{skill.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">{skill.category}</p>
                </div>
                <div className="w-32 hidden sm:block">
                  <div className="flex justify-between text-xs text-[var(--text-muted)] mb-1">
                    <span>Level</span><span className="font-bold text-[var(--highlight)]">{skill.proficiency}%</span>
                  </div>
                  <div className="h-2 bg-[var(--background)] rounded-full border border-[var(--border-color)] overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[var(--highlight)] to-[var(--primary)] rounded-full" style={{ width: `${skill.proficiency}%` }} />
                  </div>
                </div>
                <form action={deleteSkill.bind(null, skill.id)}>
                  <Button type="submit" variant="ghost" size="sm" className="text-[var(--error)] hover:bg-[var(--error)]/10 h-8 w-8 p-0">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
