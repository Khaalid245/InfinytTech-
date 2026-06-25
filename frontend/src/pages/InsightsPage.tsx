// ─── InsightsPage.tsx ──────────────────────────────────────────────────────────
// Premium blog search, filter, and list page.
// Pulls real-time categories, tags, and posts from Django CMS.
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Container from '../components/layout/Container';
import Heading from '../components/ui/Heading';
import Text from '../components/ui/Text';
import BlogCard from '../components/ui/BlogCard';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import { useBlogCategories, useBlogTags, useBlogPosts } from '../hooks/useBlog';
import { Search } from 'lucide-react';
import { cn } from '../utils/cn';

interface InsightsPageProps {
  theme: 'dark' | 'light';
}

export default function InsightsPage({ theme }: InsightsPageProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read URL query params
  const categoryParam = searchParams.get('category') || '';
  const tagParam = searchParams.get('tag') || '';
  const searchParam = searchParams.get('search') || '';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  const [searchInput, setSearchInput] = useState(searchParam);

  // Debounced search sync (400ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchParams((prev) => {
        if (searchInput) {
          prev.set('search', searchInput);
        } else {
          prev.delete('search');
        }
        prev.set('page', '1'); // Reset to first page
        return prev;
      });
    }, 400);

    return () => clearTimeout(handler);
  }, [searchInput, setSearchParams]);

  // Sync search input with URL params if modified externally
  useEffect(() => {
    setSearchInput(searchParam);
  }, [searchParam]);

  // Queries
  const { data: categories } = useBlogCategories();
  const { data: tags } = useBlogTags();
  const { data: postsData, isLoading: isPostsLoading, isFetching: isPostsFetching } = useBlogPosts({
    category: categoryParam,
    tag: tagParam,
    search: searchParam,
    page: pageParam,
    page_size: 9,
  });

  const activeCategory = categoryParam;
  const activeTag = tagParam;

  const handleCategorySelect = (slug: string) => {
    setSearchParams((prev) => {
      if (slug) {
        prev.set('category', slug);
      } else {
        prev.delete('category');
      }
      prev.delete('tag'); // Clear tag when swapping category
      prev.set('page', '1');
      return prev;
    });
  };

  const handleTagSelect = (slug: string) => {
    setSearchParams((prev) => {
      if (slug === activeTag) {
        prev.delete('tag');
      } else {
        prev.set('tag', slug);
      }
      prev.set('page', '1');
      return prev;
    });
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => {
      prev.set('page', newPage.toString());
      return prev;
    });
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setSearchParams({});
  };

  const posts = postsData?.results || [];
  const totalCount = postsData?.count || 0;
  const totalPages = Math.ceil(totalCount / 9);

  // Identify featured post for first page, standard views (no active filters)
  const hasFilters = !!(categoryParam || tagParam || searchParam);
  const featuredPost = !hasFilters && pageParam === 1 && posts.length > 0
    ? posts.find((p) => p.is_featured) || posts[0]
    : null;

  // Filter out showcase post from grid
  const displayPosts = featuredPost
    ? posts.filter((p) => p.id !== featuredPost.id)
    : posts;

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isDark = theme === 'dark';

  return (
    <div className="py-20 animate-fade-in">
      <Container size="lg">
        {/* Hero Header */}
        <div className="border-b border-border-primary pb-10 mb-12">
          <div className="max-w-3xl">
            <span className="text-caption text-accent-primary uppercase font-bold tracking-widest block mb-3">
              InfinytTech Insights
            </span>
            <Heading variant="h1" className="text-4xl md:text-5xl font-medium tracking-tight mb-4">
              Perspectives on engineering & premium design systems.
            </Heading>
            <Text variant="body-large" className="text-secondary-text">
              We document our engineering discoveries, architectural patterns, and design ideologies.
            </Text>
          </div>
        </div>

        {/* Filters Toolbar */}
        <div className="space-y-6 mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Search Input */}
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-text" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search articles..."
                className={cn(
                  'w-full h-11 pl-10 pr-4 text-small rounded-lg border outline-none transition-all',
                  isDark
                    ? 'bg-surface-light border-[#23262D] text-primary-text focus:border-[#D4A017] focus:ring-1 focus:ring-[#D4A017]'
                    : 'bg-white border-slate-200 text-primary-text focus:border-[#B8860B] focus:ring-1 focus:ring-[#B8860B]'
                )}
              />
            </div>

            {/* Category Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none -mx-6 px-6 lg:mx-0 lg:px-0">
              <button
                onClick={() => handleCategorySelect('')}
                className={cn(
                  'px-4 py-2 text-small font-medium rounded-full transition-all whitespace-nowrap cursor-pointer',
                  !activeCategory
                    ? (isDark ? 'bg-[#D4A017] text-[#0B0D0F]' : 'bg-[#0F172A] text-white')
                    : (isDark ? 'bg-surface-light text-[#94A3B8] hover:text-[#F8FAFC]' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')
                )}
              >
                All Categories
              </button>
              {categories?.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.slug)}
                  className={cn(
                    'px-4 py-2 text-small font-medium rounded-full transition-all whitespace-nowrap cursor-pointer',
                    activeCategory === cat.slug
                      ? (isDark ? 'bg-[#D4A017] text-[#0B0D0F]' : 'bg-[#0F172A] text-white')
                      : (isDark ? 'bg-surface-light text-[#94A3B8] hover:text-[#F8FAFC]' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Tags cloud */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-border-primary border-dashed">
              <span className="text-caption text-secondary-text self-center mr-2 uppercase tracking-wider font-semibold">Filter tags:</span>
              {tags.map((tag) => {
                const isSelected = activeTag === tag.slug;
                return (
                  <button
                    key={tag.id}
                    onClick={() => handleTagSelect(tag.slug)}
                    className={cn(
                      'px-3 py-1 rounded-md text-caption font-medium border transition-all cursor-pointer',
                      isSelected
                        ? (isDark ? 'bg-[#D4A017]/10 border-[#D4A017] text-[#D4A017]' : 'bg-[#0F172A]/10 border-[#0F172A] text-[#0F172A]')
                        : (isDark ? 'border-[#23262D] text-[#94A3B8] hover:text-[#F8FAFC] bg-[#121417]' : 'border-slate-200 text-slate-500 hover:text-slate-900 bg-white')
                    )}
                  >
                    #{tag.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Featured Post Showcase */}
        {featuredPost && (
          <div className="mb-16 group">
            <Link to={`/insights/${featuredPost.slug}`}>
              <div className={cn(
                'grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 md:p-8 rounded-2xl border transition-all duration-300',
                isDark
                  ? 'bg-surface-light border-[#23262D] group-hover:border-[#D4A017]'
                  : 'bg-white border-slate-200 group-hover:border-[#0F172A]'
              )}>
                <div className="lg:col-span-7 aspect-video lg:aspect-auto w-full overflow-hidden rounded-xl bg-surface-light border border-border-primary relative">
                  {featuredPost.featured_image ? (
                    <img
                      src={featuredPost.featured_image}
                      alt={featuredPost.title}
                      loading="eager"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-101"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-secondary-text">No image available</div>
                  )}
                  {featuredPost.is_featured && (
                    <span className="absolute top-4 left-4 bg-primary-text text-primary-bg px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider rounded-sm">
                      Featured
                    </span>
                  )}
                </div>

                <div className="lg:col-span-5 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-caption text-secondary-text">
                      {featuredPost.category && (
                        <span className="uppercase font-semibold tracking-wider text-accent-primary bg-neutral-900 px-2 py-0.5 rounded-sm text-[10px]">
                          {featuredPost.category.name}
                        </span>
                      )}
                      <span>{formatDate(featuredPost.published_at)}</span>
                      <span className="w-1 h-1 rounded-full bg-border-primary" />
                      <span>{featuredPost.reading_time} min read</span>
                    </div>

                    <Heading variant="h2" className="text-2xl md:text-3xl font-medium tracking-tight group-hover:text-accent-primary transition-colors">
                      {featuredPost.title}
                    </Heading>

                    <Text variant="body" className="text-secondary-text text-small line-clamp-4">
                      {featuredPost.excerpt}
                    </Text>
                  </div>

                  <div className="pt-6 flex items-center justify-between border-t border-border-primary mt-6">
                    {featuredPost.author && (
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#23262D] flex items-center justify-center text-caption font-bold text-accent-primary uppercase border border-border-primary">
                          {featuredPost.author.first_name[0]}{featuredPost.author.last_name[0]}
                        </div>
                        <span className="text-caption font-semibold">{featuredPost.author.first_name} {featuredPost.author.last_name}</span>
                      </div>
                    )}
                    <span className="text-small font-medium text-accent-primary group-hover:underline flex items-center gap-1">
                      Read Featured Article &rarr;
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Articles List / Grid */}
        {isPostsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className={cn(
                'h-[420px] rounded-xl border p-5 flex flex-col justify-between animate-pulse',
                isDark ? 'bg-[#121417] border-[#23262D]' : 'bg-white border-slate-200'
              )}>
                <div className="w-full h-44 bg-surface-light rounded-lg border border-border-primary mb-4" />
                <div className="space-y-3 flex-grow">
                  <div className="h-4 bg-surface-light rounded w-1/4" />
                  <div className="h-6 bg-surface-light rounded w-3/4" />
                  <div className="h-4 bg-surface-light rounded w-full" />
                </div>
                <div className="h-8 bg-surface-light rounded w-1/3 mt-4" />
              </div>
            ))}
          </div>
        ) : displayPosts.length === 0 && !featuredPost ? (
          <EmptyState
            title="No insights match your criteria"
            description="We haven't published any articles matching that filter combination yet."
            actionText="Reset filters"
            onAction={handleResetFilters}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayPosts.map((post) => (
              <Link to={`/insights/${post.slug}`} key={post.id} className="block h-full">
                <BlogCard
                  title={post.title}
                  excerpt={post.excerpt}
                  date={formatDate(post.published_at)}
                  readTime={`${post.reading_time} min read`}
                  imageUrl={post.featured_image || undefined}
                  category={post.category?.name}
                  href={`/insights/${post.slug}`}
                  className="h-full"
                />
              </Link>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border-primary pt-8 mt-16">
            <Button
              variant="secondary"
              disabled={pageParam <= 1 || isPostsFetching}
              onClick={() => handlePageChange(pageParam - 1)}
              className="py-2"
            >
              &larr; Previous
            </Button>

            <span className="text-small text-secondary-text font-medium">
              Page {pageParam} of {totalPages}
            </span>

            <Button
              variant="secondary"
              disabled={pageParam >= totalPages || isPostsFetching}
              onClick={() => handlePageChange(pageParam + 1)}
              className="py-2"
            >
              Next &rarr;
            </Button>
          </div>
        )}
      </Container>
    </div>
  );
}
