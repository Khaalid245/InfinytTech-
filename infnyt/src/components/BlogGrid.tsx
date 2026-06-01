'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Search, ChevronLeft, ChevronRight, ArrowRight, Tag } from 'lucide-react';
import SpiderLines from './SpiderLines';
import { api, type Post, type Category, formatDate, formatReadTime } from '@/lib/api';

const FILTERS_STATIC = ['All Articles'];
const ARTICLES_PER_PAGE = 3;

const POPULAR_TOPICS = [
  { label: 'Artificial Intelligence', count: 12 },
  { label: 'Engineering',             count: 18 },
  { label: 'Infrastructure & DevOps', count: 9  },
  { label: 'Product Design',          count: 7  },
  { label: 'Strategy',                count: 5  },
];

export default function BlogGrid() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All Articles');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [email, setEmail] = useState('');

  const filters = [
    ...FILTERS_STATIC,
    ...categories.map((c) => c.name),
  ];

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(false);
    const categorySlug = activeFilter === 'All Articles'
      ? undefined
      : categories.find((c) => c.name === activeFilter)?.slug;

    const res = await api.blog.posts({
      category: categorySlug,
      page,
      page_size: ARTICLES_PER_PAGE,
    });

    if (res.success) {
      setPosts(res.data.results);
      setTotalCount(res.data.count);
    } else {
      setError(true);
    }
    setLoading(false);
  }, [activeFilter, page, categories]);

  // Load categories once on mount
  useEffect(() => {
    api.blog.categories().then((res) => {
      if (res.success) setCategories(res.data);
    });
  }, []);

  // Fetch posts when filter or page changes
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const totalPages = Math.max(1, Math.ceil(totalCount / ARTICLES_PER_PAGE));

  // Client-side search filter on already-fetched page
  const visible = search.trim()
    ? posts.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        (p.excerpt ?? '').toLowerCase().includes(search.toLowerCase())
      )
    : posts;

  function handleFilterClick(f: string) {
    setActiveFilter(f);
    setPage(1);
  }

  function changePage(n: number) {
    setPage(Math.min(Math.max(1, n), totalPages));
    document.getElementById('articles')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <section id="articles" className="relative overflow-hidden py-16" style={{ background: 'transparent' }}>
      <div className="pointer-events-none absolute inset-0" style={{ background: 'rgba(0, 20, 26, 0.88)' }} aria-hidden="true" />
      <SpiderLines />
      <div className="cinema-key pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 72% 62% at 14% -5%, rgba(14,158,181,0.24) 0%, rgba(14,158,181,0.06) 45%, transparent 72%)', filter: 'blur(8px)' }} aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 55% at 96% 110%, rgba(180,204,65,0.15) 0%, rgba(180,204,65,0.04) 48%, transparent 72%)', filter: 'blur(14px)' }} aria-hidden="true" />
      <div className="cinema-rays pointer-events-none absolute inset-0 overflow-hidden" style={{ mixBlendMode: 'screen' }} aria-hidden="true">
        <div style={{ position: 'absolute', top: '-40%', left: '5%',  width: 280, height: '170%', background: 'linear-gradient(180deg,rgba(180,204,65,0.9) 0%,rgba(180,204,65,0.20) 52%,transparent 100%)', transform: 'rotate(-28deg)', transformOrigin: 'top center', filter: 'blur(34px)', opacity: 0.038 }} />
        <div style={{ position: 'absolute', top: '-40%', left: '19%', width: 95,  height: '170%', background: 'linear-gradient(180deg,rgba(180,204,65,0.8) 0%,rgba(180,204,65,0.14) 58%,transparent 100%)', transform: 'rotate(-28deg)', transformOrigin: 'top center', filter: 'blur(22px)', opacity: 0.026 }} />
        <div style={{ position: 'absolute', top: '-40%', left: '33%', width: 160, height: '170%', background: 'linear-gradient(180deg,rgba(14,158,181,0.8) 0%,rgba(14,158,181,0.10) 62%,transparent 100%)', transform: 'rotate(-22deg)', transformOrigin: 'top center', filter: 'blur(30px)', opacity: 0.028 }} />
      </div>
      <div className="hero-gradient-drift pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="pointer-events-none absolute -top-40 -left-40 w-160 h-160" style={{ background: 'radial-gradient(circle, rgba(180,204,65,0.09) 0%, transparent 62%)' }} aria-hidden="true" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-120 w-[65%]" style={{ background: 'radial-gradient(ellipse 80% 90% at 90% 100%, rgba(180,204,65,0.07) 0%, rgba(14,158,181,0.04) 45%, transparent 70%)' }} aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 88% 28% at 50% 46%, rgba(14,158,181,0.032) 0%, transparent 100%)' }} aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 88% 74% at 50% 42%, transparent 30%, rgba(0,0,0,0.68) 100%)' }} aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.34) 0%, transparent 16%, transparent 84%, rgba(0,0,0,0.34) 100%)' }} aria-hidden="true" />

      <div className="relative z-10 max-w-300 mx-auto px-8">
        {/* Filters + search */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-10">
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => handleFilterClick(f)}
                className="px-4 py-1.5 text-[12.5px] font-semibold transition-all duration-200"
                style={activeFilter === f ? { background: '#e1ff51', color: '#000000' } : { border: '1px solid rgba(255,255,255,0.07)', background: 'transparent', color: 'rgba(255,255,255,0.50)' }}
                onMouseEnter={e => { if (activeFilter !== f) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.90)'; }}
                onMouseLeave={e => { if (activeFilter !== f) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.50)'; }}
              >{f}</button>
            ))}
          </div>
          <div className="relative shrink-0">
            <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(255,255,255,0.30)' }} aria-hidden="true" />
            <input
              type="search"
              placeholder="Search articles…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 text-[13px] text-white placeholder:text-white/30 focus:outline-none w-52 transition-colors"
              style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(0,20,26,0.45)' }}
              onFocus={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(225,255,81,0.30)'; }}
              onBlur={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)'; }}
            />
          </div>
        </div>

        {/* Grid + sidebar */}
        <div className="flex gap-8 items-start">
          <div className="flex-1 min-w-0">
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="animate-pulse" style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(0,20,26,0.35)' }}>
                    <div className="h-[172px] bg-white/5" />
                    <div className="p-5 flex flex-col gap-3">
                      <div className="h-3 w-24 bg-white/10 rounded" />
                      <div className="h-4 w-full bg-white/10 rounded" />
                      <div className="h-3 w-4/5 bg-white/5 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && error && (
              <div className="py-16 text-center">
                <p className="text-[14px] text-white/40 mb-4">Could not load articles right now.</p>
                <button onClick={fetchPosts} className="text-[13px] font-semibold" style={{ color: '#e1ff51' }}>Try again</button>
              </div>
            )}

            {!loading && !error && visible.length === 0 && (
              <p className="text-[14px] text-white/50">No articles match your search.</p>
            )}

            {!loading && !error && visible.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {visible.map((post) => <ArticleCard key={post.id} post={post} />)}
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button onClick={() => changePage(page - 1)} disabled={page === 1} className="w-9 h-9 flex items-center justify-center text-white/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors hover:text-white" style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'transparent' }} aria-label="Previous page"><ChevronLeft size={15} /></button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button key={n} onClick={() => changePage(n)} className="w-9 h-9 text-[13px] font-semibold transition-all duration-150" style={n === page ? { background: '#e1ff51', color: '#000000' } : { border: '1px solid rgba(255,255,255,0.07)', background: 'transparent', color: 'rgba(255,255,255,0.50)' }} aria-current={n === page ? 'page' : undefined}>{n}</button>
                ))}
                <button onClick={() => changePage(page + 1)} disabled={page === totalPages} className="w-9 h-9 flex items-center justify-center text-white/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors hover:text-white" style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'transparent' }} aria-label="Next page"><ChevronRight size={15} /></button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="hidden xl:flex flex-col gap-5 w-[264px] shrink-0">
            <div className="relative overflow-hidden p-6" style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(0,20,26,0.45)' }}>
              <div className="absolute inset-x-0 top-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(225,255,81,0.45) 50%, transparent)' }} aria-hidden="true" />
              <h3 className="text-[15px] font-semibold text-white mb-1 tracking-tight">Stay in the loop</h3>
              <p className="text-[12.5px] text-white/50 leading-[1.6] mb-4">New articles to your inbox, no noise.</p>
              <div className="flex gap-2">
                <input type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} className="flex-1 min-w-0 px-3 py-2 text-[13px] text-white placeholder:text-white/30 focus:outline-none transition-colors" style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(0,20,26,0.60)' }} onFocus={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(225,255,81,0.30)'; }} onBlur={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)'; }} />
                <button onClick={() => setEmail('')} className="w-9 h-9 shrink-0 flex items-center justify-center hover:brightness-110 transition-all" style={{ background: '#e1ff51', color: '#000000' }} aria-label="Subscribe"><ArrowRight size={14} /></button>
              </div>
            </div>
            <div className="relative overflow-hidden p-6" style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(0,20,26,0.45)' }}>
              <div className="absolute inset-x-0 top-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(225,255,81,0.45) 50%, transparent)' }} aria-hidden="true" />
              <h3 className="text-[15px] font-semibold text-white mb-4 tracking-tight">Popular topics</h3>
              <ul className="flex flex-col gap-3">
                {POPULAR_TOPICS.map(({ label, count }) => (
                  <li key={label}>
                    <button onClick={() => { const match = filters.find((f) => f.toLowerCase().includes(label.split(' ')[0].toLowerCase())); if (match) handleFilterClick(match); }} className="flex items-center justify-between w-full group">
                      <span className="flex items-center gap-2 text-[13px] text-white/50 font-medium group-hover:text-[#e1ff51] transition-colors duration-200"><Tag size={11} style={{ color: '#e1ff51' }} className="shrink-0" aria-hidden="true" />{label}</span>
                      <span className="text-[11px] font-semibold px-2 py-0.5" style={{ background: 'rgba(225,255,81,0.10)', color: '#e1ff51' }}>{count}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function ArticleCard({ post }: { post: Post }) {
  const categoryName = post.category?.name ?? '';
  const date = formatDate(post.published_at);
  const readTime = formatReadTime(post.read_time);
  const body = post.excerpt || post.title;
  const hasImage = Boolean(post.thumbnail);

  return (
    <article className="group relative flex flex-col overflow-hidden transition-colors duration-500 ease-out hover:bg-white/1.5 cursor-pointer" style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(0,20,26,0.35)' }}>
      <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out z-10" style={{ background: 'radial-gradient(ellipse 80% 35% at 50% 0%, rgba(225,255,81,0.05) 0%, transparent 70%)' }} aria-hidden="true" />
      <span className="absolute top-0 left-0 h-px w-0 group-hover:w-full transition-all duration-500 ease-out z-20" style={{ background: 'linear-gradient(90deg, transparent, #e1ff51 50%, transparent)' }} aria-hidden="true" />

      {/* Image */}
      <div className="relative h-[172px] overflow-hidden shrink-0 bg-white/5">
        {hasImage ? (
          <Image src={post.thumbnail!} alt={post.title} fill className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]" sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 340px" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-[11px] font-mono text-white/20 uppercase tracking-widest">No image</span>
          </div>
        )}
        {categoryName && (
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-flex items-center text-[10px] font-mono font-semibold tracking-[0.14em] uppercase px-2.5 py-1" style={{ background: 'rgba(0,20,26,0.80)', color: '#e1ff51', border: '1px solid rgba(225,255,81,0.18)' }}>{categoryName}</span>
          </div>
        )}
      </div>

      <div className="h-px w-full" style={{ background: 'rgba(255,255,255,0.07)' }} aria-hidden="true" />

      <div className="relative z-10 flex flex-col flex-1 p-5">
        <div className="flex items-center gap-2 text-[11.5px] text-white/40 mb-3">
          {date && <span>{date}</span>}
          {date && readTime && <span className="w-1 h-1 rounded-full bg-white/20" aria-hidden="true" />}
          {readTime && <span>{readTime} read</span>}
        </div>
        <h3 className="text-[15px] font-semibold text-white leading-[1.35] mb-2 tracking-tight transition-colors duration-300 group-hover:text-[#e1ff51]">{post.title}</h3>
        <p className="text-[12.5px] text-white/55 leading-[1.65] flex-1">{body}</p>
        <div className="flex items-center justify-between mt-5 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <span className="text-[12px] font-medium text-white/40">{post.author_name ?? ''}</span>
          <a href={`/blog/${post.slug}`} className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-white/55 hover:text-[#e1ff51] transition-colors duration-200">
            Read <ArrowRight size={12} strokeWidth={2.2} aria-hidden="true" />
          </a>
        </div>
      </div>
    </article>
  );
}
