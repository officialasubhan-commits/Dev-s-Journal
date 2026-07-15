"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { 
  updateCourse, 
  createSection, 
  updateSection, 
  deleteSection, 
  createLesson, 
  updateLesson, 
  deleteLesson,
  reorderCurriculum
} from "../../actions";
import { 
  ArrowLeft, 
  Save, 
  BookOpen, 
  Video, 
  FileText, 
  Code, 
  Link as LinkIcon, 
  Image as ImageIcon,
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Check, 
  HelpCircle,
  Award,
  ChevronRight,
  ShieldCheck,
  Settings,
  DollarSign,
  User,
  Layout,
  PlusCircle
} from "lucide-react";
import Link from "next/link";

export default function CourseEditForm({ initialData }: { initialData: any }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"basic" | "media" | "pricing" | "curriculum" | "quizzes">("basic");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Flat field states
  const [title, setTitle] = useState(initialData.title);
  const [subtitle, setSubtitle] = useState(initialData.subtitle || "");
  const [slug, setSlug] = useState(initialData.slug);
  const [instructor, setInstructor] = useState(initialData.instructor);
  const [instructorBio, setInstructorBio] = useState(initialData.instructorBio || "");
  const [instructorAvatar, setInstructorAvatar] = useState(initialData.instructorAvatar || "");
  const [shortDescription, setShortDescription] = useState(initialData.shortDescription);
  const [description, setDescription] = useState(initialData.description);
  const [coverImage, setCoverImage] = useState(initialData.coverImage || "");
  const [bannerImage, setBannerImage] = useState(initialData.bannerImage || "");
  const [trailerUrl, setTrailerUrl] = useState(initialData.trailerUrl || "");
  const [difficulty, setDifficulty] = useState(initialData.difficulty);
  const [category, setCategory] = useState(initialData.category);
  const [subcategory, setSubcategory] = useState(initialData.subcategory || "");
  const [duration, setDuration] = useState(initialData.duration);
  const [estimatedTime, setEstimatedTime] = useState(initialData.estimatedTime || "");
  const [language, setLanguage] = useState(initialData.language);
  const [isFree, setIsFree] = useState(initialData.isFree);
  const [price, setPrice] = useState(initialData.price);
  const [discountPrice, setDiscountPrice] = useState(initialData.discountPrice || 0);
  const [couponEnabled, setCouponEnabled] = useState(initialData.couponEnabled || false);
  const [status, setStatus] = useState(initialData.status || "DRAFT");
  
  // JSON states
  const [instructorSocials, setInstructorSocials] = useState<any>(
    initialData.instructorSocials || { linkedin: "", twitter: "", github: "" }
  );
  const [certificateIssued, setCertificateIssued] = useState(initialData.certificateIssued || false);
  const [customCertificate, setCustomCertificate] = useState(initialData.customCertificate || "");
  const [completionCert, setCompletionCert] = useState(initialData.completionCert || false);

  // Quizzes list state
  const [quizzes, setQuizzes] = useState<any[]>(initialData.quizzes || []);
  // Resources list state
  const [resources, setResources] = useState<any[]>(initialData.resources || []);

  // Curriculum database-backed states
  const [sections, setSections] = useState<any[]>(initialData.curriculum || []);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  
  // Temporary editing lesson metadata states
  const [lesVideoUrl, setLesVideoUrl] = useState("");
  const [lesPdfUrl, setLesPdfUrl] = useState("");
  const [lesImageUrl, setLesImageUrl] = useState("");
  const [lesSourceCode, setLesSourceCode] = useState("");
  const [lesExternalLink, setLesExternalLink] = useState("");
  const [lesType, setLesType] = useState("video");

  // Save general settings
  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        title,
        subtitle,
        slug,
        instructor,
        instructorBio,
        instructorAvatar,
        shortDescription,
        description,
        coverImage,
        bannerImage,
        trailerUrl,
        difficulty,
        category,
        subcategory,
        duration,
        estimatedTime,
        language,
        isFree,
        price,
        discountPrice: discountPrice || null,
        couponEnabled,
        status,
        instructorSocials,
        certificateIssued,
        customCertificate,
        completionCert,
        quizzes,
        resources,
      };

      const res = await updateCourse(initialData.id, payload);
      if (res.success) {
        alert("Course general settings saved successfully!");
      } else {
        alert("Failed to save course: " + res.error);
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Section CRUD Actions
  const handleAddSection = async () => {
    if (!newSectionTitle.trim()) return;
    const order = sections.length;
    const res = await createSection(initialData.id, newSectionTitle, order);
    if (res.success && res.section) {
      setSections([...sections, { ...res.section, lessons: [] }]);
      setNewSectionTitle("");
    }
  };

  const handleUpdateSectionTitle = async (secId: string, currentTitle: string) => {
    const newTitle = prompt("Update Section Title:", currentTitle);
    if (newTitle === null || !newTitle.trim()) return;
    const res = await updateSection(secId, newTitle);
    if (res.success) {
      setSections(sections.map(s => s.id === secId ? { ...s, title: newTitle } : s));
    }
  };

  const handleDeleteSection = async (secId: string) => {
    if (!confirm("Are you sure you want to delete this section and all its lessons?")) return;
    const res = await deleteSection(secId);
    if (res.success) {
      setSections(sections.filter(s => s.id !== secId));
    }
  };

  // Lesson CRUD Actions
  const handleAddLesson = async (secId: string) => {
    const title = prompt("Lesson Title:");
    if (!title || !title.trim()) return;
    const sec = sections.find(s => s.id === secId);
    const order = sec?.lessons.length || 0;
    const res = await createLesson(secId, title, "10:00", order);
    if (res.success && res.lesson) {
      setSections(sections.map(s => s.id === secId ? { ...s, lessons: [...s.lessons, res.lesson] } : s));
    }
  };

  const handleEditLessonDetails = (lesson: any) => {
    setEditingLessonId(lesson.id);
    setLesVideoUrl(lesson.videoUrl || "");
    setLesPdfUrl(lesson.pdfUrl || "");
    setLesImageUrl(lesson.imageUrl || "");
    setLesSourceCode(lesson.sourceCode || "");
    setLesExternalLink(lesson.externalLink || "");
    setLesType(lesson.lessonType || "video");
  };

  const handleSaveLessonDetails = async (secId: string, lesId: string) => {
    const payload = {
      videoUrl: lesVideoUrl,
      pdfUrl: lesPdfUrl,
      imageUrl: lesImageUrl,
      sourceCode: lesSourceCode,
      externalLink: lesExternalLink,
      lessonType: lesType
    };

    const res = await updateLesson(lesId, payload);
    if (res.success) {
      setSections(sections.map(s => {
        if (s.id === secId) {
          return {
            ...s,
            lessons: s.lessons.map((l: any) => l.id === lesId ? { ...l, ...payload } : l)
          };
        }
        return s;
      }));
      setEditingLessonId(null);
      alert("Lesson metadata updated successfully!");
    } else {
      alert("Failed to update lesson.");
    }
  };

  const handleDeleteLesson = async (secId: string, lesId: string) => {
    if (!confirm("Are you sure you want to delete this lesson?")) return;
    const res = await deleteLesson(lesId);
    if (res.success) {
      setSections(sections.map(s => {
        if (s.id === secId) {
          return {
            ...s,
            lessons: s.lessons.filter((l: any) => l.id !== lesId)
          };
        }
        return s;
      }));
    }
  };

  // Reordering sections and lessons (accessible UI arrows)
  const handleMoveSection = async (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === sections.length - 1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const updated = [...sections];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    // Recalculate orders
    const payload = updated.map((sec, sIdx) => ({
      id: sec.id,
      order: sIdx,
      lessons: sec.lessons.map((les: any, lIdx: number) => ({
        id: les.id,
        order: lIdx
      }))
    }));

    setSections(updated);
    await reorderCurriculum(initialData.id, payload);
  };

  const handleMoveLesson = async (secIndex: number, lesIndex: number, direction: "up" | "down") => {
    const sec = sections[secIndex];
    if (direction === "up" && lesIndex === 0) return;
    if (direction === "down" && lesIndex === sec.lessons.length - 1) return;

    const targetIndex = direction === "up" ? lesIndex - 1 : lesIndex + 1;
    const lessonsCopy = [...sec.lessons];
    const temp = lessonsCopy[lesIndex];
    lessonsCopy[lesIndex] = lessonsCopy[targetIndex];
    lessonsCopy[targetIndex] = temp;

    const updated = sections.map((s, sIdx) => sIdx === secIndex ? { ...s, lessons: lessonsCopy } : s);

    const payload = updated.map((s, sIdx) => ({
      id: s.id,
      order: sIdx,
      lessons: s.lessons.map((les: any, lIdx: number) => ({
        id: les.id,
        order: lIdx
      }))
    }));

    setSections(updated);
    await reorderCurriculum(initialData.id, payload);
  };

  // Resources Manager Helpers
  const addResource = () => {
    const name = prompt("Resource Name (e.g. Source Code Bundle):");
    const fileUrl = prompt("Resource File Link:");
    if (!name || !fileUrl) return;
    setResources([...resources, { name, fileUrl }]);
  };

  const removeResource = (idx: number) => {
    setResources(resources.filter((_, i) => i !== idx));
  };

  // Quizzes MCQ Helpers
  const addQuiz = () => {
    const qTitle = prompt("Quiz Title (e.g. Assessment Quiz 1):");
    if (!qTitle) return;
    setQuizzes([...quizzes, {
      id: `quiz-${Date.now()}`,
      title: qTitle,
      passPercentage: 80,
      questions: []
    }]);
  };

  const removeQuiz = (quizId: string) => {
    setQuizzes(quizzes.filter(q => q.id !== quizId));
  };

  const addQuestionToQuiz = (quizId: string) => {
    const qText = prompt("Question statement/title:");
    if (!qText) return;
    const optionA = prompt("Option A:");
    const optionB = prompt("Option B:");
    const optionC = prompt("Option C:");
    const optionD = prompt("Option D:");
    const correctOpt = prompt("Correct Option Letter (A, B, C, or D):") || "A";

    setQuizzes(quizzes.map(q => {
      if (q.id === quizId) {
        return {
          ...q,
          questions: [
            ...q.questions,
            {
              id: `q-${Date.now()}`,
              text: qText,
              options: [optionA, optionB, optionC, optionD],
              correct: correctOpt.toUpperCase()
            }
          ]
        };
      }
      return q;
    }));
  };

  const removeQuestionFromQuiz = (quizId: string, qId: string) => {
    setQuizzes(quizzes.map(q => {
      if (q.id === quizId) {
        return {
          ...q,
          questions: q.questions.filter((qs: any) => qs.id !== qId)
        };
      }
      return q;
    }));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0 rounded-lg">
          <Link href="/admin/courses"><ArrowLeft className="w-4 h-4" /></Link>
        </Button>
        <div>
          <h1 className="text-xl md:text-2xl font-black font-heading text-[var(--text-main)] tracking-tight">Rebuild Course CMS</h1>
          <p className="text-[11px] text-[var(--text-secondary)]">Complete Teachable-grade learning path administrator panels.</p>
        </div>
      </div>

      {/* Tabs Layout Navigation */}
      <div className="flex flex-wrap border-b border-[var(--border-color)]">
        {[
          { id: "basic", label: "Basic & Instructor", icon: Layout },
          { id: "media", label: "Media Assets", icon: Video },
          { id: "pricing", label: "Pricing & Certificates", icon: Settings },
          { id: "curriculum", label: "Curriculum Builder", icon: BookOpen },
          { id: "quizzes", label: "Quizzes & Resources", icon: ShieldCheck }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${activeTab === tab.id ? "border-[var(--primary)] text-[var(--primary)] font-extrabold" : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-main)]"}`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Tab Panels */}
      <div className="bg-[var(--card)] border border-[var(--border-color)]/80 p-6 rounded-2xl shadow-sm space-y-6">
        
        {/* TABS 1: BASIC INFO */}
        {activeTab === "basic" && (
          <form onSubmit={handleSaveGeneral} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--text-secondary)]">Course Title</label>
                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-[var(--background)] border border-[var(--border-color)] px-3 py-2 rounded-xl text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--primary)]" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--text-secondary)]">Course Subtitle</label>
                <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="w-full bg-[var(--background)] border border-[var(--border-color)] px-3 py-2 rounded-xl text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--primary)]" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--text-secondary)]">Slug (URL endpoint)</label>
                <input type="text" required value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full bg-[var(--background)] border border-[var(--border-color)] px-3 py-2 rounded-xl text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--primary)]" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--text-secondary)]">Course Category</label>
                <input type="text" required value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-[var(--background)] border border-[var(--border-color)] px-3 py-2 rounded-xl text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--primary)]" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--text-secondary)]">Course Subcategory</label>
                <input type="text" value={subcategory} onChange={(e) => setSubcategory(e.target.value)} className="w-full bg-[var(--background)] border border-[var(--border-color)] px-3 py-2 rounded-xl text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--primary)]" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--text-secondary)]">Difficulty Level</label>
                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-full bg-[var(--background)] border border-[var(--border-color)] px-3 py-2 rounded-xl text-xs text-[var(--text-main)] font-semibold cursor-pointer">
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--text-secondary)]">Course Language</label>
                <input type="text" required value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full bg-[var(--background)] border border-[var(--border-color)] px-3 py-2 rounded-xl text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--primary)]" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--text-secondary)]">Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full bg-[var(--background)] border border-[var(--border-color)] px-3 py-2 rounded-xl text-xs text-[var(--text-main)] font-semibold cursor-pointer">
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="SCHEDULED">Scheduled</option>
                  <option value="ARCHIVED">Archived</option>
                  <option value="PRIVATE">Private</option>
                  <option value="FEATURED">Featured</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--text-secondary)]">Total Duration (e.g. 15 hours)</label>
                <input type="text" required value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full bg-[var(--background)] border border-[var(--border-color)] px-3 py-2 rounded-xl text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--primary)]" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--text-secondary)]">Estimated Time (e.g. 4 weeks, 5 hours/week)</label>
                <input type="text" value={estimatedTime} onChange={(e) => setEstimatedTime(e.target.value)} className="w-full bg-[var(--background)] border border-[var(--border-color)] px-3 py-2 rounded-xl text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--primary)]" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--text-secondary)]">Short Description</label>
              <textarea value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} rows={2} className="w-full bg-[var(--background)] border border-[var(--border-color)] px-3 py-2 rounded-xl text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--primary)] resize-none" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--text-secondary)]">Full Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={6} className="w-full bg-[var(--background)] border border-[var(--border-color)] px-3 py-2 rounded-xl text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--primary)]" />
            </div>

            {/* Instructor Details Card */}
            <div className="p-4 border border-[var(--border-color)] rounded-xl space-y-4">
              <h3 className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider">Instructor Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--text-secondary)]">Instructor Name</label>
                  <input type="text" value={instructor} onChange={(e) => setInstructor(e.target.value)} className="w-full bg-[var(--background)] border border-[var(--border-color)] px-3 py-2 rounded-xl text-xs text-[var(--text-main)] focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--text-secondary)]">Avatar Portrait Image URL</label>
                  <input type="text" value={instructorAvatar} onChange={(e) => setInstructorAvatar(e.target.value)} className="w-full bg-[var(--background)] border border-[var(--border-color)] px-3 py-2 rounded-xl text-xs text-[var(--text-main)] focus:outline-none" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--text-secondary)]">Instructor Biography</label>
                <textarea value={instructorBio} onChange={(e) => setInstructorBio(e.target.value)} rows={3} className="w-full bg-[var(--background)] border border-[var(--border-color)] px-3 py-2 rounded-xl text-xs text-[var(--text-main)] focus:outline-none resize-none" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-[var(--text-secondary)]">LinkedIn profile URL</label>
                  <input type="text" value={instructorSocials.linkedin || ""} onChange={(e) => setInstructorSocials({...instructorSocials, linkedin: e.target.value})} className="w-full bg-[var(--background)] border border-[var(--border-color)] px-2 py-1.5 rounded-lg text-xs text-[var(--text-main)]" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-[var(--text-secondary)]">Twitter profile URL</label>
                  <input type="text" value={instructorSocials.twitter || ""} onChange={(e) => setInstructorSocials({...instructorSocials, twitter: e.target.value})} className="w-full bg-[var(--background)] border border-[var(--border-color)] px-2 py-1.5 rounded-lg text-xs text-[var(--text-main)]" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-[var(--text-secondary)]">GitHub profile URL</label>
                  <input type="text" value={instructorSocials.github || ""} onChange={(e) => setInstructorSocials({...instructorSocials, github: e.target.value})} className="w-full bg-[var(--background)] border border-[var(--border-color)] px-2 py-1.5 rounded-lg text-xs text-[var(--text-main)]" />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-[var(--border-color)]">
              <Button type="submit" disabled={isSubmitting} className="h-10 px-6 rounded-xl bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 font-semibold flex items-center gap-2 cursor-pointer shadow-sm">
                <Save className="w-4 h-4" /> {isSubmitting ? "Saving..." : "Save Config"}
              </Button>
            </div>
          </form>
        )}

        {/* TABS 2: MEDIA ASSETS */}
        {activeTab === "media" && (
          <form onSubmit={handleSaveGeneral} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--text-secondary)]">Cover Image Thumbnail URL</label>
                <input type="text" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} className="w-full bg-[var(--background)] border border-[var(--border-color)] px-3 py-2.5 rounded-xl text-xs text-[var(--text-main)]" />
                {coverImage && <div className="mt-2 aspect-video relative rounded-xl overflow-hidden border"><img src={coverImage} className="object-cover w-full h-full" alt="Cover Preview" /></div>}
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--text-secondary)]">Banner Image Backdrop URL</label>
                <input type="text" value={bannerImage} onChange={(e) => setBannerImage(e.target.value)} className="w-full bg-[var(--background)] border border-[var(--border-color)] px-3 py-2.5 rounded-xl text-xs text-[var(--text-main)]" />
                {bannerImage && <div className="mt-2 aspect-[3/1] relative rounded-xl overflow-hidden border"><img src={bannerImage} className="object-cover w-full h-full" alt="Banner Preview" /></div>}
              </div>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--text-secondary)]">Promo Video / Trailer Link URL</label>
              <input type="text" value={trailerUrl} onChange={(e) => setTrailerUrl(e.target.value)} className="w-full bg-[var(--background)] border border-[var(--border-color)] px-3 py-2.5 rounded-xl text-xs text-[var(--text-main)]" placeholder="e.g. YouTube or Vimeo URL" />
            </div>

            <div className="flex justify-end pt-4 border-t border-[var(--border-color)]">
              <Button type="submit" disabled={isSubmitting} className="h-10 px-6 rounded-xl bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 font-semibold flex items-center gap-2 cursor-pointer shadow-sm">
                <Save className="w-4 h-4" /> {isSubmitting ? "Saving..." : "Save Media Assets"}
              </Button>
            </div>
          </form>
        )}

        {/* TABS 3: PRICING & CERTIFICATES */}
        {activeTab === "pricing" && (
          <form onSubmit={handleSaveGeneral} className="space-y-6">
            <div className="p-4 border border-[var(--border-color)] rounded-xl space-y-4">
              <h3 className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider">Pricing Settings (Indian Rupees ₹ only)</h3>
              
              <div className="flex items-center gap-2 cursor-pointer py-1">
                <input type="checkbox" id="isFreeCheckbox" checked={isFree} onChange={(e) => setIsFree(e.target.checked)} className="accent-[var(--primary)] w-4 h-4" />
                <label htmlFor="isFreeCheckbox" className="text-xs font-semibold text-[var(--text-main)] cursor-pointer">This Course is free of cost</label>
              </div>

              {!isFree && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[var(--text-secondary)]">Original Price (₹)</label>
                    <input type="number" value={price} onChange={(e) => setPrice(parseFloat(e.target.value) || 0)} className="w-full bg-[var(--background)] border border-[var(--border-color)] px-3 py-2 rounded-xl text-xs text-[var(--text-main)]" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[var(--text-secondary)]">Discount Price (₹)</label>
                    <input type="number" value={discountPrice} onChange={(e) => setDiscountPrice(parseFloat(e.target.value) || 0)} className="w-full bg-[var(--background)] border border-[var(--border-color)] px-3 py-2 rounded-xl text-xs text-[var(--text-main)]" />
                  </div>
                  <div className="space-y-1 flex flex-col justify-end">
                    <label className="flex items-center gap-2 cursor-pointer py-2 px-3 border border-[var(--border-color)] rounded-xl">
                      <input type="checkbox" checked={couponEnabled} onChange={(e) => setCouponEnabled(e.target.checked)} className="accent-[var(--primary)] w-4.5 h-4.5" />
                      <span className="text-xs font-semibold text-[var(--text-main)]">Coupon discounts enabled</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border border-[var(--border-color)] rounded-xl space-y-4">
              <h3 className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider">Completion Certificates Settings</h3>
              
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={certificateIssued} onChange={(e) => setCertificateIssued(e.target.checked)} className="accent-[var(--primary)] w-4 h-4" />
                  <span className="text-xs font-semibold text-[var(--text-main)]">Issue certificate on completion</span>
                </label>
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={completionCert} onChange={(e) => setCompletionCert(e.target.checked)} className="accent-[var(--primary)] w-4 h-4" />
                  <span className="text-xs font-semibold text-[var(--text-main)]">Enable custom HTML template</span>
                </label>
              </div>

              {completionCert && (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--text-secondary)]">Custom Certificate HTML/CSS template code</label>
                  <textarea value={customCertificate} onChange={(e) => setCustomCertificate(e.target.value)} rows={4} className="w-full bg-[var(--background)] border border-[var(--border-color)] px-3 py-2 rounded-xl font-mono text-[11px] text-[var(--text-main)] focus:outline-none" placeholder="<div style='border: 5px solid gold...'>Certificate details</div>" />
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4 border-t border-[var(--border-color)]">
              <Button type="submit" disabled={isSubmitting} className="h-10 px-6 rounded-xl bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 font-semibold flex items-center gap-2 cursor-pointer shadow-sm">
                <Save className="w-4 h-4" /> {isSubmitting ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          </form>
        )}

        {/* TABS 4: CURRICULUM BUILDER */}
        {activeTab === "curriculum" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-[var(--text-main)] font-heading">Course Curriculum</h3>
                <p className="text-[10px] text-[var(--text-secondary)]">Manage learning sections, topics, and upload source materials.</p>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="New Section Title..."
                  value={newSectionTitle}
                  onChange={(e) => setNewSectionTitle(e.target.value)}
                  className="bg-[var(--background)] border border-[var(--border-color)] px-3 py-1.5 rounded-xl text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--primary)]"
                />
                <Button onClick={handleAddSection} className="h-8 px-4 rounded-xl bg-[var(--primary)] text-white text-xs font-semibold flex items-center gap-1 cursor-pointer">
                  <Plus className="w-3.5 h-3.5" /> Add Section
                </Button>
              </div>
            </div>

            {/* Sections Accordion */}
            <div className="space-y-4">
              {sections.map((sec, secIdx) => (
                <div key={sec.id} className="border border-[var(--border-color)]/80 rounded-2xl overflow-hidden bg-[var(--card)]">
                  {/* Section Title Bar */}
                  <div className="bg-[var(--secondary-bg)]/30 border-b border-[var(--border-color)]/60 px-4 py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold text-[var(--text-muted)] uppercase">Section {secIdx + 1}</span>
                      <h4 className="text-xs font-bold text-[var(--text-main)]">{sec.title}</h4>
                    </div>

                    <div className="flex items-center gap-1">
                      <button onClick={(e) => handleUpdateSectionTitle(sec.id, sec.title)} className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-main)] rounded transition-colors cursor-pointer" title="Rename Section">Edit</button>
                      <button onClick={() => handleMoveSection(secIdx, "up")} disabled={secIdx === 0} className="p-1 text-[var(--text-secondary)] disabled:opacity-30 rounded cursor-pointer" title="Move Section Up">
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleMoveSection(secIdx, "down")} disabled={secIdx === sections.length - 1} className="p-1 text-[var(--text-secondary)] disabled:opacity-30 rounded cursor-pointer" title="Move Section Down">
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDeleteSection(sec.id)} className="p-1.5 text-red-500 hover:bg-red-500/10 rounded transition-colors cursor-pointer" title="Delete Section"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>

                  {/* Lessons list inside Section */}
                  <div className="p-4 space-y-2">
                    {sec.lessons.map((les: any, lesIdx: number) => (
                      <div key={les.id} className="border border-[var(--border-color)]/40 rounded-xl overflow-hidden">
                        <div className="p-3 bg-[var(--background)] flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            {les.lessonType === "video" && <Video className="w-4 h-4 text-blue-500" />}
                            {les.lessonType === "pdf" && <FileText className="w-4 h-4 text-purple-500" />}
                            {les.lessonType === "source" && <Code className="w-4 h-4 text-green-500" />}
                            {les.lessonType === "external" && <LinkIcon className="w-4 h-4 text-orange-500" />}
                            {les.lessonType === "image" && <ImageIcon className="w-4 h-4 text-pink-500" />}

                            <div className="space-y-0.5">
                              <span className="text-[10px] text-[var(--text-main)] font-semibold">{les.title}</span>
                              <span className="text-[9px] text-[var(--text-muted)] font-medium block">{les.duration} Duration</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <Button size="sm" variant="outline" onClick={() => handleEditLessonDetails(les)} className="h-7 px-3 text-[10px] font-bold rounded-lg cursor-pointer">
                              Configure Content
                            </Button>
                            <button onClick={() => handleMoveLesson(secIdx, lesIdx, "up")} disabled={lesIdx === 0} className="p-1 text-[var(--text-secondary)] disabled:opacity-30 rounded cursor-pointer" title="Move Lesson Up">
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button onClick={() => handleMoveLesson(secIdx, lesIdx, "down")} disabled={lesIdx === sec.lessons.length - 1} className="p-1 text-[var(--text-secondary)] disabled:opacity-30 rounded cursor-pointer" title="Move Lesson Down">
                              <ArrowDown className="w-3 h-3" />
                            </button>
                            <button onClick={() => handleDeleteLesson(sec.id, les.id)} className="p-1 text-red-500 hover:bg-red-500/10 rounded cursor-pointer" title="Delete Lesson"><Trash2 className="w-3 h-3" /></button>
                          </div>
                        </div>

                        {/* Lesson Content details editor Panel */}
                        {editingLessonId === les.id && (
                          <div className="p-4 bg-[var(--secondary-bg)]/10 border-t border-[var(--border-color)]/30 space-y-4 text-xs">
                            <h5 className="font-bold text-[var(--primary)]">Configure Content: {les.title}</h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="text-[10px] font-semibold text-[var(--text-secondary)]">Lesson Type</label>
                                <select value={lesType} onChange={(e) => setLesType(e.target.value)} className="w-full bg-[var(--background)] border border-[var(--border-color)] px-2 py-1.5 rounded-lg text-xs font-semibold cursor-pointer">
                                  <option value="video">🎥 Video Course</option>
                                  <option value="pdf">📄 PDF Document</option>
                                  <option value="image">🖼️ Gallery Illustration</option>
                                  <option value="source">💻 Code Sandbox / Text</option>
                                  <option value="external">🔗 External URL Link</option>
                                </select>
                              </div>

                              {lesType === "video" && (
                                <div className="space-y-1">
                                  <label className="text-[10px] font-semibold text-[var(--text-secondary)]">Video Stream URL</label>
                                  <input type="text" value={lesVideoUrl} onChange={(e) => setLesVideoUrl(e.target.value)} className="w-full bg-[var(--background)] border border-[var(--border-color)] px-2 py-1.5 rounded-lg text-xs text-[var(--text-main)]" placeholder="HLS .m3u8, YouTube link, or raw stream" />
                                </div>
                              )}

                              {lesType === "pdf" && (
                                <div className="space-y-1">
                                  <label className="text-[10px] font-semibold text-[var(--text-secondary)]">Syllabus PDF File URL</label>
                                  <input type="text" value={lesPdfUrl} onChange={(e) => setLesPdfUrl(e.target.value)} className="w-full bg-[var(--background)] border border-[var(--border-color)] px-2 py-1.5 rounded-lg text-xs text-[var(--text-main)]" placeholder="PDF attachment url" />
                                </div>
                              )}

                              {lesType === "image" && (
                                <div className="space-y-1">
                                  <label className="text-[10px] font-semibold text-[var(--text-secondary)]">Infographic Image URL</label>
                                  <input type="text" value={lesImageUrl} onChange={(e) => setLesImageUrl(e.target.value)} className="w-full bg-[var(--background)] border border-[var(--border-color)] px-2 py-1.5 rounded-lg text-xs text-[var(--text-main)]" />
                                </div>
                              )}

                              {lesType === "external" && (
                                <div className="space-y-1">
                                  <label className="text-[10px] font-semibold text-[var(--text-secondary)]">External Reference Link</label>
                                  <input type="text" value={lesExternalLink} onChange={(e) => setLesExternalLink(e.target.value)} className="w-full bg-[var(--background)] border border-[var(--border-color)] px-2 py-1.5 rounded-lg text-xs text-[var(--text-main)]" />
                                </div>
                              )}
                            </div>

                            {lesType === "source" && (
                              <div className="space-y-1">
                                <label className="text-[10px] font-semibold text-[var(--text-secondary)]">Coding Source Code snippet / Text Description</label>
                                <textarea value={lesSourceCode} onChange={(e) => setLesSourceCode(e.target.value)} rows={6} className="w-full bg-[var(--background)] border border-[var(--border-color)] px-3 py-2 rounded-xl font-mono text-[11px] text-[var(--text-main)] focus:outline-none" placeholder="// Paste coding snippet here" />
                              </div>
                            )}

                            <div className="flex gap-2 justify-end pt-2 border-t border-[var(--border-color)]/40">
                              <Button type="button" variant="outline" size="sm" onClick={() => setEditingLessonId(null)} className="rounded-lg h-7 px-3 text-[10px] font-semibold cursor-pointer">Cancel</Button>
                              <Button type="button" size="sm" onClick={() => handleSaveLessonDetails(sec.id, les.id)} className="rounded-lg h-7 px-3 text-[10px] font-semibold cursor-pointer bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90">Save Lesson Config</Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    <Button onClick={() => handleAddLesson(sec.id)} size="sm" variant="ghost" className="text-[10px] font-bold text-[var(--primary)] hover:bg-[var(--primary)]/5 mt-2 flex items-center gap-1 cursor-pointer">
                      <PlusCircle className="w-3.5 h-3.5" /> Add Lesson
                    </Button>
                  </div>
                </div>
              ))}
              {sections.length === 0 && (
                <p className="text-xs text-[var(--text-muted)] italic text-center py-6">No curriculum sections created yet. Add one using the form above.</p>
              )}
            </div>
          </div>
        )}

        {/* TABS 5: QUIZZES & RESOURCES */}
        {activeTab === "quizzes" && (
          <div className="space-y-8">
            
            {/* Downloadable Resources Manager */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider">Practice Files & Resources</h3>
                <Button size="sm" onClick={addResource} className="rounded-lg text-[10px] font-bold bg-[var(--primary)] text-white cursor-pointer">
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add Practice File
                </Button>
              </div>
              <div className="space-y-2">
                {resources.map((res, index) => (
                  <div key={index} className="flex items-center justify-between bg-[var(--background)] border border-[var(--border-color)]/70 px-3.5 py-2.5 rounded-xl text-xs text-[var(--text-main)] font-semibold">
                    <div className="space-y-0.5">
                      <div>{res.name}</div>
                      <a href={res.fileUrl} target="_blank" rel="noreferrer" className="text-[10px] text-blue-500 hover:underline">{res.fileUrl}</a>
                    </div>
                    <button onClick={() => removeResource(index)} className="p-1 text-red-500 hover:bg-red-500/10 rounded transition-colors cursor-pointer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {resources.length === 0 && (
                  <p className="text-xs text-[var(--text-muted)] italic">No practice resources listed yet.</p>
                )}
              </div>
            </div>

            {/* Quizzes Manager */}
            <div className="space-y-6 pt-4 border-t border-[var(--border-color)]">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider">MCQ & Practice Quizzes</h3>
                <Button size="sm" onClick={addQuiz} className="rounded-lg text-[10px] font-bold bg-[var(--primary)] text-white cursor-pointer">
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add Quiz
                </Button>
              </div>

              <div className="space-y-4">
                {quizzes.map((quiz) => (
                  <div key={quiz.id} className="border border-[var(--border-color)] p-4 rounded-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-[var(--text-main)]">{quiz.title}</h4>
                        <div className="text-[10px] font-semibold text-[var(--text-secondary)]">Pass rate threshold: {quiz.passPercentage || 80}%</div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button size="sm" variant="outline" onClick={() => addQuestionToQuiz(quiz.id)} className="h-7 px-3 text-[10px] font-bold rounded-lg cursor-pointer">
                          Add Question
                        </Button>
                        <button onClick={() => removeQuiz(quiz.id)} className="p-1 text-red-500 hover:bg-red-500/10 rounded cursor-pointer">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 mt-2">
                      {quiz.questions.map((q: any, qIdx: number) => (
                        <div key={q.id} className="p-3 bg-[var(--background)] border border-[var(--border-color)]/60 rounded-xl text-[11px] space-y-2">
                          <div className="flex justify-between items-start">
                            <span className="font-semibold text-[var(--text-main)]">{qIdx + 1}. {q.text}</span>
                            <button onClick={() => removeQuestionFromQuiz(quiz.id, q.id)} className="p-1 text-red-500 hover:bg-red-500/10 rounded cursor-pointer">
                              &times;
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-[10px] text-[var(--text-secondary)]">
                            <div>A: {q.options[0] || ""}</div>
                            <div>B: {q.options[1] || ""}</div>
                            <div>C: {q.options[2] || ""}</div>
                            <div>D: {q.options[3] || ""}</div>
                          </div>
                          <div className="text-[10px] font-bold text-[var(--primary)] uppercase">Correct option: {q.correct}</div>
                        </div>
                      ))}
                      {quiz.questions.length === 0 && (
                        <p className="text-[10px] text-[var(--text-muted)] italic">No questions added yet. Click 'Add Question'.</p>
                      )}
                    </div>
                  </div>
                ))}
                {quizzes.length === 0 && (
                  <p className="text-xs text-[var(--text-muted)] italic">No quizzes published yet.</p>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-[var(--border-color)]">
              <Button type="button" onClick={handleSaveGeneral} disabled={isSubmitting} className="h-10 px-6 rounded-xl bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 font-semibold flex items-center gap-2 cursor-pointer shadow-sm">
                <Save className="w-4 h-4" /> {isSubmitting ? "Saving..." : "Save Quizzes & Resources"}
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
