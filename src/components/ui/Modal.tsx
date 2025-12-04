/**
 * Modal 组件 - 模态弹窗
 *
 * 特点：
 * - 居中显示
 * - 背景遮罩
 * - 点击遮罩关闭
 * - 动画进出场
 */

import { motion, AnimatePresence } from 'framer-motion';
import { type ReactNode, useEffect } from 'react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  showCloseButton?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  showCloseButton = true,
  size = 'medium',
  className = '',
}: ModalProps) {
  // 尺寸样式 - 响应式设计
  const sizeStyles = {
    small: 'max-w-md',
    medium: 'max-w-lg',
    large: 'max-w-3xl',
  };

  // 禁止背景滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          />

          {/* 模态框容器 - 添加滚动支持 */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}  // 防止点击内容关闭
              className={`
                ${sizeStyles[size]}
                w-full bg-white rounded-3xl shadow-2xl
                my-8 mx-auto
                max-h-[calc(100vh-4rem)]
                flex flex-col
                ${className}
              `}
            >
              {/* 头部 - 固定不滚动 */}
              {(title || showCloseButton) && (
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
                  {title && (
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 pr-4">{title}</h2>
                  )}
                  {showCloseButton && (
                    <button
                      onClick={onClose}
                      className="
                        text-gray-400 hover:text-gray-600
                        transition-colors duration-200
                        text-3xl leading-none
                        flex-shrink-0
                        w-8 h-8
                        flex items-center justify-center
                      "
                      aria-label="关闭"
                    >
                      ×
                    </button>
                  )}
                </div>
              )}

              {/* 内容 - 可滚动区域 */}
              <div className="p-4 md:p-6 overflow-y-auto flex-1">
                {children}
              </div>

              {/* 底部按钮区 - 固定不滚动 */}
              {footer && (
                <div className="px-6 py-4 border-t border-gray-200 flex-shrink-0 bg-gray-50 rounded-b-3xl">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
