// ─── BlogPostDetailPage.tsx ──────────────────────────────────────────────────
// Premium blog detail reader page.
// Synchronizes SEO parameters, features reading progress, sharing controls,
// related articles, and chronological step-through buttons.
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Container from '../components/layout/Container';
import Heading from '../components/ui/Heading';
import Text from '../components/ui/Text';
import Button from '../components/ui/Button';
import BlogCard from '../components/ui/BlogCard';
import { useBlogPost, useBlogPosts } from '../hooks/useBlog';
import { Link2, ArrowLeft } from 'lucide-react';
import { cn } from '../utils/cn';

const Twitter: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const Linkedin: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

interface BlogPostDetailPageProps {
  theme: 'dark' | 'light';
}

export default function BlogPostDetailPage({ theme }: BlogPostDetailPageProps) {
  const { slug } = useParams<{ slug: string }>();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  // 1. Fetch current post details
  const { data: post, isLoading, isError } = useBlogPost(slug || '');

  // 2. Fetch related posts (same category)
  const categorySlug = post?.category?.slug || '';
  const { data: relatedPostsData } = useBlogPosts({
    category: categorySlug,
    page_size: 4,
  });

  // Filter out the active post from related list
  const relatedPosts = (relatedPostsData?.results || [])
    .filter((p) => p.slug !== slug)
    .slice(0, 3);

  // 3. Fetch all posts to determine chronological Next/Previous links
  const { data: navigationData } = useBlogPosts({ page_size: 100 });
  const allPosts = navigationData?.results || [];
  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const prevPost = currentIndex >= 0 && currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  // 4. Reading Progress Bar Sync
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 5. SEO Meta Headers Synchronization
  useEffect(() => {
    if (!post) return;
    
    // Save previous document values
    const originalTitle = document.title;
    const metaDescEl = document.querySelector('meta[name="description"]');
    const originalDesc = metaDescEl ? metaDescEl.getAttribute('content') : '';

    // Update with post specific metadata (fallbacks if empty)
    document.title = post.seo_title || `${post.title} | InfinytTech Insights`;
    if (metaDescEl) {
      metaDescEl.setAttribute('content', post.seo_description || post.excerpt);
    }

    // Restore original values on unmount
    return () => {
      document.title = originalTitle;
      if (metaDescEl && originalDesc) {
        metaDescEl.setAttribute('content', originalDesc);
      }
    };
  }, [post]);

  // Handle URL link copying
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="py-32 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative w-10 h-10 animate-spin">
          <div className="absolute inset-0 rounded-full border-[3px] border-border-primary" />
          <div className="absolute inset-0 rounded-full border-[3px] border-accent-primary border-t-transparent" />
        </div>
        <p className="text-small text-secondary-text mt-4">Loading article content...</p>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="py-32 min-h-[65vh]">
        <Container size="sm" className="text-center space-y-6">
          <Heading variant="h2" className="text-2xl">Article Not Found</Heading>
          <Text variant="body" className="text-secondary-text">
            The article you are looking for does not exist, has been archived, or was reverted to a draft.
          </Text>
          <Link to="/insights">
            <Button variant="primary" className="mt-4">Back to Insights</Button>
          </Link>
        </Container>
      </div>
    );
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const shareText = encodeURIComponent(post.title);
  const shareUrl = encodeURIComponent(window.location.href);
  const isDark = theme === 'dark';

  return (
    <div className="py-20 animate-fade-in relative">
      {/* Scroll Progress Indicator */}
      <div
        className="fixed top-0 left-0 h-[3px] bg-accent-primary z-50 transition-all duration-100"
        style={{ width: `${scrollProgress}%` }}
      />

      <Container size="sm">
        {/* Back Link */}
        <Link
          to="/insights"
          className="inline-flex items-center gap-2 text-small font-medium text-secondary-text hover:text-primary-text transition-colors mb-12"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Insights
        </Link>

        {/* Article Metadata Header */}
        <article className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-caption text-secondary-text">
              {post.category && (
                <span className="uppercase font-semibold tracking-wider text-accent-primary bg-neutral-900 px-2 py-0.5 rounded-sm text-[10px]">
                  {post.category.name}
                </span>
              )}
              <span>{formatDate(post.published_at)}</span>
              <span className="w-1 h-1 rounded-full bg-border-primary" />
              <span>{post.reading_time} min read</span>
            </div>

            <Heading variant="h1" className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight leading-tight">
              {post.title}
            </Heading>

            <Text variant="body-large" className="text-secondary-text italic border-l-2 border-border-primary pl-4 py-1">
              {post.excerpt}
            </Text>
          </div>

          {/* Author Block */}
          {post.author && (
            <div className="flex items-center gap-3 py-4 border-y border-border-primary">
              <div className="w-10 h-10 rounded-full bg-[#23262D] flex items-center justify-center text-small font-bold text-accent-primary uppercase border border-border-primary">
                {post.author.first_name[0]}{post.author.last_name[0]}
              </div>
              <div>
                <span className="text-small font-semibold block">{post.author.first_name} {post.author.last_name}</span>
                <span className="text-caption text-secondary-text uppercase tracking-wider">{post.author.role || 'Writer'}</span>
              </div>
            </div>
          )}

          {/* Wide Featured Image */}
          {post.featured_image && (
            <div className="aspect-video w-full overflow-hidden rounded-xl bg-surface-light border border-border-primary">
              <img
                src={post.featured_image}
                alt={post.title}
                loading="eager"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Render Rich Body Content */}
          <div
            className="blog-content-body pt-8"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Article Keyword Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-8 border-t border-border-primary border-dashed">
              {post.tags.map((tag) => (
                <Link
                  key={tag.id}
                  to={`/insights?tag=${tag.slug}`}
                  className={cn(
                    'px-3 py-1 rounded-md text-caption font-medium border transition-colors',
                    isDark
                      ? 'border-[#23262D] text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#D4A017] bg-[#121417]'
                      : 'border-slate-200 text-slate-500 hover:text-slate-900 hover:border-[#0F172A] bg-white'
                  )}
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          )}

          {/* Social Share Buttons */}
          <div className="flex items-center justify-between py-6 border-y border-border-primary border-dashed mt-10">
            <span className="text-caption text-secondary-text uppercase font-semibold tracking-wider">Share this article:</span>
            <div className="flex items-center gap-3">
              <a
                href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full border border-border-primary hover:text-accent-primary hover:border-accent-primary transition-all"
                title="Share on X"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full border border-border-primary hover:text-accent-primary hover:border-accent-primary transition-all"
                title="Share on LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <button
                onClick={handleCopyLink}
                className="w-9 h-9 flex items-center justify-center rounded-full border border-border-primary hover:text-accent-primary hover:border-accent-primary transition-all cursor-pointer relative"
                title="Copy Link"
              >
                <Link2 className="w-4 h-4" />
                {copied && (
                  <span className="absolute bottom-11 bg-primary-text text-primary-bg px-2 py-0.5 rounded text-[10px] whitespace-nowrap animate-fade-in-up">
                    Copied!
                  </span>
                )}
              </button>
            </div>
          </div>
        </article>

        {/* Chronological Step Navigation (Prev/Next) */}
        {(prevPost || nextPost) && (
          <div className="grid grid-cols-2 gap-4 py-8 border-b border-border-primary">
            <div>
              {prevPost && (
                <Link
                  to={`/insights/${prevPost.slug}`}
                  className="flex flex-col text-left group gap-1"
                >
                  <span className="text-caption text-secondary-text font-semibold uppercase tracking-wider">&larr; Previous</span>
                  <span className="text-small font-semibold group-hover:text-accent-primary transition-colors line-clamp-1">
                    {prevPost.title}
                  </span>
                </Link>
              )}
            </div>
            <div className="text-right">
              {nextPost && (
                <Link
                  to={`/insights/${nextPost.slug}`}
                  className="flex flex-col text-right group gap-1"
                >
                  <span className="text-caption text-secondary-text font-semibold uppercase tracking-wider">Next &rarr;</span>
                  <span className="text-small font-semibold group-hover:text-accent-primary transition-colors line-clamp-1">
                    {nextPost.title}
                  </span>
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Related Articles Panel */}
        {relatedPosts.length > 0 && (
          <div className="pt-16 space-y-8">
            <Heading variant="h3" className="text-xl font-semibold tracking-tight">
              Related Articles
            </Heading>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPosts.map((rPost) => (
                <Link to={`/insights/${rPost.slug}`} key={rPost.id} className="block h-full">
                  <BlogCard
                    title={rPost.title}
                    excerpt={rPost.excerpt}
                    date={formatDate(rPost.published_at)}
                    readTime={`${rPost.reading_time} min read`}
                    imageUrl={rPost.featured_image || undefined}
                    category={rPost.category?.name}
                    href={`/insights/${rPost.slug}`}
                    className="h-full"
                  />
                </Link>
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
