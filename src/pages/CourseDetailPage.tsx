import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Star, Users, Clock, BookOpen, CheckCircle2, Lock, Play, ShieldCheck, 
  ArrowRight, FileText, ChevronDown, ChevronUp, X 
} from 'lucide-react';
import { Lesson } from '../types';

export const CourseDetailPage: React.FC = () => {
  const { 
    selectedCourseId, 
    courses, 
    modules, 
    lessons, 
    navigateTo, 
    hasAccess, 
    openAuthModal, 
    currentUser 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'syllabus' | 'instructor' | 'outcomes'>('syllabus');
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  const [previewLesson, setPreviewLesson] = useState<Lesson | null>(null);

  const course = courses.find(c => c.id === selectedCourseId) || courses[0];
  const courseModules = modules.filter(m => m.course_id === course.id).sort((a, b) => a.order_index - b.order_index);
  const isEnrolled = hasAccess(course.id);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  const toggleModule = (modId: string) => {
    setExpandedModules(prev => ({ ...prev, [modId]: !prev[modId] }));
  };

  const handleEnrollClick = () => {
    if (!currentUser) {
      openAuthModal();
      return;
    }
    navigateTo('checkout', { courseId: course.id, courseSlug: course.slug });
  };

  return (
    <div className="pb-20 space-y-10">
      
      {/* Course Hero Banner */}
      <section className="bg-slate-900 text-white pt-10 pb-16 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            
            {/* Left Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {course.level}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {course.category}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black leading-snug">{course.title}</h1>
              
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {course.long_description || course.description}
              </p>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400 pt-2 border-t border-slate-800">
                <div className="flex items-center gap-1.5 font-semibold text-white">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>{course.rating} Rating</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span>{course.total_students.toLocaleString('id-ID')} Siswa Terdaftar</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-slate-400" />
                  <span>{lessons.filter(l => l.course_id === course.id).length} Pelajaran</span>
                </div>
              </div>

              {/* Instructor Mini Badge */}
              <div className="flex items-center gap-3 pt-2">
                <img
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/30"
                />
                <div>
                  <p className="text-xs text-slate-400">Pengajar Kursus</p>
                  <p className="text-xs font-bold text-white">{course.instructor.name}</p>
                </div>
              </div>
            </div>

            {/* Right Sticky Card */}
            <div className="lg:col-span-1">
              <div className="bg-white text-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-6 sticky top-24">
                
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100">
                  <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
                    <button
                      onClick={() => {
                        const preview = lessons.find(l => l.course_id === course.id && l.is_preview);
                        if (preview) setPreviewLesson(preview);
                        else alert('Pelajaran pratinjau belum diset.');
                      }}
                      className="w-12 h-12 rounded-full emerald-gradient text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                    >
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex items-baseline gap-2">
                    {course.discount_price ? (
                      <>
                        <span className="text-2xl font-black text-slate-900">
                          {formatRupiah(course.discount_price)}
                        </span>
                        <span className="text-xs text-slate-400 line-through">
                          {formatRupiah(course.price)}
                        </span>
                      </>
                    ) : (
                      <span className="text-2xl font-black text-slate-900">
                        {formatRupiah(course.price)}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-emerald-600 font-semibold mt-1">Akses Seumur Hidup • Sekali Bayar</p>
                </div>

                {isEnrolled ? (
                  <button
                    onClick={() => navigateTo('learn', { courseId: course.id, courseSlug: course.slug })}
                    className="w-full py-3.5 rounded-xl font-bold text-xs text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-slate-950" />
                    Lanjutkan Belajar Sekarang
                  </button>
                ) : (
                  <button
                    onClick={handleEnrollClick}
                    className="w-full py-3.5 rounded-xl font-bold text-xs text-white emerald-gradient hover:opacity-95 transition-opacity shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2"
                  >
                    Beli Kursus Ini Sekarang
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                <div className="space-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-4">
                  <p className="font-semibold text-slate-900">Fasilitas Kursus Termasuk:</p>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Akses Seluruh Video Pembelajaran HD</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Lembar Kerja PDF & Rangkuman Kaidah</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Tracking Progress Otomatis LMS</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Sertifikat Kelulusan Terverifikasi</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Main Detail Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          <div className="lg:col-span-2 space-y-8">
            
            {/* Tabs Selector */}
            <div className="flex border-b border-slate-200">
              <button
                onClick={() => setActiveTab('syllabus')}
                className={`py-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-colors ${
                  activeTab === 'syllabus' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Kurikulum & Silabus Pelajaran
              </button>
              <button
                onClick={() => setActiveTab('outcomes')}
                className={`py-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-colors ${
                  activeTab === 'outcomes' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Capaian Pembelajaran
              </button>
              <button
                onClick={() => setActiveTab('instructor')}
                className={`py-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-colors ${
                  activeTab === 'instructor' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Profil Pengajar
              </button>
            </div>

            {/* Syllabus Tab */}
            {activeTab === 'syllabus' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs text-slate-500 font-semibold">
                  <span>{courseModules.length} Modul Pembelajaran</span>
                  <span>{lessons.filter(l => l.course_id === course.id).length} Total Pelajaran</span>
                </div>

                {courseModules.map((mod) => {
                  const moduleLessons = lessons.filter(l => l.module_id === mod.id).sort((a, b) => a.order_index - b.order_index);
                  const isExpanded = expandedModules[mod.id] !== false; // default expanded

                  return (
                    <div key={mod.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                      <button
                        onClick={() => toggleModule(mod.id)}
                        className="w-full p-4 bg-slate-50/80 flex justify-between items-center text-left hover:bg-slate-100/80 transition-colors"
                      >
                        <div>
                          <h3 className="font-bold text-xs sm:text-sm text-slate-900">{mod.title}</h3>
                          <p className="text-[11px] text-slate-500 mt-0.5">{mod.description}</p>
                        </div>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                      </button>

                      {isExpanded && (
                        <div className="divide-y divide-slate-100 bg-white">
                          {moduleLessons.map((les) => (
                            <div key={les.id} className="p-3.5 sm:px-5 flex justify-between items-center text-xs hover:bg-slate-50/60">
                              <div className="flex items-center gap-3">
                                {les.is_preview ? (
                                  <button
                                    onClick={() => setPreviewLesson(les)}
                                    className="p-1.5 rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors"
                                  >
                                    <Play className="w-3.5 h-3.5 fill-emerald-700" />
                                  </button>
                                ) : (
                                  <Lock className="w-4 h-4 text-slate-300" />
                                )}
                                <div>
                                  <span className="font-semibold text-slate-800">{les.title}</span>
                                  <span className="text-[10px] text-slate-400 ml-2">({les.duration})</span>
                                </div>
                              </div>

                              <div>
                                {les.is_preview ? (
                                  <button
                                    onClick={() => setPreviewLesson(les)}
                                    className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200 hover:bg-emerald-100 transition-colors"
                                  >
                                    Pratinjau Gratis
                                  </button>
                                ) : (
                                  <span className="text-[10px] text-slate-400 font-medium">Terkunci 🔒</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Outcomes Tab */}
            {activeTab === 'outcomes' && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 text-xs text-slate-700 leading-relaxed">
                <h3 className="font-bold text-sm text-slate-900">Apa Yang Akan Anda Pelajari?</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Memahami perbedaan mendasar Ism, Fi'il, dan Harf secara komprehensif.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Menganalisis susunan kalimat Mubtada' dan Khabar dalam bahasa Arab.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Menentukan status I'rab (Marfu', Manshub, Majrur) pada tiap kata.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Bekal utama membaca kitab klasik tanpa harakat secara mandiri.</span>
                  </div>
                </div>
              </div>
            )}

            {/* Instructor Tab */}
            {activeTab === 'instructor' && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 flex items-start gap-4">
                <img
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500/30"
                />
                <div className="space-y-1 text-xs">
                  <h3 className="font-bold text-sm text-slate-900">{course.instructor.name}</h3>
                  <p className="text-emerald-600 font-semibold">{course.instructor.bio}</p>
                  <p className="text-slate-600 leading-relaxed pt-2">
                    Berdedikasi untuk menyajikan pembelajaran bahasa Arab yang mudah dicerna oleh masyarakat umum tanpa mengurangi kaidah keilmuan bahasa Arab klasik.
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Free Preview Video Modal */}
      {previewLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-3xl bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 text-white">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
                  Pratinjau Gratis
                </span>
                <h3 className="font-bold text-sm mt-1">{previewLesson.title}</h3>
              </div>
              <button
                onClick={() => setPreviewLesson(null)}
                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${previewLesson.youtube_video_id}?autoplay=1`}
                title={previewLesson.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            <div className="p-4 text-xs text-slate-300 flex justify-between items-center bg-slate-950">
              <p>{previewLesson.description}</p>
              <button
                onClick={() => {
                  setPreviewLesson(null);
                  handleEnrollClick();
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shrink-0"
              >
                Daftar Kursus Penuh
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
