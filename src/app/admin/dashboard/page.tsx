import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Briefcase, Eye, MessageSquare, Users, Image as ImageIcon, Database, Server, HardDrive, ArrowUpRight, Activity } from "lucide-react";
import prisma from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";
import { SlideUp, StaggerContainer } from "@/components/ui/animations";
import { VisitorsChart } from "@/components/admin/DashboardCharts";
import Link from "next/link";

export default async function AdminDashboard() {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [totalPosts, activeProjects, unreadMessages, totalUsers, totalImages, recentPosts, rawPageViews] = await Promise.all([
    prisma.post.count(),
    prisma.project.count({ where: { published: true } }),
    prisma.message.count({ where: { read: false } }),
    prisma.user.count(),
    prisma.galleryImage.count(),
    prisma.post.findMany({ orderBy: { createdAt: 'desc' }, take: 4 }),
    prisma.pageView.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: { createdAt: true }
    })
  ]);

  const pageViewsByDay = rawPageViews.reduce((acc: Record<string, number>, view) => {
    const dayName = view.createdAt.toLocaleDateString('en-US', { weekday: 'short' });
    acc[dayName] = (acc[dayName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    return {
      name: dayName,
      visitors: pageViewsByDay[dayName] || 0
    };
  });

  return (
    <div className="space-y-8">
      <SlideUp>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-main)] font-heading tracking-tight">Overview</h1>
            <p className="text-[var(--text-secondary)] mt-1 text-sm">Welcome to the Admin Control Center.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/posts/new" className="px-4 py-2 bg-[var(--primary)] text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-primary/20 flex items-center gap-2">
              <FileText className="w-4 h-4" /> New Post
            </Link>
          </div>
        </div>
      </SlideUp>

      {/* Stats Grid */}
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SlideUp>
          <Card className="glass-card border-[var(--border-color)]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-[var(--text-secondary)]">Total Users</p>
                <div className="w-8 h-8 rounded-lg bg-[var(--highlight)]/10 flex items-center justify-center">
                  <Users className="h-4 w-4 text-[var(--highlight)]" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-[var(--text-main)]">{totalUsers || 0}</span>
              </div>
            </CardContent>
          </Card>
        </SlideUp>

        <SlideUp>
          <Card className="glass-card border-[var(--border-color)]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-[var(--text-secondary)]">Total Posts</p>
                <div className="w-8 h-8 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-[var(--primary)]" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-[var(--text-main)]">{totalPosts || 0}</span>
              </div>
            </CardContent>
          </Card>
        </SlideUp>

        <SlideUp>
          <Card className="glass-card border-[var(--border-color)]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-[var(--text-secondary)]">Active Projects</p>
                <div className="w-8 h-8 rounded-lg bg-[var(--secondary)]/10 flex items-center justify-center">
                  <Briefcase className="h-4 w-4 text-[var(--secondary)]" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-[var(--text-main)]">{activeProjects || 0}</span>
              </div>
            </CardContent>
          </Card>
        </SlideUp>

        <SlideUp>
          <Card className="glass-card border-[var(--border-color)]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-[var(--text-secondary)]">Media Assets</p>
                <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center">
                  <ImageIcon className="h-4 w-4 text-[var(--accent)]" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-[var(--text-main)]">{totalImages || 0}</span>
              </div>
            </CardContent>
          </Card>
        </SlideUp>
      </StaggerContainer>

      <div className="grid grid-cols-1 gap-6">
        {/* Main Chart */}
        <SlideUp>
          <Card className="glass-card h-full border-[var(--border-color)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-[var(--text-main)]">Traffic Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <VisitorsChart data={chartData} />
            </CardContent>
          </Card>
        </SlideUp>
      </div>

      {/* Recent Content */}
      <SlideUp>
        <Card className="glass-card border-[var(--border-color)]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-[var(--text-main)]">Recent Content</CardTitle>
              <Link href="/admin/posts" className="text-sm font-medium text-[var(--primary)] hover:underline">View All</Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-[var(--text-muted)] uppercase bg-[var(--background)]/50 border-y border-[var(--border-color)]">
                  <tr>
                    <th className="px-4 py-3 font-medium">Title</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPosts.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-[var(--text-muted)]">No posts found</td>
                    </tr>
                  ) : (
                    recentPosts.map((post) => (
                      <tr key={post.id} className="border-b border-[var(--border-color)] hover:bg-[var(--background)]/30 transition-colors">
                        <td className="px-4 py-3 font-medium text-[var(--text-main)]">{post.title}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-[10px] uppercase font-bold rounded-full ${post.published ? 'bg-[var(--success)]/10 text-[var(--success)] border border-[var(--success)]/20' : 'bg-[var(--secondary)]/10 text-[var(--secondary)] border border-[var(--secondary)]/20'}`}>
                            {post.published ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[var(--text-secondary)]">{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</td>
                        <td className="px-4 py-3 text-right">
                          <Link href={`/admin/posts/${post.id}/edit`} className="text-[var(--primary)] hover:underline font-medium">Edit</Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </SlideUp>
    </div>
  );
}
