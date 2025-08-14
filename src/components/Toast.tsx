import React from 'react';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';
import { ToastContext } from '../contexts/ToastContext';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  React.useEffect(() => {
    if (isHovered) return; // pause auto-dismiss on hover
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose, isHovered]);
  
  const icons = {
    success: <CheckCircle data-testid="success-icon" className="text-green-500" size={20} />,
    error: <XCircle data-testid="error-icon" className="text-red-500" size={20} />,
    warning: <AlertCircle data-testid="warning-icon" className="text-amber-500" size={20} />,
    info: <Info data-testid="info-icon" className="text-blue-500" size={20} />,
  };
  
  const bgColors = {
    success: 'bg-green-50',
    error: 'bg-red-50',
    warning: 'bg-amber-50',
    info: 'bg-blue-50',
  };
  
  return (
    <div 
      className={`flex items-center p-4 mb-2 rounded-xl shadow-md ${bgColors[type]} border border-stone-100`}
      role="status"
      aria-live="polite"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="mr-3">{icons[type]}</div>
      <div className="flex-1 text-sm">{message}</div>
      <button 
        onClick={onClose} 
        className="ml-4 p-1 rounded-full hover:bg-stone-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
        aria-label="Close notification"
      >
        <XCircle size={16} />
      </button>
    </div>
  );
};

// Context lives in src/contexts/ToastContext.ts

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = React.useState<Toast[]>([]);
  
  const showToast = (message: string, type: ToastType) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prevToasts) => [...prevToasts, { id, message, type }]);
  };
  
  const closeToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };
  
  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 min-w-[280px] max-w-[320px]">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => closeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// Hook moved to src/hooks/useToast.ts to comply with react-refresh rules
