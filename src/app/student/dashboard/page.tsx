"use client";

import { useState } from "react";
import { mockCourses, mockOrders, Course } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { SafeImage } from "@/components/ui/SafeImage";
import { SlideUp, StaggerContainer } from "@/components/ui/animations";
import { 
  GraduationCap, 
  Award, 
  Heart, 
  History, 
  Settings, 
  Play, 
  CheckCircle, 
  Clock, 
  BookOpen, 
  ExternalLink,
  ChevronRight,
  User,
  ShieldAlert
} from "lucide-react";
import Link from "next/link";

export default function StudentDashboardPage() {
  const [activeTab, setActiveTab] = useState<"courses" | "certificates" | "wishlist" | "orders" | "settings">("courses");
  
  // Settings Form States
  const [studentName, setStudentName] = useState("Jane Doe");
  const [studentEmail, setStudentEmail] = useState("jane@example.com");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Active courses mockup (simulating courses in progress vs completed)
  const activeCourses = [
    { course: mockCourses[0], progress: 65, status: "In Progress" },
    { course: mockCourses[1], progress: 100, status: "Completed" }
  ];

  const wishlistCourses = [mockCourses[2]];

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] py-12">
      <div className="container max-w-5xl mx-auto px-6 space-y-10">
        
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-[var(--border-color)]/60">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[var(--primary)]/10 border border-[var(--primary)]/20 flex items-center justify-center text-[var(--primary)]">
              <User className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h1 className="text-xl md:text-2xl font-bold font-heading text-[var(--text-main)] tracking-tight">
                Welcome back, {studentName}!
              </h1>
              <p className="text-xs text-[var(--text-secondary)]">
                Student Account • Tracking 2 enrolled courses
              </p>
            </div>
          </div>
          
          <Button variant="outline" className="h-9 px-4 rounded-xl text-xs font-semibold cursor-pointer border-[var(--border-color)]" asChild>
            <Link href="/courses">Browse More Courses</Link>
          </Button>
        </div>

        {/* Dashboard grid (Navigation + Tabs pane) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
          
          {/* Side Menu */}
          <nav className="bg-[var(--card)] border border-[var(--border-color)]/80 p-4 rounded-2xl flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-x-visible scrollbar-none shadow-sm shrink-0">
            {[
              { id: "courses", label: "My Learning", icon: GraduationCap },
              { id: "certificates", label: "Certificates", icon: Award },
              { id: "wishlist", label: "Wishlist", icon: Heart },
              { id: "orders", label: "Order History", icon: History },
              { id: "settings", label: "Account Settings", icon: Settings }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left whitespace-nowrap cursor-pointer ${activeTab === tab.id ? "bg-[var(--primary)] border-[var(--primary)]/10 text-white shadow-sm" : "text-[var(--text-secondary)] hover:bg-[var(--secondary-bg)]/20 hover:text-[var(--text-main)]"}`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Active Tab Pane Content */}
          <div className="md:col-span-3 min-h-[50vh]">
            
            {/* 1. COURSES TAB */}
            {activeTab === "courses" && (
              <div className="space-y-6">
                <h2 className="font-bold text-sm text-[var(--text-main)] uppercase tracking-wider">
                  Active Enrolled Courses
                </h2>
                
                <StaggerContainer className="grid grid-cols-1 gap-4">
                  {activeCourses.map(({ course, progress, status }) => (
                    <SlideUp key={course.id}>
                      <div className="bg-[var(--card)] border border-[var(--border-color)]/70 p-5 rounded-2xl flex flex-col sm:flex-row items-center gap-5 hover:shadow-sm transition-all relative overflow-hidden group">
                        
                        {/* Course Card Preview */}
                        <div className="w-full sm:w-36 aspect-video sm:aspect-auto sm:h-24 relative rounded-xl overflow-hidden shrink-0 bg-[var(--secondary-bg)] border border-[var(--border-color)]/50">
                          <SafeImage src={course.coverImage} alt={course.title} fill className="object-cover" />
                          <div className="absolute inset-0 bg-black/35 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Play className="w-8 h-8 text-white fill-white" />
                          </div>
                        </div>

                        {/* Summary Details */}
                        <div className="flex-1 space-y-3 w-full">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                                {course.category} • {course.difficulty}
                              </span>
                              <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${status === "Completed" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                                {status}
                              </span>
                            </div>
                            <h3 className="font-bold text-sm text-[var(--text-main)] group-hover:text-[var(--primary)] transition-colors leading-snug">
                              {course.title}
                            </h3>
                          </div>

                          {/* Progress Indicators */}
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-[10px] text-[var(--text-secondary)] font-medium">
                              <span>Syllabus Completion</span>
                              <span className="font-bold text-[var(--text-main)]">{progress}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-[var(--secondary-bg)] rounded-full overflow-hidden border border-[var(--border-color)]/30">
                              <div 
                                className={`h-full rounded-full transition-all duration-500 ${status === "Completed" ? "bg-green-600" : "bg-[var(--primary)]"}`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Interactive trigger */}
                        <Button variant="outline" size="sm" className="w-full sm:w-auto h-9 px-4 rounded-xl text-xs font-bold shrink-0 border-[var(--border-color)] hover:bg-[var(--secondary-bg)] cursor-pointer" asChild>
                          <Link href={`/courses/${course.id}`}>
                            {progress === 100 ? "Review syllabus" : "Continue"}
                          </Link>
                        </Button>

                      </div>
                    </SlideUp>
                  ))}
                </StaggerContainer>
              </div>
            )}

            {/* 2. CERTIFICATES TAB */}
            {activeTab === "certificates" && (
              <div className="space-y-6">
                <h2 className="font-bold text-sm text-[var(--text-main)] uppercase tracking-wider">
                  Certificates Earned
                </h2>
                
                <div className="bg-[var(--card)] border border-[var(--border-color)]/70 p-6 rounded-2xl space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-600">
                      <Award className="w-6 h-6" />
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <h3 className="font-bold text-sm text-[var(--text-main)]">Modern UI/UX Design System Essentials</h3>
                      <p className="text-[10px] text-[var(--text-secondary)]">Issued: June 2026 • Credential: UX-DS-Essentials-990</p>
                    </div>
                    <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold rounded-lg border-[var(--border-color)] cursor-pointer" onClick={() => alert("Downloading PDF credential...")}>
                      Download PDF
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* 3. WISHLIST TAB */}
            {activeTab === "wishlist" && (
              <div className="space-y-6">
                <h2 className="font-bold text-sm text-[var(--text-main)] uppercase tracking-wider">
                  My Wishlist Courses
                </h2>
                
                {wishlistCourses.length === 0 ? (
                  <p className="text-xs text-[var(--text-muted)] italic">Your wishlist is empty.</p>
                ) : (
                  <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {wishlistCourses.map(course => (
                      <SlideUp key={course.id}>
                        <div className="bg-[var(--card)] border border-[var(--border-color)]/70 rounded-xl overflow-hidden p-3.5 flex items-center gap-3">
                          <div className="w-16 h-12 relative rounded bg-[var(--secondary-bg)] border border-[var(--border-color)]/50 shrink-0 overflow-hidden">
                            <SafeImage src={course.coverImage} alt={course.title} fill className="object-cover" />
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <h3 className="font-bold text-xs text-[var(--text-main)] truncate">{course.title}</h3>
                            <span className="text-[10px] font-semibold text-[var(--primary)]">
                              {course.isFree ? "Free" : `₹${course.discountPrice || course.price}`}
                            </span>
                          </div>
                          <Button variant="default" size="sm" className="h-7 px-2 rounded-lg text-[9px] font-bold shrink-0 cursor-pointer" asChild>
                            <Link href={`/courses/${course.id}`}>View</Link>
                          </Button>
                        </div>
                      </SlideUp>
                    ))}
                  </StaggerContainer>
                )}
              </div>
            )}

            {/* 4. ORDERS HISTORY TAB */}
            {activeTab === "orders" && (
              <div className="space-y-6">
                <h2 className="font-bold text-sm text-[var(--text-main)] uppercase tracking-wider">
                  Purchase History Logs
                </h2>

                <div className="bg-[var(--card)] border border-[var(--border-color)]/80 rounded-2xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[var(--secondary-bg)]/40 border-b border-[var(--border-color)]/60 text-[var(--text-secondary)] font-bold">
                          <th className="p-4">Order ID</th>
                          <th className="p-4">Course Item</th>
                          <th className="p-4">Date</th>
                          <th className="p-4">Total</th>
                          <th className="p-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--border-color)] text-[var(--text-secondary)]">
                        {mockOrders.map((ord) => (
                          <tr key={ord.id} className="hover:bg-[var(--secondary-bg)]/10 transition-colors">
                            <td className="p-4 font-mono font-bold text-[var(--text-main)]">{ord.id}</td>
                            <td className="p-4 font-semibold text-[var(--text-main)]">{ord.courseTitle}</td>
                            <td className="p-4">{ord.date}</td>
                            <td className="p-4 font-bold text-[var(--text-main)]">₹{ord.price}</td>
                            <td className="p-4">
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-green-100 text-green-700">
                                {ord.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 5. ACCOUNT SETTINGS TAB */}
            {activeTab === "settings" && (
              <div className="space-y-6">
                <h2 className="font-bold text-sm text-[var(--text-main)] uppercase tracking-wider">
                  Personal Information
                </h2>

                <form onSubmit={handleSaveSettings} className="bg-[var(--card)] border border-[var(--border-color)]/85 p-6 rounded-2xl space-y-4 shadow-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[var(--text-secondary)]" htmlFor="profileName">Student Name</label>
                      <input
                        id="profileName"
                        type="text"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        className="w-full bg-[var(--background)] border border-[var(--border-color)] px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-medium"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[var(--text-secondary)]" htmlFor="profileEmail">Email Address</label>
                      <input
                        id="profileEmail"
                        type="email"
                        value={studentEmail}
                        onChange={(e) => setStudentEmail(e.target.value)}
                        className="w-full bg-[var(--background)] border border-[var(--border-color)] px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-medium"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button type="submit" className="h-10 px-6 rounded-xl bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 font-semibold cursor-pointer">
                      Save Profile Changes
                    </Button>
                  </div>

                  {saveSuccess && (
                    <p className="text-xs text-green-600 font-semibold animate-pulse pt-2">
                      ✓ Profile details updated successfully!
                    </p>
                  )}
                </form>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
