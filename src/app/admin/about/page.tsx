"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SmartEditor } from "@/components/admin/SmartEditor";
import { DragList } from "@/components/admin/DragList";
import { getAboutData, updateAboutProfile, AboutFormData } from "./actions";
import { Loader2, Plus, Save, Undo, Eye } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import { ImageUploadCropper } from "@/components/ui/ImageUploadCropper";

export default function AboutManagerPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const [formData, setFormData] = useState<Partial<AboutFormData>>({});

  const [newSkill, setNewSkill] = useState("");
  const [newTech, setNewTech] = useState("");
  const [newLanguage, setNewLanguage] = useState("");

  const [message, setMessage] = useState({ type: "", text: "" });

  const loadData = async () => {
    try {
      const { admin, settings } = await getAboutData();
      
      setFormData({
        name: admin?.name || "",
        displayName: admin?.displayName || "",
        occupation: admin?.occupation || "",
        shortIntroduction: admin?.shortIntroduction || "",
        biography: admin?.biography || "",
        college: admin?.college || "",
        course: admin?.course || "",
        company: admin?.company || "",
        country: admin?.country || "",
        state: admin?.state || "",
        city: admin?.city || "",
        skills: admin?.skills || [],
        technologies: admin?.technologies || [],
        spokenLanguages: admin?.spokenLanguages || [],
        image: admin?.image || "",
        customStats: admin?.customStats || [],
        resumePdf: settings?.resumePdf || "",
        githubUrl: settings?.githubUrl || "",
        linkedinUrl: settings?.linkedinUrl || "",
        twitterUrl: settings?.twitterUrl || "",
        instagramUrl: settings?.instagramUrl || "",
        facebookUrl: settings?.facebookUrl || "",
        youtubeUrl: settings?.youtubeUrl || "",
      });


    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: "Failed to load data." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
      return;
    }

    if (status === "authenticated") {
      loadData();
    }
  }, [status, router]);

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      await updateAboutProfile(formData);

      setMessage({ type: "success", text: "About profile updated successfully!" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error: unknown) {
      setMessage({ type: "error", text: (error instanceof Error ? error.message : "Failed to save data.") });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading">About Manager</h1>
          <p className="text-[var(--text-secondary)]">Manage your personal profile, skills, and timeline.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => window.open("/about", "_blank")}>
            <Eye className="w-4 h-4 mr-2" /> Preview
          </Button>
          <Button variant="outline" onClick={loadData} disabled={saving}>
            <Undo className="w-4 h-4 mr-2" /> Reset
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Changes
          </Button>
        </div>
      </div>

      {message.text && (
        <div className={`p-4 rounded-lg font-medium ${message.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[var(--border-color)] pb-px">
        {["profile", "skills", "social"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium capitalize rounded-t-lg transition-colors border border-transparent ${
              activeTab === tab 
                ? "bg-[var(--card)] text-[var(--primary)] border-[var(--border-color)] border-b-[var(--card)] -mb-px relative z-10" 
                : "text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--card)]/50"
            }`}
          >
            {tab === "social" ? "Media & Social" : tab}
          </button>
        ))}
      </div>

      <div className="bg-[var(--card)] border border-[var(--border-color)] rounded-b-xl rounded-tr-xl p-6 shadow-sm">
        
        {/* PROFILE TAB */}
        {activeTab === "profile" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Display Name</label>
                <Input value={formData.displayName || ""} onChange={e => setFormData({...formData, displayName: e.target.value})} placeholder="e.g. John Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Professional Title</label>
                <Input value={formData.occupation || ""} onChange={e => setFormData({...formData, occupation: e.target.value})} placeholder="e.g. Full Stack Developer" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Short Introduction</label>
              <Input value={formData.shortIntroduction || ""} onChange={e => setFormData({...formData, shortIntroduction: e.target.value})} placeholder="A one-liner about yourself..." />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Biography (Rich Text)</label>
              <SmartEditor 
                value={formData.biography || ""} 
                onChange={val => setFormData({...formData, biography: val})} 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[var(--border-color)]">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Current Experience</h3>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Company / Status</label>
                  <Input value={formData.company || ""} onChange={e => setFormData({...formData, company: e.target.value})} placeholder="e.g. Self-Employed or Google" />
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Education</h3>
                <div className="space-y-2">
                  <label className="text-sm font-medium">College / University</label>
                  <Input value={formData.college || ""} onChange={e => setFormData({...formData, college: e.target.value})} placeholder="e.g. MIT" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Degree / Course</label>
                  <Input value={formData.course || ""} onChange={e => setFormData({...formData, course: e.target.value})} placeholder="e.g. B.S. Computer Science" />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-[var(--border-color)]">
              <div className="space-y-2">
                <label className="text-sm font-medium">Country</label>
                <Input value={formData.country || ""} onChange={e => setFormData({...formData, country: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">State/Province</label>
                <Input value={formData.state || ""} onChange={e => setFormData({...formData, state: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">City</label>
                <Input value={formData.city || ""} onChange={e => setFormData({...formData, city: e.target.value})} />
              </div>
            </div>
          </div>
        )}

        {/* SKILLS TAB */}
        {activeTab === "skills" && (
          <div className="space-y-8 animate-in fade-in">
            {/* Core Skills */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Core Skills</h3>
              <p className="text-sm text-[var(--text-secondary)] mb-4">Drag to reorder your skills.</p>
              
              <div className="flex gap-2 mb-4">
                <Input 
                  value={newSkill} 
                  onChange={e => setNewSkill(e.target.value)} 
                  placeholder="Add a new skill (e.g. Frontend Development)" 
                  onKeyDown={e => {
                    if (e.key === "Enter" && newSkill.trim()) {
                      setFormData({...formData, skills: [...(formData.skills || []), newSkill.trim()]});
                      setNewSkill("");
                    }
                  }}
                />
                <Button type="button" onClick={() => {
                  if (newSkill.trim()) {
                    setFormData({...formData, skills: [...(formData.skills || []), newSkill.trim()]});
                    setNewSkill("");
                  }
                }}>
                  <Plus className="w-4 h-4" /> Add
                </Button>
              </div>

              <DragList 
                items={formData.skills || []}
                setItems={(items) => setFormData({...formData, skills: items})}
                keyExtractor={(item) => item}
                onRemove={(id) => setFormData({...formData, skills: formData.skills?.filter(s => s !== id)})}
                renderItem={(item) => <span className="font-medium text-sm">{item}</span>}
              />
            </div>

            <div className="border-t border-[var(--border-color)]" />

            {/* Technologies */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Technologies & Tools</h3>
              
              <div className="flex gap-2 mb-4">
                <Input 
                  value={newTech} 
                  onChange={e => setNewTech(e.target.value)} 
                  placeholder="Add a technology (e.g. React, Docker)" 
                  onKeyDown={e => {
                    if (e.key === "Enter" && newTech.trim()) {
                      setFormData({...formData, technologies: [...(formData.technologies || []), newTech.trim()]});
                      setNewTech("");
                    }
                  }}
                />
                <Button type="button" onClick={() => {
                  if (newTech.trim()) {
                    setFormData({...formData, technologies: [...(formData.technologies || []), newTech.trim()]});
                    setNewTech("");
                  }
                }}>
                  <Plus className="w-4 h-4" /> Add
                </Button>
              </div>

              <DragList 
                items={formData.technologies || []}
                setItems={(items) => setFormData({...formData, technologies: items})}
                keyExtractor={(item) => item}
                onRemove={(id) => setFormData({...formData, technologies: formData.technologies?.filter(s => s !== id)})}
                renderItem={(item) => <span className="font-medium text-sm">{item}</span>}
              />
            </div>

            <div className="border-t border-[var(--border-color)]" />

            {/* Spoken Languages */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Spoken Languages</h3>
              
              <div className="flex gap-2 mb-4">
                <Input 
                  value={newLanguage} 
                  onChange={e => setNewLanguage(e.target.value)} 
                  placeholder="Add a language (e.g. English, Spanish)" 
                  onKeyDown={e => {
                    if (e.key === "Enter" && newLanguage.trim()) {
                      setFormData({...formData, spokenLanguages: [...(formData.spokenLanguages || []), newLanguage.trim()]});
                      setNewLanguage("");
                    }
                  }}
                />
                <Button type="button" onClick={() => {
                  if (newLanguage.trim()) {
                    setFormData({...formData, spokenLanguages: [...(formData.spokenLanguages || []), newLanguage.trim()]});
                    setNewLanguage("");
                  }
                }}>
                  <Plus className="w-4 h-4" /> Add
                </Button>
              </div>

              <DragList 
                items={formData.spokenLanguages || []}
                setItems={(items) => setFormData({...formData, spokenLanguages: items})}
                keyExtractor={(item) => item}
                onRemove={(id) => setFormData({...formData, spokenLanguages: formData.spokenLanguages?.filter(s => s !== id)})}
                renderItem={(item) => <span className="font-medium text-sm">{item}</span>}
              />
            </div>

          </div>
        )}



        {/* SOCIAL & MEDIA TAB */}
        {activeTab === "social" && (
          <div className="space-y-8 animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Media */}
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Profile Picture</h3>
                  <div className="flex items-center gap-4">
                    <div className="w-40">
                      <ImageUploadCropper
                        value={formData.image || undefined}
                        onChange={(url) => setFormData({ ...formData, image: url })}
                        onRemove={() => setFormData({ ...formData, image: "" })}
                        circularCrop={true}
                        aspect={1}
                        maxSizeMB={5}
                        accept="image/jpeg, image/png, image/webp"
                        label="Upload Photo"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-[var(--border-color)]" />

                <div>
                  <h3 className="font-semibold text-lg mb-2">Resume PDF</h3>
                  <div className="space-y-2">
                    <Input value={formData.resumePdf || ""} onChange={e => setFormData({...formData, resumePdf: e.target.value})} placeholder="Direct URL to PDF or Cloudinary URL" />
                    <CldUploadWidget 
                      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ml_default"} 
                      options={{ clientAllowedFormats: ['pdf'] }}
                      onSuccess={(result) => {
                        const info = typeof result.info === 'object' && result.info !== null ? result.info as { secure_url?: string } : null;
                        if (info?.secure_url) {
                          setFormData({ ...formData, resumePdf: info.secure_url });
                        }
                      }}
                    >
                      {({ open }) => (
                        <Button type="button" variant="secondary" size="sm" onClick={() => open?.()}>
                          Upload PDF to Cloudinary
                        </Button>
                      )}
                    </CldUploadWidget>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Social Links</h3>
                <div className="space-y-3">
                  <div className="flex gap-2 items-center">
                    <span className="w-24 text-sm font-medium">GitHub</span>
                    <Input className="flex-1" value={formData.githubUrl || ""} onChange={e => setFormData({...formData, githubUrl: e.target.value})} placeholder="https://github.com/..." />
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="w-24 text-sm font-medium">LinkedIn</span>
                    <Input className="flex-1" value={formData.linkedinUrl || ""} onChange={e => setFormData({...formData, linkedinUrl: e.target.value})} placeholder="https://linkedin.com/in/..." />
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="w-24 text-sm font-medium">Twitter / X</span>
                    <Input className="flex-1" value={formData.twitterUrl || ""} onChange={e => setFormData({...formData, twitterUrl: e.target.value})} placeholder="https://x.com/..." />
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="w-24 text-sm font-medium">Instagram</span>
                    <Input className="flex-1" value={formData.instagramUrl || ""} onChange={e => setFormData({...formData, instagramUrl: e.target.value})} placeholder="https://instagram.com/..." />
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="w-24 text-sm font-medium">YouTube</span>
                    <Input className="flex-1" value={formData.youtubeUrl || ""} onChange={e => setFormData({...formData, youtubeUrl: e.target.value})} placeholder="https://youtube.com/..." />
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
