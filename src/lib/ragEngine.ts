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
          route: 'vocab' // or general reference
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

  // If no high match, fallback to top general grammar rules & beginner courses
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
 * Generate AI Response using Gemini API or Smart Fallback RAG Synthesizer
 */
export async function generateRAGResponse(
  userQuery: string,
  retrievedContexts: RAGContextItem[],
  customApiKey?: string
): Promise<{ text: string; citations: RAGContextItem[]; suggestedFollowups: string[] }> {
  
  const apiKey = customApiKey || (import.meta.env.VITE_GEMINI_API_KEY as string) || '';

  // Prepare context text snippet
  const contextSnippetText = retrievedContexts.map((ctx, idx) => 
    `[Sumber ${idx + 1}] (${ctx.title})\nKonteks: ${ctx.fullContent || ctx.snippet}`
  ).join('\n\n');

  // Try calling Gemini API if API key is provided
  if (apiKey && apiKey.trim() !== '') {
    try {
      const prompt = `Anda adalah "Asisten AI Arabiyyah Learning Platform", tutor bahasa Arab cerdas dan ramah.
Jawablah pertanyaan berikut berdasarkan **Konteks RAG** yang diberikan di bawah ini.
Jika teks konteks memberikan informasi yang relevan, sertakan penjelasan yang jelas, ramah, dan berikan contoh kalimat bahasa Arab lengkap dengan harakat.
Jika pertanyaan adalah tentang rekomendasi kursus, sebutkan nama kursus secara spesifik.

Konteks Terkait dari Platform:
${contextSnippetText}

Pertanyaan Pengguna:
${userQuery}

Tuliskan jawaban yang terstruktur rapi dengan poin-poin utama, penyorotan teks Arab, serta penjelasan bahasa Indonesia yang mudah dipahami.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (aiText) {
          return {
            text: aiText,
            citations: retrievedContexts,
            suggestedFollowups: generateSuggestedFollowups(userQuery)
          };
        }
      }
    } catch (err) {
      console.warn('Gemini API call failed, switching to Smart Local RAG Synthesizer:', err);
    }
  }

  // Fallback: Smart Local RAG Response Synthesizer
  const fallbackResponse = synthesizeLocalRAGResponse(userQuery, retrievedContexts);
  return {
    text: fallbackResponse,
    citations: retrievedContexts,
    suggestedFollowups: generateSuggestedFollowups(userQuery)
  };
}

/**
 * Smart Local RAG Synthesizer when offline or API key isn't configured
 */
function synthesizeLocalRAGResponse(query: string, contexts: RAGContextItem[]): string {
  const qLower = query.toLowerCase();

  let intro = `Berdasarkan basis pengetahuan **Arabiyyah Learning Platform** (RAG Retrieval), berikut penjelasan lengkap untuk pertanyaan Anda:`;

  if (contexts.length === 0) {
    return `Bahasa Arab adalah bahasa yang kaya akan kaidah tata bahasa (Nahwu & Shorof). 
Untuk pertanyaan "${query}", kami merekomendasikan Anda untuk memulai dari modul dasar Nahwu Fundamentals atau mempelajari daftar Mufradat di platform kami.`;
  }

  const primaryContext = contexts[0];
  let mainBody = ``;

  if (primaryContext.sourceType === 'GRAMMAR_RULE') {
    mainBody = `### 📌 Kaidah & Konsep Utama
${primaryContext.fullContent || primaryContext.snippet}

> **Tips Belajar:** Kuasai materi ini sebelum melangkah ke analisis I'rab kalimat yang lebih kompleks!`;
  } else if (primaryContext.sourceType === 'COURSE') {
    mainBody = `### 📚 Rekomendasi Kursus Terkait
Kami menemukan kursus yang sangat relevan dengan pertanyaan Anda:
**${primaryContext.title}**

*Deskripsi:* ${primaryContext.snippet}
*Tingkat:* ${primaryContext.metadata?.level || 'Pemula'}
*Kategori:* ${primaryContext.metadata?.category || 'Umum'}

Anda dapat langsung mengambil kursus ini untuk mempelajari topik ini secara terstruktur dengan video & kuis interaktif.`;
  } else if (primaryContext.sourceType === 'VOCAB') {
    mainBody = `### 📖 Kosakata & Mufradat Terkait
${primaryContext.snippet}

Bahasa Arab sangat mengandalkan pembentukan akar kata. Pastikan Anda melatih pengucapan dan menghafal bentuk mufrod & jamak dari kosakata tersebut!`;
  } else if (primaryContext.sourceType === 'LESSON') {
    mainBody = `### 🎬 Pelajaran Terkait dalam Kursus
Materi ini dibahas secara detail dalam video **${primaryContext.title}**.

*Rangkuman Pelajaran:*
${primaryContext.snippet}`;
  } else {
    mainBody = `### 📝 Referensi Terkait
**${primaryContext.title}**
${primaryContext.snippet}`;
  }

  // Combine top contexts summary
  let additionalContextsSummary = '';
  if (contexts.length > 1) {
    additionalContextsSummary = `\n\n### 🔗 Sumber Rujukan Tambahan:\n` + 
      contexts.slice(1).map((c, i) => `${i + 2}. **${c.title}** — ${c.snippet.substring(0, 100)}...`).join('\n');
  }

  return `${intro}\n\n${mainBody}${additionalContextsSummary}\n\n---
*💡 Catatan RAG: Anda dapat mengklik kartu sitasi di bawah ini untuk membuka halaman materi atau kursus terkait secara langsung.*`;
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
