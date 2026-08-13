import { 
  User, Course, Module, Lesson, Enrollment, Order, LessonProgress, 
  LearningPathLevel, QuizQuestion, VocabItem, BlogPost, LessonComment 
} from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user-student-1',
    name: 'Ahmad Fauzi',
    email: 'ahmad@example.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    role: 'STUDENT',
    created_at: '2026-01-15T08:00:00Z',
    bio: 'Penuntut ilmu bahasa Arab pemula yang bersemangat memahami Al-Qur\'an.',
    target_goal: 'Mampu membaca kitab Fathul Qorib dalam 6 bulan.'
  },
  {
    id: 'user-admin-1',
    name: 'Ustadz Abdullah, Lc., M.A.',
    email: 'admin@arabiyyah.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    role: 'ADMIN',
    created_at: '2025-10-01T08:00:00Z',
    bio: 'Lulusan Universitas Islam Madinah, Pengasuh Arabiyyah Learning Platform.'
  }
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course-nahwu-dasar',
    title: 'Nahwu Fundamentals: Menguasai Struktur Kalimat Bahasa Arab',
    slug: 'nahwu-fundamentals',
    description: 'Panduan sistematis mempelajari kaidah Nahwu dari nol. Pahami perubahan akhir kata (I\'rab), Ism, Fi\'il, dan Harf dengan mudah.',
    long_description: 'Kursus ini dirancang khusus bagi pemula yang ingin memahami struktur gramatika bahasa Arab (Nahwu) secara terstruktur. Menggunakan metode visual dan analogi sederhana, Anda akan dibimbing memahami konsep Ism, Fi\'il, Harf, Mubtada\', Khabar, hingga posisi I\'rab tanpa perlu menghafal rumus rumit.',
    thumbnail_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800',
    level: 'PEMULA',
    category: 'NAHWU',
    price: 199000,
    discount_price: 149000,
    instructor: {
      name: 'Ustadz Abdullah, Lc., M.A.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
      bio: 'Lulusan Universitas Islam Madinah, pengajar bahasa Arab profesional berpengalaman lebih dari 10 tahun.'
    },
    rating: 4.9,
    total_students: 1280,
    status: 'PUBLISHED',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-02-01T00:00:00Z'
  },
  {
    id: 'course-shorof-dasar',
    title: 'Shorof Fundamentals: Morfologi & Perubahan Bentuk Kata',
    slug: 'shorof-fundamentals',
    description: 'Kuasai ilmu Tashrif dan pembentukan kosakata bahasa Arab. Ubah 1 kata dasar menjadi puluhan kata turunan dengan makna berbeda.',
    long_description: 'Shorof adalah induk dari ilmu bahasa Arab. Dalam kursus ini, Anda akan mempelajari pola-pola kata (Wazan), Fi\'il Madhi, Mudhari\', Amar, Ism Fa\'il, Ism Maf\'ul, hingga pola Ism Makan & Zaman secara bertahap.',
    thumbnail_url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800',
    level: 'PEMULA',
    category: 'SHOROF',
    price: 199000,
    discount_price: 149000,
    instructor: {
      name: 'Ustadz Abdullah, Lc., M.A.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
      bio: 'Lulusan Universitas Islam Madinah, pengajar bahasa Arab profesional berpengalaman lebih dari 10 tahun.'
    },
    rating: 4.85,
    total_students: 940,
    status: 'PUBLISHED',
    created_at: '2026-01-05T00:00:00Z',
    updated_at: '2026-02-02T00:00:00Z'
  },
  {
    id: 'course-bundling-nahwu-shorof',
    title: 'Paket Bundling Komplit: Nahwu + Shorof dari Nol hingga Mahir',
    slug: 'bundling-nahwu-shorof',
    description: 'Hemat 30%! Dapatkan akses penuh ke seluruh kurikulum dasar Nahwu dan Shorof lengkap dengan modul latihan & lembar kerja PDF.',
    long_description: 'Paket terlengkap untuk Anda yang serius ingin menguasai bahasa Arab. Menggabungkan dua cabang ilmu utama (Kaidah Kalimat & Bentuk Kata) untuk bekal membaca kitab dan memahami Al-Qur\'an.',
    thumbnail_url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800',
    level: 'PEMULA',
    category: 'NAHWU',
    price: 349000,
    discount_price: 269000,
    instructor: {
      name: 'Ustadz Abdullah, Lc., M.A.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
      bio: 'Lulusan Universitas Islam Madinah, pengajar bahasa Arab profesional.'
    },
    rating: 4.95,
    total_students: 2150,
    status: 'PUBLISHED',
    created_at: '2026-01-10T00:00:00Z',
    updated_at: '2026-02-05T00:00:00Z'
  },
  {
    id: 'course-baca-kitab-fathul-qorib',
    title: 'Metode Praktis Membaca Kitab Gundul (Fathul Qorib)',
    slug: 'baca-kitab-fathul-qorib',
    description: 'Praktek langsung membaca teks Arab tanpa harakat. Analisis I\'rab dan kedudukan kata paragraf demi paragraf.',
    long_description: 'Setelah menguasai dasar Nahwu dan Shorof, saatnya mempraktekkannya pada teks kitab ulama klasik. Menggunakan Kitab Matan Abu Syuja\' / Fathul Qorib sebagai bahan latihan interaktif.',
    thumbnail_url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=800',
    level: 'MENENGAH',
    category: 'BACA_KITAB',
    price: 299000,
    discount_price: 229000,
    instructor: {
      name: 'Ustadz Salman Al-Farisi, Lc.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
      bio: 'Pakar Filologi & Bahasa Arab Klasik, pengasuh kajian Kitab Turats.'
    },
    rating: 4.9,
    total_students: 620,
    status: 'PUBLISHED',
    created_at: '2026-01-12T00:00:00Z',
    updated_at: '2026-02-06T00:00:00Z'
  },
  {
    id: 'course-alquran-comprehension',
    title: 'Bahasa Arab Al-Qur\'an & Tadabbur Kosakata Pilihan',
    slug: 'bahasa-arab-alquran',
    description: 'Memahami makna Al-Qur\'an secara mendalam melalui kosa kata kunci, struktur ayat, dan keindahan kebahasaan Al-Qur\'an.',
    long_description: 'Pelajari 80% kosakata Al-Qur\'an yang sering diulang beserta rahasia keindahan balaghah dalam susunan kalimat Ilahi. Menambah kekhusyukan saat membaca dan mendengarkan bacaan shalat.',
    thumbnail_url: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&q=80&w=800',
    level: 'MENENGAH',
    category: 'ALQURAN',
    price: 249000,
    discount_price: 189000,
    instructor: {
      name: 'Ustadz Dr. Muhammad Rizki',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250',
      bio: 'Doktor Studi Al-Qur\'an & Bahasa Arab, penulis buku Tafsir Lughawi.'
    },
    rating: 4.98,
    total_students: 1540,
    status: 'PUBLISHED',
    created_at: '2026-01-15T00:00:00Z',
    updated_at: '2026-02-08T00:00:00Z'
  }
];

export const INITIAL_MODULES: Module[] = [
  {
    id: 'mod-nahwu-1',
    course_id: 'course-nahwu-dasar',
    title: 'Modul 1: Pondasi Dasar Bahasa Arab & Pembagian Kata',
    description: 'Pengenalan elemen dasar kalimat Arab, membedakan Ism, Fi\'il, dan Harf.',
    order_index: 1
  },
  {
    id: 'mod-nahwu-2',
    course_id: 'course-nahwu-dasar',
    title: 'Modul 2: Struktur Kalimat Jumlah Ismiyyah (Mubtada\' & Khabar)',
    description: 'Memahami susunan subjek dan predikat dalam bahasa Arab serta kesesuaian sifat.',
    order_index: 2
  },
  {
    id: 'mod-shorof-1',
    course_id: 'course-shorof-dasar',
    title: 'Modul 1: Pengenalan Wazan (Pola Kata) & Tashrif Lughawi',
    description: 'Mengubah kata kerja berdasarkan kata ganti orang (Dhamir).',
    order_index: 1
  }
];

export const INITIAL_LESSONS: Lesson[] = [
  {
    id: 'les-nahwu-101',
    module_id: 'mod-nahwu-1',
    course_id: 'course-nahwu-dasar',
    title: 'Pengantar Ilmu Nahwu & Mengapa Penting Belajar Kaidah',
    description: 'Keutamaan ilmu Nahwu dalam memahami Al-Qur\'an dan struktur bahasa Arab.',
    youtube_video_id: 'dQw4w9WgXcQ',
    duration: '10:15',
    order_index: 1,
    is_preview: true,
    notes_markdown: '### Catatan Pelajaran\n- **Ilmu Nahwu**: Ilmu yang mempelajari perubahan akhir kata sesuai kedudukannya dalam kalimat.\n- **Tujuan Utama**: Menjaga lisan dari kesalahan membaca dan memahami Al-Qur\'an.',
    worksheet_filename: 'Lembar_Kerja_Nahwu_Bab1.pdf'
  },
  {
    id: 'les-nahwu-102',
    module_id: 'mod-nahwu-1',
    course_id: 'course-nahwu-dasar',
    title: 'Pembagian Kata dalam Bahasa Arab: Ism (Kata Benda)',
    description: 'Mengenal ciri-ciri Ism: Tanwin, Alif Lam, dan Harf Jar.',
    youtube_video_id: 'L9TjXpQ-tCY',
    duration: '14:20',
    order_index: 2,
    is_preview: true,
    notes_markdown: '### Ciri-ciri Ism (الاسم)\n1. Menerima Tanwin\n2. Menerima Alif Lam\n3. Terletak setelah Harf Jar',
    worksheet_filename: 'Latihan_Ciri_Ism.pdf'
  },
  {
    id: 'les-nahwu-103',
    module_id: 'mod-nahwu-1',
    course_id: 'course-nahwu-dasar',
    title: 'Pembagian Kata: Fi\'il (Kata Kerja Madhi, Mudhari\', Amar)',
    description: 'Memahami kata kerja lampau, sekarang/yang akan datang, dan kata perintah.',
    youtube_video_id: '6Pq-Rk9F0tA',
    duration: '16:45',
    order_index: 3,
    is_preview: false,
    notes_markdown: '### Jenis Fi\'il (الفعل)\n- Fi\'il Madhi (Lampau)\n- Fi\'il Mudhari\' (Sekarang)\n- Fi\'il Amar (Perintah)',
    worksheet_filename: 'Tabel_Fiil_Latihan.pdf'
  }
];

export const INITIAL_ENROLLMENTS: Enrollment[] = [
  {
    id: 'enr-1',
    user_id: 'user-student-1',
    course_id: 'course-nahwu-dasar',
    status: 'ACTIVE',
    enrolled_at: '2026-02-01T10:00:00Z'
  }
];

export const INITIAL_LESSON_PROGRESS: LessonProgress[] = [
  {
    id: 'prog-1',
    user_id: 'user-student-1',
    lesson_id: 'les-nahwu-101',
    course_id: 'course-nahwu-dasar',
    completed: true,
    completed_at: '2026-02-02T14:30:00Z'
  },
  {
    id: 'prog-2',
    user_id: 'user-student-1',
    lesson_id: 'les-nahwu-102',
    course_id: 'course-nahwu-dasar',
    completed: true,
    completed_at: '2026-02-03T16:15:00Z'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    order_number: 'INV/20260201/ARB/001',
    user_id: 'user-student-1',
    user_name: 'Ahmad Fauzi',
    user_email: 'ahmad@example.com',
    course_id: 'course-nahwu-dasar',
    course_title: 'Nahwu Fundamentals: Menguasai Struktur Kalimat Bahasa Arab',
    amount: 149000,
    payment_status: 'PAID',
    payment_method: 'QRIS',
    created_at: '2026-02-01T09:55:00Z',
    paid_at: '2026-02-01T10:00:00Z'
  }
];

export const LEARNING_PATH_LEVELS: LearningPathLevel[] = [
  {
    level: 1,
    title: 'Level 1 — Fondasi & Huruf Arab',
    subtitle: 'Pengenalan Bahasa & Tata Bunyi',
    description: 'Membangun pemahaman awal huruf Hijaiyah, tanda baca (Harakat), pembagian kata Ism, Fi\'il, dan Harf.',
    course_ids: ['course-nahwu-dasar'],
    icon: 'BookOpen'
  },
  {
    level: 2,
    title: 'Level 2 — Kaidah Nahwu Dasar',
    subtitle: 'Struktur Kalimat & I\'rab',
    description: 'Memahami Jumlah Ismiyyah (Mubtada-Khabar), Jumlah Fi\'liyyah (Fi\'il-Fa\'il-Maf\'ul), dan tanda I\'rab Marfu\', Manshub, Majrur.',
    course_ids: ['course-nahwu-dasar', 'course-bundling-nahwu-shorof'],
    icon: 'Layers'
  },
  {
    level: 3,
    title: 'Level 3 — Morfologi Kata (Shorof)',
    subtitle: 'Tashrif & Perubahan Bentuk Kata',
    description: 'Kuasai pola perubahan kata (Wazan), Fi\'il Madhi, Mudhari\', Amar, Ism Fa\'il, Maf\'ul, hingga Ism Makan & Zaman.',
    course_ids: ['course-shorof-dasar'],
    icon: 'GitMerge'
  },
  {
    level: 4,
    title: 'Level 4 — Baca Kitab Gundul',
    subtitle: 'Praktek Teks Klasik Tanpa Harakat',
    description: 'Menerapkan kaidah Nahwu dan Shorof pada teks kitab fiqih klasik (Fathul Qorib). Analisis posisi I\'rab per kata.',
    course_ids: ['course-baca-kitab-fathul-qorib'],
    icon: 'FileText'
  },
  {
    level: 5,
    title: 'Level 5 — Bahasa Arab Al-Qur\'an',
    subtitle: 'Tadabbur & Kebahasaan Kitab Suci',
    description: 'Memahami 80% kosakata Al-Qur\'an yang paling sering diulang serta mengapresiasi keindahan sastra balaghah Al-Qur\'an.',
    course_ids: ['course-alquran-comprehension'],
    icon: 'Award'
  }
];

// Interactive Quiz Questions (PRD §5 & §35 P1)
export const INITIAL_QUIZZES: QuizQuestion[] = [
  {
    id: 'quiz-1',
    lesson_id: 'les-nahwu-101',
    question_arabic: 'مَا هُوَ التَّعْرِيفُ الصَّحِيحُ لِلْعَلَمِ النَّحْوِيِّ؟',
    question_indo: 'Apakah tujuan utama mempelajari ilmu Nahwu?',
    options: [
      'Menjaga lisan dari kesalahan membaca & memahami kalimat Arab',
      'Menghafal kosakata tanpa memahami tata kalimat',
      'Mempelajari cara menulis kaligrafi Arab',
      'Mempelajari sejarah peradaban Islam'
    ],
    correct_index: 0,
    explanation: 'Ilmu Nahwu bertujuan utama menjaga lisan dari kesalahan membaca dan memahami struktur I\'rab kalimat bahasa Arab.'
  },
  {
    id: 'quiz-2',
    lesson_id: 'les-nahwu-102',
    question_arabic: 'أَيٌّ مِنَ العَلاَمَاتِ التَّالِيَةِ تُعْتَبَرُ مِنْ خَصَائِصِ الاسْمِ؟',
    question_indo: 'Manakah yang termasuk ciri khas kata Ism (الاسم)?',
    options: [
      'Menerima Tanwin dan diawali Alif Lam (الـ)',
      'Hanya muncul pada waktu lampau',
      'Terletak setelah huruf Qad (قَدْ)',
      'Selalu diakhiri dengan sukun'
    ],
    correct_index: 0,
    explanation: 'Salah satu ciri utama Ism adalah bisa menerima Tanwin (ـً ـٍ ـٌ) dan Alif Lam (الـ).'
  }
];

// Vocabulary Flashcards (PRD §5 & §35 P2)
export const INITIAL_VOCAB: VocabItem[] = [
  {
    id: 'v-1',
    course_id: 'course-nahwu-dasar',
    arabic: 'كِتَابٌ',
    transliteration: 'Kitābun',
    indo_meaning: 'Buku / Kitab',
    category: 'Ism (Kata Benda)',
    example_sentence: 'هَذَا كِتَابٌ جَدِيدٌ (Ini adalah buku baru)'
  },
  {
    id: 'v-2',
    course_id: 'course-nahwu-dasar',
    arabic: 'كَتَبَ',
    transliteration: 'Kataba',
    indo_meaning: 'Dia (laki-laki) telah menulis',
    category: 'Fi\'il Madhi (Kata Kerja)',
    example_sentence: 'كَتَبَ الطَّالِبُ الدَّرْسَ (Siswa itu telah menulis pelajaran)'
  },
  {
    id: 'v-3',
    course_id: 'course-nahwu-dasar',
    arabic: 'فِي',
    transliteration: 'Fī',
    indo_meaning: 'Di / Di dalam',
    category: 'Harf Jar (Kata Tugas)',
    example_sentence: 'القَلَمُ فِي الحَقِيبَةِ (Pena itu ada di dalam tas)'
  },
  {
    id: 'v-4',
    course_id: 'course-shorof-dasar',
    arabic: 'يَكْتُبُ',
    transliteration: 'Yaktubu',
    indo_meaning: 'Dia sedang / akan menulis',
    category: 'Fi\'il Mudhari\'',
    example_sentence: 'يَكْتُبُ زَيْدٌ الرِّسَالَةَ (Zaid sedang menulis surat)'
  }
];

// SEO Blog Articles (PRD §32 SEO Requirements: /blog and /blog/:slug)
export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'Panduan Belajar Bahasa Arab dari Nol untuk Pemula',
    slug: 'panduan-belajar-bahasa-arab-dari-nol',
    summary: 'Sering bingung harus mulai dari mana saat belajar bahasa Arab? Temukan 5 tahapan terstruktur dari Nahwu, Shorof hingga membaca kitab gundul.',
    content_markdown: `### Mengapa Banyak Orang Kesulitan Belajar Bahasa Arab?

Banyak pembelajar terjebak mempelajari materi secara acak dari YouTube tanpa alur yang jelas. Akibatnya, sulit membedakan kedudukan kata dan rumus I'rab.

#### 5 Langkah Terstruktur Menguasai Bahasa Arab:
1. **Pondasi Huruf & Pembagian Kata:** Kuasai Ism, Fi'il, dan Harf.
2. **Kaidah Nahwu Dasar:** Pelajari Mubtada', Khabar, Fa'il, dan Maf'ul.
3. **Morfologi Shorof:** Pahami pola perubahan kata (Wazan).
4. **Praktek Kitab Gundul:** Latihan analisis teks klasik tanpa harakat.
5. **Tadabbur Al-Qur'an:** Pahami 80% kosakata Al-Qur'an yang paling sering diulang.`,
    category: 'Panduan Belajar',
    author: 'Ustadz Abdullah, Lc., M.A.',
    read_time: '5 min baca',
    published_at: '2026-02-01T00:00:00Z',
    thumbnail_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'blog-2',
    title: 'Perbedaan Utama Ilmu Nahwu dan Ilmu Shorof',
    slug: 'perbedaan-ilmu-nahwu-dan-shorof',
    summary: 'Memahami fungsi dua pilar utama dalam tata bahasa Arab. Nahwu mengurus akhir kata, sedangkan Shorof mengurus bentuk internal kata.',
    content_markdown: `### Dua Pilar Utama Bahasa Arab

Bahasa Arab dibangun di atas dua fondasi utama: **Nahwu** dan **Shorof**.

- **Nahwu (النحو):** Mengkaji kedudukan kata dalam kalimat dan perubahan harakat akhir (I'rab).
- **Shorof (الصرف):** Mengkaji perubahan bentuk kata dasar menjadi berbagai bentuk turunan dengan makna yang bervariasi.`,
    category: 'Kaidah Bahasa',
    author: 'Ustadz Salman Al-Farisi, Lc.',
    read_time: '4 min baca',
    published_at: '2026-02-05T00:00:00Z',
    thumbnail_url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800'
  }
];

// Initial Lesson Comments (PRD §5 & §31)
export const INITIAL_LESSON_COMMENTS: LessonComment[] = [
  {
    id: 'comm-1',
    lesson_id: 'les-nahwu-101',
    user_id: 'user-student-1',
    user_name: 'Ahmad Fauzi',
    user_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    user_role: 'STUDENT',
    text: 'Ustadz, apakah harakat akhir Ism selalu dhommah jika berdiri sendiri?',
    created_at: '2026-02-02T15:00:00Z'
  },
  {
    id: 'comm-2',
    lesson_id: 'les-nahwu-101',
    user_id: 'user-admin-1',
    user_name: 'Ustadz Abdullah, Lc., M.A.',
    user_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    user_role: 'ADMIN',
    text: 'Na\'am mas Ahmad. Ism pada asalnya bernilai Marfu\' (dhommah) sebelum kemasukan faktor pengubah (Amil) seperti Harf Jar atau Inna.',
    created_at: '2026-02-02T16:20:00Z'
  }
];
