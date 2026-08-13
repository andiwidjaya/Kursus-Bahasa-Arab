import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CertificateModal } from '../components/CertificateModal';
import { Course } from '../types';
import { 
  LayoutDashboard, PlayCircle, Award, CheckCircle2, BookOpen, Clock, 
  Flame, ArrowRight, Sparkles, Trophy 
} from 'lucide-react';

export const StudentDashboardPage: React.FC = () => {
  const { 
    currentUser, 
    courses, 
    enrollments, 
    lessons, 
    lessonProgress, 
    getCourseProgress, 
    navigateTo 
  } = useApp();

  const [certificateCourse, setCertificateCourse] = useState<Course | null>(null);

  // Filter Enrolled Courses
  const enrolledCourses = courses.filter(course => 
    enrollments.some(e => e.user_id === currentUser?.id && e.course_id === course.id && e.status === 'ACTIVE')
  );

  // Compute Overall Stats
  const userProgressList = lessonProgress.filter(p => p.user_id === currentUser?.id && p.completed);
  const completedLessonsCount = userProgressList.length;

  // Continue Learning Pick (Find course with active incomplete progress)
  const lastActiveCourse = enrolledCourses.length > 0 ? enrolledCourses[0] : courses[0];
  const lastActiveProgress = getCourseProgress(lastActiveCourse.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Welcome Header */}
      <div className="bg-slate-900 text-white p-8 rounded-3xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
            <LayoutDashboard className="w-4 h-4" /> Dashboard Siswa LMS
          </div>
          <h1 className="text-2xl sm:text-4xl font-black">Ahlan wa Sahlan, {currentUser?.name || 'Siswa'}!</h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Pantau statistik kemajuan belajar bahasa Arab Anda dan lanjutkan modul pembelajaran terstruktur.
          </p>
        </div>

        {/* Streak & Level Counter */}
        <div className="flex items-center gap-3 bg-slate-800/90 p-3.5 rounded-2xl border border-slate-700/80 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            <Flame className="w-6 h-6 fill-amber-400" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-semibold">Learning Streak</p>
            <p className="text-sm font-black text-white">5 Hari Berturut-turut 🔥</p>
          </div>
        </div>
      </div>

      {/* Continue Learning Hero Card (PRD §16) */}
      {enrolledCourses.length > 0 && (
        <div className="emerald-gradient text-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-emerald-900/15 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3 max-w-xl">
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white/10 text-emerald-200 border border-white/20 uppercase tracking-wide">
                ⚡ Lanjutkan Belajar Terakhir
              </span>
              <h2 className="text-xl sm:text-2xl font-black">{lastActiveCourse.title}</h2>
              <p className="text-xs text-emerald-100 line-clamp-2">{lastActiveCourse.description}</p>
              
              <div className="pt-2">
                <div className="flex justify-between items-center text-xs mb-1 font-bold">
                  <span>Progres Kursus</span>
                  <span>{lastActiveProgress}% Completed</span>
                </div>
                <div className="w-full bg-slate-900/40 rounded-full h-2.5 overflow-hidden p-0.5 border border-white/20">
                  <div 
                    className="bg-amber-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${lastActiveProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigateTo('learn', { courseId: lastActiveCourse.id, courseSlug: lastActiveCourse.slug })}
              className="px-6 py-3.5 rounded-2xl text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-300 transition-all shadow-md shrink-0 flex items-center gap-2"
            >
              <PlayCircle className="w-4 h-4 fill-slate-950" />
              Lanjutkan Pelajaran Sekarang
            </button>
          </div>
        </div>
      )}

      {/* Overall Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2">
            <BookOpen className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-slate-900">{enrolledCourses.length}</p>
          <p className="text-xs text-slate-500">Kursus Terdaftar</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center mb-2">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-slate-900">{completedLessonsCount}</p>
          <p className="text-xs text-slate-500">Pelajaran Selesai</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-2">
            <Clock className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-slate-900">4.5 Jam</p>
          <p className="text-xs text-slate-500">Total Jam Belajar</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center mb-2">
            <Award className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-slate-900">
            {enrolledCourses.filter(c => getCourseProgress(c.id) === 100).length}
          </p>
          <p className="text-xs text-slate-500">Sertifikat Kelulusan</p>
        </div>
      </div>

      {/* My Enrolled Courses Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-900">Kursus Saya (Enrolled Courses)</h2>
          <button 
            onClick={() => navigateTo('courses')}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            Tambah Kursus Lain →
          </button>
        </div>

        {enrolledCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {enrolledCourses.map((course) => {
              const progress = getCourseProgress(course.id);
              const isCompleted = progress === 100;

              return (
                <div key={course.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4 flex flex-col justify-between">
                  
                  <div className="space-y-3">
                    <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-100 relative">
                      <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
                      {isCompleted && (
                        <div className="absolute top-2 right-2 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 shadow flex items-center gap-1">
                          <Trophy className="w-3 h-3" /> Lulus 100%
                        </div>
                      )}
                    </div>

                    <h3 className="font-bold text-sm text-slate-900 line-clamp-2">{course.title}</h3>
                    <p className="text-xs text-slate-500">{course.level} • {course.category}</p>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-slate-600">Progress</span>
                        <span className="text-emerald-600 font-bold">{progress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex gap-2">
                    <button
                      onClick={() => navigateTo('learn', { courseId: course.id, courseSlug: course.slug })}
                      className="flex-1 py-2.5 px-3 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <PlayCircle className="w-4 h-4" />
                      Masuk LMS
                    </button>

                    {isCompleted && (
                      <button
                        onClick={() => setCertificateCourse(course)}
                        className="py-2.5 px-3 rounded-xl text-xs font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 border border-amber-200 transition-colors flex items-center gap-1"
                        title="Unduh Sertifikat"
                      >
                        <Award className="w-4 h-4 text-amber-600" />
                        Sertifikat
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 space-y-3">
            <p className="text-sm font-bold text-slate-700">Anda belum mendaftar di kursus manapun</p>
            <p className="text-xs text-slate-500">Jelajahi katalog kami dan mulai belajar sekarang.</p>
            <button
              onClick={() => navigateTo('courses')}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white emerald-gradient hover:opacity-95 transition-opacity"
            >
              Lihat Katalog Kursus
            </button>
          </div>
        )}
      </div>

      {/* Certificate Modal Trigger */}
      {certificateCourse && currentUser && (
        <CertificateModal
          course={certificateCourse}
          user={currentUser}
          onClose={() => setCertificateCourse(null)}
        />
      )}

    </div>
  );
};
