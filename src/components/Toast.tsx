import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full px-4 pointer-events-none">
      {toasts.map(toast => {
        const getIcon = () => {
          switch (toast.type) {
            case 'success': return <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;
            case 'warning': return <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />;
            case 'error': return <XCircle className="w-5 h-5 text-rose-500 shrink-0" />;
            default: return <Info className="w-5 h-5 text-sky-500 shrink-0" />;
          }
        };

        const getBorderColor = () => {
          switch (toast.type) {
            case 'success': return 'border-emerald-200 bg-emerald-50/95 text-emerald-900';
            case 'warning': return 'border-amber-200 bg-amber-50/95 text-amber-900';
            case 'error': return 'border-rose-200 bg-rose-50/95 text-rose-900';
            default: return 'border-sky-200 bg-sky-50/95 text-sky-900';
          }
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-md transition-all duration-300 transform translate-y-0 animate-in fade-in slide-in-from-bottom-5 ${getBorderColor()}`}
          >
            {getIcon()}
            <p className="text-sm font-medium leading-snug flex-1">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 transition-colors p-1"
              aria-label="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
