import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

const ToastContext = createContext(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return { showToast: (message, type = 'success') => {} };
  }
  return ctx;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-20 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const ToastItem = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const typeStyles = {
    success: 'bg-[#2A9D8F] text-white',
    error: 'bg-[#E76F51] text-white',
    warning: 'bg-[#E9C46A] text-[#1F2937]',
    info: 'bg-[#1F2937] text-white',
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5 shrink-0" />,
    error: <XCircle className="w-5 h-5 shrink-0" />,
    warning: <XCircle className="w-5 h-5 shrink-0" />,
    info: <CheckCircle className="w-5 h-5 shrink-0" />,
  };

  return (
    <div
      className={`pointer-events-auto flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl font-bold text-sm animate-slide-in-right ${typeStyles[toast.type] || typeStyles.success}`}
      style={{ minWidth: 280, maxWidth: 420 }}
    >
      {icons[toast.type] || icons.success}
      <span className="flex-1">{toast.message}</span>
      <button onClick={onClose} className="opacity-70 hover:opacity-100 transition-opacity">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
