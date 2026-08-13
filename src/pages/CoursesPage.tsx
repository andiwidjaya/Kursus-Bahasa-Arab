import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CourseCard } from '../components/CourseCard';
import { Search, SlidersHorizontal, BookOpen, Filter } from 'lucide-react';

export const CoursesPage: React.FC = () => {
  const { courses } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('SEMUA');
  const [selectedCategory, setSelectedCategory] = useState<string>('SEMUA');
  const [sortBy, setSortBy] = useState<'POPULAR' | 'PRICE_LOW' | 'PRICE_HIGH' | 'RATING'>('POPULAR');

  // Filtering Logic
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          course.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLevel = selectedLevel === 'SEMUA' || course.level === selectedLevel;
    const matchesCategory = selectedCategory === 'SEMUA' || course.category === selectedCategory;

    return matchesSearch && matchesLevel && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === 'PRICE_LOW') return (a.discount_price || a.price) - (b.discount_price || b.price);
    if (sortBy === 'PRICE_HIGH') return (b.discount_price || b.price) - (a.discount_price || a.price);
    if (sortBy === 'RATING') return b.rating - a.rating;
    return b.total_students - a.total_students; // Default Popularity
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Header */}
      <div className="bg-slate-900 text-white p-8 rounded-3xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
            <BookOpen className="w-4 h-4" /> Catalog Kursus Lengkap
          </div>
          <h1 className="text-2xl sm:text-4xl font-black">Jelajahi Kurikulum Bahasa Arab</h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Pilih materi pembelajaran sesuai tingkatan kemampuan Anda. Dari tata bahasa dasar hingga kajian kitab klasik.
          </p>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari judul kursus atau materi..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50/50"
            />
          </div>

          {/* Level Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5" /> Level:
            </span>
            {['SEMUA', 'PEMULA', 'MENENGAH', 'LANJUTAN'].map((level) => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                  selectedLevel === level
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {level}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="py-2 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50 focus:outline-none"
            >
              <option value="POPULAR">Terpopuler</option>
              <option value="RATING">Rating Tertinggi</option>
              <option value="PRICE_LOW">Harga: Termurah</option>
              <option value="PRICE_HIGH">Harga: Termahal</option>
            </select>
          </div>

        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 border-t border-slate-100 pt-3 overflow-x-auto">
          <span className="text-xs font-semibold text-slate-500 shrink-0">Kategori:</span>
          {[
            { id: 'SEMUA', label: 'Semua Kategori' },
            { id: 'NAHWU', label: 'Nahwu' },
            { id: 'SHOROF', label: 'Shorof' },
            { id: 'BACA_KITAB', label: 'Baca Kitab' },
            { id: 'ALQURAN', label: 'Bahasa Arab Al-Qur\'an' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-amber-400 font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

      </div>

      {/* Course Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-base">Tidak ada kursus ditemukan</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Coba ubah kata kunci pencarian atau sesuaikan filter level & kategori.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedLevel('SEMUA');
              setSelectedCategory('SEMUA');
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
          >
            Reset Filter
          </button>
        </div>
      )}

    </div>
  );
};
