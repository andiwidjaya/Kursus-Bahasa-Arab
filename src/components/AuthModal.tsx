import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { INITIAL_USERS } from '../data/mockData';
import { X, Mail, Lock, User as UserIcon, Sparkles, Shield, ArrowRight, Loader2, KeyRound } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    login, 
    loginWithSupabase, 
    signUpWithSupabase, 
    resetPasswordWithSupabase, 
    showToast 
  } = useApp();

  const [tab, setTab] = useState<'login' | 'register' | 'forgot'>('login');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email) {
      setErrorMessage('Harap masukkan alamat email.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (tab === 'login') {
        if (!password) {
          setErrorMessage('Harap masukkan kata sandi.');
          setIsSubmitting(false);
          return;
        }
        const res = await loginWithSupabase(email, password);
        if (!res.success) {
          setErrorMessage(res.error || 'Gagal masuk. Periksa email dan password Anda.');
        }
      } else if (tab === 'register') {
        if (!password || password.length < 6) {
          setErrorMessage('Kata sandi minimal 6 karakter.');
          setIsSubmitting(false);
          return;
        }
        const res = await signUpWithSupabase(email, password, name);
        if (!res.success) {
          setErrorMessage(res.error || 'Gagal mendaftar akun baru.');
        }
      } else if (tab === 'forgot') {
        const res = await resetPasswordWithSupabase(email);
        if (!res.success) {
          setErrorMessage(res.error || 'Gagal mengirim instruksi pemulihan kata sandi.');
        } else {
          setTab('login');
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickLogin = (role: 'STUDENT' | 'ADMIN') => {
    const user = INITIAL_USERS.find(u => u.role === role);
    if (user) {
      login(user);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 z-10 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="emerald-gradient p-8 text-white relative">
          <div className="relative z-10">
            <span className="font-arabic text-amber-400 text-sm font-bold">العَرَبِيَّة</span>
            <h2 className="text-2xl font-black mt-1">
              {tab === 'login' && 'Selamat Datang Kembali!'}
              {tab === 'register' && 'Buat Akun Pembelajar'}
              {tab === 'forgot' && 'Pemulihan Kata Sandi'}
            </h2>
            <p className="text-xs text-emerald-100 mt-1">
              {tab === 'login' && 'Masuk dengan kredensial terenkripsi Supabase Auth'}
              {tab === 'register' && 'Bergabunglah bersama ribuan penuntut ilmu bahasa Arab'}
              {tab === 'forgot' && 'Masukkan email Anda untuk menerima link reset kata sandi'}
            </p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-100 bg-slate-50/50">
          <button
            onClick={() => { setTab('login'); setErrorMessage(null); }}
            className={`flex-1 py-3 text-xs font-bold transition-colors ${
              tab === 'login' ? 'text-emerald-600 border-b-2 border-emerald-500 bg-white' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Masuk Akun
          </button>
          <button
            onClick={() => { setTab('register'); setErrorMessage(null); }}
            className={`flex-1 py-3 text-xs font-bold transition-colors ${
              tab === 'register' ? 'text-emerald-600 border-b-2 border-emerald-500 bg-white' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Daftar Baru
          </button>
          <button
            onClick={() => { setTab('forgot'); setErrorMessage(null); }}
            className={`flex-1 py-3 text-xs font-bold transition-colors ${
              tab === 'forgot' ? 'text-emerald-600 border-b-2 border-emerald-500 bg-white' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Lupa Password
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-4">
          
          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              ⚠️ {errorMessage}
            </div>
          )}

          {/* Preset Quick Logins */}
          {tab !== 'forgot' && (
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-2">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">
                ⚡ Akun Demo Instan (Sekali Klik)
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('STUDENT')}
                  className="py-2 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-800 border border-emerald-500/20 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  Demo Siswa
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('ADMIN')}
                  className="py-2 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 border border-amber-500/20 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5 text-amber-600" />
                  Demo Admin
                </button>
              </div>
            </div>
          )}

          {tab !== 'forgot' && (
            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-200 w-full"></div>
              <span className="bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase">atau Supabase Auth</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {tab === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Nama Anda"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Alamat Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="contoh@email.com"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {tab !== 'forgot' && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-slate-700">Kata Sandi</label>
                  {tab === 'login' && (
                    <button
                      type="button"
                      onClick={() => setTab('forgot')}
                      className="text-[11px] font-bold text-emerald-600 hover:underline"
                    >
                      Lupa Kata Sandi?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl text-xs font-bold text-white emerald-gradient hover:opacity-95 transition-opacity shadow-md shadow-emerald-900/20 flex items-center justify-center gap-1.5 mt-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  {tab === 'login' && 'Masuk Sekarang'}
                  {tab === 'register' && 'Daftar Akun Baru'}
                  {tab === 'forgot' && 'Kirim Link Pemulihan'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};
