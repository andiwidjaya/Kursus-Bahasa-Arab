import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { updateSEOHead } from '../lib/seo';
import { ArrowLeft, Clock, User as UserIcon, Tag, Share2, Sparkles, BookOpen, ChevronRight } from 'lucide-react';

export const BlogDetailPage: React.FC = () => {
  const { selectedBlogSlug, blogPosts, navigateTo, showToast } = useApp();

  const post = blogPosts.find(b => b.slug === selectedBlogSlug) || blogPosts[0];

  useEffect(() => {
    if (post) {
      updateSEOHead({
        title: `${post.title} — Arabiyyah Blog`,
        description: post.summary,
        keywords: [post.category, 'belajar bahasa arab', 'nahwu shorof'],
        ogImage: post.thumbnail_url,
        ogType: 'article'
      });
    }
  }, [post]);

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-800">Artikel Tidak Ditemukan</h1>
        <button
          onClick={() => navigateTo('blog')}
          className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs"
        >
          Kembali ke Daftar Blog
        </button>
      </div>
    );
  }

  const relatedPosts = blogPosts.filter(b => b.id !== post.id).slice(0, 2);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Tautan artikel tersalin ke clipboard!', 'info');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Back Button */}
      <button
        onClick={() => navigateTo('blog')}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Daftar Blog
      </button>

      {/* Article Header */}
      <div className="space-y-4">
        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 text-xs font-extrabold border border-emerald-500/20 uppercase tracking-wider">
          {post.category}
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight">
          {post.title}
        </h1>
        
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-b border-slate-100 pb-4 text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-bold text-slate-800">
              <UserIcon className="w-4 h-4 text-emerald-600" />
              {post.author}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-slate-400" />
              {post.read_time}
            </span>
          </div>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            Bagikan
          </button>
        </div>
      </div>

      {/* Hero Thumbnail */}
      <div className="rounded-3xl overflow-hidden aspect-[16/9] shadow-lg border border-slate-200">
        <img src={post.thumbnail_url} alt={post.title} className="w-full h-full object-cover" />
      </div>

      {/* Article Content Body */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6 prose prose-emerald max-w-none text-slate-800 text-sm sm:text-base leading-relaxed">
        {post.content_markdown.split('\n\n').map((paragraph, index) => {
          if (paragraph.startsWith('### ')) {
            return <h3 key={index} className="text-xl font-extrabold text-slate-900 mt-6 mb-3">{paragraph.replace('### ', '')}</h3>;
          }
          if (paragraph.startsWith('#### ')) {
            return <h4 key={index} className="text-base font-extrabold text-slate-900 mt-4 mb-2">{paragraph.replace('#### ', '')}</h4>;
          }
          return <p key={index} className="mb-4 text-slate-700">{paragraph}</p>;
        })}
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="pt-8 border-t border-slate-200 space-y-4">
          <h2 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            Artikel Terkait Lainnya
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedPosts.map(rel => (
              <div
                key={rel.id}
                onClick={() => navigateTo('blog-detail', { blogSlug: rel.slug })}
                className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-emerald-500 cursor-pointer transition-all flex items-center justify-between gap-3 group"
              >
                <div>
                  <span className="text-[10px] font-extrabold text-emerald-600 uppercase">{rel.category}</span>
                  <h3 className="text-xs font-extrabold text-slate-900 group-hover:text-emerald-600 line-clamp-1 mt-0.5">{rel.title}</h3>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-transform flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
