import { Course, Module, Lesson, VocabItem, BlogPost, QuizQuestion, RAGContextItem } from '../types';
import { ARABIC_KNOWLEDGE_BASE } from '../data/arabicKnowledge';

interface KnowledgeData {
  courses: Course[];
  modules: Module[];
  lessons: Lesson[];
  vocabItems: VocabItem[];
  blogPosts: BlogPost[];
  quizzes?: QuizQuestion[];
}

/**
 * Clean & tokenize text for keyword vector matching
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s\u0600-\u06FF]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 1);
}

/**
 * Calculate keyword relevance score between a query and document text
 */
function calculateRelevanceScore(query: string, docText: string, extraKeywords: string[] = []): number {
  const queryTokens = tokenize(query);
  const docTokens = tokenize(docText);
  const docSet = new Set(docTokens);
  
  let score = 0;
  if (queryTokens.length === 0) return 0;

  for (const token of queryTokens) {
    if (docSet.has(token)) {
      score += 2;
    }
    // Partial substring match
    if (docText.toLowerCase().includes(token)) {
      score += 1;
    }
    // Extra keyword match bonus
    if (extraKeywords.some(k => k.toLowerCase().includes(token))) {
      score += 3;
    }
  }

  // Exact phrase match bonus
  if (docText.toLowerCase().includes(query.toLowerCase().trim())) {
    score += 5;
  }

  // Normalize score between 0 and 1
  const maxPossible = (queryTokens.length * 5) + 5;
  return Math.min(Math.round((score / maxPossible) * 100), 99);
}

/**
 * RAG Retrieval Engine: Indexes platform data & retrieves top relevant contexts
 */
export function retrieveRelevantContexts(query: string, data: KnowledgeData, limit: number = 4): RAGContextItem[] {
  const results: RAGContextItem[] = [];

  // 1. Index Grammar Rules
  for (const rule of ARABIC_KNOWLEDGE_BASE) {
    const textToMatch = `${rule.title} ${rule.arabicTitle} ${rule.summary} ${rule.content} ${rule.keywords.join(' ')}`;
    const score = calculateRelevanceScore(query, textToMatch, rule.keywords);
    if (score > 15) {
      results.push({
        id: rule.id,
        sourceType: 'GRAMMAR_RULE',
        title: `Kaidah: ${rule.title}`,
        snippet: rule.summary,
        fullContent: rule.content,
        relevanceScore: score,
        routeLink: {
          route: 'vocab'
        },
        metadata: {
          category: rule.category,
          arabicText: rule.arabicTitle
        }
      });
    }
  }

  // 2. Index Courses
  for (const course of data.courses) {
    const textToMatch = `${course.title} ${course.description} ${course.long_description || ''} ${course.category} ${course.level}`;
    const score = calculateRelevanceScore(query, textToMatch, [course.category, course.level]);
    if (score > 12) {
      results.push({
        id: course.id,
        sourceType: 'COURSE',
        title: `Kursus: ${course.title}`,
        snippet: course.description,
        fullContent: course.long_description || course.description,
        relevanceScore: score,
        routeLink: {
          route: 'course-detail',
          params: { courseId: course.id }
        },
        metadata: {
          category: course.category,
          level: course.level
        }
      });
    }
  }

  // 3. Index Lessons & Video Notes
  for (const lesson of data.lessons) {
    const course = data.courses.find(c => c.id === lesson.course_id);
    const courseTitle = course ? course.title : 'Kursus Bahasa Arab';
    const textToMatch = `${lesson.title} ${lesson.description} ${lesson.notes_markdown || ''}`;
    const score = calculateRelevanceScore(query, textToMatch);
    if (score > 15) {
      results.push({
        id: lesson.id,
        sourceType: 'LESSON',
        title: `Pelajaran: ${lesson.title} (${courseTitle})`,
        snippet: lesson.description,
        fullContent: lesson.notes_markdown || lesson.description,
        relevanceScore: score,
        routeLink: {
          route: 'learn',
          params: { courseId: lesson.course_id, lessonId: lesson.id }
        },
        metadata: {
          category: course?.category
        }
      });
    }
  }

  // 4. Index Vocabularies
  for (const vocab of data.vocabItems) {
    const textToMatch = `${vocab.arabic} ${vocab.transliteration} ${vocab.indo_meaning} ${vocab.category} ${vocab.example_sentence || ''}`;
    const score = calculateRelevanceScore(query, textToMatch, [vocab.category]);
    if (score > 20) {
      results.push({
        id: vocab.id,
        sourceType: 'VOCAB',
        title: `Mufradat: ${vocab.arabic} (${vocab.transliteration}) - ${vocab.indo_meaning}`,
        snippet: `Kategori: ${vocab.category}. Arti: ${vocab.indo_meaning}.${vocab.example_sentence ? ` Contoh: ${vocab.example_sentence}` : ''}`,
        fullContent: `Kata Arab: ${vocab.arabic} (${vocab.transliteration})\nKategori: ${vocab.category}\nArti: ${vocab.indo_meaning}\nContoh Kalimat: ${vocab.example_sentence || 'Tidak ada'}`,
        relevanceScore: score,
        routeLink: {
          route: 'vocab'
        },
        metadata: {
          arabicText: vocab.arabic,
          category: vocab.category
        }
      });
    }
  }

  // 5. Index Blog Posts
  for (const blog of data.blogPosts) {
    const textToMatch = `${blog.title} ${blog.summary} ${blog.content_markdown} ${blog.category}`;
    const score = calculateRelevanceScore(query, textToMatch, [blog.category]);
    if (score > 15) {
      results.push({
        id: blog.id,
        sourceType: 'BLOG',
        title: `Artikel: ${blog.title}`,
        snippet: blog.summary,
        fullContent: blog.content_markdown.substring(0, 300) + '...',
        relevanceScore: score,
        routeLink: {
          route: 'blog-detail',
          params: { blogSlug: blog.slug }
        },
        metadata: {
          category: blog.category
        }
      });
    }
  }

  // Sort by relevance score descending
  results.sort((a, b) => b.relevanceScore - a.relevanceScore);

  // If no high match, default to general reference grammar rule
  if (results.length === 0) {
    const fallbackRule = ARABIC_KNOWLEDGE_BASE[0];
    results.push({
      id: fallbackRule.id,
      sourceType: 'GRAMMAR_RULE',
      title: `Kaidah: ${fallbackRule.title}`,
      snippet: fallbackRule.summary,
      fullContent: fallbackRule.content,
      relevanceScore: 60,
      routeLink: { route: 'vocab' },
      metadata: { category: fallbackRule.category }
    });
  }

  return results.slice(0, limit);
}

/**
 * Generate Production AI Response using Gemini API
 */
export async function generateRAGResponse(
  userQuery: string,
  retrievedContexts: RAGContextItem[],
  customApiKey?: string
): Promise<{ text: string; citations: RAGContextItem[]; suggestedFollowups: string[] }> {
  
  const apiKey = customApiKey || (import.meta.env.VITE_GEMINI_API_KEY as string) || '';

  if (!apiKey || apiKey.trim() === '') {
    return {
      text: `⚠️ **Gemini API Key Belum Dikonfigurasi**

Untuk menggunakan fitur **Asisten AI Produksi**, harap masukkan Gemini API Key Anda:
1. Klik tombol **Set Gemini Key** di bagian atas halaman ini (atau ikon kunci di widget).
2. Atau tambahkan \`VITE_GEMINI_API_KEY=your_key_here\` di dalam file \`.env\` server/aplikasi Anda.

 API Key dapat diperoleh gratis melalui [Google AI Studio](https://aistudio.google.com/).`,
      citations: retrievedContexts,
      suggestedFollowups: [
        'Bagaimana cara mendapatkan Gemini API Key?',
        'Apa saja kaidah Nahwu dasar yang ada di platform ini?'
      ]
    };
  }

  // Prepare context text snippet for RAG
  const contextSnippetText = retrievedContexts.map((ctx, idx) => 
    `[Sumber ${idx + 1}] (${ctx.title})\nKonteks: ${ctx.fullContent || ctx.snippet}`
  ).join('\n\n');

  try {
    const prompt = `Anda adalah "Asisten AI Arabiyyah Learning Platform", tutor dan pengajar bahasa Arab profesional.
Tugas Anda adalah memberikan jawaban yang akurat, ramah, terstruktur, dan edukatif berdasarkan **Konteks RAG** yang diberikan di bawah ini.

Konteks Terkait dari Platform:
${contextSnippetText}

Pertanyaan Pengguna:
${userQuery}

Instruksi Format Jawaban:
1. Jawab langsung pertanyaan pengguna secara komprehensif.
2. Setiap kali menyebutkan kata atau kalimat Bahasa Arab, selalu berikan harakat lengkap.
3. Tuliskan analisis kedudukan kata (I'rab/Tashrif) atau penjelasan ringkas yang mudah dipahami santri.
4. Bila pertanyaan berupa rekomendasi materi, sebutkan nama kursus atau pelajaran secara spesifik berdasarkan konteks RAG.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey.trim()}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMsg = errorData.error?.message || response.statusText;
      return {
        text: `❌ **Gagal Memanggil Gemini API (${response.status})**

Pesan Kesalahan: ${errorMsg}

Mohon periksa kembali apakah Gemini API Key yang Anda masukkan valid dan memiliki kuota yang mencukupi.`,
        citations: retrievedContexts,
        suggestedFollowups: generateSuggestedFollowups(userQuery)
      };
    }

    const data = await response.json();
    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (aiText) {
      return {
        text: aiText,
        citations: retrievedContexts,
        suggestedFollowups: generateSuggestedFollowups(userQuery)
      };
    }

    return {
      text: 'Maaf, tidak ada respon teks yang dihasilkan oleh model AI.',
      citations: retrievedContexts,
      suggestedFollowups: generateSuggestedFollowups(userQuery)
    };

  } catch (err: any) {
    return {
      text: `❌ **Terjadi Kesalahan Koneksi AI**

Gagal terhubung ke layanan Google Gemini API: ${err?.message || 'Network error'}.
Pastikan koneksi internet Anda stabil.`,
      citations: retrievedContexts,
      suggestedFollowups: generateSuggestedFollowups(userQuery)
    };
  }
}

/**
 * Generate contextual follow-up prompt suggestions
 */
function generateSuggestedFollowups(query: string): string[] {
  const q = query.toLowerCase();
  if (q.includes('ism') || q.includes('fiil') || q.includes('harf') || q.includes('kata')) {
    return [
      'Apa saja ciri-ciri khusus Ism?',
      'Bagaimana cara membedakan Fi\'il Madhi dan Mudhari\'?',
      'Tampilkan contoh kalimat yang menggabungkan Ism, Fi\'il, dan Harf.'
    ];
  }
  if (q.includes('mubtada') || q.includes('khabar') || q.includes('ismiyyah')) {
    return [
      'Apa syarat-syarat Mubtada dalam kalimat?',
      'Apa perbedaan Jumlah Ismiyyah dan Jumlah Fi\'liyyah?',
      'Tunjukkan contoh I\'rab lengkap untuk Mubtada dan Khabar.'
    ];
  }
  if (q.includes('kursus') || q.includes('belajar') || q.includes('rekomendasi')) {
    return [
      'Rekomendasi urutan belajar untuk pemula dari nol',
      'Apa bedanya materi Nahwu dan Shorof?',
      'Berapa lama estimasi waktu belajar hingga bisa membaca kitab gundul?'
    ];
  }
  return [
    'Jelaskan tentang pembagian kata dalam bahasa Arab',
    'Apa perbedaan Nahwu dan Shorof?',
    'Tunjukkan kosakata favorit untuk aktivitas sehari-hari'
  ];
}
