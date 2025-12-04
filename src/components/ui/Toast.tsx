/**
 * Toast 组件 - 通知提示
 *
 * 特点：
 * - 自动消失
 * - 多种类型（成功、警告、错误）
 * - 动画进出场
 * - 堆叠显示
 */

import { motion, AnimatePresence } from 'framer-motion';
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

// Toast 类型
export type ToastType = 'success' | 'error' | 'warning' | 'info';

// Toast 数据接口
export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

// Toast Context
interface ToastContextValue {
  toasts: ToastMessage[];
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

// Toast Provider
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((
    message: string,
    type: ToastType = 'info',
    duration: number = 3000
  ) => {
    const id = Math.random().toString(36).substring(7);
    const newToast: ToastMessage = { id, type, message, duration };

    setToasts((prev) => [...prev, newToast]);

    // 自动移除
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

// Toast Container
function ToastContainer({
  toasts,
  removeToast,
}: {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
}

// Single Toast Item
function ToastItem({
  toast,
  onClose,
}: {
  toast: ToastMessage;
  onClose: () => void;
}) {
  // 类型样式
  const typeStyles = {
    success: {
      bg: 'bg-success',
      icon: '✓',
    },
    error: {
      bg: 'bg-danger',
      icon: '✗',
    },
    warning: {
      bg: 'bg-warning text-gray-800',
      icon: '⚠',
    },
    info: {
      bg: 'bg-primary',
      icon: 'ℹ',
    },
  };

  const style = typeStyles[toast.type];

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.8 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className={`
        ${style.bg}
        ${toast.type === 'warning' ? 'text-gray-800' : 'text-white'}
        px-6 py-4 rounded-xl shadow-lg
        flex items-center gap-3
        min-w-[300px] max-w-md
      `}
    >
      <span className="text-2xl font-bold">{style.icon}</span>
      <p className="flex-1 font-semibold">{toast.message}</p>
      <button
        onClick={onClose}
        className="text-2xl leading-none opacity-70 hover:opacity-100 transition-opacity"
        aria-label="关闭"
      >
        ×
      </button>
    </motion.div>
  );
}

// Hook to use toast
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
