import React from 'react';
import { useApp } from '../context/AppContext';
import { BookOpen, Heart, Globe, Mail, Phone, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-900">
          
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigateTo('home')}>
              <div className="w-9 h-9 rounded-xl emerald-gradient flex items-center justify-center text-white shadow-md">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl text-white tracking-tight">
                Arabiyyah <span className="font-arabic text-amber-400 font-normal">العَرَبِيَّة</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Platform Learning Management System (LMS) Bahasa Arab terstruktur pertama berbasis video YouTube interaktif, kurikulum ilmiah, dan progress tracking real-time.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5" /> Direct Access Control LMS
              </span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">Navigasi Utama</h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => navigateTo('home')} className="hover:text-emerald-400 transition-colors">Beranda</button>
              </li>
              <li>
                <button onClick={() => navigateTo('courses')} className="hover:text-emerald-400 transition-colors">Katalog Kursus Lengkap</button>
              </li>
              <li>
                <button onClick={() => navigateTo('blog')} className="hover:text-emerald-400 transition-colors">Blog & Artikel Edukasi</button>
              </li>
              <li>
                <button onClick={() => navigateTo('dashboard')} className="hover:text-emerald-400 transition-colors">Dashboard Siswa</button>
              </li>
              <li>
                <button onClick={() => navigateTo('admin')} className="hover:text-amber-400 transition-colors">Panel Admin (LMS)</button>
              </li>
            </ul>
          </div>

          {/* Jalur Belajar */}
          <div>
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">Jalur Belajar (Level)</h3>
            <ul className="space-y-2.5 text-xs">
              <li className="hover:text-emerald-400 cursor-pointer">Level 1: Fondasi Bahasa & Huruf</li>
              <li className="hover:text-emerald-400 cursor-pointer">Level 2: Kaidah Nahwu Dasar</li>
              <li className="hover:text-emerald-400 cursor-pointer">Level 3: Morfologi Kata (Shorof)</li>
              <li className="hover:text-emerald-400 cursor-pointer">Level 4: Membaca Kitab Gundul</li>
              <li className="hover:text-emerald-400 cursor-pointer">Level 5: Bahasa Arab Al-Qur'an</li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">Hubungi Kami</h3>
            <ul className="space-y-3 text-xs">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>support@arabiyyah.id</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+62 812-3456-7890 (WhatsApp)</span>
              </li>
              <li className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Jakarta, Indonesia</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Arabiyyah Learning Platform. Hak Cipta Dilindungi.</p>
          <p className="flex items-center gap-1">
            Dibuat dengan <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> untuk Pembelajar Bahasa Arab
          </p>
        </div>
      </div>
    </footer>
  );
};
