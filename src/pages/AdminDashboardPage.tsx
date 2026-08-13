import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Course, Module, Lesson, CourseLevel, CourseCategory, PaymentStatus } from '../types';
import { 
  Shield, Users, BookOpen, DollarSign, Plus, Edit3, Trash2, CheckCircle2, 
  Clock, XCircle, Search, Filter, Video, Layers, X, Play, Eye, RotateCcw, 
  Sparkles, TrendingUp, Award, CreditCard, ChevronRight, FileText, ArrowRight 
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { 
    courses, 
    modules, 
    lessons, 
    orders, 
    users, 
    enrollments, 
    lessonProgress, 
    createCourse, 
    updateCourse, 
    deleteCourse, 
    createModule, 
    updateModule, 
    deleteModule, 
    createLesson, 
    updateLesson, 
    deleteLesson, 
    updateOrderPaymentStatus, 
    updateUserRole, 
    showToast 
  } = useApp();

  // Navigation Tab State
  const [activeTab, setActiveTab] = useState<'metrics' | 'courses' | 'modules' | 'lessons' | 'orders' | 'users'>('metrics');

  // Filter States
  const [courseSearch, setCourseSearch] = useState('');
  const [courseStatusFilter, setCourseStatusFilter] = useState<string>('ALL');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('ALL');
  const [userSearch, setUserSearch] = useState('');

  // Course Management Modals
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    long_description: '',
    thumbnail_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800',
    level: 'PEMULA' as CourseLevel,
    category: 'NAHWU' as CourseCategory,
    price: 199000,
    discount_price: 149000,
    status: 'DRAFT' as Course['status']
  });

  // Module Management State
  const [selectedCourseForModules, setSelectedCourseForModules] = useState<string>(courses[0]?.id || '');
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [moduleForm, setModuleForm] = useState({
    title: '',
    description: '',
    order_index: 1
  });

  // Lesson Management State
  const [selectedCourseForLessons, setSelectedCourseForLessons] = useState<string>(courses[0]?.id || '');
  const [selectedModuleForLessons, setSelectedModuleForLessons] = useState<string>(modules[0]?.id || '');
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [lessonForm, setLessonForm] = useState({
    title: '',
    description: '',
    youtube_video_id: '',
    duration: '12:30',
    order_index: 1,
    is_preview: false,
    notes_markdown: '### Catatan Pelajaran\n- Kaidah Nahwu & I\'rab.',
    worksheet_filename: 'Lembar_Kerja_Latihan.pdf'
  });

  // Admin YouTube Video Preview Modal
  const [adminPreviewVideoId, setAdminPreviewVideoId] = useState<string | null>(null);

  // User Detail View Modal
  const [selectedUserDetail, setSelectedUserDetail] = useState<typeof users[0] | null>(null);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  // Metrics Computation
  const paidOrders = orders.filter(o => o.payment_status === 'PAID');
  const totalRevenue = paidOrders.reduce((acc, curr) => acc + curr.amount, 0) + 145800000;
  const activeStudentsCount = users.filter(u => u.role === 'STUDENT').length + 873;
  const publishedCoursesCount = courses.filter(c => c.status === 'PUBLISHED').length;

  // Handlers: Course Form Submit
  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseForm.title) return;

    const slug = courseForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (editingCourse) {
      updateCourse(editingCourse.id, {
        ...courseForm,
        slug
      });
    } else {
      createCourse({
        ...courseForm,
        slug,
        instructor: {
          name: 'Ustadz Abdullah, Lc., M.A.',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
          bio: 'Pengajar Senior Bahasa Arab'
        },
        rating: 5.0,
        total_students: 0
      });
    }

    setIsCourseModalOpen(false);
    setEditingCourse(null);
  };

  const openEditCourse = (c: Course) => {
    setEditingCourse(c);
    setCourseForm({
      title: c.title,
      description: c.description,
      long_description: c.long_description || '',
      thumbnail_url: c.thumbnail_url,
      level: c.level,
      category: c.category,
      price: c.price,
      discount_price: c.discount_price || 0,
      status: c.status
    });
    setIsCourseModalOpen(true);
  };

  // Handlers: Module Form Submit
  const handleSaveModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!moduleForm.title) return;

    if (editingModule) {
      updateModule(editingModule.id, moduleForm);
    } else {
      createModule({
        course_id: selectedCourseForModules,
        ...moduleForm
      });
    }

    setIsModuleModalOpen(false);
    setEditingModule(null);
    setModuleForm({ title: '', description: '', order_index: 1 });
  };

  // Handlers: Lesson Form Submit
  const handleSaveLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonForm.title || !lessonForm.youtube_video_id) {
      showToast('Harap lengkapi judul & YouTube Video ID.', 'warning');
      return;
    }

    if (editingLesson) {
      updateLesson(editingLesson.id, lessonForm);
    } else {
      createLesson({
        course_id: selectedCourseForLessons,
        module_id: selectedModuleForLessons || modules.find(m => m.course_id === selectedCourseForLessons)?.id || 'mod-1',
        ...lessonForm
      });
    }

    setIsLessonModalOpen(false);
    setEditingLesson(null);
    setLessonForm({
      title: '',
      description: '',
      youtube_video_id: '',
      duration: '12:30',
      order_index: 1,
      is_preview: false,
      notes_markdown: '### Catatan Pelajaran\n- Kaidah Nahwu & I\'rab.',
      worksheet_filename: 'Lembar_Kerja_Latihan.pdf'
    });
  };

  // Filtered lists
  const filteredCourses = courses.filter(c => {
    const matchQuery = c.title.toLowerCase().includes(courseSearch.toLowerCase());
    const matchStatus = courseStatusFilter === 'ALL' || c.status === courseStatusFilter;
    return matchQuery && matchStatus;
  });

  const filteredOrders = orders.filter(o => {
    return orderStatusFilter === 'ALL' || o.payment_status === orderStatusFilter;
  });

  const filteredUsers = users.filter(u => {
    return u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase());
  });

  const currentCourseModules = modules.filter(m => m.course_id === selectedCourseForModules);
  const currentCourseLessons = lessons.filter(l => l.course_id === selectedCourseForLessons);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-8 rounded-3xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-2xl">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20">
            <Shield className="w-4 h-4" /> Admin Master LMS Control Suite (PRD §21 - §26)
          </div>
          <h1 className="text-2xl sm:text-4xl font-black">Panel Kontrol Administrator</h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Kelola katalog kursus, modul, pelajaran YouTube, transaksi pembayaran, dan hak akses siswa secara terpusat.
          </p>
        </div>

        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => {
              setEditingCourse(null);
              setCourseForm({
                title: '',
                description: '',
                long_description: '',
                thumbnail_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800',
                level: 'PEMULA',
                category: 'NAHWU',
                price: 199000,
                discount_price: 149000,
                status: 'DRAFT'
              });
              setIsCourseModalOpen(true);
            }}
            className="px-5 py-3 rounded-2xl text-xs font-extrabold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors shadow-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Buat Kursus Baru
          </button>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-2xl p-2 shadow-sm overflow-x-auto">
        {[
          { id: 'metrics', label: '📊 Metrics & Analitik', icon: TrendingUp },
          { id: 'courses', label: `📚 Kursus (${courses.length})`, icon: BookOpen },
          { id: 'modules', label: `📦 Modul (${modules.length})`, icon: Layers },
          { id: 'lessons', label: `🎬 Pelajaran YouTube (${lessons.length})`, icon: Video },
          { id: 'orders', label: `💳 Transaksi (${orders.length})`, icon: CreditCard },
          { id: 'users', label: `👥 Pengguna (${users.length})`, icon: Users }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              activeTab === tab.id
                ? 'bg-slate-900 text-amber-400 shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: METRICS & ANALYTICS (PRD §21 & §33) */}
      {activeTab === 'metrics' && (
        <div className="space-y-6">
          
          {/* KPI Counter Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <p className="text-3xl font-black text-slate-900">1,250</p>
              <p className="text-xs font-semibold text-slate-500">Total Pengguna Terdaftar</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <p className="text-3xl font-black text-slate-900">{activeStudentsCount}</p>
              <p className="text-xs font-semibold text-slate-500">Siswa Aktif Pembayar</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <p className="text-3xl font-black text-slate-900">{publishedCoursesCount} / {courses.length}</p>
              <p className="text-xs font-semibold text-slate-500">Kursus Dipublikasikan</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
              <p className="text-xl sm:text-2xl font-black text-slate-900">{formatRupiah(totalRevenue)}</p>
              <p className="text-xs font-semibold text-slate-500">Total Pendapatan (Rp)</p>
            </div>
          </div>

          {/* Product KPIs Breakdown (PRD §33 & §43) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                Tingkat Konversi (PRD §33)
              </h3>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-slate-600 font-semibold mb-1">
                    <span>Pengunjung $\rightarrow$ Pendaftaran</span>
                    <span className="text-emerald-600 font-bold">42.5%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '42.5%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-600 font-semibold mb-1">
                    <span>Pendaftaran $\rightarrow$ Pembelian</span>
                    <span className="text-emerald-600 font-bold">70.0%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-600 font-semibold mb-1">
                    <span>Tingkat Penyelesaian Kursus</span>
                    <span className="text-amber-600 font-bold">84.2%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-amber-500 h-2 rounded-full" style={{ width: '84.2%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 md:col-span-2">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-600" />
                Distribusi Pembelian per Metode Pembayaran (PRD §14)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-xs text-slate-500">QRIS (Scan)</p>
                  <p className="text-lg font-black text-slate-900 mt-1">45%</p>
                  <p className="text-[10px] text-emerald-600 font-bold">Paling Populer</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-xs text-slate-500">BCA VA</p>
                  <p className="text-lg font-black text-slate-900 mt-1">30%</p>
                  <p className="text-[10px] text-slate-400">Virtual Account</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-xs text-slate-500">Mandiri VA</p>
                  <p className="text-lg font-black text-slate-900 mt-1">15%</p>
                  <p className="text-[10px] text-slate-400">Virtual Account</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-xs text-slate-500">GoPay / Card</p>
                  <p className="text-lg font-black text-slate-900 mt-1">10%</p>
                  <p className="text-[10px] text-slate-400">E-Wallet</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: COURSE MANAGEMENT (PRD §22 & §40) */}
      {activeTab === 'courses' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
          
          {/* Search & Status Filter */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={courseSearch}
                onChange={e => setCourseSearch(e.target.value)}
                placeholder="Cari nama kursus..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 text-xs w-full sm:w-auto">
              <span className="font-bold text-slate-500">Status:</span>
              {['ALL', 'PUBLISHED', 'DRAFT', 'ARCHIVED'].map(st => (
                <button
                  key={st}
                  onClick={() => setCourseStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    courseStatusFilter === st ? 'bg-slate-900 text-amber-400' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Courses Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Judul Kursus & Slug</th>
                  <th className="p-3.5">Level & Kategori</th>
                  <th className="p-3.5">Harga</th>
                  <th className="p-3.5">Siswa</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Tindakan Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCourses.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50/60">
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <img src={c.thumbnail_url} alt={c.title} className="w-12 h-12 rounded-xl object-cover" />
                        <div>
                          <p className="font-bold text-slate-900 line-clamp-1">{c.title}</p>
                          <p className="text-[10px] text-slate-400 font-mono">/courses/{c.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5 font-semibold text-slate-700">
                      <span className="px-2 py-0.5 rounded bg-slate-100 border text-[10px] font-bold mr-1">{c.level}</span>
                      <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">{c.category}</span>
                    </td>
                    <td className="p-3.5">
                      <p className="font-extrabold text-slate-900">{formatRupiah(c.discount_price || c.price)}</p>
                      {c.discount_price && <p className="text-[10px] text-slate-400 line-through">{formatRupiah(c.price)}</p>}
                    </td>
                    <td className="p-3.5 font-semibold text-slate-700">
                      {c.total_students.toLocaleString('id-ID')} Siswa
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                        c.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-1.5">
                      <button
                        onClick={() => openEditCourse(c)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                        title="Edit Kursus"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          const nextStatus = c.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
                          updateCourse(c.id, { status: nextStatus });
                        }}
                        className={`px-3 py-1.5 rounded-lg font-bold text-[10px] ${
                          c.status === 'PUBLISHED' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-500 text-white'
                        }`}
                      >
                        {c.status === 'PUBLISHED' ? 'Kembalikan ke Draft' : 'Publikasikan'}
                      </button>

                      <button
                        onClick={() => deleteCourse(c.id)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50"
                        title="Hapus Kursus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* TAB 3: MODULE MANAGEMENT (PRD §23) */}
      {activeTab === 'modules' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Pilih Kursus Terlebih Dahulu:</label>
              <select
                value={selectedCourseForModules}
                onChange={e => setSelectedCourseForModules(e.target.value)}
                className="p-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-white focus:outline-none min-w-[280px]"
              >
                {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </div>

            <button
              onClick={() => {
                setEditingModule(null);
                setModuleForm({ title: '', description: '', order_index: currentCourseModules.length + 1 });
                setIsModuleModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-white emerald-gradient hover:opacity-95 shadow flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Tambah Modul Baru
            </button>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-xs uppercase text-slate-500 tracking-wider">
              Daftar Modul Kursus ({currentCourseModules.length})
            </h3>

            {currentCourseModules.map((mod) => (
              <div key={mod.id} className="p-4 rounded-2xl border border-slate-200 bg-white flex justify-between items-center text-xs">
                <div>
                  <span className="font-extrabold text-slate-900 text-sm">Modul {mod.order_index}: {mod.title}</span>
                  <p className="text-slate-500 text-xs mt-0.5">{mod.description}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingModule(mod);
                      setModuleForm({ title: mod.title, description: mod.description, order_index: mod.order_index });
                      setIsModuleModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => deleteModule(mod.id)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB 4: LESSON MANAGEMENT (PRD §24) */}
      {activeTab === 'lessons' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Pilih Kursus:</label>
                <select
                  value={selectedCourseForLessons}
                  onChange={e => {
                    setSelectedCourseForLessons(e.target.value);
                    const firstMod = modules.find(m => m.course_id === e.target.value);
                    if (firstMod) setSelectedModuleForLessons(firstMod.id);
                  }}
                  className="p-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-white focus:outline-none min-w-[240px]"
                >
                  {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Pilih Modul:</label>
                <select
                  value={selectedModuleForLessons}
                  onChange={e => setSelectedModuleForLessons(e.target.value)}
                  className="p-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-white focus:outline-none min-w-[200px]"
                >
                  {currentCourseModules.map(m => <option key={m.id} value={m.id}>Modul {m.order_index}: {m.title}</option>)}
                </select>
              </div>
            </div>

            <button
              onClick={() => {
                setEditingLesson(null);
                setLessonForm({
                  title: '',
                  description: '',
                  youtube_video_id: '',
                  duration: '12:30',
                  order_index: currentCourseLessons.length + 1,
                  is_preview: false,
                  notes_markdown: '### Catatan Pelajaran\n- Kaidah Nahwu & I\'rab.',
                  worksheet_filename: 'Lembar_Kerja_Latihan.pdf'
                });
                setIsLessonModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-white emerald-gradient hover:opacity-95 shadow flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Tambah Pelajaran YouTube
            </button>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-xs uppercase text-slate-500 tracking-wider">
              Daftar Pelajaran YouTube Kursus Ini ({currentCourseLessons.length})
            </h3>

            {currentCourseLessons.map((les) => (
              <div key={les.id} className="p-4 rounded-2xl border border-slate-200 bg-white flex justify-between items-center text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900">{les.order_index}. {les.title}</span>
                    {les.is_preview && <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">Pratinjau Gratis</span>}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    YouTube Video ID: <code className="text-emerald-700 font-bold">{les.youtube_video_id}</code> • Durasi: {les.duration}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setAdminPreviewVideoId(les.youtube_video_id)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-[11px] border border-emerald-200 hover:bg-emerald-100 flex items-center gap-1"
                  >
                    <Play className="w-3.5 h-3.5 fill-emerald-700" /> Tes Video
                  </button>

                  <button
                    onClick={() => {
                      setEditingLesson(les);
                      setLessonForm({
                        title: les.title,
                        description: les.description,
                        youtube_video_id: les.youtube_video_id,
                        duration: les.duration,
                        order_index: les.order_index,
                        is_preview: les.is_preview,
                        notes_markdown: les.notes_markdown || '',
                        worksheet_filename: les.worksheet_filename || ''
                      });
                      setIsLessonModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => deleteLesson(les.id)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB 5: TRANSACTION & ORDERS MANAGEMENT (PRD §26) */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <h3 className="font-bold text-sm text-slate-900">Manajemen Transaksi & Pembayaran Webhook</h3>
            
            <div className="flex items-center gap-1.5 text-xs overflow-x-auto w-full sm:w-auto">
              <span className="font-bold text-slate-500">Filter Status:</span>
              {['ALL', 'PAID', 'PENDING', 'FAILED', 'EXPIRED', 'REFUNDED'].map(st => (
                <button
                  key={st}
                  onClick={() => setOrderStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
                    orderStatusFilter === st ? 'bg-slate-900 text-amber-400' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Invoice #</th>
                  <th className="p-3.5">Pembeli</th>
                  <th className="p-3.5">Kursus Dipesan</th>
                  <th className="p-3.5">Nominal (Rp)</th>
                  <th className="p-3.5">Metode Bayar</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Verifikasi & Akses</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map(o => (
                  <tr key={o.id} className="hover:bg-slate-50/60">
                    <td className="p-3.5 font-mono font-bold text-slate-800">{o.order_number}</td>
                    <td className="p-3.5">
                      <p className="font-bold text-slate-900">{o.user_name}</p>
                      <p className="text-[10px] text-slate-400">{o.user_email}</p>
                    </td>
                    <td className="p-3.5 font-semibold text-slate-700 max-w-xs truncate">{o.course_title}</td>
                    <td className="p-3.5 font-extrabold text-slate-900">{formatRupiah(o.amount)}</td>
                    <td className="p-3.5 font-bold text-slate-600">{o.payment_method}</td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                        o.payment_status === 'PAID' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : o.payment_status === 'PENDING'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {o.payment_status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-1">
                      {o.payment_status === 'PENDING' && (
                        <button
                          onClick={() => updateOrderPaymentStatus(o.id, 'PAID')}
                          className="px-3 py-1 rounded-lg bg-emerald-500 text-white font-bold text-[10px] hover:bg-emerald-600 shadow"
                        >
                          Verifikasi Lunas
                        </button>
                      )}

                      {o.payment_status === 'PAID' && (
                        <button
                          onClick={() => updateOrderPaymentStatus(o.id, 'REFUNDED')}
                          className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-600 font-bold text-[10px] hover:bg-rose-100 border border-rose-200"
                        >
                          Refund
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* TAB 6: USER MANAGEMENT (PRD §25) */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
          
          <div className="flex justify-between items-center gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
                placeholder="Cari nama atau email siswa..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Pengguna</th>
                  <th className="p-3.5">Email</th>
                  <th className="p-3.5">Peran (Role)</th>
                  <th className="p-3.5">Tanggal Daftar</th>
                  <th className="p-3.5 text-right">Kelola Hak Akses</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/60">
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500/30" />
                        <span className="font-bold text-slate-900">{u.name}</span>
                      </div>
                    </td>
                    <td className="p-3.5 font-medium text-slate-600">{u.email}</td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                        u.role === 'ADMIN' ? 'bg-amber-500/10 text-amber-700 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-500">
                      {new Date(u.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => setSelectedUserDetail(u)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold text-slate-700"
                      >
                        Detail Pembelian & Progress
                      </button>

                      <button
                        onClick={() => updateUserRole(u.id, u.role === 'ADMIN' ? 'STUDENT' : 'ADMIN')}
                        className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 font-bold text-slate-950 shadow"
                      >
                        Ubah ke {u.role === 'ADMIN' ? 'Siswa' : 'Admin'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* MODAL: CREATE / EDIT COURSE (PRD §22 & §40) */}
      {isCourseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl p-6 border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-base">
                {editingCourse ? 'Edit Data Kursus' : 'Buat Kursus Baru (PRD §22)'}
              </h3>
              <button onClick={() => setIsCourseModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Judul Kursus</label>
                <input
                  type="text"
                  value={courseForm.title}
                  onChange={e => setCourseForm({ ...courseForm, title: e.target.value })}
                  placeholder="Misal: Durusul Lughah Volume 1"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Deskripsi Singkat</label>
                <textarea
                  value={courseForm.description}
                  onChange={e => setCourseForm({ ...courseForm, description: e.target.value })}
                  rows={2}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">URL Gambar Thumbnail</label>
                <input
                  type="text"
                  value={courseForm.thumbnail_url}
                  onChange={e => setCourseForm({ ...courseForm, thumbnail_url: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Level Tingkatan</label>
                  <select
                    value={courseForm.level}
                    onChange={e => setCourseForm({ ...courseForm, level: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white"
                  >
                    <option value="PEMULA">PEMULA</option>
                    <option value="MENENGAH">MENENGAH</option>
                    <option value="LANJUTAN">LANJUTAN</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={courseForm.category}
                    onChange={e => setCourseForm({ ...courseForm, category: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white"
                  >
                    <option value="NAHWU">NAHWU</option>
                    <option value="SHOROF">SHOROF</option>
                    <option value="BACA_KITAB">BACA_KITAB</option>
                    <option value="ALQURAN">ALQURAN</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Harga Normal (Rp)</label>
                  <input
                    type="number"
                    value={courseForm.price}
                    onChange={e => setCourseForm({ ...courseForm, price: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Harga Coret / Diskon (Rp)</label>
                  <input
                    type="number"
                    value={courseForm.discount_price}
                    onChange={e => setCourseForm({ ...courseForm, discount_price: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Status Publikasi</label>
                <select
                  value={courseForm.status}
                  onChange={e => setCourseForm({ ...courseForm, status: e.target.value as any })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white"
                >
                  <option value="DRAFT">DRAFT</option>
                  <option value="PUBLISHED">PUBLISHED</option>
                  <option value="ARCHIVED">ARCHIVED</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors shadow"
              >
                {editingCourse ? 'Simpan Perubahan' : 'Buat Kursus'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE / EDIT MODULE (PRD §23) */}
      {isModuleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 border border-slate-100 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-base">
                {editingModule ? 'Edit Modul' : 'Tambah Modul Baru (PRD §23)'}
              </h3>
              <button onClick={() => setIsModuleModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModule} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Judul Modul</label>
                <input
                  type="text"
                  value={moduleForm.title}
                  onChange={e => setModuleForm({ ...moduleForm, title: e.target.value })}
                  placeholder="Misal: Modul 1: Pondasi Dasar"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Deskripsi Modul</label>
                <textarea
                  value={moduleForm.description}
                  onChange={e => setModuleForm({ ...moduleForm, description: e.target.value })}
                  rows={2}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Urutan Modul (Order Index)</label>
                <input
                  type="number"
                  value={moduleForm.order_index}
                  onChange={e => setModuleForm({ ...moduleForm, order_index: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl text-xs font-bold text-white emerald-gradient hover:opacity-95 transition-opacity shadow"
              >
                Simpan Modul
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE / EDIT LESSON (PRD §24) */}
      {isLessonModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-base">
                {editingLesson ? 'Edit Pelajaran' : 'Tambah Pelajaran Video YouTube (PRD §24)'}
              </h3>
              <button onClick={() => setIsLessonModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLesson} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Judul Pelajaran</label>
                <input
                  type="text"
                  value={lessonForm.title}
                  onChange={e => setLessonForm({ ...lessonForm, title: e.target.value })}
                  placeholder="Misal: Pembagian Ism & Fi'il"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">YouTube Video ID (Unlisted)</label>
                <input
                  type="text"
                  value={lessonForm.youtube_video_id}
                  onChange={e => setLessonForm({ ...lessonForm, youtube_video_id: e.target.value })}
                  placeholder="Misal: t70R0x6p4dE"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Durasi Video (e.g. 12:35)</label>
                  <input
                    type="text"
                    value={lessonForm.duration}
                    onChange={e => setLessonForm({ ...lessonForm, duration: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Urutan Pelajaran</label>
                  <input
                    type="number"
                    value={lessonForm.order_index}
                    onChange={e => setLessonForm({ ...lessonForm, order_index: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                    required
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={lessonForm.is_preview}
                  onChange={e => setLessonForm({ ...lessonForm, is_preview: e.target.checked })}
                  className="accent-emerald-600"
                />
                Jadikan Pratinjau Gratis (Bisa ditonton publik tanpa bayar)
              </label>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl text-xs font-bold text-white emerald-gradient hover:opacity-95 transition-opacity shadow"
              >
                Simpan Pelajaran YouTube
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADMIN YOUTUBE VIDEO TEST PLAYER */}
      {adminPreviewVideoId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-3xl bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 text-white">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center">
              <h3 className="font-bold text-xs text-amber-400">Pengujian Video Player YouTube (Admin Mode)</h3>
              <button onClick={() => setAdminPreviewVideoId(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video w-full">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${adminPreviewVideoId}?autoplay=1`}
                title="Admin YouTube Test"
                className="w-full h-full border-0"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: USER DETAILS (PRD §25) */}
      {selectedUserDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 border border-slate-100 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <img src={selectedUserDetail.avatar} alt={selectedUserDetail.name} className="w-10 h-10 rounded-full" />
                <div>
                  <h3 className="font-black text-slate-900 text-sm">{selectedUserDetail.name}</h3>
                  <p className="text-[10px] text-slate-400">{selectedUserDetail.email}</p>
                </div>
              </div>
              <button onClick={() => setSelectedUserDetail(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-slate-800">Kursus Yang Dibeli & Progress Pembelajaran:</h4>
              <div className="space-y-2">
                {courses.map(c => {
                  const userEnrolled = enrollments.some(e => e.user_id === selectedUserDetail.id && e.course_id === c.id);
                  return (
                    <div key={c.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex justify-between items-center">
                      <div>
                        <p className="font-bold text-slate-900">{c.title}</p>
                        <p className="text-[10px] text-slate-500">{userEnrolled ? 'Terdaftar & Aktif' : 'Belum Dibeli'}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        userEnrolled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {userEnrolled ? 'Aktif' : 'Tidak Ada Akses'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
