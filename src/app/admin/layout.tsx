"use client";

import { ReactNode, useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, FileText, Briefcase, Image as ImageIcon, Settings, LogOut, 
  Sparkles, Users, User, MessageSquare, Mail, BookOpen, BarChart3, Menu, X, GraduationCap, Command as CommandIcon
} from "lucide-react";
import { signOut } from "next-auth/react";
import { AdminCommandPalette } from "@/components/admin/CommandPalette";
import { useSession } from "next-auth/react";

const navLinks = [
  { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/posts", label: "Content Studio", icon: FileText },
  { href: "/admin/projects", label: "Projects", icon: Briefcase },
  { href: "/admin/gallery", label: "Media Gallery", icon: ImageIcon },
  { href: "/admin/learning", label: "Learning Hub", icon: GraduationCap },
  { href: "/admin/about", label: "About Manager", icon: User },
  { href: "/admin/users", label: "Users & Access", icon: Users },
  { href: "/admin/messages", label: "Inbox", icon: Mail },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/contact", label: "Contact Settings", icon: Mail },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

function SidebarContent({ pathname, onNavigate, onCommandPalette }: { pathname: string; onNavigate?: () => void; onCommandPalette: () => void }) {
  const { data: session } = useSession();

  return (
    <>
      <div className="p-6 border-b border-[var(--border-color)]">
        <Link href="/admin/dashboard" onClick={onNavigate} className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center shadow-lg shadow-primary/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold font-heading text-[var(--text-main)]">Admin Panel</h2>
            <p className="text-xs text-[var(--text-muted)] font-medium">Control Center</p>
          </div>
        </Link>
      </div>

      <div className="px-4 pt-4 pb-2">
        <button 
          onClick={onCommandPalette}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border-color)] text-sm text-[var(--text-muted)] hover:border-[var(--primary)]/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <SearchIcon className="w-4 h-4" />
            <span>Search...</span>
          </div>
          <kbd className="hidden md:inline-flex items-center gap-1 font-sans text-[10px] font-semibold">
            <CommandIcon className="w-3 h-3" /> K
          </kbd>
        </button>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Menu</div>
        {navLinks.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium ${
                isActive
                  ? "bg-[var(--background)] text-[var(--primary)] shadow-sm border border-[var(--border-color)]"
                  : "text-[var(--text-secondary)] hover:bg-[var(--background)]/50 hover:text-[var(--text-main)] border border-transparent"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-[var(--primary)]" : ""}`} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[var(--border-color)]">
        <div className="flex items-center justify-between mb-4 px-2">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-[var(--primary)]/20 flex items-center justify-center shrink-0">
              {session?.user?.image ? (
                <img src={session.user.image} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <span className="text-xs font-bold text-[var(--primary)]">
                  {session?.user?.name?.charAt(0) || "A"}
                </span>
              )}
            </div>
            <div className="truncate">
              <p className="text-sm font-bold text-[var(--text-main)] truncate">{session?.user?.name || "Admin"}</p>
              <p className="text-xs text-[var(--text-muted)] truncate">{session?.user?.email}</p>
            </div>
          </div>
        </div>
        
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--background)] hover:text-[var(--text-main)] transition-all"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Exit to Site</span>
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 px-3 py-2.5 mt-1 rounded-xl text-sm font-medium text-[var(--error)] hover:bg-[var(--error)]/10 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </div>
    </>
  );
}

// Simple search icon component to avoid importing another one if not needed
function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Reset scroll position on route change
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [pathname]);

  return (
    <div className="flex h-screen bg-[var(--secondary-bg)] overflow-hidden font-sans">
      <AdminCommandPalette open={commandOpen} setOpen={setCommandOpen} />

      {/* Desktop Sidebar */}
      <aside className="w-72 bg-[var(--card)] border-r border-[var(--border-color)] flex-col hidden lg:flex h-full z-10 shadow-sm relative">
        <SidebarContent pathname={pathname} onCommandPalette={() => setCommandOpen(true)} />
      </aside>

      {/* Mobile: Top bar with hamburger */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[var(--card)]/80 backdrop-blur-md border-b border-[var(--border-color)] flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-bold font-heading text-[var(--text-main)]">Control Center</span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg hover:bg-[var(--background)] transition-colors"
        >
          <Menu className="w-5 h-5 text-[var(--text-main)]" />
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-[var(--card)] border-r border-[var(--border-color)] flex flex-col shadow-2xl animate-in slide-in-from-left-full duration-200">
            <div className="flex justify-end p-4 absolute top-0 right-0 z-10">
              <button onClick={() => setMobileOpen(false)} className="p-2 rounded-full bg-[var(--background)]/80 backdrop-blur border border-[var(--border-color)] text-[var(--text-main)] hover:bg-[var(--background)]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <SidebarContent pathname={pathname} onNavigate={() => setMobileOpen(false)} onCommandPalette={() => {
              setMobileOpen(false);
              setCommandOpen(true);
            }} />
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Background glow effects */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[var(--primary)]/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[var(--highlight)]/5 rounded-full blur-3xl pointer-events-none translate-y-1/4 translate-x-1/4"></div>
        
        {/* Scrollable Content */}
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto pt-16 lg:pt-0 pb-10">
          <div className="p-4 md:p-8 max-w-7xl mx-auto w-full relative z-10">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <Suspense fallback={
                <div className="flex h-64 items-center justify-center">
                  <div className="w-8 h-8 border-4 border-[var(--primary)]/30 border-t-[var(--primary)] rounded-full animate-spin" />
                </div>
              }>
                {children}
              </Suspense>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
