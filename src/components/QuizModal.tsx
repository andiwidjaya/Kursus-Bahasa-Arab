import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { HelpCircle, CheckCircle2, XCircle, Award, RotateCcw, ArrowRight, X } from 'lucide-react';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  quizzes: QuizQuestion[];
  lessonTitle: string;
  onCompleteQuiz?: (score: number) => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  isOpen,
  onClose,
  quizzes,
  lessonTitle,
  onCompleteQuiz
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  if (!isOpen) return null;

  if (!quizzes || quizzes.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-2xl">
          <HelpCircle className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-xl font-bold text-white">Kuis Belum Tersedia</h3>
          <p className="text-sm text-slate-400">Belum ada latihan kuis yang terdaftar untuk pelajaran ini.</p>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold"
          >
            Tutup
          </button>
        </div>
      </div>
    );
  }

  const currentQuiz = quizzes[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (isSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    setIsSubmitted(true);
    if (selectedOption === currentQuiz.correct_index) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < quizzes.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      setIsFinished(true);
      if (onCompleteQuiz) {
        onCompleteQuiz(score + (selectedOption === currentQuiz.correct_index ? 1 : 0));
      }
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScore(0);
    setIsFinished(false);
  };

  const finalScorePercent = Math.round((score / quizzes.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 relative overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1 pr-8">
          <span className="px-3 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
            Kuis & Uji Pemahaman
          </span>
          <h2 className="text-xl font-bold text-white">{lessonTitle}</h2>
        </div>

        {!isFinished ? (
          <div className="space-y-6">
            
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-400 font-semibold">
                <span>Soal {currentIndex + 1} dari {quizzes.length}</span>
                <span>Skor Sementara: {score} Poin</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                <div
                  className="bg-emerald-500 h-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / quizzes.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Text */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              {currentQuiz.question_arabic && (
                <p className="font-arabic text-2xl sm:text-3xl font-bold text-amber-300 text-right leading-relaxed">
                  {currentQuiz.question_arabic}
                </p>
              )}
              <p className="text-base font-semibold text-slate-100">
                {currentQuiz.question_indo}
              </p>
            </div>

            {/* Options List */}
            <div className="space-y-3">
              {currentQuiz.options.map((opt, idx) => {
                let btnStyle = "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/50";
                
                if (selectedOption === idx) {
                  btnStyle = "bg-emerald-500/10 border-emerald-500 text-emerald-300 font-semibold";
                }

                if (isSubmitted) {
                  if (idx === currentQuiz.correct_index) {
                    btnStyle = "bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold";
                  } else if (selectedOption === idx) {
                    btnStyle = "bg-rose-500/20 border-rose-500 text-rose-300 font-semibold";
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isSubmitted}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-4 rounded-2xl border text-sm transition-all flex items-center justify-between gap-3 ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {isSubmitted && idx === currentQuiz.correct_index && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    )}
                    {isSubmitted && selectedOption === idx && idx !== currentQuiz.correct_index && (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation box after submission */}
            {isSubmitted && (
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-200 space-y-1 animate-in fade-in">
                <p className="font-bold text-emerald-400">💡 Penjelasan:</p>
                <p className="leading-relaxed">{currentQuiz.explanation}</p>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 pt-2">
              {!isSubmitted ? (
                <button
                  disabled={selectedOption === null}
                  onClick={handleSubmitAnswer}
                  className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold text-sm transition-all shadow-md"
                >
                  Jawab & Periksa
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center gap-2 transition-all shadow-md"
                >
                  {currentIndex < quizzes.length - 1 ? 'Soal Selanjutnya' : 'Lihat Hasil Akhir'} <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>
        ) : (
          /* Quiz Results View */
          <div className="text-center py-6 space-y-6 animate-in zoom-in-95">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/30">
              <Award className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white">Kuis Selesai!</h3>
              <p className="text-slate-400 text-sm">
                Anda telah menyelesaikan kuis pemahaman untuk <span className="text-emerald-400 font-semibold">{lessonTitle}</span>.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 max-w-sm mx-auto space-y-2">
              <p className="text-xs uppercase text-slate-500 font-semibold tracking-wider">Nilai Akhir Anda</p>
              <p className="text-5xl font-black text-amber-400">{finalScorePercent}%</p>
              <p className="text-xs text-slate-400 font-medium">
                {score} dari {quizzes.length} soal dijawab dengan benar
              </p>
            </div>

            <div className="flex items-center justify-center gap-4 pt-4">
              <button
                onClick={handleReset}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Ulangi Kuis
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-md"
              >
                Lanjutkan Belajar
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
