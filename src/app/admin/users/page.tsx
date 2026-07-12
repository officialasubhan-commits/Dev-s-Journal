import prisma from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";
import { Search, Shield, User as UserIcon, Settings, AlertCircle, Edit, Trash2 } from "lucide-react";
import { BroadcastForm } from "@/components/admin/BroadcastForm";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const q = resolvedSearchParams.q || "";

  const users = await prisma.user.findMany({
    where: {
      OR: [
        { name: { contains: q, mode: 'insensitive' } },
        { email: { contains: q, mode: 'insensitive' } },
        { displayName: { contains: q, mode: 'insensitive' } },
      ],
    },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      displayName: true,
      email: true,
      role: true,
      createdAt: true,
      lockedUntil: true,
    }
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-[var(--text-main)]">User Management</h1>
          <p className="text-[var(--text-secondary)] mt-1">Manage all registered users on the platform.</p>
        </div>
      </div>

      <BroadcastForm />

      <div className="glass-card p-6 rounded-2xl">
        {/* Search */}
        <form className="mb-6 max-w-md relative">
          <input 
            type="text" 
            name="q"
            defaultValue={q}
            placeholder="Search by name, email, or display name..." 
            className="w-full pl-10 pr-4 py-2 bg-[var(--background)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)]"
          />
          <Search className="w-5 h-5 absolute left-3 top-2.5 text-[var(--text-muted)]" />
          <button type="submit" className="hidden">Search</button>
        </form>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[var(--border-color)] text-[var(--text-secondary)] text-sm uppercase tracking-wider">
                <th className="pb-3 font-semibold">User</th>
                <th className="pb-3 font-semibold">Email</th>
                <th className="pb-3 font-semibold">Role</th>
                <th className="pb-3 font-semibold">Joined</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-[var(--background)] transition-colors">
                  <td className="py-4">
                    <div className="font-bold text-[var(--text-main)]">{user.displayName || user.name || "Anonymous"}</div>
                  </td>
                  <td className="py-4 text-[var(--text-secondary)]">{user.email}</td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      user.role === 'ADMIN' ? 'bg-[var(--primary)]/10 text-[var(--primary)]' : 'bg-[var(--border-color)] text-[var(--text-secondary)]'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 text-[var(--text-secondary)]">{format(new Date(user.createdAt), "MMM d, yyyy")}</td>
                  <td className="py-4">
                    {user.lockedUntil && user.lockedUntil > new Date() ? (
                      <span className="text-[var(--error)] flex items-center gap-1 text-sm font-medium"><AlertCircle className="w-4 h-4"/> Suspended</span>
                    ) : (
                      <span className="text-[var(--success)] flex items-center gap-1 text-sm font-medium"><Shield className="w-4 h-4"/> Active</span>
                    )}
                  </td>
                  <td className="py-4 text-right space-x-2">
                    <Link href={`/admin/users/${user.id}`} className="inline-flex items-center gap-1 text-sm text-[var(--text-main)] hover:text-[var(--primary)] transition-colors px-3 py-1 border border-[var(--border-color)] rounded-md hover:border-[var(--primary)]">
                      <Settings className="w-4 h-4" /> Manage
                    </Link>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[var(--text-muted)] italic">
                    No users found matching "{q}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
