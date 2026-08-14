import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  User as UserIcon, Mail, Shield, Award, BookOpen, Clock, 
  CheckCircle, Save, Camera, Sparkles, Key, AlertCircle 
} from 'lucide-react';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250'
];

export const ProfilePage: React.FC = () => {
  const { currentUser, updateUserProfile, enrollments, courses, lessonProgress, showToast, navigateTo } = useApp();

  const [name, setName] = useState(currentUser?.name || '');
  const [bio, setBio] = useState(currentUser?.bio || 'Semangat menguasai bahasa Al-Qur\'an dan Nahwu Shorof.');
  const [targetGoal, setTargetGoal] = useState(currentUser?.target_goal || 'Lancar membaca kitab gundul & memahami isi Al-Qur\'an');
  const [selectedAvatar, setSelectedAvatar] = useState(currentUser?.avatar || AVATAR_PRESETS[0]);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md bg-slate-900 border border-slate-800 p-8 rounded-3xl">
          <AlertCircle className="w-12 h-12 text-amber-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">Akses Terbatas</h2>
          <p className="text-slate-400 text-sm">Silakan login terlebih dahulu untuk mengakses halaman profil Anda.</p>
          <button 
            onClick={() => navigateTo('home')}
            className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  // Calculate learning statistics
  const userEnrollments = enrollments.filter(e => e.user_id === currentUser.id);
  const completedLessonsCount = lessonProgress.filter(p => p.user_id === currentUser.id && p.completed).length;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const finalAvatar = customAvatarUrl.trim() ? customAvatarUrl.trim() : selectedAvatar;

    setTimeout(() => {
      updateUserProfile({
        name,
        bio,
        target_goal: targetGoal,
        avatar: finalAvatar
      });
      setIsSaving(false);
      showToast('Profil Anda berhasil diperbarui!', 'success');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
              <Sparkles className="w-3 h-3" /> Akun & Pengaturan
            </div>
            <h1 className="text-3xl font-extrabold text-white">Profil Pengguna</h1>
            <p className="text-slate-400 text-sm mt-1">Kelola data pribadi, foto profil, dan target pembelajaran Anda.</p>
          </div>

          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
              currentUser.role === 'ADMIN' 
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            }`}>
              <Shield className="w-3.5 h-3.5" />
              {currentUser.role === 'ADMIN' ? 'Administrator LMS' : 'Siswa Terdaftar'}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-white">{userEnrollments.length}</p>
              <p className="text-xs text-slate-400 font-medium">Kursus Diikuti</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center border border-teal-500/20">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-white">{completedLessonsCount}</p>
              <p className="text-xs text-slate-400 font-medium">Pelajaran Selesai</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-white">Active</p>
              <p className="text-xs text-slate-400 font-medium">Status Keanggotaan</p>
            </div>
          </div>
        </div>

        {/* Main Profile Form */}
        <form onSubmit={handleSaveProfile} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Avatar & Quick Info */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 flex flex-col items-center text-center">
            <div className="relative group">
              <img
                src={customAvatarUrl.trim() || selectedAvatar}
                alt={name}
                className="w-32 h-32 rounded-full object-cover ring-4 ring-emerald-500/30 shadow-2xl"
              />
              <div className="absolute bottom-0 right-0 p-2 rounded-full bg-emerald-500 text-slate-950 shadow-md">
                <Camera className="w-4 h-4" />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">{name || 'Nama Siswa'}</h2>
              <p className="text-xs text-slate-400 mt-0.5">{currentUser.email}</p>
            </div>

            {/* Avatar Selector Presets */}
            <div className="w-full space-y-3 pt-4 border-t border-slate-800">
              <p className="text-xs font-semibold text-slate-300 text-left">Pilih Foto Profil Preset:</p>
              <div className="flex items-center justify-center gap-2">
                {AVATAR_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedAvatar(preset);
                      setCustomAvatarUrl('');
                    }}
                    className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all ${
                      selectedAvatar === preset && !customAvatarUrl ? 'border-emerald-400 ring-2 ring-emerald-500/40 scale-110' : 'border-slate-800 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={preset} alt="preset" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <input
                  type="url"
                  placeholder="Atau masukkan URL Foto eksternal..."
                  value={customAvatarUrl}
                  onChange={(e) => setCustomAvatarUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

          </div>

          {/* Right Column: Editable Profile Fields */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-emerald-400" /> Informasi Pribadi
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Alamat Email (Pengenal Akun)</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    disabled
                    value={currentUser.email}
                    className="w-full bg-slate-950/60 border border-slate-800/80 text-slate-500 rounded-xl pl-10 pr-4 py-2.5 text-sm cursor-not-allowed"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Email digunakan sebagai ID unik akun Anda.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Bio Singkat</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Ceritakan singkat tentang diri Anda..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Target & Impian Belajar Bahasa Arab</label>
                <input
                  type="text"
                  value={targetGoal}
                  onChange={(e) => setTargetGoal(e.target.value)}
                  placeholder="Contoh: Ingin memahami makna shalat & Al-Qur'an secara langsung..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-emerald-950"
              >
                <Save className="w-4 h-4" /> {isSaving ? 'Menyimpan...' : 'Simpan Perubahan Profil'}
              </button>
            </div>

          </div>

        </form>

      </div>
    </div>
  );
};
