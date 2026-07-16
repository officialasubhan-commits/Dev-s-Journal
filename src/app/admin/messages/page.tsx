import prisma from "@/lib/prisma";
import { format } from "date-fns";
import { Mail, Trash2, MailOpen, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { markMessageRead, deleteMessage } from "../comments/actions";
import Link from "next/link";

export default async function AdminMessagesPage({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const filter = resolvedSearchParams.filter || "all";

  const whereClause = filter === "unread" ? { read: false } : filter === "read" ? { read: true } : {};

  const messages = await prisma.message.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      subject: true,
      message: true,
      read: true,
      createdAt: true
    }
  });

  const [unreadCount, totalCount] = await Promise.all([
    prisma.message.count({ where: { read: false } }),
    prisma.message.count(),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]">Messages</h1>
          <p className="text-[var(--text-secondary)] mt-1">Contact form messages from visitors.</p>
        </div>
        <div className="flex gap-2">
          {[
            { id: "all", label: `All (${totalCount})` },
            { id: "unread", label: `Unread (${unreadCount})` },
            { id: "read", label: "Read" },
          ].map(tab => (
            <Link
              key={tab.id}
              href={`/admin/messages?filter=${tab.id}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                filter === tab.id
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
        {messages.length === 0 ? (
          <div className="p-12 text-center text-[var(--text-muted)] italic">
            <Inbox className="w-12 h-12 mx-auto mb-3 opacity-30" />
            No messages found.
          </div>
        ) : (
          <div className="divide-y divide-[var(--border-color)]">
            {messages.map(msg => (
              <div key={msg.id} className={`p-5 hover:bg-[var(--background)]/50 transition-colors ${!msg.read ? "border-l-4 border-[var(--primary)]" : ""}`}>
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      {!msg.read && <span className="w-2 h-2 rounded-full bg-[var(--primary)] shrink-0" />}
                      <p className="font-semibold text-[var(--text-main)]">{msg.name}</p>
                      <a href={`mailto:${msg.email}`} className="text-xs text-[var(--primary)] hover:underline">{msg.email}</a>
                    </div>
                    {msg.subject && <p className="font-medium text-[var(--text-secondary)]">{msg.subject}</p>}
                    <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{msg.message}</p>
                    <p className="text-xs text-[var(--text-muted)]">{format(new Date(msg.createdAt), "PPp")}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {!msg.read && (
                      <form action={markMessageRead.bind(null, msg.id)}>
                        <Button type="submit" size="sm" variant="outline" className="flex items-center gap-1.5">
                          <MailOpen className="w-4 h-4" /> Mark Read
                        </Button>
                      </form>
                    )}
                    <a href={`mailto:${msg.email}?subject=Re: ${msg.subject || 'Your Message'}`}>
                      <Button size="sm" className="bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 flex items-center gap-1.5">
                        <Mail className="w-4 h-4" /> Reply
                      </Button>
                    </a>
                    <form action={deleteMessage.bind(null, msg.id)}>
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
