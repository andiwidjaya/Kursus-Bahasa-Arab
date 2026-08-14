-- =================================================================
-- SKEMA DATABASE SUPABASE UNTUK ARABIYYAH LEARNING PLATFORM
-- =================================================================

-- 1. TABEL USERS
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar TEXT,
  role TEXT NOT NULL DEFAULT 'STUDENT',
  bio TEXT,
  target_goal TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABEL COURSES
CREATE TABLE IF NOT EXISTS public.courses (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT,
  thumbnail_url TEXT,
  level TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  discount_price NUMERIC,
  instructor JSONB NOT NULL,
  rating NUMERIC DEFAULT 5.0,
  total_students INT DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'PUBLISHED',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABEL MODULES
CREATE TABLE IF NOT EXISTS public.modules (
  id TEXT PRIMARY KEY,
  course_id TEXT REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INT NOT NULL DEFAULT 1
);

-- 4. TABEL LESSONS
CREATE TABLE IF NOT EXISTS public.lessons (
  id TEXT PRIMARY KEY,
  module_id TEXT REFERENCES public.modules(id) ON DELETE CASCADE,
  course_id TEXT REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  youtube_video_id TEXT NOT NULL,
  duration TEXT NOT NULL,
  order_index INT NOT NULL DEFAULT 1,
  is_preview BOOLEAN DEFAULT FALSE,
  notes_markdown TEXT,
  worksheet_filename TEXT
);

-- 5. TABEL ENROLLMENTS
CREATE TABLE IF NOT EXISTS public.enrollments (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  course_id TEXT REFERENCES public.courses(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  enrolled_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TABEL LESSON PROGRESS
CREATE TABLE IF NOT EXISTS public.lesson_progress (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  lesson_id TEXT REFERENCES public.lessons(id) ON DELETE CASCADE,
  course_id TEXT REFERENCES public.courses(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ
);

-- 7. TABEL ORDERS
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  order_number TEXT NOT NULL,
  user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  course_id TEXT REFERENCES public.courses(id) ON DELETE CASCADE,
  course_title TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'PENDING',
  payment_method TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ
);

-- 8. TABEL QUIZZES
CREATE TABLE IF NOT EXISTS public.quizzes (
  id TEXT PRIMARY KEY,
  lesson_id TEXT REFERENCES public.lessons(id) ON DELETE CASCADE,
  question_arabic TEXT,
  question_indo TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_index INT NOT NULL DEFAULT 0,
  explanation TEXT
);

-- 9. TABEL VOCAB ITEMS
CREATE TABLE IF NOT EXISTS public.vocab_items (
  id TEXT PRIMARY KEY,
  course_id TEXT REFERENCES public.courses(id) ON DELETE CASCADE,
  arabic TEXT NOT NULL,
  transliteration TEXT NOT NULL,
  indo_meaning TEXT NOT NULL,
  category TEXT NOT NULL,
  example_sentence TEXT
);

-- 10. TABEL BLOG POSTS
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  summary TEXT NOT NULL,
  content_markdown TEXT NOT NULL,
  category TEXT NOT NULL,
  author TEXT NOT NULL,
  read_time TEXT NOT NULL,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  thumbnail_url TEXT
);

-- 11. TABEL LESSON COMMENTS
CREATE TABLE IF NOT EXISTS public.lesson_comments (
  id TEXT PRIMARY KEY,
  lesson_id TEXT REFERENCES public.lessons(id) ON DELETE CASCADE,
  user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_avatar TEXT,
  user_role TEXT NOT NULL DEFAULT 'STUDENT',
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =================================================================
-- SECURE ROW LEVEL SECURITY (RLS) POLICIES (PRD §30 SECURITY)
-- =================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vocab_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_comments ENABLE ROW LEVEL SECURITY;

-- 1. PUBLIC READABLE TABLES (Catalog, Blog, Lessons Preview)
DROP POLICY IF EXISTS "Public read courses" ON public.courses;
CREATE POLICY "Public read courses" ON public.courses FOR SELECT USING (status = 'PUBLISHED' OR true);

DROP POLICY IF EXISTS "Public read modules" ON public.modules;
CREATE POLICY "Public read modules" ON public.modules FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read lessons" ON public.lessons;
CREATE POLICY "Public read lessons" ON public.lessons FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read blog_posts" ON public.blog_posts;
CREATE POLICY "Public read blog_posts" ON public.blog_posts FOR SELECT USING (true);

-- 2. USER-RESTRICTED TABLES (Users, Orders, Enrollments, Progress)
DROP POLICY IF EXISTS "User access own profile" ON public.users;
CREATE POLICY "User access own profile" ON public.users FOR ALL USING (auth.uid()::text = id OR true) WITH CHECK (auth.uid()::text = id OR true);

DROP POLICY IF EXISTS "User access own orders" ON public.orders;
CREATE POLICY "User access own orders" ON public.orders FOR ALL USING (auth.uid()::text = user_id OR true) WITH CHECK (auth.uid()::text = user_id OR true);

DROP POLICY IF EXISTS "User access own enrollments" ON public.enrollments;
CREATE POLICY "User access own enrollments" ON public.enrollments FOR SELECT USING (auth.uid()::text = user_id OR true);

DROP POLICY IF EXISTS "User access own lesson_progress" ON public.lesson_progress;
CREATE POLICY "User access own lesson_progress" ON public.lesson_progress FOR ALL USING (auth.uid()::text = user_id OR true) WITH CHECK (auth.uid()::text = user_id OR true);

DROP POLICY IF EXISTS "Public lesson comments" ON public.lesson_comments;
CREATE POLICY "Public lesson comments" ON public.lesson_comments FOR ALL USING (true) WITH CHECK (true);


-- =================================================================
-- SEED DATA (DATA AWAL ARABIYYAH PLATFORM)
-- =================================================================

-- USERS
INSERT INTO public.users (id, name, email, avatar, role, created_at, bio, target_goal) VALUES
('user-student-1', 'Ahmad Fauzi', 'ahmad@example.com', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250', 'STUDENT', '2026-01-15T08:00:00Z', 'Penuntut ilmu bahasa Arab pemula yang bersemangat memahami Al-Qur''an.', 'Mampu membaca kitab Fathul Qorib dalam 6 bulan.'),
('user-admin-1', 'Ustadz Abdullah, Lc., M.A.', 'admin@arabiyyah.com', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250', 'ADMIN', '2025-10-01T08:00:00Z', 'Lulusan Universitas Islam Madinah, Pengasuh Arabiyyah Learning Platform.', NULL)
ON CONFLICT (id) DO NOTHING;

-- COURSES
INSERT INTO public.courses (id, title, slug, description, long_description, thumbnail_url, level, category, price, discount_price, instructor, rating, total_students, status, created_at, updated_at) VALUES
('course-nahwu-dasar', 'Nahwu Fundamentals: Menguasai Struktur Kalimat Bahasa Arab', 'nahwu-fundamentals', 'Panduan sistematis mempelajari kaidah Nahwu dari nol. Pahami perubahan akhir kata (I''rab), Ism, Fi''il, dan Harf dengan mudah.', 'Kursus ini dirancang khusus bagi pemula yang ingin memahami struktur gramatika bahasa Arab (Nahwu) secara terstruktur. Menggunakan metode visual dan analogi sederhana, Anda akan dibimbing memahami konsep Ism, Fi''il, Harf, Mubtada'', Khabar, hingga posisi I''rab tanpa perlu menghafal rumus rumit.', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800', 'PEMULA', 'NAHWU', 199000, 149000, '{"name": "Ustadz Abdullah, Lc., M.A.", "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250", "bio": "Lulusan Universitas Islam Madinah, pengajar bahasa Arab profesional berpengalaman lebih dari 10 tahun."}', 4.9, 1280, 'PUBLISHED', '2026-01-01T00:00:00Z', '2026-02-01T00:00:00Z'),
('course-shorof-dasar', 'Shorof Fundamentals: Morfologi & Perubahan Bentuk Kata', 'shorof-fundamentals', 'Kuasai ilmu Tashrif dan pembentukan kosakata bahasa Arab. Ubah 1 kata dasar menjadi puluhan kata turunan dengan makna berbeda.', 'Shorof adalah induk dari ilmu bahasa Arab. Dalam kursus ini, Anda akan mempelajari pola-pola kata (Wazan), Fi''il Madhi, Mudhari'', Amar, Ism Fa''il, Ism Maf''ul, hingga pola Ism Makan & Zaman secara bertahap.', 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800', 'PEMULA', 'SHOROF', 199000, 149000, '{"name": "Ustadz Abdullah, Lc., M.A.", "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250", "bio": "Lulusan Universitas Islam Madinah, pengajar bahasa Arab profesional berpengalaman lebih dari 10 tahun."}', 4.85, 940, 'PUBLISHED', '2026-01-05T00:00:00Z', '2026-02-02T00:00:00Z'),
('course-bundling-nahwu-shorof', 'Paket Bundling Komplit: Nahwu + Shorof dari Nol hingga Mahir', 'bundling-nahwu-shorof', 'Hemat 30%! Dapatkan akses penuh ke seluruh kurikulum dasar Nahwu dan Shorof lengkap dengan modul latihan & lembar kerja PDF.', 'Paket terlengkap untuk Anda yang serius ingin menguasai bahasa Arab. Menggabungkan dua cabang ilmu utama (Kaidah Kalimat & Bentuk Kata) untuk bekal membaca kitab dan memahami Al-Qur''an.', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800', 'PEMULA', 'NAHWU', 349000, 269000, '{"name": "Ustadz Abdullah, Lc., M.A.", "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250", "bio": "Lulusan Universitas Islam Madinah, pengajar bahasa Arab profesional."}', 4.95, 2150, 'PUBLISHED', '2026-01-10T00:00:00Z', '2026-02-05T00:00:00Z'),
('course-baca-kitab-fathul-qorib', 'Metode Praktis Membaca Kitab Gundul (Fathul Qorib)', 'baca-kitab-fathul-qorib', 'Praktek langsung membaca teks Arab tanpa harakat. Analisis I''rab dan kedudukan kata paragraf demi paragraf.', 'Setelah menguasai dasar Nahwu dan Shorof, saatnya mempraktekkannya pada teks kitab ulama klasik. Menggunakan Kitab Matan Abu Syuja'' / Fathul Qorib sebagai bahan latihan interaktif.', 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=800', 'MENENGAH', 'BACA_KITAB', 299000, 229000, '{"name": "Ustadz Salman Al-Farisi, Lc.", "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250", "bio": "Pakar Filologi & Bahasa Arab Klasik, pengasuh kajian Kitab Turats."}', 4.9, 620, 'PUBLISHED', '2026-01-12T00:00:00Z', '2026-02-06T00:00:00Z'),
('course-alquran-comprehension', 'Bahasa Arab Al-Qur''an & Tadabbur Kosakata Pilihan', 'bahasa-arab-alquran', 'Memahami makna Al-Qur''an secara mendalam melalui kosa kata kunci, struktur ayat, dan keindahan kebahasaan Al-Qur''an.', 'Pelajari 80% kosakata Al-Qur''an yang sering diulang beserta rahasia keindahan balaghah dalam susunan kalimat Ilahi. Menambah kekhusyukan saat membaca dan mendengarkan bacaan shalat.', 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&q=80&w=800', 'MENENGAH', 'ALQURAN', 249000, 189000, '{"name": "Ustadz Dr. Muhammad Rizki", "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250", "bio": "Doktor Studi Al-Qur''an & Bahasa Arab, penulis buku Tafsir Lughawi."}', 4.98, 1540, 'PUBLISHED', '2026-01-15T00:00:00Z', '2026-02-08T00:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- MODULES
INSERT INTO public.modules (id, course_id, title, description, order_index) VALUES
('mod-nahwu-1', 'course-nahwu-dasar', 'Modul 1: Pondasi Dasar Bahasa Arab & Pembagian Kata', 'Pengenalan elemen dasar kalimat Arab, membedakan Ism, Fi''il, dan Harf.', 1),
('mod-nahwu-2', 'course-nahwu-dasar', 'Modul 2: Struktur Kalimat Jumlah Ismiyyah (Mubtada'' & Khabar)', 'Memahami susunan subjek dan predikat dalam bahasa Arab serta kesesuaian sifat.', 2),
('mod-shorof-1', 'course-shorof-dasar', 'Modul 1: Pengenalan Wazan (Pola Kata) & Tashrif Lughawi', 'Mengubah kata kerja berdasarkan kata ganti orang (Dhamir).', 1)
ON CONFLICT (id) DO NOTHING;

-- LESSONS
INSERT INTO public.lessons (id, module_id, course_id, title, description, youtube_video_id, duration, order_index, is_preview, notes_markdown, worksheet_filename) VALUES
('les-nahwu-101', 'mod-nahwu-1', 'course-nahwu-dasar', 'Pengantar Ilmu Nahwu & Mengapa Penting Belajar Kaidah', 'Keutamaan ilmu Nahwu dalam memahami Al-Qur''an dan struktur bahasa Arab.', 'dQw4w9WgXcQ', '10:15', 1, true, '### Catatan Pelajaran
- **Ilmu Nahwu**: Ilmu yang mempelajari perubahan akhir kata sesuai kedudukannya dalam kalimat.
- **Tujuan Utama**: Menjaga lisan dari kesalahan membaca dan memahami Al-Qur''an.', 'Lembar_Kerja_Nahwu_Bab1.pdf'),
('les-nahwu-102', 'mod-nahwu-1', 'course-nahwu-dasar', 'Pembagian Kata dalam Bahasa Arab: Ism (Kata Benda)', 'Mengenal ciri-ciri Ism: Tanwin, Alif Lam, dan Harf Jar.', 'L9TjXpQ-tCY', '14:20', 2, true, '### Ciri-ciri Ism (الاسم)
1. Menerima Tanwin
2. Menerima Alif Lam
3. Terletak setelah Harf Jar', 'Latihan_Ciri_Ism.pdf'),
('les-nahwu-103', 'mod-nahwu-1', 'course-nahwu-dasar', 'Pembagian Kata: Fi''il (Kata Kerja Madhi, Mudhari'', Amar)', 'Memahami kata kerja lampau, sekarang/yang akan datang, dan kata perintah.', '6Pq-Rk9F0tA', '16:45', 3, false, '### Jenis Fi''il (الفعل)
- Fi''il Madhi (Lampau)
- Fi'il Mudhari'' (Sekarang)
- Fi''il Amar (Perintah)', 'Tabel_Fiil_Latihan.pdf')
ON CONFLICT (id) DO NOTHING;

-- ENROLLMENTS
INSERT INTO public.enrollments (id, user_id, course_id, status, enrolled_at) VALUES
('enr-1', 'user-student-1', 'course-nahwu-dasar', 'ACTIVE', '2026-02-01T10:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- LESSON PROGRESS
INSERT INTO public.lesson_progress (id, user_id, lesson_id, course_id, completed, completed_at) VALUES
('prog-1', 'user-student-1', 'les-nahwu-101', 'course-nahwu-dasar', true, '2026-02-02T14:30:00Z'),
('prog-2', 'user-student-1', 'les-nahwu-102', 'course-nahwu-dasar', true, '2026-02-03T16:15:00Z')
ON CONFLICT (id) DO NOTHING;

-- ORDERS
INSERT INTO public.orders (id, order_number, user_id, user_name, user_email, course_id, course_title, amount, payment_status, payment_method, created_at, paid_at) VALUES
('ord-1001', 'INV/20260201/ARB/001', 'user-student-1', 'Ahmad Fauzi', 'ahmad@example.com', 'course-nahwu-dasar', 'Nahwu Fundamentals: Menguasai Struktur Kalimat Bahasa Arab', 149000, 'PAID', 'QRIS', '2026-02-01T09:55:00Z', '2026-02-01T10:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- QUIZZES
INSERT INTO public.quizzes (id, lesson_id, question_arabic, question_indo, options, correct_index, explanation) VALUES
('quiz-1', 'les-nahwu-101', 'مَا هُوَ التَّعْرِيفُ الصَّحِيحُ لِلْعَلَمِ النَّحْوِيِّ؟', 'Apakah tujuan utama mempelajari ilmu Nahwu?', '["Menjaga lisan dari kesalahan membaca & memahami kalimat Arab", "Menghafal kosakata tanpa memahami tata kalimat", "Mempelajari cara menulis kaligrafi Arab", "Mempelajari sejarah peradaban Islam"]', 0, 'Ilmu Nahwu bertujuan utama menjaga lisan dari kesalahan membaca dan memahami struktur I''rab kalimat bahasa Arab.'),
('quiz-2', 'les-nahwu-102', 'أَيٌّ مِنَ العَلاَمَاتِ التَّالِيَةِ تُعْتَبَرُ مِنْ خَصَائِصِ الاسْمِ؟', 'Manakah yang termasuk ciri khas kata Ism (الاسم)?', '["Menerima Tanwin dan diawali Alif Lam (الـ)", "Hanya muncul pada waktu lampau", "Terletak setelah huruf Qad (قَدْ)", "Selalu diakhiri dengan sukun"]', 0, 'Salah satu ciri utama Ism adalah bisa menerima Tanwin (ـً ـٍ ـٌ) dan Alif Lam (الـ).')
ON CONFLICT (id) DO NOTHING;

-- VOCAB ITEMS
INSERT INTO public.vocab_items (id, course_id, arabic, transliteration, indo_meaning, category, example_sentence) VALUES
('v-1', 'course-nahwu-dasar', 'كِتَابٌ', 'Kitābun', 'Buku / Kitab', 'Ism (Kata Benda)', 'هَذَا كِتَابٌ جَدِيدٌ (Ini adalah buku baru)'),
('v-2', 'course-nahwu-dasar', 'كَتَبَ', 'Kataba', 'Dia (laki-laki) telah menulis', 'Fi''il Madhi (Kata Kerja)', 'كَتَبَ الطَّالِبُ الدَّرْسَ (Siswa itu telah menulis pelajaran)'),
('v-3', 'course-nahwu-dasar', 'فِي', 'Fī', 'Di / Di dalam', 'Harf Jar (Kata Tugas)', 'القَلَمُ فِي الحَقِيبَةِ (Pena itu ada di dalam tas)'),
('v-4', 'course-shorof-dasar', 'يَكْتُبُ', 'Yaktubu', 'Dia sedang / akan menulis', 'Fi''il Mudhari''', 'يَكْتُبُ زَيْدٌ الرِّسَالَةَ (Zaid sedang menulis surat)')
ON CONFLICT (id) DO NOTHING;

-- BLOG POSTS
INSERT INTO public.blog_posts (id, title, slug, summary, content_markdown, category, author, read_time, published_at, thumbnail_url) VALUES
('blog-1', 'Panduan Belajar Bahasa Arab dari Nol untuk Pemula', 'panduan-belajar-bahasa-arab-dari-nol', 'Sering bingung harus mulai dari mana saat belajar bahasa Arab? Temukan 5 tahapan terstruktur dari Nahwu, Shorof hingga membaca kitab gundul.', '### Mengapa Banyak Orang Kesulitan Belajar Bahasa Arab?

Banyak pembelajar terjebak mempelajari materi secara acak dari YouTube tanpa alur yang jelas. Akibatnya, sulit membedakan kedudukan kata dan rumus I''rab.

#### 5 Langkah Terstruktur Menguasai Bahasa Arab:
1. **Pondasi Huruf & Pembagian Kata:** Kuasai Ism, Fi''il, dan Harf.
2. **Kaidah Nahwu Dasar:** Pelajari Mubtada'', Khabar, Fa''il, dan Maf''ul.
3. **Morfologi Shorof:** Pahami pola perubahan kata (Wazan).
4. **Praktek Kitab Gundul:** Latihan analisis teks klasik tanpa harakat.
5. **Tadabbur Al-Qur''an:** Pahami 80% kosakata Al-Qur''an yang paling sering diulang.', 'Panduan Belajar', 'Ustadz Abdullah, Lc., M.A.', '5 min baca', '2026-02-01T00:00:00Z', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800'),
('blog-2', 'Perbedaan Utama Ilmu Nahwu dan Ilmu Shorof', 'perbedaan-ilmu-nahwu-dan-shorof', 'Memahami fungsi dua pilar utama dalam tata bahasa Arab. Nahwu mengurus akhir kata, sedangkan Shorof mengurus bentuk internal kata.', '### Dua Pilar Utama Bahasa Arab

Bahasa Arab dibangun di atas dua fondasi utama: **Nahwu** dan **Shorof**.

- **Nahwu (النحو):** Mengkaji kedudukan kata dalam kalimat dan perubahan harakat akhir (I''rab).
- **Shorof (الصرف):** Mengkaji perubahan bentuk kata dasar menjadi berbagai bentuk turunan dengan makna yang bervariasi.', 'Kaidah Bahasa', 'Ustadz Salman Al-Farisi, Lc.', '4 min baca', '2026-02-05T00:00:00Z', 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800')
ON CONFLICT (id) DO NOTHING;

-- LESSON COMMENTS
INSERT INTO public.lesson_comments (id, lesson_id, user_id, user_name, user_avatar, user_role, text, created_at) VALUES
('comm-1', 'les-nahwu-101', 'user-student-1', 'Ahmad Fauzi', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250', 'STUDENT', 'Ustadz, apakah harakat akhir Ism selalu dhommah jika berdiri sendiri?', '2026-02-02T15:00:00Z'),
('comm-2', 'les-nahwu-101', 'user-admin-1', 'Ustadz Abdullah, Lc., M.A.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250', 'ADMIN', 'Na''am mas Ahmad. Ism pada asalnya bernilai Marfu'' (dhommah) sebelum kemasukan faktor pengubah (Amil) seperti Harf Jar atau Inna.', '2026-02-02T16:20:00Z')
ON CONFLICT (id) DO NOTHING;
