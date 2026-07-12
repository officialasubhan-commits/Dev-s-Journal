"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FaGoogle, FaGithub, FaEye, FaEyeSlash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

interface AuthFormProps {
  type: "login" | "register";
}

export function AuthForm({ type }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (type === "register") {
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Registration failed");
        
        // Auto sign in after register
        const signInRes = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });
        
        if (signInRes?.error) {
          setError(signInRes.error);
        } else {
          router.push("/");
          router.refresh();
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    } else {
      // Login
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Invalid email or password");
        setLoading(false);
      } else {
        router.push("/");
        router.refresh();
      }
    }
  };

  const handleOAuth = (provider: "google" | "github") => {
    signIn(provider, { callbackUrl: "/auth-success" });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto bg-[var(--background)] p-8 rounded-2xl shadow-[0_0_50px_rgba(37,99,235,0.1)] border border-[var(--border-color)]"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-glow mb-2">
          {type === "login" ? "Welcome Back" : "Create Account"}
        </h1>
        <p className="text-[var(--text-secondary)]">
          {type === "login"
            ? "Sign in to continue"
            : "Join us and start your journey"}
        </p>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-[var(--error)]/10 text-[var(--error)] text-sm p-3 rounded-lg mb-6 border border-[var(--error)]/20"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-5">
        {type === "register" && (
          <div className="space-y-1">
            <label className="text-sm font-medium">Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-black/20 border border-[var(--border-color)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
              placeholder="John Doe"
            />
          </div>
        )}

        <div className="space-y-1">
          <label className="text-sm font-medium">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-black/20 border border-[var(--border-color)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Password</label>
            {type === "login" && (
              <Link href="/forgot-password" className="text-xs text-[var(--primary)] hover:underline">
                Forgot password?
              </Link>
            )}
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-black/20 border border-[var(--border-color)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all pr-12"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        {type === "login" && (
          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-gray-600 bg-black/20 text-[var(--primary)] focus:ring-[var(--primary)]"
            />
            <label htmlFor="remember" className="ml-2 text-sm text-[var(--text-secondary)]">
              Remember me
            </label>
          </div>
        )}

        <Button type="submit" className="w-full py-6 text-lg rounded-xl font-semibold shadow-lg shadow-blue-500/20" disabled={loading}>
          {loading ? "Please wait..." : type === "login" ? "Sign In" : "Sign Up"}
        </Button>
      </form>

      <div className="mt-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--border-color)]"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-[var(--background)] text-[var(--text-secondary)]">Or continue with</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <Button variant="outline" type="button" onClick={() => handleOAuth("google")} className="py-6 rounded-xl border-[var(--border-color)] hover:bg-white/5">
            <FaGoogle className="mr-2 h-5 w-5" />
            Google
          </Button>
          <Button variant="outline" type="button" onClick={() => handleOAuth("github")} className="py-6 rounded-xl border-[var(--border-color)] hover:bg-white/5">
            <FaGithub className="mr-2 h-5 w-5" />
            GitHub
          </Button>
        </div>
      </div>

      <p className="mt-8 text-center text-sm text-[var(--text-secondary)]">
        {type === "login" ? "Don't have an account? " : "Already have an account? "}
        <Link
          href={type === "login" ? "/register" : "/login"}
          className="font-semibold text-[var(--primary)] hover:underline"
        >
          {type === "login" ? "Create one" : "Sign in"}
        </Link>
      </p>
    </motion.div>
  );
}
