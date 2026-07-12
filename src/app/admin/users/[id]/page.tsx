import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Shield, AlertCircle, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { updateUserRole, toggleSuspension, deleteUser } from "./actions";

export default async function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const user = await prisma.user.findUnique({
    where: { id: resolvedParams.id },
    include: {
      _count: {
        select: { posts: true, projects: true, comments: true }
      },
      activities: {
        orderBy: { createdAt: 'desc' },
        take: 5
      }
    }
  });

  if (!user) notFound();

  const isSuspended = user.lockedUntil && user.lockedUntil > new Date();

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/admin/users" className="p-2 hover:bg-[var(--border-color)] rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-[var(--text-main)]" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold font-heading text-[var(--text-main)]">Manage User</h1>
          <p className="text-[var(--text-secondary)] mt-1">{user.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* User Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="glass-card p-6 rounded-2xl">
            <h2 className="text-xl font-bold font-heading mb-4 border-b border-[var(--border-color)] pb-2">Profile Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-[var(--text-muted)] block">Name</span>
                <span className="font-medium text-[var(--text-main)]">{user.name || "-"}</span>
              </div>
              <div>
                <span className="text-sm text-[var(--text-muted)] block">Display Name</span>
                <span className="font-medium text-[var(--text-main)]">{user.displayName || "-"}</span>
              </div>
              <div>
                <span className="text-sm text-[var(--text-muted)] block">Location</span>
                <span className="font-medium text-[var(--text-main)]">{[user.city, user.country].filter(Boolean).join(", ") || "-"}</span>
              </div>
              <div>
                <span className="text-sm text-[var(--text-muted)] block">Joined</span>
                <span className="font-medium text-[var(--text-main)]">{format(new Date(user.createdAt), "PPp")}</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl">
            <h2 className="text-xl font-bold font-heading mb-4 border-b border-[var(--border-color)] pb-2">Recent Activity</h2>
            {user.activities.length === 0 ? (
              <p className="text-[var(--text-muted)] italic">No recent activity.</p>
            ) : (
              <div className="space-y-4">
                {user.activities.map(act => (
                  <div key={act.id} className="flex justify-between items-start border-b border-[var(--border-color)] pb-2 last:border-0 last:pb-0">
                    <div>
                      <div className="font-medium text-[var(--text-main)]">{act.type.replace(/_/g, ' ')}</div>
                      <div className="text-sm text-[var(--text-secondary)]">{act.details}</div>
                    </div>
                    <div className="text-xs text-[var(--text-muted)]">{format(new Date(act.createdAt), "MMM d")}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Administration Actions */}
        <div className="space-y-6">
          
          <div className="glass-card p-6 rounded-2xl">
            <h2 className="text-xl font-bold font-heading mb-4 border-b border-[var(--border-color)] pb-2">Statistics</h2>
            <ul className="space-y-2 text-[var(--text-secondary)] font-medium">
              <li className="flex justify-between"><span>Posts:</span> <span className="text-[var(--text-main)]">{user._count.posts}</span></li>
              <li className="flex justify-between"><span>Projects:</span> <span className="text-[var(--text-main)]">{user._count.projects}</span></li>
              <li className="flex justify-between"><span>Comments:</span> <span className="text-[var(--text-main)]">{user._count.comments}</span></li>

            </ul>
          </div>

          <div className="glass-card p-6 rounded-2xl border-t-4 border-[var(--primary)] space-y-4">
            <h2 className="text-xl font-bold font-heading">Role & Access</h2>
            
            <form action={updateUserRole}>
              <input type="hidden" name="userId" value={user.id} />
              <div className="flex gap-2">
                <select name="role" defaultValue={user.role} className="flex-1 bg-[var(--background)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-[var(--text-main)] outline-none focus:border-[var(--primary)]">
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
                <Button type="submit" variant="outline">Update</Button>
              </div>
            </form>

            <div className="pt-4 border-t border-[var(--border-color)] space-y-3">
              <form action={toggleSuspension}>
                <input type="hidden" name="userId" value={user.id} />
                <Button type="submit" variant="outline" className={`w-full justify-start ${isSuspended ? 'text-[var(--success)] border-[var(--success)] hover:bg-[var(--success)] hover:text-white' : 'text-[var(--error)] border-[var(--error)] hover:bg-[var(--error)] hover:text-white'}`}>
                  {isSuspended ? (
                    <><Shield className="w-4 h-4 mr-2"/> Restore Access</>
                  ) : (
                    <><AlertCircle className="w-4 h-4 mr-2"/> Suspend User (7 days)</>
                  )}
                </Button>
              </form>

              <form action={deleteUser}>
                <input type="hidden" name="userId" value={user.id} />
                <Button type="submit" variant="destructive" className="w-full justify-start bg-red-600 hover:bg-red-700 text-white">
                  <Trash2 className="w-4 h-4 mr-2"/> Delete Account Forever
                </Button>
              </form>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
