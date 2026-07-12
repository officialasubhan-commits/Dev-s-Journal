import prisma from "@/lib/prisma";
import { format } from "date-fns";
import { MessageSquare, CheckCircle, XCircle, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { approveComment, rejectComment, deleteComment } from "./actions";
import Link from "next/link";

export default async function AdminCommentsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const status = resolvedSearchParams.status || "pending";
  
  const whereClause = status === "pending" ? { approved: false } :
                      status === "approved" ? { approved: true } : {};

  const comments = await prisma.comment.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    include: { post: { select: { title: true, slug: true } } }
  });

  const [pendingCount, approvedCount] = await Promise.all([
    prisma.comment.count({ where: { approved: false } }),
    prisma.comment.count({ where: { approved: true } }),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]">Comments</h1>
          <p className="text-[var(--text-secondary)] mt-1">Review and moderate visitor comments.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {[
            { id: "pending", label: `Pending (${pendingCount})`, color: "yellow" },
            { id: "approved", label: `Approved (${approvedCount})`, color: "green" },
            { id: "all", label: "All", color: "gray" },
          ].map(tab => (
            <Link
              key={tab.id}
              href={`/admin/comments?status=${tab.id}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                status === tab.id
                  ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                  : "border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        {comments.length === 0 ? (
          <div className="p-12 text-center text-[var(--text-muted)] italic">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
            No comments found.
          </div>
        ) : (
          <div className="divide-y divide-[var(--border-color)]">
            {comments.map(comment => (
              <div key={comment.id} className="p-5 hover:bg-[var(--background)]/50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <p className="font-semibold text-[var(--text-main)]">{comment.authorName}</p>
                      {comment.authorEmail && <p className="text-xs text-[var(--text-muted)]">{comment.authorEmail}</p>}
                      <span className={`px-2 py-0.5 text-xs rounded-full ${comment.approved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {comment.approved ? "Approved" : "Pending"}
                      </span>
                    </div>
                    <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{comment.content}</p>
                    <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                      <span>{format(new Date(comment.createdAt), "PPp")}</span>
                      {comment.post && (
                        <Link href={`/journal/${comment.post.slug}`} target="_blank" className="flex items-center gap-1 hover:text-[var(--primary)] transition-colors">
                          <ExternalLink className="w-3 h-3" /> {comment.post.title}
                        </Link>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {!comment.approved && (
                      <form action={approveComment.bind(null, comment.id)}>
                        <Button type="submit" size="sm" className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-1.5">
                          <CheckCircle className="w-4 h-4" /> Approve
                        </Button>
                      </form>
                    )}
                    {comment.approved && (
                      <form action={rejectComment.bind(null, comment.id)}>
                        <Button type="submit" variant="outline" size="sm" className="flex items-center gap-1.5">
                          <XCircle className="w-4 h-4" /> Reject
                        </Button>
                      </form>
                    )}
                    <form action={deleteComment.bind(null, comment.id)}>
                      <Button type="submit" variant="ghost" size="sm" className="text-[var(--error)] hover:bg-[var(--error)]/10">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
