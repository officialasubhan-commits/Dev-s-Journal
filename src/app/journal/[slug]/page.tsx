import prisma from "@/lib/prisma";
import { UnavailableContent } from "@/components/ui/UnavailableContent";
import { SafeImage } from "@/components/ui/SafeImage";
import { Clock, Tag, Calendar } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post) return { title: "Post Not Found" };
  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.content.substring(0, 150),
  };
}

export default async function JournalPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  console.log("Received slug:", slug);

  if (!slug) return <UnavailableContent type="Journal Post" />;

  const post = await prisma.post.findUnique({
    where: { slug, published: true },
  });

  if (!post) return <UnavailableContent type="Journal Post" />;

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {post.coverImage && (
          <div className="w-full aspect-video relative rounded-2xl overflow-hidden border border-[var(--border-color)]">
            <SafeImage src={post.coverImage} alt={post.title} fill className="object-cover" priority />
          </div>
        )}

        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-glow">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-secondary)]">
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-1.5" /> 
              {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1.5" /> 
              {post.readingTime} min read
            </span>
            {post.mood && (
              <span className="px-2 py-1 bg-[var(--primary)]/10 text-[var(--primary)] rounded-full text-xs font-medium">
                {post.mood}
              </span>
            )}
          </div>
        </div>

        <div className="glass-card p-6 md:p-10 rounded-2xl">
          <div 
            className="prose prose-invert max-w-none 
              prose-headings:text-[var(--text-primary)] 
              prose-a:text-[var(--primary)] prose-a:no-underline hover:prose-a:underline
              prose-p:text-[var(--text-secondary)] prose-p:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }} 
          />
        </div>

        {post.tags.length > 0 && (
          <div className="flex items-center gap-2 pt-4">
            {post.tags.map(tag => (
              <span key={tag} className="flex items-center text-sm px-3 py-1.5 bg-[var(--background)] rounded-full border border-[var(--border-color)]">
                <Tag className="w-4 h-4 mr-1.5 text-[var(--accent)]" /> {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
