import React from 'react';
import { Course, User } from '../types';
import { Award, X, Download, CheckCircle2, Printer } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CertificateModalProps {
  course: Course;
  user: User;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ course, user, onClose }) => {
  React.useEffect(() => {
    // Trigger confetti upon completion certificate view!
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log('Confetti effect trigger', e);
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in print:p-0 print:bg-white print:static">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-amber-200/80 animate-in zoom-in-95 print:shadow-none print:border-none print:max-w-none">
        
        {/* Close button (Hidden during print) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors print:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Frame */}
        <div className="p-8 sm:p-12 text-center relative border-8 border-amber-100 m-3 rounded-2xl bg-gradient-to-b from-amber-50/50 via-white to-amber-50/30">
          
          {/* Header Badge */}
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500/10 border-2 border-amber-400 flex items-center justify-center text-amber-600 shadow-inner">
            <Award className="w-9 h-9" />
          </div>

          <p className="font-arabic text-amber-600 text-2xl font-bold mb-1">شهادة إتمام</p>
          <h2 className="text-xs font-bold text-amber-700 tracking-widest uppercase mb-6">
            SERTIFIKAT KELULUSAN KURSUS
          </h2>

          <p className="text-xs text-slate-500 italic mb-2">Diberikan kepada:</p>
          <h3 className="text-2xl font-black text-slate-900 underline decoration-amber-400 decoration-2 underline-offset-8 mb-6">
            {user.name}
          </h3>

          <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed mb-6">
            Telah menyelesaikan seluruh modul dan kurikulum pembelajaran terstruktur pada kursus:
          </p>

          <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-sm max-w-md mx-auto mb-6">
            <h4 className="font-bold text-slate-900 text-sm mb-1">{course.title}</h4>
            <span className="text-[11px] font-semibold text-emerald-600 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% Pembelajaran Terverifikasi
            </span>
          </div>

          <div className="flex justify-between items-end text-left text-[11px] text-slate-500 border-t border-slate-200 pt-6 max-w-md mx-auto">
            <div>
              <p className="font-semibold text-slate-800">{course.instructor.name}</p>
              <p className="text-[10px]">Instruktur Utama LMS</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-slate-800">Arabiyyah Platform</p>
              <p className="text-[10px]">{new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>

        </div>

        {/* Action Controls (Hidden during print) */}
        <div className="p-4 bg-slate-900 flex flex-wrap justify-between items-center px-8 gap-3 print:hidden">
          <span className="text-xs text-slate-400 font-medium">ID Sertifikat: ARB-CERT-{Math.floor(100000 + Math.random() * 900000)}</span>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors flex items-center gap-1.5 shadow"
            >
              <Printer className="w-4 h-4" /> Cetak / Unduh PDF
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
