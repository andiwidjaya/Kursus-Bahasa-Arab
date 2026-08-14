import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { updateSEOHead } from '../lib/seo';
import { Search, BookOpen, Clock, ArrowRight, Sparkles, Tag, User as UserIcon } from 'lucide-react';

export const BlogListPage: React.FC = () => {
  const { blogPosts, navigateTo } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  useEffect(() => {
    updateSEOHead({
      title: 'Artikel & Panduan Belajar Bahasa Arab — Arabiyyah Blog',
      description: 'Temukan tips, trik, dan panduan terstruktur mempelajari kaidah Nahwu, Shorof, kosakata Al-Qur\'an, dan membaca kitab gundul dari nol.',
      keywords: ['artikel bahasa arab', 'tips belajar nahwu', 'panduan shorof', 'metode baca kitab']
    });
  }, []);

  // Filter blog posts
  const categories = ['ALL', ...Array.from(new Set(blogPosts.map(b => b.category)))];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          post.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header Banner */}
      <div className="emerald-gradient text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 backdrop-blur-md border border-white/20 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" /> Jurnal & Edukasi Bahasa Arab
          </span>
          <h1 className="text-3xl sm:text-4xl font-black leading-tight">
            Wawasan & Strategi Belajar Bahasa Arab Terstruktur
          </h1>
          <p className="text-sm text-emerald-100 leading-relaxed">
            Artikel pilihan dari para pengajar profesional untuk membimbing Anda memahami tata kalimat, morfem, dan kosakata Al-Qur'an secara mudah.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Cari judul atau kata kunci artikel..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'ALL' ? 'Semua Kategori' : cat}
            </button>
          ))}
        </div>

      </div>

      {/* Post Grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map(post => (
            <article
              key={post.id}
              onClick={() => navigateTo('blog-detail', { blogSlug: post.slug })}
              className="group bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                  <img
                    src={post.thumbnail_url}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/70 backdrop-blur-md text-emerald-400 text-[10px] font-extrabold border border-white/10 uppercase tracking-wider">
                    {post.category}
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-4 text-[11px] text-slate-400 font-medium">
                    <span className="flex items-center gap-1">
                      <UserIcon className="w-3.5 h-3.5 text-emerald-600" />
                      {post.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {post.read_time}
                    </span>
                  </div>

                  <h2 className="font-extrabold text-base text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-2">
                    {post.title}
                  </h2>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {post.summary}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 group-hover:translate-x-1 transition-transform">
                  Baca Selengkapnya
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 space-y-3">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">Artikel Tidak Ditemukan</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Tidak ada artikel yang cocok dengan pencarian "{searchTerm}". Coba kata kunci lain atau pilih semua kategori.
          </p>
        </div>
      )}

    </div>
  );
};
