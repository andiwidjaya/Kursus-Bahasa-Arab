import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  BookOpen, Volume2, Search, RotateCw, Filter, Sparkles, 
  CheckCircle2, ArrowRight, ArrowLeft, Layers, Grid 
} from 'lucide-react';
import { VocabItem } from '../types';

export const VocabPage: React.FC = () => {
  const { vocabItems, courses, navigateTo } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'flashcard' | 'grid'>('flashcard');

  // Flashcard mode active index
  const [cardIndex, setCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [learnedCardIds, setLearnedCardIds] = useState<Set<string>>(new Set());

  // Filtered Vocab List
  const filteredVocab = vocabItems.filter(item => {
    const matchesSearch = 
      item.arabic.includes(searchTerm) ||
      item.transliteration.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.indo_meaning.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'ALL' || item.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesCourse = selectedCourseFilter === 'ALL' || item.course_id === selectedCourseFilter;

    return matchesSearch && matchesCategory && matchesCourse;
  });

  const activeCard: VocabItem | undefined = filteredVocab[cardIndex];

  // Speech synthesis audio trigger
  const playAudio = (text: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop current speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.85; // Slightly slower for clarity
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Browser Anda tidak mendukung fitur pemutaran suara otomatis.');
    }
  };

  const handleNextCard = () => {
    setIsFlipped(false);
    setCardIndex(prev => (prev + 1) % Math.max(1, filteredVocab.length));
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setCardIndex(prev => (prev - 1 + filteredVocab.length) % Math.max(1, filteredVocab.length));
  };

  const toggleLearned = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setLearnedCardIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 selection:bg-emerald-500 selection:text-white">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/60 border border-slate-800 p-8 md:p-10 shadow-2xl">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Sparkles className="w-3.5 h-3.5" /> Bank Kosakata Interaktif (المُفْرَدَات)
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Kamus Kosakata & Flashcards Arabic
              </h1>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                Tingkatkan perbendaharaan kata bahasa Arab Anda melalui metode kartu memori (*Flashcards*) interaktif, audio pelafalan asli, dan kalimat contoh.
              </p>
            </div>

            {/* Quick Stats Pill */}
            <div className="flex items-center gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 backdrop-blur-md">
              <div className="text-center px-2">
                <p className="text-2xl font-black text-emerald-400">{vocabItems.length}</p>
                <p className="text-[11px] text-slate-400 uppercase font-medium tracking-wider">Total Kata</p>
              </div>
              <div className="h-8 w-px bg-slate-800" />
              <div className="text-center px-2">
                <p className="text-2xl font-black text-amber-400">{learnedCardIds.size}</p>
                <p className="text-[11px] text-slate-400 uppercase font-medium tracking-wider">Dikuasai</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter & View Mode Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari kata Arab, latin, atau arti Indonesia..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCardIndex(0);
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { label: 'Semua Kategori', value: 'ALL' },
              { label: 'Ism (Kata Benda)', value: 'Ism' },
              { label: 'Fi\'il (Kata Kerja)', value: 'Fi\'il' },
              { label: 'Harf (Kata Tugas)', value: 'Harf' }
            ].map(cat => (
              <button
                key={cat.value}
                onClick={() => {
                  setSelectedCategory(cat.value);
                  setCardIndex(0);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === cat.value
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}

            {/* View Mode Switcher */}
            <div className="ml-auto sm:ml-2 flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setViewMode('flashcard')}
                className={`p-2 rounded-lg text-xs font-medium transition-all ${
                  viewMode === 'flashcard' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Mode Flashcard"
              >
                <Layers className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg text-xs font-medium transition-all ${
                  viewMode === 'grid' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Mode Tabel / Grid"
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        {filteredVocab.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/50 rounded-3xl border border-slate-800/80">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-slate-300">Tidak ada kosakata yang ditemukan</h3>
            <p className="text-sm text-slate-500 mt-1">Coba sesuaikan kata kunci pencarian atau filter kategori Anda.</p>
          </div>
        ) : viewMode === 'flashcard' ? (
          /* FLASHCARD INTERACTIVE MODE */
          <div className="space-y-6 max-w-2xl mx-auto">
            {activeCard && (
              <div 
                onClick={() => setIsFlipped(!isFlipped)}
                className="perspective cursor-pointer select-none group"
              >
                <div className={`relative w-full min-h-[340px] rounded-3xl bg-slate-900 border border-slate-800 p-8 flex flex-col justify-between shadow-2xl transition-all duration-500 transform hover:scale-[1.01] hover:border-emerald-500/50 ${
                  isFlipped ? 'bg-gradient-to-b from-slate-900 to-slate-900/90' : ''
                }`}>

                  {/* Card Header Info */}
                  <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/80 pb-4">
                    <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                      {activeCard.category}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-slate-500">
                        {cardIndex + 1} dari {filteredVocab.length}
                      </span>
                      <button
                        onClick={(e) => toggleLearned(activeCard.id, e)}
                        className={`p-1.5 rounded-full transition-colors ${
                          learnedCardIds.has(activeCard.id) 
                            ? 'bg-amber-500/20 text-amber-400' 
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                        title={learnedCardIds.has(activeCard.id) ? 'Telah Dikuasai' : 'Tandai Dikuasai'}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Card Main Body */}
                  <div className="my-8 text-center space-y-4">
                    {!isFlipped ? (
                      /* FRONT SIDE: Arabic & Transliteration */
                      <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                        <h2 className="font-arabic text-5xl sm:text-6xl font-bold text-amber-300 leading-snug tracking-wide">
                          {activeCard.arabic}
                        </h2>
                        <p className="text-lg font-medium text-emerald-400 font-sans tracking-wide">
                          {activeCard.transliteration}
                        </p>
                        
                        <div className="pt-2">
                          <button
                            onClick={(e) => playAudio(activeCard.arabic, e)}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-300 text-xs font-semibold transition-all shadow-md"
                          >
                            <Volume2 className="w-4 h-4" /> Dengarkan Pelafalan
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* BACK SIDE: Indonesian Meaning & Example */
                      <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                        <div className="inline-block px-3 py-1 rounded-full bg-slate-800 text-[11px] text-slate-400 font-semibold uppercase">
                          Arti Bahasa Indonesia
                        </div>
                        <h3 className="text-2xl font-bold text-white">
                          {activeCard.indo_meaning}
                        </h3>

                        {activeCard.example_sentence && (
                          <div className="mt-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-left space-y-2">
                            <p className="text-[11px] font-semibold uppercase text-emerald-400 tracking-wider">Contoh Kalimat:</p>
                            <p className="font-arabic text-lg text-amber-200 text-right leading-relaxed">{activeCard.example_sentence.split('(')[0]}</p>
                            {activeCard.example_sentence.includes('(') && (
                              <p className="text-xs text-slate-400 italic">({activeCard.example_sentence.split('(')[1]}</p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Card Footer Hint */}
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-800/80">
                    <span className="flex items-center gap-1.5">
                      <RotateCw className="w-3.5 h-3.5 text-emerald-400" /> Klik kartu untuk membalik
                    </span>
                    <span className="text-slate-400 font-semibold">
                      {isFlipped ? 'Sisi Belakang' : 'Sisi Depan'}
                    </span>
                  </div>

                </div>
              </div>
            )}

            {/* Flashcard Navigation Controls */}
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={handlePrevCard}
                className="flex-1 py-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:bg-slate-800"
              >
                <ArrowLeft className="w-4 h-4" /> Kartu Sebelumnya
              </button>

              <button
                onClick={handleNextCard}
                className="flex-1 py-3 rounded-2xl bg-emerald-500 text-slate-950 text-sm font-bold flex items-center justify-center gap-2 transition-all hover:bg-emerald-400 shadow-lg shadow-emerald-950"
              >
                Kartu Selanjutnya <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* GRID TABLE VIEW MODE */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVocab.map((item) => (
              <div 
                key={item.id} 
                className="bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-5 space-y-3 transition-all hover:shadow-xl group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {item.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => playAudio(item.arabic)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-300 transition-colors"
                      title="Pelafalan Suara"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => toggleLearned(item.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        learnedCardIds.has(item.id) ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1 pt-1">
                  <h3 className="font-arabic text-3xl font-bold text-amber-300">
                    {item.arabic}
                  </h3>
                  <p className="text-xs font-medium text-emerald-400 font-mono">
                    {item.transliteration}
                  </p>
                  <p className="text-sm font-semibold text-slate-200">
                    {item.indo_meaning}
                  </p>
                </div>

                {item.example_sentence && (
                  <div className="pt-2 border-t border-slate-800/80 text-xs space-y-1">
                    <p className="font-arabic text-amber-200/90 text-right">{item.example_sentence.split('(')[0]}</p>
                    {item.example_sentence.includes('(') && (
                      <p className="text-[11px] text-slate-400">({item.example_sentence.split('(')[1]}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
