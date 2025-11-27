
import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';
import { Toast as ToastType } from '../types';

interface ToastProps {
  toast: ToastType;
  onRemove: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  const getIcon = () => {
    switch (toast.type) {
      case 'SUCCESS': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'ERROR': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'WARNING': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStyles = () => {
    switch (toast.type) {
      case 'SUCCESS': return 'border-green-500/50 bg-green-500/10 text-green-100';
      case 'ERROR': return 'border-red-500/50 bg-red-500/10 text-red-100';
      case 'WARNING': return 'border-amber-500/50 bg-amber-500/10 text-amber-100';
      default: return 'border-blue-500/50 bg-blue-500/10 text-blue-100';
    }
  };

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-md animate-in slide-in-from-top-2 fade-in duration-300 min-w-[300px] pointer-events-auto ${getStyles()}`}>
      {getIcon()}
      <p className="text-sm font-medium flex-1">{toast.message}</p>
      <button 
        onClick={() => onRemove(toast.id)}
        className="text-white/50 hover:text-white transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;
