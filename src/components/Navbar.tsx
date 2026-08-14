import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BookOpen, Shield, LogOut, ChevronDown, Sparkles, LayoutDashboard, Compass } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    currentRoute, 
    navigateTo, 
    currentUser, 
    switchUserRole, 
    openAuthModal, 
    logout 
  } = useApp();
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigateTo('home')}>
            <div className="w-10 h-10 rounded-xl emerald-gradient flex items-center justify-center text-white shadow-md shadow-emerald-900/40">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
                  Arabiyyah
                </span>
                <span className="font-arabic text-amber-400 text-sm font-semibold">العَرَبِيَّة</span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-wider font-medium uppercase">Learning LMS Platform</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => navigateTo('home')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentRoute === 'home' 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Beranda
            </button>

            <button
              onClick={() => navigateTo('courses')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentRoute === 'courses' || currentRoute === 'course-detail'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Katalog Kursus
            </button>

            <button
              onClick={() => {
                navigateTo('home');
                setTimeout(() => {
                  document.getElementById('learning-path-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors flex items-center gap-1.5"
            >
              <Compass className="w-4 h-4 text-emerald-400" />
              Jalur Belajar
            </button>

            <button
              onClick={() => navigateTo('blog')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentRoute === 'blog' || currentRoute === 'blog-detail'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Blog & Edukasi
            </button>

            {currentUser && (
              <button
                onClick={() => navigateTo('dashboard')}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  currentRoute === 'dashboard' || currentRoute === 'learn'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                Dashboard Saya
              </button>
            )}

            {currentUser?.role === 'ADMIN' && (
              <button
                onClick={() => navigateTo('admin')}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  currentRoute === 'admin' 
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                    : 'text-amber-300 hover:text-amber-200 hover:bg-amber-500/10'
                }`}
              >
                <Shield className="w-4 h-4 text-amber-400" />
                Panel Admin
              </button>
            )}
          </nav>

          {/* User Controls & Role Switcher */}
          <div className="flex items-center gap-3">

            {/* Quick Demo Role Switcher Pill */}
            <div className="hidden sm:flex items-center bg-slate-800/90 p-1 rounded-full border border-slate-700/80 text-xs">
              <span className="px-2 text-slate-400 font-medium">Demo Mode:</span>
              <button
                onClick={() => switchUserRole('STUDENT')}
                className={`px-2.5 py-1 rounded-full font-medium transition-all ${
                  currentUser?.role === 'STUDENT'
                    ? 'bg-emerald-500 text-slate-950 font-semibold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Siswa
              </button>
              <button
                onClick={() => switchUserRole('ADMIN')}
                className={`px-2.5 py-1 rounded-full font-medium transition-all ${
                  currentUser?.role === 'ADMIN'
                    ? 'bg-amber-500 text-slate-950 font-semibold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Admin
              </button>
            </div>

            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-800 transition-colors border border-slate-700/60"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/40"
                  />
                  <span className="text-xs font-semibold text-slate-200 hidden lg:inline max-w-[100px] truncate">
                    {currentUser.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-slate-900 rounded-xl shadow-2xl border border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                    onMouseLeave={() => setIsDropdownOpen(false)}
                  >
                    <div className="px-4 py-2.5 border-b border-slate-800">
                      <p className="text-sm font-semibold text-white truncate">{currentUser.name}</p>
                      <p className="text-xs text-slate-400 truncate">{currentUser.email}</p>
                      <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {currentUser.role === 'ADMIN' ? 'Administrator' : 'Siswa Terdaftar'}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        navigateTo('dashboard');
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2"
                    >
                      <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                      Dashboard Kursus Saya
                    </button>

                    {currentUser.role === 'ADMIN' && (
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          navigateTo('admin');
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-amber-300 hover:bg-slate-800 hover:text-amber-200 flex items-center gap-2"
                      >
                        <Shield className="w-4 h-4 text-amber-400" />
                        Kelola LMS (Admin)
                      </button>
                    )}

                    <div className="border-t border-slate-800 my-1"></div>

                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Keluar (Logout)
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={openAuthModal}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  Masuk
                </button>
                <button
                  onClick={openAuthModal}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-all shadow-md shadow-emerald-900/30 flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Daftar Akun
                </button>
              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
