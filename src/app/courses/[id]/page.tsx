"use client";

import { use, useState } from "react";
import { mockCourses } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { SafeImage } from "@/components/ui/SafeImage";
import { SlideUp, StaggerContainer } from "@/components/ui/animations";
import { 
  Play, 
  ChevronDown, 
  CheckCircle, 
  Star, 
  Clock, 
  BookOpen, 
  Users, 
  Languages, 
  Calendar, 
  Award, 
  FileText, 
  ChevronRight, 
  ArrowLeft 
} from "lucide-react";
import Link from "next/link";

export default function CourseDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const course = mockCourses.find(c => c.id === resolvedParams.id);
  const [openSection, setOpenSection] = useState<string | null>("sec-1");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  if (!course) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <h2 className="text-xl font-bold text-[var(--text-main)]">Course not found</h2>
        <Button asChild>
          <Link href="/courses">Back to Academy</Link>
        </Button>
      </div>
    );
  }

  // Get similar courses (excluding this one)
  const similarCourses = mockCourses.filter(c => c.id !== course.id).slice(0, 2);

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] py-10">
      <div className="container max-w-5xl mx-auto px-6 space-y-10">
        
        {/* Back Link */}
        <Link href="/courses" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors group">
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" /> Back to Academy
        </Link>

        {/* Hero Section Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main Hero and Meta info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--primary)] bg-[var(--primary)]/10 px-3 py-1 rounded-full">
                {course.category} • {course.difficulty}
              </span>
              <h1 className="text-2xl md:text-4xl font-bold font-heading text-[var(--text-main)] tracking-tight leading-tight">
                {course.title}
              </h1>
              <p className="text-sm md:text-base text-[var(--text-secondary)] leading-relaxed">
                {course.shortDescription}
              </p>
            </div>

            {/* Quick stats row */}
            <div className="flex flex-wrap items-center gap-6 py-4 px-5 bg-[var(--secondary-bg)]/40 rounded-2xl border border-[var(--border-color)]/30 text-xs text-[var(--text-secondary)]">
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span className="font-bold text-[var(--text-main)]">{course.rating}</span>
                <span>({course.reviews.length} reviews)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                <span className="font-semibold text-[var(--text-main)]">{course.studentsCount}</span> students
              </div>
              <div className="flex items-center gap-1.5">
                <Languages className="w-4 h-4" />
                <span>{course.language}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>Last updated {course.lastUpdated}</span>
              </div>
            </div>

            {/* Cover and Video Preview block */}
            <div className="relative aspect-video rounded-3xl overflow-hidden border border-[var(--border-color)] group bg-black shadow-sm">
              <SafeImage 
                src={course.coverImage} 
                alt={course.title} 
                fill 
                className="object-cover opacity-80 group-hover:scale-[1.01] transition-all duration-500" 
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <a 
                  href={course.trailerUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-16 h-16 rounded-full bg-white/95 text-[var(--primary)] flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer border border-neutral-200"
                >
                  <Play className="w-6 h-6 fill-[var(--primary)] ml-1" />
                </a>
              </div>
              <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] text-white font-semibold">
                Click to watch promo trailer
              </div>
            </div>

            {/* Outcomes Section */}
            <div className="bg-[var(--card)] border border-[var(--border-color)]/80 p-6 rounded-2xl space-y-4">
              <h2 className="text-lg font-bold font-heading text-[var(--text-main)]">What you will learn</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-[var(--text-secondary)]">
                {course.outcomes.map((outcome, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-[var(--primary)] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{outcome}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Curriculum Curriculum Accordion */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold font-heading text-[var(--text-main)]">Course curriculum</h2>
              <div className="border border-[var(--border-color)]/80 rounded-2xl overflow-hidden divide-y divide-[var(--border-color)]">
                {course.curriculum.map((section) => {
                  const isOpen = openSection === section.id;
                  return (
                    <div key={section.id} className="bg-[var(--card)]">
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="w-full px-5 py-4 flex items-center justify-between font-semibold text-sm text-[var(--text-main)] hover:bg-[var(--secondary-bg)]/20 transition-all text-left"
                      >
                        <span>{section.title}</span>
                        <ChevronDown className={`w-4 h-4 text-[var(--text-secondary)] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                      </button>
                      
                      {isOpen && (
                        <div className="px-5 pb-4 divide-y divide-[var(--border-color)]/40 text-xs text-[var(--text-secondary)]">
                          {section.lessons.map(lesson => (
                            <div key={lesson.id} className="py-2.5 flex items-center justify-between">
                              <span className="font-medium">{lesson.title}</span>
                              <div className="flex items-center gap-3">
                                <span>{lesson.duration}</span>
                                {lesson.isPreview ? (
                                  <span className="text-[9px] font-bold text-[var(--primary)] bg-[var(--primary)]/10 px-2 py-0.5 rounded">Preview</span>
                                ) : (
                                  <span className="text-[9px] font-medium text-[var(--text-muted)]">Locked</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Requirements and Target Audience */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-[var(--card)] border border-[var(--border-color)]/80 p-5 rounded-2xl space-y-3">
                <h3 className="font-bold text-sm text-[var(--text-main)]">Requirements</h3>
                <ul className="list-disc list-inside text-xs text-[var(--text-secondary)] space-y-2 leading-relaxed">
                  {course.requirements.map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-[var(--card)] border border-[var(--border-color)]/80 p-5 rounded-2xl space-y-3">
                <h3 className="font-bold text-sm text-[var(--text-main)]">Who is this course for?</h3>
                <ul className="list-disc list-inside text-xs text-[var(--text-secondary)] space-y-2 leading-relaxed">
                  {course.targetAudience.map((aud, idx) => (
                    <li key={idx}>{aud}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* FAQs */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold font-heading text-[var(--text-main)]">Frequently Asked Questions</h2>
              <div className="space-y-3">
                {course.faqs.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div key={idx} className="bg-[var(--card)] border border-[var(--border-color)]/80 rounded-xl overflow-hidden">
                      <button
                        onClick={() => toggleFaq(idx)}
                        className="w-full px-5 py-3.5 flex items-center justify-between font-semibold text-xs text-[var(--text-main)] hover:bg-[var(--secondary-bg)]/20 transition-all text-left"
                      >
                        <span>{faq.question}</span>
                        <ChevronDown className={`w-4 h-4 text-[var(--text-secondary)] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                      </button>
                      {isOpen && (
                        <p className="px-5 pb-4 text-xs text-[var(--text-secondary)] leading-relaxed">
                          {faq.answer}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="space-y-6">
              <h2 className="text-lg font-bold font-heading text-[var(--text-main)]">Student Feedback</h2>
              <div className="space-y-4">
                {course.reviews.length === 0 ? (
                  <p className="text-xs text-[var(--text-muted)] italic">No reviews recorded yet for this release.</p>
                ) : course.reviews.map((rev) => (
                  <div key={rev.id} className="p-5 bg-[var(--card)] border border-[var(--border-color)]/70 rounded-2xl space-y-3">
                    <div className="flex items-center gap-3">
                      {rev.avatarUrl ? (
                        <img src={rev.avatarUrl} alt={rev.userName} className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[var(--secondary-bg)] flex items-center justify-center font-bold text-xs text-[var(--text-secondary)]">
                          {rev.userName.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-xs text-[var(--text-main)]">{rev.userName}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex text-amber-500">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`w-3 h-3 ${i < rev.rating ? "fill-amber-500 text-amber-500" : "text-neutral-300"}`} />
                            ))}
                          </div>
                          <span className="text-[10px] text-[var(--text-muted)]">{rev.date}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Sticky Side Card */}
          <aside className="lg:col-span-1 lg:sticky lg:top-24 space-y-6">
            <div className="bg-[var(--card)] border border-[var(--border-color)]/80 rounded-2xl p-6 shadow-sm space-y-6">
              
              {/* Price Block */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider block">Price</span>
                <div className="flex items-baseline gap-2">
                  {course.isFree ? (
                    <span className="text-2xl font-black text-[var(--primary)]">Free Tier</span>
                  ) : (
                    <>
                      <span className="text-3xl font-black text-[var(--text-main)]">
                        ${course.discountPrice || course.price}
                      </span>
                      {course.discountPrice && (
                        <span className="text-sm text-[var(--text-muted)] line-through">
                          ${course.price}
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Course Meta Bullets */}
              <div className="space-y-3.5 text-xs text-[var(--text-secondary)]">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Duration</span>
                  <span className="font-semibold text-[var(--text-main)]">{course.duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" /> Lectures</span>
                  <span className="font-semibold text-[var(--text-main)]">{course.lessonsCount} lessons</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><Award className="w-4 h-4" /> Certificate</span>
                  <span className="font-semibold text-[var(--text-main)] text-right">Included</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><FileText className="w-4 h-4" /> Resources</span>
                  <span className="font-semibold text-[var(--text-main)]">12 PDFs & Code Files</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button className="w-full h-11 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white font-semibold cursor-pointer shadow-sm" asChild>
                  <Link href={course.isFree ? "/student/dashboard" : `/checkout?courseId=${course.id}`}>
                    {course.isFree ? "Enroll Now" : "Buy Course"}
                  </Link>
                </Button>
                
                <Button variant="outline" className="w-full h-11 rounded-xl border-[var(--border-color)] hover:bg-[var(--secondary-bg)] font-semibold cursor-pointer">
                  Wishlist Course
                </Button>
              </div>

              {/* Certificate badge info block */}
              <div className="pt-4 border-t border-[var(--border-color)]/50 text-[10px] text-[var(--text-secondary)] leading-relaxed text-center font-medium">
                🔒 30-day money-back guarantee. Instant access.
              </div>
            </div>

            {/* Instructor Quick Profile */}
            <div className="bg-[var(--card)] border border-[var(--border-color)]/80 rounded-2xl p-5 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-[var(--text-main)] uppercase pb-2 border-b border-[var(--border-color)]/60">
                Your Instructor
              </h3>
              <div className="flex items-center gap-3">
                {course.instructorAvatar && (
                  <img src={course.instructorAvatar} alt={course.instructor} className="w-12 h-12 rounded-2xl object-cover" />
                )}
                <div>
                  <h4 className="font-bold text-xs text-[var(--text-main)]">{course.instructor}</h4>
                  <p className="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-wider">Expert Developer</p>
                </div>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed font-normal">
                {course.instructorBio}
              </p>
            </div>
          </aside>

        </div>

        {/* Similar Courses */}
        <section className="space-y-6 pt-10 border-t border-[var(--border-color)]/60">
          <h2 className="text-xl font-bold font-heading text-[var(--text-main)]">Similar Courses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {similarCourses.map(sim => (
              <Link 
                href={`/courses/${sim.id}`}
                key={sim.id}
                className="flex items-center gap-4 bg-[var(--card)] border border-[var(--border-color)]/80 p-4 rounded-xl hover:shadow-sm transition-all group"
              >
                <div className="w-20 h-20 relative rounded-lg overflow-hidden shrink-0 bg-[var(--secondary-bg)]">
                  <SafeImage src={sim.coverImage} alt={sim.title} fill className="object-cover" />
                </div>
                <div className="space-y-1 overflow-hidden">
                  <h3 className="font-bold text-xs text-[var(--text-main)] group-hover:text-[var(--primary)] transition-colors truncate">
                    {sim.title}
                  </h3>
                  <p className="text-[10px] text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                    {sim.shortDescription}
                  </p>
                  <span className="text-[9px] font-bold text-[var(--primary)] block">
                    {sim.isFree ? "Free" : `$${sim.discountPrice || sim.price}`}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
