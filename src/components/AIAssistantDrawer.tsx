import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Bot, X, Send, ExternalLink, Bookmark } from 'lucide-react';
import { retrieveRelevantContexts, generateRAGResponse } from '../lib/ragEngine';
import { ChatMessage, RAGContextItem } from '../types';

export const AIAssistantDrawer: React.FC = () => {
  const { 
    courses, modules, lessons, vocabItems, blogPosts, quizzes, 
    navigateTo, currentRoute 
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'drawer-init',
      sender: 'ai',
      text: 'مَرْحَبًا! Ada yang ingin Anda tanyakan seputar Nahwu, Shorof, atau materi di platform ini?',
      timestamp: ''
    }
  ]);

  // Don't show floating drawer if already on full AI tutor page
  if (currentRoute === 'ai-tutor') return null;

  const handleSend = async () => {
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `drawer-user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    const currentQ = query;
    setQuery('');
    setIsLoading(true);

    try {
      const contexts = retrieveRelevantContexts(
        currentQ,
        { courses, modules, lessons, vocabItems, blogPosts, quizzes },
        3
      );

      const apiKey = localStorage.getItem('arabiyyah_gemini_api_key') || '';
      const response = await generateRAGResponse(currentQ, contexts, apiKey);

      const aiMsg: ChatMessage = {
        id: `drawer-ai-${Date.now()}`,
        sender: 'ai',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: response.citations
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (e) {
      setMessages(prev => [...prev, {
        id: `err-${Date.now()}`,
        sender: 'ai',
        text: 'Maaf, terjadi kendala saat memproses pertanyaan RAG.',
        timestamp: ''
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold px-4 py-3 rounded-full shadow-2xl flex items-center gap-2.5 transition transform hover:scale-105 border border-emerald-300/40 group"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-slate-950" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full animate-ping" />
          </div>
          <span className="text-xs sm:text-sm tracking-tight font-extrabold">Tanya Asisten AI</span>
        </button>
      )}

      {/* Floating Chat Drawer Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm sm:max-w-md bg-slate-950 border border-emerald-500/30 rounded-2xl shadow-2xl flex flex-col h-[520px] overflow-hidden text-slate-100">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 to-emerald-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  Asisten AI Arabiyyah
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </h4>
                <p className="text-[10px] text-emerald-400">RAG Engine Ready</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigateTo('ai-tutor');
                }}
                className="p-1.5 text-slate-400 hover:text-emerald-300 text-[11px] font-semibold flex items-center gap-1 hover:bg-slate-800 rounded-lg transition"
                title="Buka Halaman Penuh AI"
              >
                Full Mode <ExternalLink className="w-3 h-3" />
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 text-xs">
            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-xl max-w-[85%] leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-emerald-600 text-white rounded-tr-none'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  
                  {/* Citations snippet */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-slate-800 text-[10px] space-y-1">
                      <div className="text-emerald-400 font-semibold flex items-center gap-1">
                        <Bookmark className="w-3 h-3" /> Rujukan RAG ({msg.citations.length})
                      </div>
                      {msg.citations.map((c, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setIsOpen(false);
                            navigateTo(c.routeLink.route, c.routeLink.params);
                          }}
                          className="block text-left text-teal-300 hover:underline truncate w-full"
                        >
                          • {c.title} ({c.relevanceScore}%)
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="text-slate-400 text-[11px] italic flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                Mencari RAG context & menyusun jawaban...
              </div>
            )}
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-slate-900 border-t border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tanya soal Nahwu, Shorof..."
                disabled={isLoading}
                className="flex-1 bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={isLoading || !query.trim()}
                className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 p-2 rounded-lg transition"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>
      )}
    </>
  );
};
