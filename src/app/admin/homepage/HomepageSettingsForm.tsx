"use client";

import { useState } from "react";
import { saveHomepageSettings } from "../settings/actions";
import { Button } from "@/components/ui/button";
import { ImageManager } from "@/components/admin/ImageManager";
import { Sparkles, ArrowRight, User, Globe, Link2, Sparkle, Loader2 } from "lucide-react";

interface HomepageSettingsFormProps {
  settings: any;
  projects: any[];
  posts: any[];
  certifications: any[];
  courses: any[];
}

export function HomepageSettingsForm({
  settings,
  projects,
  posts,
  certifications,
  courses
}: HomepageSettingsFormProps) {
  const [activeTab, setActiveTab] = useState<"hero" | "profile" | "featured">("hero");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Selected values tracking
  const [selectedProjects, setSelectedProjects] = useState<string[]>(settings?.featuredProjects || []);
  const [selectedPosts, setSelectedPosts] = useState<string[]>(settings?.featuredPosts || []);
  const [selectedCertificates, setSelectedCertificates] = useState<string[]>(settings?.featuredCertificates || []);
  const [selectedCourses, setSelectedCourses] = useState<string[]>(settings?.featuredCourses || []);

  const [highlightedWords, setHighlightedWords] = useState<string[]>(
    settings?.heroHighlighted ? settings.heroHighlighted.split(",").map((s: string) => s.trim()).filter(Boolean) : []
  );
  const [newWord, setNewWord] = useState("");

  const addWord = (e: React.MouseEvent) => {
    e.preventDefault();
    if (newWord.trim() && !highlightedWords.includes(newWord.trim())) {
      setHighlightedWords([...highlightedWords, newWord.trim()]);
      setNewWord("");
    }
  };

  const removeWord = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    setHighlightedWords(highlightedWords.filter((_, i) => i !== index));
  };


  const handleCheckboxChange = (id: string, list: string[], setList: (val: string[]) => void) => {
    if (list.includes(id)) {
      setList(list.filter(item => item !== id));
    } else {
      setList([...list, id]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    const data = new FormData(e.currentTarget);
    
    // Append array items
    selectedProjects.forEach(id => data.append("featuredProjects", id));
    selectedPosts.forEach(id => data.append("featuredPosts", id));
    selectedCertificates.forEach(id => data.append("featuredCertificates", id));
    selectedCourses.forEach(id => data.append("featuredCourses", id));
    
    data.set("heroHighlighted", highlightedWords.join(","));

    try {
      const res = await saveHomepageSettings(data);
      if (res?.error) {
        setError(res.error);
      } else {
        setSuccess(res?.success || "Settings saved successfully!");
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Messages */}
      {success && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-600 rounded-xl text-sm font-semibold flex items-center gap-2">
          <Sparkles className="w-5 h-5 shrink-0" />
          <span>{success}</span>
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm font-semibold">
          {error}
        </div>
      )}

      {/* Tabs Menu */}
      <div className="flex border-b border-[var(--border-color)]">
        {[
          { id: "hero", label: "Hero Customizer", icon: Sparkle },
          { id: "profile", label: "Author Profile Card", icon: User },
          { id: "featured", label: "Featured Collections", icon: Link2 }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${activeTab === tab.id ? "border-[var(--primary)] text-[var(--primary)] font-extrabold" : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-main)]"}`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="bg-[var(--card)] border border-[var(--border-color)]/80 p-6 rounded-2xl shadow-sm space-y-6 max-w-4xl">
        
        {/* 1. HERO CUSTOMIZER */}
        {activeTab === "hero" && (
          <div className="space-y-6">
            <h2 className="text-sm font-bold text-[var(--text-main)] uppercase tracking-wider pb-3 border-b border-[var(--border-color)]/60">
              Hero Section Layout
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--text-secondary)]" htmlFor="heroTitle">Hero Title Heading</label>
                  <input
                    id="heroTitle"
                    name="heroTitle"
                    type="text"
                    defaultValue={settings?.heroTitle || ""}
                    className="w-full bg-[var(--background)] border border-[var(--border-color)] px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--text-secondary)]">Highlighted Heading Words (Typing Animation)</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newWord}
                      onChange={(e) => setNewWord(e.target.value)}
                      placeholder="Add a word..."
                      className="w-full bg-[var(--background)] border border-[var(--border-color)] px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)]"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addWord(e as any);
                        }
                      }}
                    />
                    <Button onClick={addWord} type="button" className="h-[38px] px-4 rounded-xl bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 text-xs font-semibold cursor-pointer shrink-0">Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {highlightedWords.map((word, index) => (
                      <div key={index} className="flex items-center gap-1.5 bg-[var(--secondary-bg)] border border-[var(--border-color)] px-3 py-1.5 rounded-lg text-xs font-semibold text-[var(--text-main)]">
                        <span>{word}</span>
                        <button type="button" onClick={(e) => removeWord(index, e)} className="text-[var(--text-muted)] hover:text-red-500 cursor-pointer">
                          &times;
                        </button>
                      </div>
                    ))}
                    {highlightedWords.length === 0 && (
                      <p className="text-xs text-[var(--text-muted)] italic">No words added yet.</p>
                    )}
                  </div>
                  <p className="text-[10px] text-[var(--text-muted)] mt-1">These words will cycle in the typing animation on the homepage hero section.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--text-secondary)]" htmlFor="heroDescription">Hero Paragraph Subtext</label>
                  <textarea
                    id="heroDescription"
                    name="heroDescription"
                    rows={4}
                    defaultValue={settings?.heroDescription || ""}
                    className="w-full bg-[var(--background)] border border-[var(--border-color)] px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] leading-relaxed resize-none"
                  />
                </div>
              </div>

              {/* Decor & Buttons */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--text-secondary)]" htmlFor="heroBgDecor">Background Glow Decoration</label>
                  <select
                    id="heroBgDecor"
                    name="heroBgDecor"
                    defaultValue={settings?.heroBgDecor || "glow"}
                    className="w-full bg-[var(--background)] border border-[var(--border-color)] px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-semibold cursor-pointer"
                  >
                    <option value="glow">Orange Ambient Glow</option>
                    <option value="none">Clean Plain Canvas</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[var(--text-secondary)]" htmlFor="heroBtnPrimaryText">Primary Button Text</label>
                    <input
                      id="heroBtnPrimaryText"
                      name="heroBtnPrimaryText"
                      type="text"
                      defaultValue={settings?.heroBtnPrimaryText || ""}
                      className="w-full bg-[var(--background)] border border-[var(--border-color)] px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[var(--text-secondary)]" htmlFor="heroBtnPrimaryLink">Primary Button Route</label>
                    <input
                      id="heroBtnPrimaryLink"
                      name="heroBtnPrimaryLink"
                      type="text"
                      defaultValue={settings?.heroBtnPrimaryLink || ""}
                      className="w-full bg-[var(--background)] border border-[var(--border-color)] px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[var(--text-secondary)]" htmlFor="heroBtnSecondaryText">Secondary Button Text</label>
                    <input
                      id="heroBtnSecondaryText"
                      name="heroBtnSecondaryText"
                      type="text"
                      defaultValue={settings?.heroBtnSecondaryText || ""}
                      className="w-full bg-[var(--background)] border border-[var(--border-color)] px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[var(--text-secondary)]" htmlFor="heroBtnSecondaryLink">Secondary Button Route</label>
                    <input
                      id="heroBtnSecondaryLink"
                      name="heroBtnSecondaryLink"
                      type="text"
                      defaultValue={settings?.heroBtnSecondaryLink || ""}
                      className="w-full bg-[var(--background)] border border-[var(--border-color)] px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. AUTHOR PROFILE CARD */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            <h2 className="text-sm font-bold text-[var(--text-main)] uppercase tracking-wider pb-3 border-b border-[var(--border-color)]/60">
              Personal Profile Card Info
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              
              {/* Profile Image Manager */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-[var(--text-secondary)]">Profile Portrait Image</label>
                <ImageManager 
                  name="heroProfileImage" 
                  defaultValue={settings?.heroProfileImage || ""} 
                  label="Upload Profile Avatar"
                  aspect={1}
                  circularCrop={false}
                />
              </div>

              {/* Text metadata */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--text-secondary)]" htmlFor="authorTitle">Occupancy Title</label>
                  <input
                    id="authorTitle"
                    name="authorTitle"
                    type="text"
                    defaultValue={settings?.authorTitle || ""}
                    className="w-full bg-[var(--background)] border border-[var(--border-color)] px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--text-secondary)]" htmlFor="authorBio">Short Biography Introduction</label>
                  <textarea
                    id="authorBio"
                    name="authorBio"
                    rows={4}
                    defaultValue={settings?.authorBio || ""}
                    className="w-full bg-[var(--background)] border border-[var(--border-color)] px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] leading-relaxed resize-none"
                  />
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 3. FEATURED COLLECTIONS */}
        {activeTab === "featured" && (
          <div className="space-y-6">
            <h2 className="text-sm font-bold text-[var(--text-main)] uppercase tracking-wider pb-3 border-b border-[var(--border-color)]/60">
              Select Featured Homepage Items
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Featured Projects Selection */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Featured Projects (Select 2)</label>
                <div className="max-h-48 overflow-y-auto border border-[var(--border-color)] rounded-xl p-3.5 space-y-2 bg-[var(--background)] scrollbar-thin">
                  {projects.length === 0 ? (
                    <p className="text-xs text-[var(--text-muted)] italic">No projects found.</p>
                  ) : projects.map(proj => (
                    <label key={proj.id} className="flex items-center gap-2 text-xs text-[var(--text-secondary)] cursor-pointer hover:text-[var(--text-main)] truncate">
                      <input
                        type="checkbox"
                        checked={selectedProjects.includes(proj.id)}
                        onChange={() => handleCheckboxChange(proj.id, selectedProjects, setSelectedProjects)}
                        className="accent-[var(--primary)]"
                      />
                      <span>{proj.title}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Featured Posts Selection */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Featured Articles (Select 3)</label>
                <div className="max-h-48 overflow-y-auto border border-[var(--border-color)] rounded-xl p-3.5 space-y-2 bg-[var(--background)] scrollbar-thin">
                  {posts.length === 0 ? (
                    <p className="text-xs text-[var(--text-muted)] italic">No posts found.</p>
                  ) : posts.map(post => (
                    <label key={post.id} className="flex items-center gap-2 text-xs text-[var(--text-secondary)] cursor-pointer hover:text-[var(--text-main)] truncate">
                      <input
                        type="checkbox"
                        checked={selectedPosts.includes(post.id)}
                        onChange={() => handleCheckboxChange(post.id, selectedPosts, setSelectedPosts)}
                        className="accent-[var(--primary)]"
                      />
                      <span>{post.title}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Featured Certificates */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Featured Certificates</label>
                <div className="max-h-48 overflow-y-auto border border-[var(--border-color)] rounded-xl p-3.5 space-y-2 bg-[var(--background)] scrollbar-thin">
                  {certifications.length === 0 ? (
                    <p className="text-xs text-[var(--text-muted)] italic">No certifications found in database.</p>
                  ) : certifications.map(c => (
                    <label key={c.id} className="flex items-center gap-2 text-xs text-[var(--text-secondary)] cursor-pointer hover:text-[var(--text-main)] truncate">
                      <input
                        type="checkbox"
                        checked={selectedCertificates.includes(c.id)}
                        onChange={() => handleCheckboxChange(c.id, selectedCertificates, setSelectedCertificates)}
                        className="accent-[var(--primary)]"
                      />
                      <span>{c.title}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Featured Courses */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Featured Learning Courses</label>
                <div className="max-h-48 overflow-y-auto border border-[var(--border-color)] rounded-xl p-3.5 space-y-2 bg-[var(--background)] scrollbar-thin">
                  {courses.length === 0 ? (
                    <p className="text-xs text-[var(--text-muted)] italic">No courses found in database.</p>
                  ) : courses.map(c => (
                    <label key={c.id} className="flex items-center gap-2 text-xs text-[var(--text-secondary)] cursor-pointer hover:text-[var(--text-main)] truncate">
                      <input
                        type="checkbox"
                        checked={selectedCourses.includes(c.id)}
                        onChange={() => handleCheckboxChange(c.id, selectedCourses, setSelectedCourses)}
                        className="accent-[var(--primary)]"
                      />
                      <span>{c.title}</span>
                    </label>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Submit Bar */}
        <div className="flex justify-end pt-4 border-t border-[var(--border-color)]/60">
          <Button type="submit" disabled={isLoading} className="h-10 px-6 rounded-xl bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-sm">
            {isLoading ? (
              <>
                <Loader2 className="w-4.5 h-4.5 animate-spin" />
                <span>Saving Config...</span>
              </>
            ) : (
              <span>Save Homepage Configurations</span>
            )}
          </Button>
        </div>

      </form>
    </div>
  );
}
