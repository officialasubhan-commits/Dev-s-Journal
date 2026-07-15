"use client";

import { useState } from "react";
import { saveHomepageSettings } from "../settings/actions";
import { Button } from "@/components/ui/button";
import { ImageManager } from "@/components/admin/ImageManager";
import { Sparkles, ArrowRight, User, Globe, Link2, Sparkle, Loader2, ArrowUp, ArrowDown, Pencil, Check, Trash2, Palette, Settings } from "lucide-react";
import { TypingAnimation } from "@/components/home/TypingAnimation";

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

  const [typingConfig, setTypingConfig] = useState<any>(
    settings?.typingConfig || {
      textColor: "#F97316",
      cursorColor: "#F97316",
      cursorWidth: "3px",
      cursorBlinkSpeed: "1s",
      typingSpeed: 100,
      deleteSpeed: 50,
      delayBetweenWords: 2000,
      animationDelay: 800,
      fontWeight: "700",
      fontSize: "inherit",
      textTransform: "none",
      letterSpacing: "normal",
      gradientEnabled: false,
      gradientStart: "#F97316",
      gradientEnd: "#FB7185",
      shadowEnabled: false,
      animationEnabled: true,
      fontFamily: "inherit",
      lineHeight: "normal",
      wordSpacing: "normal"
    }
  );

  const updateConfig = (key: string, value: any) => {
    setTypingConfig((prev: any) => ({
      ...prev,
      [key]: value
    }));
  };

  const COLOR_PRESETS = [
    { name: "Warm Gold", textColor: "#D4AF37", gradientEnabled: false },
    { name: "Amber", textColor: "#F59E0B", gradientEnabled: false },
    { name: "Copper", textColor: "#B87333", gradientEnabled: false },
    { name: "Sunset Orange", textColor: "#FF4500", gradientEnabled: false },
    { name: "Terracotta", textColor: "#E2725B", gradientEnabled: false },
    { name: "Burnt Orange", textColor: "#CC5500", gradientEnabled: false },
    { name: "Premium Bronze", textColor: "#CD7F32", gradientEnabled: false },
    { name: "Champagne Gold", textColor: "#F7E7CE", gradientEnabled: false },
    { name: "Cream", textColor: "#FFFDD0", gradientEnabled: false },
    { name: "Warm White", textColor: "#FDFBF7", gradientEnabled: false },
    { name: "Soft Peach", textColor: "#FFDAB9", gradientEnabled: false },
    { name: "Deep Brown", textColor: "#5C4033", gradientEnabled: false },
    { name: "Slate Gray", textColor: "#708090", gradientEnabled: false },
    { name: "Charcoal", textColor: "#36454F", gradientEnabled: false },
    // Gradients
    { name: "Gold → Orange", textColor: "#D4AF37", gradientEnabled: true, gradientStart: "#D4AF37", gradientEnd: "#FF4500" },
    { name: "Copper → Bronze", textColor: "#B87333", gradientEnabled: true, gradientStart: "#B87333", gradientEnd: "#CD7F32" },
    { name: "Amber → Cream", textColor: "#F59E0B", gradientEnabled: true, gradientStart: "#F59E0B", gradientEnd: "#FFFDD0" },
    { name: "Brown → Gold", textColor: "#5C4033", gradientEnabled: true, gradientStart: "#5C4033", gradientEnd: "#D4AF37" }
  ];

  // Selected values tracking
  const [selectedProjects, setSelectedProjects] = useState<string[]>(settings?.featuredProjects || []);
  const [selectedPosts, setSelectedPosts] = useState<string[]>(settings?.featuredPosts || []);
  const [selectedCertificates, setSelectedCertificates] = useState<string[]>(settings?.featuredCertificates || []);
  const [selectedCourses, setSelectedCourses] = useState<string[]>(settings?.featuredCourses || []);

  const [highlightedWords, setHighlightedWords] = useState<string[]>(
    settings?.heroHighlighted ? settings.heroHighlighted.split(",").map((s: string) => s.trim()).filter(Boolean) : []
  );
  const [newWord, setNewWord] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");

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
    if (editingIndex === index) {
      setEditingIndex(null);
    }
  };

  const moveWord = (index: number, direction: "up" | "down", e: React.MouseEvent) => {
    e.preventDefault();
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === highlightedWords.length - 1) return;

    const newIndex = direction === "up" ? index - 1 : index + 1;
    const newList = [...highlightedWords];
    const temp = newList[index];
    newList[index] = newList[newIndex];
    newList[newIndex] = temp;
    setHighlightedWords(newList);

    if (editingIndex === index) {
      setEditingIndex(newIndex);
    } else if (editingIndex === newIndex) {
      setEditingIndex(index);
    }
  };

  const startEdit = (index: number, word: string, e: React.MouseEvent) => {
    e.preventDefault();
    setEditingIndex(index);
    setEditingValue(word);
  };

  const saveEdit = (index: number, e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    if (editingValue.trim()) {
      const newList = [...highlightedWords];
      newList[index] = editingValue.trim();
      setHighlightedWords(newList);
    }
    setEditingIndex(null);
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
        <input type="hidden" name="typingConfig" value={JSON.stringify(typingConfig)} />
        
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
                  <div className="flex gap-2 mb-3">
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
                  <div className="space-y-2 mt-2 max-w-md">
                    {highlightedWords.map((word, index) => (
                      <div key={index} className="flex items-center justify-between bg-[var(--secondary-bg)] border border-[var(--border-color)] px-3 py-2 rounded-xl text-xs font-semibold text-[var(--text-main)]">
                        {editingIndex === index ? (
                          <input
                            type="text"
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveEdit(index, e);
                            }}
                            className="bg-[var(--background)] border border-[var(--border-color)] px-2 py-1 rounded text-xs text-[var(--text-main)] font-medium mr-2 flex-1"
                            autoFocus
                          />
                        ) : (
                          <span className="truncate max-w-[200px]">{word}</span>
                        )}
                        
                        <div className="flex items-center gap-1 shrink-0">
                          {editingIndex === index ? (
                            <button type="button" onClick={(e) => saveEdit(index, e)} className="p-1 text-green-500 hover:bg-green-500/10 rounded transition-colors cursor-pointer" title="Save">
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button type="button" onClick={(e) => startEdit(index, word, e)} className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-gray-500/10 rounded transition-colors cursor-pointer" title="Edit">
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button type="button" onClick={(e) => moveWord(index, "up", e)} disabled={index === 0} className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-gray-500/10 rounded transition-colors cursor-pointer disabled:opacity-30 disabled:pointer-events-none" title="Move Up">
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button type="button" onClick={(e) => moveWord(index, "down", e)} disabled={index === highlightedWords.length - 1} className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-gray-500/10 rounded transition-colors cursor-pointer disabled:opacity-30 disabled:pointer-events-none" title="Move Down">
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button type="button" onClick={(e) => removeWord(index, e)} className="p-1 text-red-500 hover:bg-red-500/10 rounded transition-colors cursor-pointer" title="Delete">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {highlightedWords.length === 0 && (
                      <p className="text-xs text-[var(--text-muted)] italic">No words added yet.</p>
                    )}
                  </div>
                  <p className="text-[10px] text-[var(--text-muted)] mt-2">These words will cycle dynamically in the typing animation on the homepage hero section. You can add, edit, reorder, or delete words above.</p>
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

            {/* Typing Text Customizer Full-Width Panel */}
            <div className="mt-8 border-t border-[var(--border-color)]/60 pt-6 space-y-6">
              <div className="flex items-center gap-2 border-b border-[var(--border-color)]/40 pb-3">
                <Palette className="w-5 h-5 text-[var(--primary)]" />
                <h3 className="text-xs font-bold text-[var(--text-main)] uppercase tracking-wider">Typing Text Customization</h3>
              </div>

              {/* Live Preview Widget */}
              <div className="bg-[var(--secondary-bg)] border border-[var(--border-color)]/80 p-6 rounded-xl flex flex-col items-center justify-center min-h-[140px] text-center shadow-inner relative overflow-hidden">
                <div className="absolute top-2 left-3 text-[9px] font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[var(--primary)]" />
                  <span>Real-Time Live Preview</span>
                </div>
                <div className="text-xl md:text-2xl font-bold font-heading text-[var(--text-main)] leading-[1.2] flex flex-col items-center">
                  <div>Where Ideas Become Software.</div>
                  <div className="text-lg md:text-xl font-bold text-[var(--primary)] mt-1">
                    <TypingAnimation 
                      words={highlightedWords.length > 0 ? highlightedWords : ["Think.", "Work.", "Build."]} 
                      config={typingConfig} 
                    />
                  </div>
                </div>
                <p className="text-[10px] text-[var(--text-muted)] mt-2 italic">Updates automatically as you tweak the parameters below.</p>
              </div>

              {/* Customizer settings controls divided into 3 columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Column 1: Colors & Presets */}
                <div className="space-y-4 bg-[var(--background)] border border-[var(--border-color)]/40 p-4 rounded-xl">
                  <h4 className="text-xs font-bold text-[var(--text-main)] uppercase tracking-wider border-b border-[var(--border-color)] pb-2 flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-[var(--primary)]" />
                    <span>Colors & Gradients</span>
                  </h4>
                  
                  <div className="space-y-2">
                    <label className="flex items-center justify-between text-xs text-[var(--text-secondary)] font-medium cursor-pointer">
                      <span>Enable Linear Gradient</span>
                      <input
                        type="checkbox"
                        checked={typingConfig.gradientEnabled || false}
                        onChange={(e) => updateConfig("gradientEnabled", e.target.checked)}
                        className="accent-[var(--primary)] cursor-pointer"
                      />
                    </label>
                  </div>

                  {typingConfig.gradientEnabled ? (
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold text-[var(--text-secondary)]">Gradient Start</label>
                        <input
                          type="color"
                          value={typingConfig.gradientStart || "#F97316"}
                          onChange={(e) => updateConfig("gradientStart", e.target.value)}
                          className="w-full h-8 rounded border border-[var(--border-color)] bg-[var(--background)] cursor-pointer p-0.5"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold text-[var(--text-secondary)]">Gradient End</label>
                        <input
                          type="color"
                          value={typingConfig.gradientEnd || "#FB7185"}
                          onChange={(e) => updateConfig("gradientEnd", e.target.value)}
                          className="w-full h-8 rounded border border-[var(--border-color)] bg-[var(--background)] cursor-pointer p-0.5"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-semibold text-[var(--text-secondary)]">Text Color</label>
                      <input
                        type="color"
                        value={typingConfig.textColor || "#F97316"}
                        onChange={(e) => updateConfig("textColor", e.target.value)}
                        className="w-full h-8 rounded border border-[var(--border-color)] bg-[var(--background)] cursor-pointer p-0.5"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-[10px] font-semibold text-[var(--text-secondary)]">Premium Color Presets</label>
                    <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto border border-[var(--border-color)] p-2 rounded-xl bg-[var(--background)] scrollbar-thin">
                      {COLOR_PRESETS.map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => {
                            setTypingConfig((prev: any) => ({
                              ...prev,
                              textColor: preset.textColor,
                              gradientEnabled: preset.gradientEnabled,
                              gradientStart: preset?.gradientStart || prev.gradientStart,
                              gradientEnd: preset?.gradientEnd || prev.gradientEnd
                            }));
                          }}
                          className="text-[10px] px-2 py-1 bg-[var(--secondary-bg)] border border-[var(--border-color)] rounded hover:border-[var(--primary)] transition-all cursor-pointer font-semibold text-[var(--text-main)] truncate max-w-[120px]"
                        >
                          {preset.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-[var(--border-color)]/60">
                    <label className="flex items-center justify-between text-xs text-[var(--text-secondary)] font-medium cursor-pointer">
                      <span>Enable Text Shadow</span>
                      <input
                        type="checkbox"
                        checked={typingConfig.shadowEnabled || false}
                        onChange={(e) => updateConfig("shadowEnabled", e.target.checked)}
                        className="accent-[var(--primary)] cursor-pointer"
                      />
                    </label>
                  </div>
                </div>

                {/* Column 2: Typography & Sizing */}
                <div className="space-y-4 bg-[var(--background)] border border-[var(--border-color)]/40 p-4 rounded-xl">
                  <h4 className="text-xs font-bold text-[var(--text-main)] uppercase tracking-wider border-b border-[var(--border-color)] pb-2 flex items-center gap-1.5">
                    <Settings className="w-3.5 h-3.5 text-[var(--primary)]" />
                    <span>Typography & Styling</span>
                  </h4>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-[var(--text-secondary)]">Font Family</label>
                    <select
                      value={typingConfig.fontFamily || "inherit"}
                      onChange={(e) => updateConfig("fontFamily", e.target.value)}
                      className="w-full bg-[var(--background)] border border-[var(--border-color)] px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-semibold cursor-pointer"
                    >
                      <option value="inherit">Inherit default</option>
                      <option value="system-ui, sans-serif">System Sans</option>
                      <option value="Georgia, serif">Classic Serif</option>
                      <option value="monospace">Mono/Code</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-[var(--text-secondary)]">Font Weight</label>
                    <select
                      value={typingConfig.fontWeight || "700"}
                      onChange={(e) => updateConfig("fontWeight", e.target.value)}
                      className="w-full bg-[var(--background)] border border-[var(--border-color)] px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-semibold cursor-pointer"
                    >
                      <option value="300">Light (300)</option>
                      <option value="400">Regular (400)</option>
                      <option value="500">Medium (500)</option>
                      <option value="600">Semibold (600)</option>
                      <option value="700">Bold (700)</option>
                      <option value="800">Extrabold (800)</option>
                      <option value="900">Black (900)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-semibold text-[var(--text-secondary)]">Font Size</label>
                      <input
                        type="text"
                        value={typingConfig.fontSize || "inherit"}
                        onChange={(e) => updateConfig("fontSize", e.target.value)}
                        placeholder="e.g. 2rem, 30px"
                        className="w-full bg-[var(--background)] border border-[var(--border-color)] px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-semibold text-[var(--text-secondary)]">Text Transform</label>
                      <select
                        value={typingConfig.textTransform || "none"}
                        onChange={(e) => updateConfig("textTransform", e.target.value)}
                        className="w-full bg-[var(--background)] border border-[var(--border-color)] px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-semibold cursor-pointer"
                      >
                        <option value="none">None</option>
                        <option value="uppercase">UPPERCASE</option>
                        <option value="lowercase">lowercase</option>
                        <option value="capitalize">Capitalize</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-[var(--border-color)]/60">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-semibold text-[var(--text-secondary)] leading-none">Letter Space</label>
                      <input
                        type="text"
                        value={typingConfig.letterSpacing || "normal"}
                        onChange={(e) => updateConfig("letterSpacing", e.target.value)}
                        placeholder="e.g. 1px"
                        className="w-full bg-[var(--background)] border border-[var(--border-color)] px-2 py-1.5 rounded-lg text-[10px] focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-semibold text-[var(--text-secondary)] leading-none">Line Height</label>
                      <input
                        type="text"
                        value={typingConfig.lineHeight || "normal"}
                        onChange={(e) => updateConfig("lineHeight", e.target.value)}
                        placeholder="e.g. 1.2"
                        className="w-full bg-[var(--background)] border border-[var(--border-color)] px-2 py-1.5 rounded-lg text-[10px] focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-semibold text-[var(--text-secondary)] leading-none">Word Space</label>
                      <input
                        type="text"
                        value={typingConfig.wordSpacing || "normal"}
                        onChange={(e) => updateConfig("wordSpacing", e.target.value)}
                        placeholder="e.g. 2px"
                        className="w-full bg-[var(--background)] border border-[var(--border-color)] px-2 py-1.5 rounded-lg text-[10px] focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)]"
                      />
                    </div>
                  </div>
                </div>

                {/* Column 3: Animation Intervals & Cursor */}
                <div className="space-y-4 bg-[var(--background)] border border-[var(--border-color)]/40 p-4 rounded-xl">
                  <h4 className="text-xs font-bold text-[var(--text-main)] uppercase tracking-wider border-b border-[var(--border-color)] pb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[var(--primary)]" />
                    <span>Intervals & Cursor</span>
                  </h4>
                  
                  <div className="space-y-2">
                    <label className="flex items-center justify-between text-xs text-[var(--text-secondary)] font-medium cursor-pointer">
                      <span>Enable Animation Loop</span>
                      <input
                        type="checkbox"
                        checked={typingConfig.animationEnabled ?? true}
                        onChange={(e) => updateConfig("animationEnabled", e.target.checked)}
                        className="accent-[var(--primary)] cursor-pointer"
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[var(--border-color)]/60">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-semibold text-[var(--text-secondary)]">Type Speed (ms)</label>
                      <input
                        type="number"
                        value={typingConfig.typingSpeed !== undefined ? typingConfig.typingSpeed : 100}
                        onChange={(e) => updateConfig("typingSpeed", Number(e.target.value))}
                        className="w-full bg-[var(--background)] border border-[var(--border-color)] px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-semibold text-[var(--text-secondary)]">Delete Speed (ms)</label>
                      <input
                        type="number"
                          value={typingConfig.deleteSpeed !== undefined ? typingConfig.deleteSpeed : 50}
                          onChange={(e) => updateConfig("deleteSpeed", Number(e.target.value))}
                          className="w-full bg-[var(--background)] border border-[var(--border-color)] px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-semibold text-[var(--text-secondary)]">Delay Between Words (ms)</label>
                      <input
                        type="number"
                        value={typingConfig.delayBetweenWords !== undefined ? typingConfig.delayBetweenWords : 2000}
                        onChange={(e) => updateConfig("delayBetweenWords", Number(e.target.value))}
                        className="w-full bg-[var(--background)] border border-[var(--border-color)] px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-semibold text-[var(--text-secondary)]">Initial Animation Delay (ms)</label>
                      <input
                        type="number"
                        value={typingConfig.animationDelay !== undefined ? typingConfig.animationDelay : 800}
                        onChange={(e) => updateConfig("animationDelay", Number(e.target.value))}
                        className="w-full bg-[var(--background)] border border-[var(--border-color)] px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)]"
                      />
                    </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[var(--border-color)]/60">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-semibold text-[var(--text-secondary)]">Cursor Color</label>
                      <input
                        type="color"
                        value={typingConfig.cursorColor || "#F97316"}
                        onChange={(e) => updateConfig("cursorColor", e.target.value)}
                        className="w-full h-8 rounded border border-[var(--border-color)] bg-[var(--background)] cursor-pointer p-0.5"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-semibold text-[var(--text-secondary)]">Cursor Width</label>
                      <input
                        type="text"
                        value={typingConfig.cursorWidth || "3px"}
                        onChange={(e) => updateConfig("cursorWidth", e.target.value)}
                        placeholder="e.g. 2px"
                        className="w-full bg-[var(--background)] border border-[var(--border-color)] px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-[var(--text-secondary)]">Cursor Blink Speed</label>
                    <input
                      type="text"
                      value={typingConfig.cursorBlinkSpeed || "1s"}
                      onChange={(e) => updateConfig("cursorBlinkSpeed", e.target.value)}
                      placeholder="e.g. 1s"
                      className="w-full bg-[var(--background)] border border-[var(--border-color)] px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)]"
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
