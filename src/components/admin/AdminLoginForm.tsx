"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/client/CardComponents";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import Link from "next/link";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [totp, setTotp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [requiresTotp, setRequiresTotp] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      totp: requiresTotp ? totp : undefined,
    });

    setLoading(false);

    if (res?.error) {
      if (res.error === "TOTP_REQUIRED") {
        setRequiresTotp(true);
        setError("Two-Factor Authentication is enabled. Please enter your code.");
      } else {
        setError(res.error);
      }
    } else {
      window.location.href = "/admin/dashboard";
    }
  };

  return (
    <Card className="w-full max-w-md border-[var(--border-color)] shadow-2xl bg-[var(--card)]">
      <CardHeader className="text-center space-y-2 border-b border-[var(--border-color)] pb-6">
        <div className="mx-auto w-12 h-12 bg-[var(--primary)]/10 rounded-full flex items-center justify-center text-[var(--primary)] mb-2">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <CardTitle className="text-3xl font-bold tracking-tight text-glow">
          Admin <span className="text-[var(--accent)]">Portal</span>
        </CardTitle>
        <CardDescription>Restricted Access</CardDescription>
      </CardHeader>
      <CardContent className="pt-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-[var(--error)]/10 border border-[var(--error)] text-[var(--error)] p-3 rounded-md text-sm text-center">
              {error}
            </div>
          )}

          {!requiresTotp ? (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email or Username</label>
                <input required type="text" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-md px-3 py-2 focus:outline-none focus:border-[var(--primary)]" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Password</label>
                  <Link href="/admin/forgot-password" className="text-xs text-[var(--primary)] hover:underline">Forgot Password?</Link>
                </div>
                <div className="relative">
                  <input required type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-md px-3 py-2 focus:outline-none focus:border-[var(--primary)]" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-[var(--text-secondary)] hover:text-white">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <input type="checkbox" id="remember" className="rounded border-[var(--border-color)] text-[var(--primary)] focus:ring-[var(--primary)]" />
                <label htmlFor="remember" className="text-sm text-[var(--text-secondary)]">Remember Me for 30 days</label>
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <label className="text-sm font-medium">Authenticator Code (6 Digits)</label>
              <input required type="text" maxLength={6} value={totp} onChange={e => setTotp(e.target.value)} className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-md px-3 py-2 text-center text-xl tracking-widest focus:outline-none focus:border-[var(--primary)]" placeholder="000000" />
            </div>
          )}
          
          <Button type="submit" className="w-full mt-4" disabled={loading}>
            {loading ? "Authenticating..." : requiresTotp ? "Verify Code" : "Sign In"}
          </Button>
          
          {!requiresTotp && (
            <div className="mt-4 pt-4 border-t border-[var(--border-color)]">
              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                onClick={() => signIn('google', { callbackUrl: '/auth-success' })}
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
