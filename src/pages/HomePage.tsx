import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CourseCard } from '../components/CourseCard';
import { LEARNING_PATH_LEVELS } from '../data/mockData';
import { 
  Sparkles, ArrowRight, Play, BookOpen, Layers, GitMerge, FileText, Award, 
  CheckCircle2, XCircle, ChevronDown, ChevronUp, Star, ShieldCheck, Video
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { courses, navigateTo, openAuthModal } = useApp();

  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Apakah kursus ini cocok untuk pemula yang belum tahu bahasa Arab sama sekali?',
      a: 'Sangat cocok! Jalur Belajar Level 1 dirancang khusus dari nol, mengajarkan huruf Hijaiyah, tanda baca, dan pembagian kata Ism, Fi\'il, dan Harf dengan pendekatan visual yang intuitif.'
    },
    {
      q: 'Apakah videonya dapat ditonton melalui YouTube?',
      a: 'Ya, seluruh materi video berkualitas tinggi di-host melalui YouTube Unlisted dan diintegrasikan langsung ke dalam Learning Player LMS Arabiyyah dengan progress tracking otomatis.'
    },
    {
      q: 'Berapa lama saya mendapatkan akses setelah melakukan pembayaran?',
      a: 'Anda mendapatkan Akses Seumur Hidup (Lifetime Access) untuk kursus yang telah dibeli, termasuk pembaruan materi dan lembar kerja PDF pendukung.'
    },
    {
      q: 'Apakah saya mendapatkan sertifikat kelulusan?',
      a: 'Ya, setelah menyelesaikan 100% pelajaran pada suatu kursus, sistem secara otomatis akan menerbitkan Sertifikat Kelulusan Terverifikasi yang dapat Anda unduh dalam format PDF.'
    },
    {
      q: 'Metode pembayaran apa saja yang didukung?',
      a: 'Kami mendukung Transfer Bank / Virtual Account (BCA, Mandiri, BNI, BRI), E-Wallet (GoPay, OVO, Dana), QRIS (bebas biaya admin), dan Kartu Kredit.'
    }
  ];

  const getLevelIcon = (iconName: string) => {
    switch (iconName) {
      case 'BookOpen': return <BookOpen className="w-5 h-5" />;
      case 'Layers': return <Layers className="w-5 h-5" />;
      case 'GitMerge': return <GitMerge className="w-5 h-5" />;
      case 'FileText': return <FileText className="w-5 h-5" />;
      default: return <Award className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-20 pb-20">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 text-white pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wide backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse-subtle" />
              <span>Platform LMS Bahasa Arab Terstruktur Berbasis YouTube</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
              Belajar Bahasa Arab <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
                Terstruktur & Terukur
              </span>
            </h1>

            {/* Arabic Calligraphy Accent */}
            <p className="font-arabic text-amber-400/90 text-2xl font-bold tracking-wide">
              تَعَلَّمِ العَرَبِيَّةَ بِسُهُولَةٍ وَمَنَهَجِيَّةٍ
            </p>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Ubah video YouTube yang tersebar menjadi kurikulum pembelajaran yang runtut. Dari pemula tanpa dasar hingga mahir membaca kitab klasik dan memahami makna Al-Qur'an.
            </p>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={() => navigateTo('courses')}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-extrabold text-sm text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 group"
              >
                Mulai Belajar Sekarang
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => {
                  document.getElementById('learning-path-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-sm text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 text-amber-400 fill-amber-400" />
                Lihat Jalur Belajar
              </button>
            </div>

            {/* Trust Metrics */}
            <div className="pt-10 grid grid-cols-3 gap-4 border-t border-slate-800/80 max-w-xl mx-auto">
              <div>
                <p className="text-2xl sm:text-3xl font-black text-white">2,500+</p>
                <p className="text-xs text-slate-400">Siswa Aktif</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-emerald-400">100%</p>
                <p className="text-xs text-slate-400">Kurikulum Terurut</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-amber-400">4.9 / 5.0</p>
                <p className="text-xs text-slate-400">Rating Kepuasan</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Problem vs Solution Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2">Problem & Solusi</h2>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Mengapa Belajar di Arabiyyah Jauh Lebih Efektif?
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Problem Card */}
          <div className="bg-rose-50/60 rounded-3xl p-8 border border-rose-100 space-y-4">
            <div className="inline-flex p-3 rounded-2xl bg-rose-100 text-rose-600">
              <XCircle className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-rose-950">Sebelumnya (Cari Video Sendiri di YouTube)</h4>
            <ul className="space-y-3 text-xs text-slate-700">
              <li className="flex items-start gap-2.5">
                <span className="text-rose-500 font-bold">•</span>
                <span>Video tercecer tanpa alur jelas, bingung harus mulai dari mana.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-500 font-bold">•</span>
                <span>Tidak ada pencatatan mana pelajaran yang sudah ditonton & mana yang belum.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-500 font-bold">•</span>
                <span>Terganggu oleh rekomendasi video YouTube yang tidak relevan.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-500 font-bold">•</span>
                <span>Tanpa lembar kerja PDF, rangkuman rumus I'rab, dan ujian evaluasi.</span>
              </li>
            </ul>
          </div>

          {/* Solution Card */}
          <div className="emerald-gradient rounded-3xl p-8 text-white space-y-4 shadow-xl shadow-emerald-900/10">
            <div className="inline-flex p-3 rounded-2xl bg-white/10 text-emerald-300">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white">Dengan Arabiyyah LMS</h4>
            <ul className="space-y-3 text-xs text-emerald-100">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                <span>Kurikulum 5-Level terstruktur dari dasar Nahwu, Shorof hingga Baca Kitab.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                <span>Pencatatan progress otomatis (`40% Selesai`), bisa dilanjutkan kapan saja.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                <span>Fokus penuh dalam Learning Player khusus tanpa terdistraksi iklan.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                <span>Lengkap dengan Lembar Kerja PDF, Catatan Ringkas & Sertifikat Kelulusan.</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* Jalur Belajar 5 Level Section */}
      <section id="learning-path-section" className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20 mb-3">
              <Layers className="w-4 h-4" /> Systemic Curriculum
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Jalur Belajar Terstruktur (Learning Path)
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Sistem berjenjang 5 level untuk memastikan Anda menguasai fondasi kaidah sebelum lanjut ke analisis kitab dan Al-Qur'an.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {LEARNING_PATH_LEVELS.map((lvl) => (
              <div 
                key={lvl.level}
                className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/60 hover:border-emerald-500/50 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center border border-emerald-500/30">
                      L{lvl.level}
                    </span>
                    <div className="text-slate-400 group-hover:text-emerald-400 transition-colors">
                      {getLevelIcon(lvl.icon)}
                    </div>
                  </div>

                  <h3 className="font-bold text-sm text-white mb-1 leading-snug">{lvl.title}</h3>
                  <p className="text-[11px] font-semibold text-amber-400 mb-2">{lvl.subtitle}</p>
                  <p className="text-xs text-slate-400 leading-relaxed">{lvl.description}</p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-700/50">
                  <button
                    onClick={() => navigateTo('courses')}
                    className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                  >
                    Lihat Kursus Level ini →
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Featured Courses Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">Pilihan Kursus Terbaik</h2>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Mulai Pembelajaran Anda Hari Ini
            </h3>
          </div>
          <button
            onClick={() => navigateTo('courses')}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            Lihat Semua ({courses.length}) Kursus →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.slice(0, 3).map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-slate-50 py-16 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">Testimoni Siswa</h2>
            <h3 className="text-2xl font-black text-slate-900">Apa Kata Pembelajar di Arabiyyah?</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
              </div>
              <p className="text-xs text-slate-700 leading-relaxed italic">
                "Sebelumnya belajar Nahwu terasa rumit karena banyak istilah menghafal. Di Arabiyyah, alurnya begitu teratur dari Ism hingga I'rab. Sekarang saya mulai bisa baca kitab tanpa harakat!"
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                  RA
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Rizky Alamsyah</p>
                  <p className="text-[10px] text-slate-500">Siswa Nahwu & Shorof</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
              </div>
              <p className="text-xs text-slate-700 leading-relaxed italic">
                "Sangat terbantu dengan fitur 'Tandai Selesai' dan tracking percentage. Ketika sibuk kerja, saya bisa langsung tahu dari mana harus melanjut pembelajaran."
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center">
                  ST
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Siti Nurjanah</p>
                  <p className="text-[10px] text-slate-500">Siswa Bahasa Arab Al-Qur'an</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
              </div>
              <p className="text-xs text-slate-700 leading-relaxed italic">
                "Instrukturnya sangat jelas dalam menyampaikan konsep Wazan Shorof. Lembar kerja PDF-nya sangat bagus untuk latihan mandiri."
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                <div className="w-9 h-9 rounded-full bg-sky-100 text-sky-800 font-bold text-xs flex items-center justify-center">
                  HD
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Hendra Darmawan</p>
                  <p className="text-[10px] text-slate-500">Siswa Fathul Qorib</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center">
          <h2 className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">Pertanyaan Umum</h2>
          <h3 className="text-2xl font-black text-slate-900">Pertanyaan Yang Sering Diajukan (FAQ)</h3>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = expandedFaq === idx;
            return (
              <div key={idx} className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
                <button
                  onClick={() => setExpandedFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex justify-between items-center gap-4 hover:bg-slate-50 transition-colors"
                >
                  <span className="font-bold text-xs sm:text-sm text-slate-900">{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-emerald-600 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                </button>
                {isOpen && (
                  <div className="p-5 pt-0 text-xs text-slate-600 border-t border-slate-100 leading-relaxed bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="emerald-gradient rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-2xl shadow-emerald-900/20">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="font-arabic text-amber-400 text-2xl font-bold">بِسْمِ اللَّهِ</span>
            <h2 className="text-2xl sm:text-4xl font-black">Mulai Langkah Pertama Anda Menguasai Bahasa Arab</h2>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              Bergabunglah hari ini dan rasakan kemudahan belajar bahasa Arab secara teratur, terukur, dan menyenangkan.
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <button
                onClick={() => navigateTo('courses')}
                className="px-8 py-3.5 rounded-xl font-bold text-xs text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors shadow-md"
              >
                Jelajahi Kursus Sekarang
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
