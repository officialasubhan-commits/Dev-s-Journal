import prisma from "@/lib/prisma";
import { BarChart3, Eye, Users, FileText, Briefcase, TrendingUp, Monitor, Smartphone, Tablet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SlideUp, StaggerContainer } from "@/components/ui/animations";
import { VisitorsChart } from "@/components/admin/DashboardCharts";

async function getTopPages(days: number = 30) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const results = await prisma.pageView.groupBy({
    by: ["path"],
    where: { createdAt: { gte: since } },
    _count: { path: true },
    orderBy: { _count: { path: "desc" } },
    take: 10,
  });
  return results.map((r: { path: string; _count: { path: number } }) => ({ path: r.path, count: r._count.path }));
}

async function getDeviceBreakdown() {
  const results = await prisma.pageView.groupBy({
    by: ["device"],
    _count: { device: true },
  });
  return results.map((r: { device: string | null; _count: { device: number } }) => ({ device: r.device || "unknown", count: r._count.device }));
}

export default async function AdminAnalyticsPage() {
  const [
    totalViews, totalUsers, totalPosts, totalProjects,
    viewsToday, viewsThisWeek, topPages, deviceBreakdown
  ] = await Promise.all([
    prisma.pageView.count(),
    prisma.user.count(),
    prisma.post.count({ where: { published: true } }),
    prisma.project.count({ where: { published: true } }),
    prisma.pageView.count({ where: { createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } } }),
    prisma.pageView.count({ where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } }),
    getTopPages(30),
    getDeviceBreakdown(),
  ]);

  const deviceIcon = (device: string) => {
    if (device === "mobile") return <Smartphone className="w-4 h-4" />;
    if (device === "tablet") return <Tablet className="w-4 h-4" />;
    return <Monitor className="w-4 h-4" />;
  };

  const totalDeviceViews = deviceBreakdown.reduce(
    (sum: number, d: { count: number }) => sum + d.count,
    0
  ) || 1;

  return (
    <div className="space-y-8">
      <SlideUp>
        <div>
          <h1 className="text-3xl font-bold font-heading text-[var(--text-main)] tracking-tight">Analytics</h1>
          <p className="text-[var(--text-secondary)] mt-1">Real-time insights from your audience. Privacy-first — no personal data stored.</p>
        </div>
      </SlideUp>

      {/* Stats Cards */}
      <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Page Views", value: totalViews.toLocaleString(), icon: Eye, color: "primary", sub: `${viewsToday} today` },
          { label: "Registered Users", value: totalUsers.toLocaleString(), icon: Users, color: "highlight", sub: "All time" },
          { label: "Published Posts", value: totalPosts.toLocaleString(), icon: FileText, color: "secondary", sub: "Live articles" },
          { label: "Active Projects", value: totalProjects.toLocaleString(), icon: Briefcase, color: "accent", sub: "Showcased work" },
        ].map(({ label, value, icon: Icon, color, sub }) => (
          <SlideUp key={label}>
            <Card className="glass-card border-[var(--border-color)]">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-[var(--text-secondary)]">{label}</CardTitle>
                <div className={`w-8 h-8 rounded-lg bg-[var(--${color})]/10 flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 text-[var(--${color})]`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-[var(--text-main)]">{value}</div>
                <p className="text-xs text-[var(--text-muted)] mt-1 font-medium">{sub}</p>
              </CardContent>
            </Card>
          </SlideUp>
        ))}
      </StaggerContainer>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Views Over Time Chart */}
        <SlideUp className="lg:col-span-2">
          <Card className="glass-card h-full border-[var(--border-color)]">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="font-semibold text-lg flex items-center gap-2 text-[var(--text-main)]">
                  <TrendingUp className="w-4 h-4 text-[var(--primary)]" /> Traffic Growth
                </CardTitle>
                <span className="text-xs font-medium px-2 py-1 bg-[var(--background)] rounded border border-[var(--border-color)] text-[var(--text-secondary)]">Last 7 Days</span>
              </div>
            </CardHeader>
            <CardContent>
              <VisitorsChart data={[]} />
            </CardContent>
          </Card>
        </SlideUp>

        {/* Device Breakdown */}
        <SlideUp>
          <Card className="glass-card h-full border-[var(--border-color)]">
            <CardHeader className="pb-4">
              <CardTitle className="font-semibold text-lg flex items-center gap-2 text-[var(--text-main)]">
                <Monitor className="w-4 h-4 text-[var(--secondary)]" /> Devices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deviceBreakdown.length === 0 ? (
                  <p className="text-[var(--text-muted)] text-sm italic">No data yet.</p>
                ) : deviceBreakdown.map(({ device, count }: { device: string; count: number }) => {
                  const pct = Math.round((count / totalDeviceViews) * 100);
                  return (
                    <div key={device} className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="flex items-center gap-2 font-medium text-[var(--text-main)] capitalize">
                          {deviceIcon(device)} {device}
                        </span>
                        <span className="font-bold text-[var(--text-main)]">{pct}%</span>
                      </div>
                      <div className="h-1.5 bg-[var(--background)] rounded-full overflow-hidden border border-[var(--border-color)]">
                        <div className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </SlideUp>
      </div>

      {/* Top Pages */}
      <SlideUp>
        <Card className="glass-card border-[var(--border-color)] overflow-hidden">
          <CardHeader className="border-b border-[var(--border-color)] bg-[var(--background)]/30">
            <CardTitle className="font-semibold text-lg flex items-center gap-2 text-[var(--text-main)]">
              <BarChart3 className="w-4 h-4 text-[var(--highlight)]" /> Top Pages (Last 30 Days)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {topPages.length === 0 ? (
              <p className="p-8 text-center text-[var(--text-muted)] italic">No page view data yet. Views will appear here as visitors browse your site.</p>
            ) : (
              <div className="divide-y divide-[var(--border-color)]">
                {topPages.map(({ path, count }: { path: string; count: number }, i: number) => {
                  const maxCount = topPages[0]?.count || 1;
                  return (
                    <div key={path} className="p-4 flex items-center gap-4 hover:bg-[var(--background)]/50 transition-colors">
                      <span className="w-6 text-sm font-bold text-[var(--text-muted)] shrink-0">{i + 1}</span>
                      <div className="flex-1">
                        <p className="font-mono text-sm text-[var(--text-main)]">{path}</p>
                        <div className="h-1 bg-[var(--background)] rounded-full mt-2 overflow-hidden max-w-md border border-[var(--border-color)]">
                          <div className="h-full bg-gradient-to-r from-[var(--highlight)] to-[var(--primary)] rounded-full" style={{ width: `${(count / maxCount) * 100}%` }} />
                        </div>
                      </div>
                      <span className="font-bold text-[var(--text-main)] shrink-0">{count.toLocaleString()}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </SlideUp>
    </div>
  );
}
