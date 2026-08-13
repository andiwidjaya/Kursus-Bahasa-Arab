import React from 'react';
import { Course } from '../types';
import { useApp } from '../context/AppContext';
import { Star, Users, PlayCircle, CheckCircle2, ArrowRight } from 'lucide-react';

interface CourseCardProps {
  course: Course;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const { navigateTo, hasAccess, getCourseProgress } = useApp();

  const isEnrolled = hasAccess(course.id);
  const progressPercent = isEnrolled ? getCourseProgress(course.id) : 0;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  const getLevelBadgeClass = (level: string) => {
    switch (level) {
      case 'PEMULA': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'MENENGAH': return 'bg-sky-500/10 text-sky-600 border-sky-500/20';
      case 'LANJUTAN': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      default: return 'bg-slate-500/10 text-slate-600 border-slate-500/20';
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden transform hover:-translate-y-1">
      
      {/* Thumbnail & Badges */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        <img
          src={course.thumbnail_url}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-60"></div>
        
        {/* Badges top right & left */}
        <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
          <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold border backdrop-blur-md shadow-sm ${getLevelBadgeClass(course.level)}`}>
            {course.level}
          </span>
          <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-900/80 text-amber-400 border border-slate-700/80 backdrop-blur-md">
            {course.category}
          </span>
        </div>

        {isEnrolled && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500 text-white shadow-md flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Terdaftar
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating & Students */}
          <div className="flex items-center gap-4 text-xs text-slate-500 mb-2.5">
            <div className="flex items-center gap-1 font-semibold text-slate-800">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>{course.rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>{course.total_students.toLocaleString('id-ID')} Siswa</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-bold text-base text-slate-900 line-clamp-2 group-hover:text-emerald-700 transition-colors mb-2 leading-snug">
            {course.title}
          </h3>

          {/* Description */}
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
            {course.description}
          </p>
        </div>

        <div>
          {/* Enrolled Progress Bar OR Pricing */}
          {isEnrolled ? (
            <div className="mb-4 pt-3 border-t border-slate-100">
              <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
                <span className="text-slate-600">Progress Belajar</span>
                <span className="text-emerald-600 font-bold">{progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <div className="flex items-baseline gap-2 mb-4 pt-3 border-t border-slate-100">
              {course.discount_price ? (
                <>
                  <span className="text-lg font-extrabold text-slate-900">
                    {formatRupiah(course.discount_price)}
                  </span>
                  <span className="text-xs text-slate-400 line-through">
                    {formatRupiah(course.price)}
                  </span>
                  <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-600 border border-rose-500/20">
                    Hemat {Math.round(((course.price - course.discount_price) / course.price) * 100)}%
                  </span>
                </>
              ) : (
                <span className="text-lg font-extrabold text-slate-900">
                  {formatRupiah(course.price)}
                </span>
              )}
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => navigateTo('course-detail', { courseId: course.id, courseSlug: course.slug })}
              className="flex-1 py-2.5 px-3 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5"
            >
              Lihat Detail
            </button>

            {isEnrolled ? (
              <button
                onClick={() => navigateTo('learn', { courseId: course.id, courseSlug: course.slug })}
                className="py-2.5 px-4 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5"
              >
                <PlayCircle className="w-4 h-4" />
                Lanjutkan
              </button>
            ) : (
              <button
                onClick={() => navigateTo('checkout', { courseId: course.id, courseSlug: course.slug })}
                className="py-2.5 px-4 rounded-xl text-xs font-bold text-white emerald-gradient hover:opacity-95 transition-opacity shadow-md shadow-emerald-900/20 flex items-center justify-center gap-1"
              >
                Beli Kursus
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
