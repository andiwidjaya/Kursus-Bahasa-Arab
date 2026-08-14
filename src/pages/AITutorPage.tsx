import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { ChatMessage, RAGContextItem } from '../types';
import { retrieveRelevantContexts, generateRAGResponse } from '../lib/ragEngine';
import { ARABIC_KNOWLEDGE_BASE } from '../data/arabicKnowledge';
import { 
  Sparkles, Send, Bot, User, BookOpen, ExternalLink, Key, RefreshCw, 
  CheckCircle2, HelpCircle, Layers, FileText, Bookmark, Lightbulb, Trash2, ArrowRight
} from 'lucide-react';

export const AITutorPage: React.FC = () => {
  const { 
    courses, modules, lessons, vocabItems, blogPosts, quizzes, 
    navigateTo, showToast 
  } = useApp();

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('arabiyyah_ai_chat_history');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [
      {
        id: 'msg-welcome',
        sender: 'ai',
        text: `السَّلاَمُ عَلَيْكُمْ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ! 👋

Selamat datang di **Asisten AI Arabiyyah**! Saya didukung oleh **Sistem RAG (Retrieval-Augmented Generation)** yang langsung mengindeks seluruh materi kursus, modul video, kosakata (mufradat), kuis, dan artikel blog di platform ini.

Silakan ajukan pertanyaan seputar tata bahasa Arab (Nahwu & Shorof), analisis I'rab, mufradat, atau rekomendasi kursus yang tepat untuk Anda!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedFollowups: [
          'Apa perbedaan antara Ism, Fi\'il, dan Harf?',
          'Jelaskan tentang aturan Mubtada dan Khabar',
          'Rekomendasikan kursus Nahwu untuk pemula'
        ]
      }
    ];
  });

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTopic, setActiveTopic] = useState<'ALL' | 'NAHWU' | 'VOCAB' | 'COURSES' | 'BLOG'>('ALL');
  const [customApiKey, setCustomApiKey] = useState<string>(() => localStorage.getItem('arabiyyah_gemini_api_key') || '');
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Save chat history
  useEffect(() => {
    localStorage.setItem('arabiyyah_ai_chat_history', JSON.stringify(chatMessages));
  }, [chatMessages]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isLoading]);

  const handleSendMessage = async (queryText?: string) => {
    const query = queryText || inputQuery;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    if (!queryText) setInputQuery('');
    setIsLoading(true);

    try {
      // 1. RAG Retrieval Phase
      const retrievedContexts = retrieveRelevantContexts(
        query,
        { courses, modules, lessons, vocabItems, blogPosts, quizzes },
        5
      );

      // Filter contexts by topic if active
      let filteredContexts = retrievedContexts;
      if (activeTopic === 'NAHWU') {
        filteredContexts = retrievedContexts.filter(c => c.sourceType === 'GRAMMAR_RULE' || c.metadata?.category === 'NAHWU' || c.metadata?.category === 'SHOROF');
      } else if (activeTopic === 'VOCAB') {
        filteredContexts = retrievedContexts.filter(c => c.sourceType === 'VOCAB');
      } else if (activeTopic === 'COURSES') {
        filteredContexts = retrievedContexts.filter(c => c.sourceType === 'COURSE' || c.sourceType === 'LESSON');
      } else if (activeTopic === 'BLOG') {
        filteredContexts = retrievedContexts.filter(c => c.sourceType === 'BLOG');
      }

      if (filteredContexts.length === 0) filteredContexts = retrievedContexts;

      // 2. Generation Phase (Gemini API or Smart Local RAG Fallback)
      const aiResponse = await generateRAGResponse(query, filteredContexts, customApiKey);

      const aiMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: aiResponse.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: aiResponse.citations,
        suggestedFollowups: aiResponse.suggestedFollowups
      };

      setChatMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      showToast('Gagal memproses pertanyaan AI', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus seluruh riwayat percakapan AI?')) {
      setChatMessages([
        {
          id: 'msg-welcome-reset',
          sender: 'ai',
          text: 'Riwayat percakapan telah dibersihkan. Silakan ajukan pertanyaan baru!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedFollowups: [
            'Apa perbedaan antara Ism, Fi\'il, dan Harf?',
            'Jelaskan bab Tashrif dalam Shorof',
            'Bagaimana tips membaca kitab gundul?'
          ]
        }
      ]);
      localStorage.removeItem('arabiyyah_ai_chat_history');
      showToast('Riwayat chat berhasil dihapus', 'info');
    }
  };

  const handleSaveApiKey = (key: string) => {
    setCustomApiKey(key);
    if (key.trim()) {
      localStorage.setItem('arabiyyah_gemini_api_key', key.trim());
      showToast('Gemini API Key berhasil disimpan!', 'success');
    } else {
      localStorage.removeItem('arabiyyah_gemini_api_key');
      showToast('Menggunakan mode Local Smart RAG Fallback', 'info');
    }
    setIsApiKeyModalOpen(false);
  };

  const getSourceBadgeColor = (type: string) => {
    switch (type) {
      case 'GRAMMAR_RULE': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'COURSE': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'LESSON': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'VOCAB': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'BLOG': return 'bg-rose-100 text-rose-800 border-rose-300';
      default: return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  const getSourceLabel = (type: string) => {
    switch (type) {
      case 'GRAMMAR_RULE': return 'Kaidah Nahwu';
      case 'COURSE': return 'Kursus';
      case 'LESSON': return 'Video Pelajaran';
      case 'VOCAB': return 'Kamus Mufradat';
      case 'BLOG': return 'Artikel Blog';
      default: return 'Dokumen';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header & Stats Banner */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-semibold tracking-wide uppercase mb-2">
                <Sparkles className="w-3.5 h-3.5" /> RAG Knowledge Engine Active
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                Asisten AI Arabiyyah
                <span className="text-sm font-normal px-2.5 py-0.5 rounded-md bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  Tutor RAG v1.0
                </span>
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Tanya jawab tata bahasa Arab, mufradat, dan materi kursus dengan rujukan otomatis (*retrieved context*).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsApiKeyModalOpen(true)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
              >
                <Key className="w-4 h-4 text-amber-400" />
                {customApiKey ? 'API Key Set' : 'Set Gemini Key'}
              </button>

              <button
                onClick={handleClearHistory}
                className="p-2 rounded-xl bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 border border-slate-700 transition"
                title="Hapus Riwayat Chat"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* RAG Knowledge Index Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-6 pt-4 border-t border-slate-800/80 text-xs">
            <div className="bg-slate-800/60 rounded-lg p-2.5 border border-slate-800 text-center">
              <span className="text-emerald-400 font-bold text-base block">{ARABIC_KNOWLEDGE_BASE.length}</span>
              <span className="text-slate-400">Kaidah Nahwu</span>
            </div>
            <div className="bg-slate-800/60 rounded-lg p-2.5 border border-slate-800 text-center">
              <span className="text-blue-400 font-bold text-base block">{courses.length}</span>
              <span className="text-slate-400">Kursus Terindeks</span>
            </div>
            <div className="bg-slate-800/60 rounded-lg p-2.5 border border-slate-800 text-center">
              <span className="text-purple-400 font-bold text-base block">{lessons.length}</span>
              <span className="text-slate-400">Video Pelajaran</span>
            </div>
            <div className="bg-slate-800/60 rounded-lg p-2.5 border border-slate-800 text-center">
              <span className="text-amber-400 font-bold text-base block">{vocabItems.length}</span>
              <span className="text-slate-400">Mufradat</span>
            </div>
            <div className="bg-slate-800/60 rounded-lg p-2.5 border border-slate-800 text-center col-span-2 sm:col-span-1">
              <span className="text-rose-400 font-bold text-base block">{blogPosts.length}</span>
              <span className="text-slate-400">Artikel Blog</span>
            </div>
          </div>
        </div>

        {/* Topic Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1">Fokus Topik:</span>
          {[
            { key: 'ALL', label: 'Seluruh Materi' },
            { key: 'NAHWU', label: 'Nahwu & Shorof' },
            { key: 'VOCAB', label: 'Mufradat / Kamus' },
            { key: 'COURSES', label: 'Katalog Kursus' },
            { key: 'BLOG', label: 'Artikel Blog' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTopic(tab.key as any)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                activeTopic === tab.key
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Chat Box */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl flex flex-col h-[600px] shadow-2xl overflow-hidden">
          
          {/* Chat Messages List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {chatMessages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-3 sm:gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
                  msg.sender === 'user'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gradient-to-br from-teal-500 to-emerald-700 text-white border border-emerald-400/30'
                }`}>
                  {msg.sender === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>

                {/* Content Bubble */}
                <div className={`max-w-[85%] sm:max-w-[80%] space-y-3 ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}>
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-tr-none'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-lg'
                  }`}>
                    {/* Render Formatted Text */}
                    <div className="whitespace-pre-wrap space-y-2">
                      {msg.text.split('\n').map((line, idx) => {
                        // Highlight Arabic text blocks
                        if (/[\u0600-\u06FF]/.test(line)) {
                          return (
                            <p key={idx} className="font-arabic text-lg leading-loose text-emerald-300 bg-slate-950/60 p-2 rounded-lg border border-emerald-500/20 my-1">
                              {line}
                            </p>
                          );
                        }
                        if (line.startsWith('###')) {
                          return <h4 key={idx} className="font-bold text-emerald-400 text-base mt-2">{line.replace('###', '')}</h4>;
                        }
                        if (line.startsWith('* ') || line.startsWith('- ')) {
                          return <li key={idx} className="ml-4 list-disc text-slate-300">{line.replace(/^[\*\-]\s*/, '')}</li>;
                        }
                        return <p key={idx}>{line}</p>;
                      })}
                    </div>

                    <div className={`text-[10px] mt-2 text-right ${
                      msg.sender === 'user' ? 'text-emerald-200' : 'text-slate-500'
                    }`}>
                      {msg.timestamp}
                    </div>
                  </div>

                  {/* RAG Source Citation Cards (If AI message has citations) */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 space-y-2 mt-2">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                        <Bookmark className="w-3.5 h-3.5" />
                        Sitasi Sumber Acuan (RAG Context)
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {msg.citations.map((citation, cIdx) => (
                          <div
                            key={cIdx}
                            className="bg-slate-950 border border-slate-800 hover:border-emerald-500/50 rounded-lg p-2.5 text-xs transition group"
                          >
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getSourceBadgeColor(citation.sourceType)}`}>
                                {getSourceLabel(citation.sourceType)}
                              </span>
                              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded">
                                {citation.relevanceScore}% Relevan
                              </span>
                            </div>

                            <p className="font-semibold text-slate-200 line-clamp-1 group-hover:text-emerald-400 transition">
                              {citation.title}
                            </p>
                            <p className="text-slate-400 text-[11px] line-clamp-2 mt-1">
                              {citation.snippet}
                            </p>

                            <button
                              onClick={() => navigateTo(citation.routeLink.route, citation.routeLink.params)}
                              className="mt-2 text-[11px] font-medium text-teal-400 hover:text-teal-300 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                            >
                              Buka Sumber Materi <ExternalLink className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Suggested Follow-up Prompts */}
                  {msg.suggestedFollowups && msg.suggestedFollowups.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.suggestedFollowups.map((prompt, pIdx) => (
                        <button
                          key={pIdx}
                          onClick={() => handleSendMessage(prompt)}
                          className="text-xs bg-slate-900 hover:bg-emerald-950/80 text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 rounded-lg px-2.5 py-1 transition flex items-center gap-1"
                        >
                          <Lightbulb className="w-3 h-3 text-amber-400" />
                          {prompt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-3 items-start">
                <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 animate-pulse">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-none p-4 text-xs text-slate-400 flex items-center gap-3">
                  <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin" />
                  <span>Mencari rujukan RAG & menyintesis jawaban AI...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Preset Questions Bar */}
          <div className="bg-slate-900/60 border-t border-slate-800 px-4 py-2 flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
            <span className="text-slate-500 whitespace-nowrap font-medium">Contoh:</span>
            {[
              'Apa bedanya Ism, Fi\'il, dan Harf?',
              'Jelaskan tentang Mubtada dan Khabar',
              'Apa saja wazan Fi\'il Madhi?',
              'Tips membaca kitab gundul Fathul Qorib'
            ].map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md px-2.5 py-1 whitespace-nowrap border border-slate-700 transition"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <div className="p-4 bg-slate-900 border-t border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ketik pertanyaan Bahasa Arab, Nahwu, Shorof, atau cari materi kursus..."
                disabled={isLoading}
                className="flex-1 bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition"
              />
              <button
                type="submit"
                disabled={isLoading || !inputQuery.trim()}
                className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl px-5 py-3 text-sm transition flex items-center gap-2 shadow-lg shadow-emerald-500/20 shrink-0"
              >
                <span>Kirim</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

      </div>

      {/* API Key Modal */}
      {isApiKeyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-amber-400">
              <Key className="w-6 h-6" />
              <h3 className="text-lg font-bold text-white">Konfigurasi Gemini API Key</h3>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed">
              Anda dapat memasukkan **Google Gemini API Key** Anda sendiri untuk menghasilkan respon AI generatif online secara langsung.
              Jika dikosongkan, aplikasi akan secara otomatis menggunakan **Smart Local RAG Synthesizer Engine** (offline/fallback mode).
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Gemini API Key:
              </label>
              <input
                type="password"
                value={customApiKey}
                onChange={(e) => setCustomApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsApiKeyModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Batal
              </button>
              <button
                onClick={() => handleSaveApiKey(customApiKey)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold"
              >
                Simpan Key
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
