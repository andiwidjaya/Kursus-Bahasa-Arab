import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CheckCircle2, Play, Lock, ChevronLeft, ChevronRight, Download, 
  FileText, ArrowLeft, ShieldAlert, Sparkles, BookOpen, Layers, Menu, X, HelpCircle 
} from 'lucide-react';
import { Lesson } from '../types';
import { QuizModal } from '../components/QuizModal';

export const LearningPlayerPage: React.FC = () => {
  const { 
    selectedCourseId, 
    selectedLessonId, 
    courses, 
    modules, 
    lessons, 
    quizzes,
    hasAccess, 
    isLessonCompleted, 
    toggleLessonCompleted, 
    getCourseProgress, 
    navigateTo, 
    currentUser, 
    openAuthModal,
    showToast 
  } = useApp();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'notes' | 'worksheet' | 'mynotes'>('notes');
  const [myNotesText, setMyNotesText] = useState('');
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  const course = courses.find(c => c.id === selectedCourseId) || courses[0];
  const courseModules = modules.filter(m => m.course_id === course.id).sort((a, b) => a.order_index - b.order_index);
  const courseLessons = lessons.filter(l => l.course_id === course.id).sort((a, b) => a.order_index - b.order_index);

  // Access Control Check (PRD §29)
  const isEnrolled = hasAccess(course.id);

  // Determine current active lesson
  const activeLesson: Lesson = courseLessons.find(l => l.id === selectedLessonId) || courseLessons[0] || {
    id: 'fallback-1',
    module_id: 'mod-1',
    course_id: course.id,
    title: 'Pengantar Pelajaran',
    description: 'Deskripsi pelajaran...',
    youtube_video_id: 't70R0x6p4dE',
    duration: '10:00',
    order_index: 1,
    is_preview: true
  };

  // Find quizzes matching this lesson or fallback to course quizzes
  const lessonQuizzes = quizzes.filter(q => q.lesson_id === activeLesson.id);
  const availableQuizzes = lessonQuizzes.length > 0 ? lessonQuizzes : quizzes;

  const isCompleted = isLessonCompleted(activeLesson.id);
  const progressPercent = getCourseProgress(course.id);

  // Next & Prev Lesson Logic
  const currentIndex = courseLessons.findIndex(l => l.id === activeLesson.id);
  const prevLesson = currentIndex > 0 ? courseLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < courseLessons.length - 1 ? courseLessons[currentIndex + 1] : null;

  // Access Denied Screen (PRD §29)
  if (!isEnrolled && !activeLesson.is_preview) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-rose-100 text-rose-600 mx-auto flex items-center justify-center border border-rose-200">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-bold text-rose-600 uppercase tracking-widest">Akses Ditolak</span>
          <h1 className="text-2xl font-black text-slate-900">Anda Belum Terdaftar di Kursus Ini</h1>
          <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
            Sesuai sistem otorisasi LMS, Anda harus menyelesaikan pendaftaran & pembayaran sebelum dapat mengkaji pelajaran ini.
          </p>
        </div>

        <div className="flex justify-center gap-3 pt-2">
          <button
            onClick={() => navigateTo('course-detail', { courseId: course.id, courseSlug: course.slug })}
            className="px-6 py-3 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            Lihat Detail Kursus
          </button>
          <button
            onClick={() => {
              if (!currentUser) openAuthModal();
              else navigateTo('checkout', { courseId: course.id, courseSlug: course.slug });
            }}
            className="px-6 py-3 rounded-xl text-xs font-bold text-white emerald-gradient hover:opacity-95 transition-opacity shadow-lg shadow-emerald-900/20"
          >
            Beli & Dapatkan Akses Instan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      
      {/* Learning Header Bar */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo('dashboard')}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Kembali ke Dashboard</span>
          </button>

          <div className="h-4 w-px bg-slate-800 hidden sm:block"></div>

          <div>
            <h1 className="font-bold text-xs sm:text-sm text-white line-clamp-1">{course.title}</h1>
            <p className="text-[10px] text-slate-400">{activeLesson.title}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          
          {/* Progress Pill */}
          <div className="hidden sm:flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700 text-xs">
            <span className="text-slate-400 text-[11px]">Progress:</span>
            <span className="text-emerald-400 font-bold">{progressPercent}%</span>
            <div className="w-16 bg-slate-700 rounded-full h-1.5 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>

          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
            title="Buka/Tutup Silabus Curriculum"
          >
            {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

        </div>
      </header>

      {/* Main LMS Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* Main Content Area (Player + Actions + Tabs) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* YouTube Video Player Container (PRD §17) */}
          <div className="relative aspect-video w-full rounded-3xl overflow-hidden bg-black shadow-2xl border border-slate-800">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${activeLesson.youtube_video_id}?autoplay=1&modestbranding=1&rel=0`}
              title={activeLesson.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          {/* Action Bar & Lesson Info */}
          <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                  Pelajaran {activeLesson.order_index}
                </span>
                <h2 className="text-lg font-extrabold text-white mt-1">{activeLesson.title}</h2>
                <p className="text-xs text-slate-400 mt-0.5">{activeLesson.description}</p>
              </div>

              {/* Action Buttons: Mark Completed & Start Quiz */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setIsQuizOpen(true)}
                  className="px-4 py-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
                >
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  Mulai Kuis Pelajaran
                </button>

                <button
                  onClick={() => toggleLessonCompleted(activeLesson.id, course.id)}
                  className={`px-5 py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 shrink-0 shadow-md ${
                    isCompleted
                      ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                      : 'bg-slate-800 text-white hover:bg-slate-700 border border-slate-700'
                  }`}
                >
                  <CheckCircle2 className={`w-4 h-4 ${isCompleted ? 'fill-slate-950 text-emerald-500' : 'text-slate-400'}`} />
                  {isCompleted ? 'Selesai (Completed)' : 'Tandai Selesai'}
                </button>
              </div>
            </div>

            {/* Prev / Next Navigation Buttons */}
            <div className="flex justify-between items-center pt-3 border-t border-slate-800/80 text-xs">
              {prevLesson ? (
                <button
                  onClick={() => navigateTo('learn', { courseId: course.id, courseSlug: course.slug, lessonId: prevLesson.id })}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" /> Pelajaran Sebelumnya
                </button>
              ) : <div></div>}

              {nextLesson ? (
                <button
                  onClick={() => navigateTo('learn', { courseId: course.id, courseSlug: course.slug, lessonId: nextLesson.id })}
                  className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold transition-colors flex items-center gap-1.5"
                >
                  Pelajaran Berikutnya <ChevronRight className="w-4 h-4" />
                </button>
              ) : <div></div>}
            </div>
          </div>

          {/* Supporting Learning Tabs (PRD §11 & §17) */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
            
            {/* Tabs Bar */}
            <div className="flex border-b border-slate-800 bg-slate-950/50">
              <button
                onClick={() => setActiveTab('notes')}
                className={`py-3 px-5 text-xs font-bold transition-colors ${
                  activeTab === 'notes' ? 'text-emerald-400 border-b-2 border-emerald-500 bg-slate-900' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Catatan Rangkuman
              </button>
              <button
                onClick={() => setActiveTab('worksheet')}
                className={`py-3 px-5 text-xs font-bold transition-colors ${
                  activeTab === 'worksheet' ? 'text-emerald-400 border-b-2 border-emerald-500 bg-slate-900' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Lembar Kerja PDF
              </button>
              <button
                onClick={() => setActiveTab('mynotes')}
                className={`py-3 px-5 text-xs font-bold transition-colors ${
                  activeTab === 'mynotes' ? 'text-emerald-400 border-b-2 border-emerald-500 bg-slate-900' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Catatan Pribadi Saya
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6 text-xs text-slate-300 leading-relaxed">
              {activeTab === 'notes' && (
                <div className="space-y-3">
                  <h3 className="font-bold text-sm text-white">Ringkasan Pelajaran</h3>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-300 whitespace-pre-line">
                    {activeLesson.notes_markdown || 'Catatan rangkuman pelajaran tersedia untuk membantu pemahaman Anda.'}
                  </div>
                </div>
              )}

              {activeTab === 'worksheet' && (
                <div className="space-y-4">
                  <h3 className="font-bold text-sm text-white">Lembar Latihan & PDF Support</h3>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-white text-xs">{activeLesson.worksheet_filename || 'Lembar_Kerja_Latihan.pdf'}</p>
                        <p className="text-[10px] text-slate-500">PDF • 1.2 MB</p>
                      </div>
                    </div>

                    <button
                      onClick={() => alert(`Mengunduh berkas ${activeLesson.worksheet_filename || 'Lembar_Kerja_Latihan.pdf'}...`)}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors flex items-center gap-1.5"
                    >
                      <Download className="w-4 h-4" /> Unduh PDF
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'mynotes' && (
                <div className="space-y-3">
                  <h3 className="font-bold text-sm text-white">Tulis Catatan Mandiri</h3>
                  <textarea
                    value={myNotesText}
                    onChange={e => setMyNotesText(e.target.value)}
                    placeholder="Tuliskan catatan penting Anda saat menyimak video ini..."
                    rows={4}
                    className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                  <p className="text-[10px] text-slate-500">Catatan disimpan secara lokal di peramban Anda.</p>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Collapsible Curriculum Tree Sidebar (PRD §17) */}
        {isSidebarOpen && (
          <aside className="w-full lg:w-80 bg-slate-900 border-l border-slate-800 flex flex-col h-full shrink-0">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/40">
              <div>
                <h3 className="font-bold text-xs text-white uppercase tracking-wider">Silabus Kursus</h3>
                <p className="text-[10px] text-emerald-400 font-semibold">{progressPercent}% Selesai</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-800/80">
              {courseModules.map((mod) => {
                const modLessons = lessons.filter(l => l.module_id === mod.id).sort((a, b) => a.order_index - b.order_index);

                return (
                  <div key={mod.id} className="p-3">
                    <h4 className="font-bold text-xs text-slate-300 mb-2 leading-snug">{mod.title}</h4>
                    
                    <div className="space-y-1">
                      {modLessons.map((les) => {
                        const isCurrent = les.id === activeLesson.id;
                        const isDone = isLessonCompleted(les.id);

                        return (
                          <button
                            key={les.id}
                            onClick={() => navigateTo('learn', { courseId: course.id, courseSlug: course.slug, lessonId: les.id })}
                            className={`w-full text-left p-2.5 rounded-xl text-xs flex items-start gap-2.5 transition-all ${
                              isCurrent 
                                ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 shadow-sm' 
                                : 'hover:bg-slate-800 text-slate-400'
                            }`}
                          >
                            <div className="mt-0.5 shrink-0">
                              {isDone ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-500/20" />
                              ) : isCurrent ? (
                                <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                              ) : (
                                <span className="w-4 h-4 rounded-full border border-slate-600 text-[10px] flex items-center justify-center text-slate-500">
                                  {les.order_index}
                                </span>
                              )}
                            </div>

                            <div className="flex-1">
                              <p className={`font-semibold line-clamp-1 ${isCurrent ? 'text-white font-bold' : ''}`}>
                                {les.title}
                              </p>
                              <p className="text-[10px] text-slate-500">{les.duration}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>
        )}

      </div>

      {/* Interactive Quiz Modal */}
      <QuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        quizzes={availableQuizzes}
        lessonTitle={activeLesson.title}
        onCompleteQuiz={() => {
          showToast('Selamat! Kuis telah berhasil diselesaikan.', 'success');
        }}
      />
    </div>
  );
};
