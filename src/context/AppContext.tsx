import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, Course, Module, Lesson, Enrollment, Order, LessonProgress, PaymentMethod, 
  QuizQuestion, VocabItem, BlogPost, LessonComment 
} from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_COURSES, 
  INITIAL_MODULES, 
  INITIAL_LESSONS, 
  INITIAL_ENROLLMENTS, 
  INITIAL_LESSON_PROGRESS, 
  INITIAL_ORDERS,
  INITIAL_QUIZZES,
  INITIAL_VOCAB,
  INITIAL_BLOG_POSTS,
  INITIAL_LESSON_COMMENTS
} from '../data/mockData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { verifyAndFulfillOrder } from '../lib/payment';

export type PageRoute = 'home' | 'courses' | 'course-detail' | 'checkout' | 'dashboard' | 'learn' | 'admin' | 'vocab' | 'blog' | 'blog-detail' | 'profile';

interface ToastInfo {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  // Navigation
  currentRoute: PageRoute;
  navigateTo: (route: PageRoute, params?: { courseId?: string; courseSlug?: string; lessonId?: string; blogSlug?: string }) => void;
  selectedCourseId: string | null;
  selectedCourseSlug: string | null;
  selectedLessonId: string | null;
  selectedBlogSlug: string | null;

  // Supabase status
  isSupabaseConnected: boolean;
  refreshFromSupabase: () => Promise<void>;

  // User & Auth
  currentUser: User | null;
  users: User[];
  switchUserRole: (role: 'STUDENT' | 'ADMIN') => void;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  login: (user: User) => void;
  logout: () => void;
  loginWithSupabase: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signUpWithSupabase: (email: string, pass: string, name: string) => Promise<{ success: boolean; error?: string }>;
  resetPasswordWithSupabase: (email: string) => Promise<{ success: boolean; error?: string }>;
  updateUserRole: (userId: string, role: 'STUDENT' | 'ADMIN') => void;
  updateUserProfile: (updatedFields: Partial<User>) => void;

  // Data Collections
  courses: Course[];
  modules: Module[];
  lessons: Lesson[];
  enrollments: Enrollment[];
  lessonProgress: LessonProgress[];
  orders: Order[];
  quizzes: QuizQuestion[];
  vocabItems: VocabItem[];
  blogPosts: BlogPost[];
  lessonComments: LessonComment[];

  // Student Methods
  hasAccess: (courseId: string) => boolean;
  getCourseProgress: (courseId: string) => number; // 0 to 100
  isLessonCompleted: (lessonId: string) => boolean;
  toggleLessonCompleted: (lessonId: string, courseId: string) => void;
  createOrderAndCheckout: (courseId: string, paymentMethod: PaymentMethod) => Order;
  simulatePaymentSuccess: (orderId: string) => void;
  verifyPaymentAndFulfillOrder: (orderId: string) => Promise<boolean>;
  addLessonComment: (lessonId: string, text: string) => void;

  // Admin Methods
  createCourse: (newCourse: Omit<Course, 'id' | 'created_at' | 'updated_at'>) => void;
  updateCourse: (id: string, updatedCourse: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  
  createModule: (newModule: Omit<Module, 'id'>) => void;
  updateModule: (id: string, updatedModule: Partial<Module>) => void;
  deleteModule: (id: string) => void;

  createLesson: (newLesson: Omit<Lesson, 'id'>) => void;
  updateLesson: (id: string, updatedLesson: Partial<Lesson>) => void;
  deleteLesson: (id: string) => void;

  updateOrderPaymentStatus: (orderId: string, status: Order['payment_status']) => void;

  // Toast
  toasts: ToastInfo[];
  showToast: (message: string, type?: ToastInfo['type']) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State
  const [currentRoute, setCurrentRoute] = useState<PageRoute>('home');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedCourseSlug, setSelectedCourseSlug] = useState<string | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [selectedBlogSlug, setSelectedBlogSlug] = useState<string | null>(null);

  // User & Auth State
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('arabiyyah_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });
  const [currentUser, setCurrentUser] = useState<User | null>(users[0] || INITIAL_USERS[0]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Data Collections with LocalStorage caching
  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('arabiyyah_courses');
    return saved ? JSON.parse(saved) : INITIAL_COURSES;
  });

  const [modules, setModules] = useState<Module[]>(() => {
    const saved = localStorage.getItem('arabiyyah_modules');
    return saved ? JSON.parse(saved) : INITIAL_MODULES;
  });

  const [lessons, setLessons] = useState<Lesson[]>(() => {
    const saved = localStorage.getItem('arabiyyah_lessons');
    return saved ? JSON.parse(saved) : INITIAL_LESSONS;
  });

  const [enrollments, setEnrollments] = useState<Enrollment[]>(() => {
    const saved = localStorage.getItem('arabiyyah_enrollments');
    return saved ? JSON.parse(saved) : INITIAL_ENROLLMENTS;
  });

  const [lessonProgress, setLessonProgress] = useState<LessonProgress[]>(() => {
    const saved = localStorage.getItem('arabiyyah_lesson_progress');
    return saved ? JSON.parse(saved) : INITIAL_LESSON_PROGRESS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('arabiyyah_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [quizzes, setQuizzes] = useState<QuizQuestion[]>(INITIAL_QUIZZES);
  const [vocabItems, setVocabItems] = useState<VocabItem[]>(INITIAL_VOCAB);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(INITIAL_BLOG_POSTS);
  
  const [lessonComments, setLessonComments] = useState<LessonComment[]>(() => {
    const saved = localStorage.getItem('arabiyyah_comments');
    return saved ? JSON.parse(saved) : INITIAL_LESSON_COMMENTS;
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  // Function to load / refresh all data from Supabase
  const refreshFromSupabase = async () => {
    if (!isSupabaseConfigured) return;

    try {
      const [
        uRes, cRes, mRes, lRes, eRes, pRes, oRes, qRes, vRes, bRes, commRes
      ] = await Promise.all([
        supabase.from('users').select('*'),
        supabase.from('courses').select('*'),
        supabase.from('modules').select('*').order('order_index', { ascending: true }),
        supabase.from('lessons').select('*').order('order_index', { ascending: true }),
        supabase.from('enrollments').select('*'),
        supabase.from('lesson_progress').select('*'),
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('quizzes').select('*'),
        supabase.from('vocab_items').select('*'),
        supabase.from('blog_posts').select('*').order('published_at', { ascending: false }),
        supabase.from('lesson_comments').select('*').order('created_at', { ascending: true })
      ]);

      if (uRes.data) setUsers(uRes.data);
      if (cRes.data) setCourses(cRes.data);
      if (mRes.data) setModules(mRes.data);
      if (lRes.data) setLessons(lRes.data);
      if (eRes.data) setEnrollments(eRes.data);
      if (pRes.data) setLessonProgress(pRes.data);
      if (oRes.data) setOrders(oRes.data);
      if (qRes.data) setQuizzes(qRes.data);
      if (vRes.data) setVocabItems(vRes.data);
      if (bRes.data) setBlogPosts(bRes.data);
      if (commRes.data) setLessonComments(commRes.data);

      console.log('🔄 Data berhasil disinkronkan dari Supabase');
    } catch (err) {
      console.warn('⚠️ Gagal memuat data dari Supabase:', err);
    }
  };

  // Fetch initial data on mount & listen to Supabase Auth session changes
  useEffect(() => {
    if (isSupabaseConfigured) {
      refreshFromSupabase();

      // Listen for Supabase Auth state changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          const authEmail = session.user.email || '';
          const authName = session.user.user_metadata?.full_name || session.user.user_metadata?.name || authEmail.split('@')[0];
          
          const appUser: User = {
            id: session.user.id,
            name: authName,
            email: authEmail,
            avatar: session.user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
            role: authEmail.includes('admin') ? 'ADMIN' : 'STUDENT',
            created_at: session.user.created_at || new Date().toISOString()
          };
          
          setCurrentUser(appUser);
          
          // Upsert into Supabase users table if connected
          try {
            await supabase.from('users').upsert([appUser], { onConflict: 'email' });
          } catch (e) {
            console.warn('Upsert user table warning:', e);
          }
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  // LocalStorage Persistence Sync (as fallback cache)
  useEffect(() => { localStorage.setItem('arabiyyah_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('arabiyyah_courses', JSON.stringify(courses)); }, [courses]);
  useEffect(() => { localStorage.setItem('arabiyyah_modules', JSON.stringify(modules)); }, [modules]);
  useEffect(() => { localStorage.setItem('arabiyyah_lessons', JSON.stringify(lessons)); }, [lessons]);
  useEffect(() => { localStorage.setItem('arabiyyah_enrollments', JSON.stringify(enrollments)); }, [enrollments]);
  useEffect(() => { localStorage.setItem('arabiyyah_lesson_progress', JSON.stringify(lessonProgress)); }, [lessonProgress]);
  useEffect(() => { localStorage.setItem('arabiyyah_orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('arabiyyah_comments', JSON.stringify(lessonComments)); }, [lessonComments]);

  // Toast Helper
  const showToast = (message: string, type: ToastInfo['type'] = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Router Helper
  const navigateTo = (route: PageRoute, params?: { courseId?: string; courseSlug?: string; lessonId?: string; blogSlug?: string }) => {
    if (params?.courseId) setSelectedCourseId(params.courseId);
    if (params?.courseSlug) setSelectedCourseSlug(params.courseSlug);
    if (params?.lessonId) setSelectedLessonId(params.lessonId);
    if (params?.blogSlug) setSelectedBlogSlug(params.blogSlug);
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auth Methods
  const switchUserRole = (role: 'STUDENT' | 'ADMIN') => {
    const found = users.find(u => u.role === role);
    if (found) {
      setCurrentUser(found);
      showToast(`Beralih peran sebagai: ${found.name} (${role === 'ADMIN' ? 'Administrator' : 'Siswa'})`, 'success');
      if (role === 'ADMIN') {
        setCurrentRoute('admin');
      } else {
        setCurrentRoute('home');
      }
    }
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const login = (user: User) => {
    const existing = users.find(u => u.email === user.email);
    if (!existing) {
      setUsers([...users, user]);
      if (isSupabaseConfigured) {
        supabase.from('users').insert([user]).then(({ error }) => {
          if (error) console.error('Supabase User Insert Error:', error);
        });
      }
    }
    setCurrentUser(user);
    closeAuthModal();
    showToast(`Selamat datang kembali, ${user.name}!`, 'success');
  };

  const loginWithSupabase = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured) {
      // Local fallback
      const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (found) {
        login(found);
        return { success: true };
      }
      const newU: User = {
        id: `user-${Date.now()}`,
        name: email.split('@')[0],
        email,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
        role: 'STUDENT',
        created_at: new Date().toISOString()
      };
      login(newU);
      return { success: true };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        const authUser: User = {
          id: data.user.id,
          name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
          email: data.user.email || email,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
          role: email.includes('admin') ? 'ADMIN' : 'STUDENT',
          created_at: data.user.created_at || new Date().toISOString()
        };
        setCurrentUser(authUser);
        closeAuthModal();
        showToast(`Berhasil masuk! Selamat datang ${authUser.name}`, 'success');
        return { success: true };
      }
      return { success: false, error: 'User data not returned' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Terjadi kesalahan sistem auth' };
    }
  };

  const signUpWithSupabase = async (email: string, pass: string, name: string): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured) {
      const newU: User = {
        id: `user-${Date.now()}`,
        name: name || email.split('@')[0],
        email,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
        role: 'STUDENT',
        created_at: new Date().toISOString()
      };
      login(newU);
      return { success: true };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: {
          data: { name, full_name: name }
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        const newUser: User = {
          id: data.user.id,
          name: name || email.split('@')[0],
          email,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
          role: 'STUDENT',
          created_at: new Date().toISOString()
        };

        await supabase.from('users').upsert([newUser]);
        setCurrentUser(newUser);
        closeAuthModal();
        showToast('Pendaftaran akun berhasil! Selamat belajar.', 'success');
        return { success: true };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Gagal mendaftar akun' };
    }
  };

  const resetPasswordWithSupabase = async (email: string): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured) {
      showToast(`Instruksi reset password (simulasi) telah dikirim ke ${email}`, 'info');
      return { success: true };
    }
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) return { success: false, error: error.message };
      showToast(`Link pemulihan kata sandi telah dikirim ke email ${email}`, 'success');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Gagal mengirim email reset password' };
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setCurrentUser(null);
    setCurrentRoute('home');
    showToast('Anda telah keluar dari akun.', 'info');
  };

  const updateUserRole = (userId: string, role: 'STUDENT' | 'ADMIN') => {
    setUsers(users.map(u => u.id === userId ? { ...u, role } : u));
    if (currentUser?.id === userId) {
      setCurrentUser({ ...currentUser, role });
    }
    if (isSupabaseConfigured) {
      supabase.from('users').update({ role }).eq('id', userId).then(({ error }) => {
        if (error) console.error('Supabase Update User Role Error:', error);
      });
    }
    showToast(`Peran pengguna berhasil diubah menjadi ${role}`, 'info');
  };

  const updateUserProfile = (updatedFields: Partial<User>) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...updatedFields };
    setCurrentUser(updatedUser);
    setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
    if (isSupabaseConfigured) {
      supabase.from('users').update(updatedFields).eq('id', currentUser.id).then(({ error }) => {
        if (error) console.error('Supabase Profile Update Error:', error);
      });
    }
    showToast('Profil Anda berhasil diperbarui!', 'success');
  };

  // Access & Progress Helpers
  const hasAccess = (courseId: string): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === 'ADMIN') return true;
    return enrollments.some(e => e.user_id === currentUser.id && e.course_id === courseId && e.status === 'ACTIVE');
  };

  const getCourseProgress = (courseId: string): number => {
    if (!currentUser) return 0;
    const courseLessons = lessons.filter(l => l.course_id === courseId);
    if (courseLessons.length === 0) return 0;

    const completedCount = lessonProgress.filter(
      p => p.user_id === currentUser.id && p.course_id === courseId && p.completed
    ).length;

    return Math.round((completedCount / courseLessons.length) * 100);
  };

  const isLessonCompleted = (lessonId: string): boolean => {
    if (!currentUser) return false;
    return lessonProgress.some(p => p.user_id === currentUser.id && p.lesson_id === lessonId && p.completed);
  };

  const toggleLessonCompleted = (lessonId: string, courseId: string) => {
    if (!currentUser) {
      openAuthModal();
      return;
    }

    const existing = lessonProgress.find(p => p.user_id === currentUser.id && p.lesson_id === lessonId);
    if (existing) {
      const isComp = !existing.completed;
      const compAt = isComp ? new Date().toISOString() : undefined;
      const updated = lessonProgress.map(p => 
        p.id === existing.id ? { ...p, completed: isComp, completed_at: compAt } : p
      );
      setLessonProgress(updated);

      if (isSupabaseConfigured) {
        supabase.from('lesson_progress').update({ completed: isComp, completed_at: compAt }).eq('id', existing.id).then(({ error }) => {
          if (error) console.error('Supabase Progress Update Error:', error);
        });
      }

      showToast(isComp ? 'Pelajaran ditandai SELESAI 🎉' : 'Status pelajaran diperbarui', 'success');
    } else {
      const newProgress: LessonProgress = {
        id: `prog-${Date.now()}`,
        user_id: currentUser.id,
        lesson_id: lessonId,
        course_id: courseId,
        completed: true,
        completed_at: new Date().toISOString()
      };
      setLessonProgress([...lessonProgress, newProgress]);

      if (isSupabaseConfigured) {
        supabase.from('lesson_progress').insert([newProgress]).then(({ error }) => {
          if (error) console.error('Supabase Progress Insert Error:', error);
        });
      }

      showToast('Pelajaran ditandai SELESAI 🎉', 'success');
    }
  };

  // Order & Payment Checkout
  const createOrderAndCheckout = (courseId: string, paymentMethod: PaymentMethod): Order => {
    const course = courses.find(c => c.id === courseId);
    if (!course) throw new Error('Kursus tidak ditemukan');
    if (!currentUser) throw new Error('Pengguna belum login');

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      order_number: `INV/${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}/ARB/${Math.floor(100 + Math.random() * 900)}`,
      user_id: currentUser.id,
      user_name: currentUser.name,
      user_email: currentUser.email,
      course_id: courseId,
      course_title: course.title,
      amount: course.discount_price || course.price,
      payment_status: 'PENDING',
      payment_method: paymentMethod,
      created_at: new Date().toISOString()
    };

    setOrders([newOrder, ...orders]);

    if (isSupabaseConfigured) {
      supabase.from('orders').insert([newOrder]).then(({ error }) => {
        if (error) console.error('Supabase Order Insert Error:', error);
      });
    }

    return newOrder;
  };

  const simulatePaymentSuccess = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const paidAt = new Date().toISOString();

    // Update order status to PAID
    const updatedOrders = orders.map(o => o.id === orderId ? { ...o, payment_status: 'PAID' as const, paid_at: paidAt } : o);
    setOrders(updatedOrders);

    if (isSupabaseConfigured) {
      supabase.from('orders').update({ payment_status: 'PAID', paid_at: paidAt }).eq('id', orderId).then(({ error }) => {
        if (error) console.error('Supabase Payment Update Error:', error);
      });
    }

    // Grant Enrollment
    const existingEnrollment = enrollments.find(e => e.user_id === order.user_id && e.course_id === order.course_id);
    if (!existingEnrollment) {
      const newEnrollment: Enrollment = {
        id: `enr-${Date.now()}`,
        user_id: order.user_id,
        course_id: order.course_id,
        status: 'ACTIVE',
        enrolled_at: new Date().toISOString()
      };
      setEnrollments([...enrollments, newEnrollment]);

      if (isSupabaseConfigured) {
        supabase.from('enrollments').insert([newEnrollment]).then(({ error }) => {
          if (error) console.error('Supabase Enrollment Insert Error:', error);
        });
      }
    }

    showToast('Pembayaran berhasil terverifikasi! Akses kursus telah diberikan.', 'success');
  };

  const addLessonComment = (lessonId: string, text: string) => {
    if (!currentUser) {
      openAuthModal();
      return;
    }
    const newComm: LessonComment = {
      id: `comm-${Date.now()}`,
      lesson_id: lessonId,
      user_id: currentUser.id,
      user_name: currentUser.name,
      user_avatar: currentUser.avatar,
      user_role: currentUser.role,
      text,
      created_at: new Date().toISOString()
    };
    setLessonComments([...lessonComments, newComm]);

    if (isSupabaseConfigured) {
      supabase.from('lesson_comments').insert([newComm]).then(({ error }) => {
        if (error) console.error('Supabase Comment Insert Error:', error);
      });
    }

    showToast('Pertanyaan / komentar berhasil dikirim!', 'success');
  };

  // Admin Actions
  const createCourse = (newCourseData: Omit<Course, 'id' | 'created_at' | 'updated_at'>) => {
    const newCourse: Course = {
      ...newCourseData,
      id: `course-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setCourses([newCourse, ...courses]);

    if (isSupabaseConfigured) {
      supabase.from('courses').insert([newCourse]).then(({ error }) => {
        if (error) console.error('Supabase Create Course Error:', error);
      });
    }

    showToast('Kursus baru berhasil ditambahkan! (Draft)', 'success');
  };

  const updateCourse = (id: string, updatedFields: Partial<Course>) => {
    const updatedAt = new Date().toISOString();
    setCourses(courses.map(c => c.id === id ? { ...c, ...updatedFields, updated_at: updatedAt } : c));

    if (isSupabaseConfigured) {
      supabase.from('courses').update({ ...updatedFields, updated_at: updatedAt }).eq('id', id).then(({ error }) => {
        if (error) console.error('Supabase Update Course Error:', error);
      });
    }

    showToast('Data kursus berhasil diperbarui.', 'success');
  };

  const deleteCourse = (id: string) => {
    setCourses(courses.filter(c => c.id !== id));

    if (isSupabaseConfigured) {
      supabase.from('courses').delete().eq('id', id).then(({ error }) => {
        if (error) console.error('Supabase Delete Course Error:', error);
      });
    }

    showToast('Kursus berhasil dihapus.', 'info');
  };

  const createModule = (newModuleData: Omit<Module, 'id'>) => {
    const newMod: Module = {
      ...newModuleData,
      id: `mod-${Date.now()}`
    };
    setModules([...modules, newMod]);

    if (isSupabaseConfigured) {
      supabase.from('modules').insert([newMod]).then(({ error }) => {
        if (error) console.error('Supabase Create Module Error:', error);
      });
    }

    showToast('Modul baru berhasil dibuat.', 'success');
  };

  const updateModule = (id: string, updatedFields: Partial<Module>) => {
    setModules(modules.map(m => m.id === id ? { ...m, ...updatedFields } : m));

    if (isSupabaseConfigured) {
      supabase.from('modules').update(updatedFields).eq('id', id).then(({ error }) => {
        if (error) console.error('Supabase Update Module Error:', error);
      });
    }

    showToast('Modul berhasil diperbarui.', 'success');
  };

  const deleteModule = (id: string) => {
    setModules(modules.filter(m => m.id !== id));
    setLessons(lessons.filter(l => l.module_id !== id));

    if (isSupabaseConfigured) {
      supabase.from('modules').delete().eq('id', id).then(({ error }) => {
        if (error) console.error('Supabase Delete Module Error:', error);
      });
    }

    showToast('Modul & pelajaran di dalamnya telah dihapus.', 'info');
  };

  const createLesson = (newLessonData: Omit<Lesson, 'id'>) => {
    const newLes: Lesson = {
      ...newLessonData,
      id: `les-${Date.now()}`
    };
    setLessons([...lessons, newLes]);

    if (isSupabaseConfigured) {
      supabase.from('lessons').insert([newLes]).then(({ error }) => {
        if (error) console.error('Supabase Create Lesson Error:', error);
      });
    }

    showToast('Pelajaran baru berhasil ditambahkan.', 'success');
  };

  const updateLesson = (id: string, updatedFields: Partial<Lesson>) => {
    setLessons(lessons.map(l => l.id === id ? { ...l, ...updatedFields } : l));

    if (isSupabaseConfigured) {
      supabase.from('lessons').update(updatedFields).eq('id', id).then(({ error }) => {
        if (error) console.error('Supabase Update Lesson Error:', error);
      });
    }

    showToast('Pelajaran berhasil diperbarui.', 'success');
  };

  const deleteLesson = (id: string) => {
    setLessons(lessons.filter(l => l.id !== id));

    if (isSupabaseConfigured) {
      supabase.from('lessons').delete().eq('id', id).then(({ error }) => {
        if (error) console.error('Supabase Delete Lesson Error:', error);
      });
    }

    showToast('Pelajaran berhasil dihapus.', 'info');
  };

  const updateOrderPaymentStatus = (orderId: string, status: Order['payment_status']) => {
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder) return;

    const paidAt = status === 'PAID' ? new Date().toISOString() : targetOrder.paid_at;
    setOrders(orders.map(o => o.id === orderId ? { ...o, payment_status: status, paid_at: paidAt } : o));

    if (isSupabaseConfigured) {
      supabase.from('orders').update({ payment_status: status, paid_at: paidAt }).eq('id', orderId).then(({ error }) => {
        if (error) console.error('Supabase Update Order Status Error:', error);
      });
    }

    if (status === 'PAID') {
      const existing = enrollments.find(e => e.user_id === targetOrder.user_id && e.course_id === targetOrder.course_id);
      if (!existing) {
        const newEnr: Enrollment = {
          id: `enr-${Date.now()}`,
          user_id: targetOrder.user_id,
          course_id: targetOrder.course_id,
          status: 'ACTIVE',
          enrolled_at: new Date().toISOString()
        };
        setEnrollments([...enrollments, newEnr]);

        if (isSupabaseConfigured) {
          supabase.from('enrollments').insert([newEnr]).then(({ error }) => {
            if (error) console.error('Supabase Enrollment Insert Error:', error);
          });
        }
      }
    }
    showToast(`Status transaksi #${targetOrder.order_number} diubah menjadi ${status}`, 'info');
  };

  const verifyPaymentAndFulfillOrder = async (orderId: string): Promise<boolean> => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return false;

    const result = await verifyAndFulfillOrder(orderId, order.user_id, order.course_id);
    if (result.success) {
      const paidAt = new Date().toISOString();
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, payment_status: 'PAID', paid_at: paidAt } : o));

      if (result.enrollment) {
        setEnrollments(prev => {
          const exists = prev.some(e => e.user_id === result.enrollment!.user_id && e.course_id === result.enrollment!.course_id);
          return exists ? prev : [result.enrollment!, ...prev];
        });
      }

      showToast(result.message, 'success');
      return true;
    } else {
      showToast('Gagal memverifikasi status pembayaran.', 'error');
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentRoute,
        navigateTo,
        selectedCourseId,
        selectedCourseSlug,
        selectedLessonId,
        selectedBlogSlug,
        isSupabaseConnected: isSupabaseConfigured,
        refreshFromSupabase,
        currentUser,
        users,
        switchUserRole,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        login,
        logout,
        loginWithSupabase,
        signUpWithSupabase,
        resetPasswordWithSupabase,
        updateUserRole,
        updateUserProfile,
        courses,
        modules,
        lessons,
        enrollments,
        lessonProgress,
        orders,
        quizzes,
        vocabItems,
        blogPosts,
        lessonComments,
        hasAccess,
        getCourseProgress,
        isLessonCompleted,
        toggleLessonCompleted,
        createOrderAndCheckout,
        simulatePaymentSuccess,
        verifyPaymentAndFulfillOrder,
        addLessonComment,
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
        toasts,
        showToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
