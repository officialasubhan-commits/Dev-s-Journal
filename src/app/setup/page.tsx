"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function SetupWizard() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    biography: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match.");
    }
    
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Setup failed.");
      }
      
      router.push('/admin'); // Redirect to login
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--background)]">
      <Card className="w-full max-w-2xl border-[var(--primary)] border shadow-[0_0_50px_rgba(37,99,235,0.15)]">
        <CardHeader className="text-center space-y-2 border-b border-[var(--border-color)] pb-6">
          <CardTitle className="text-4xl font-bold tracking-tight text-glow">
            Welcome to <span className="text-[var(--accent)]">your Digital Home</span>
          </CardTitle>
          <CardDescription className="text-lg text-[var(--text-secondary)]">
            First-Time Initialization Wizard
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-[var(--error)]/10 border border-[var(--error)] text-[var(--error)] p-4 rounded-md text-sm text-center">
                {error}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-md px-4 py-2 focus:outline-none focus:border-[var(--primary)]" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Username</label>
                <input required type="text" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-md px-4 py-2 focus:outline-none focus:border-[var(--primary)]" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Email Address</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-md px-4 py-2 focus:outline-none focus:border-[var(--primary)]" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Strong Password</label>
                <input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-md px-4 py-2 focus:outline-none focus:border-[var(--primary)]" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Confirm Password</label>
                <input required type="password" value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-md px-4 py-2 focus:outline-none focus:border-[var(--primary)]" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Biography (Optional)</label>
                <textarea rows={3} value={formData.biography} onChange={e => setFormData({...formData, biography: e.target.value})} className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-md px-4 py-2 focus:outline-none focus:border-[var(--primary)] resize-none" />
              </div>
            </div>
            
            <div className="pt-4 border-t border-[var(--border-color)]">
              <Button type="submit" className="w-full text-lg h-12" disabled={loading}>
                {loading ? "Initializing System..." : "Complete Setup & Create Admin"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
