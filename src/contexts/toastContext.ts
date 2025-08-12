import { createContext } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

export interface ToastContextType {
  toasts: ToastMessage[];
  addToast: (message: string, type: ToastType) => void;
  removeToast: (id: string) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);
