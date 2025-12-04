/**
 * Button 组件 - 儿童友好的按钮
 *
 * 特点：
 * - 大触摸区域（最小44x44px）
 * - 圆润的圆角
 * - 明亮的颜色
 * - 点击动画反馈
 */

import { motion } from 'framer-motion';
import { type ReactNode } from 'react';

export interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  fullWidth = false,
  icon,
  className = '',
  type = 'button',
}: ButtonProps) {
  return (
    <motion.button
      type={type}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`
        font-bold rounded-xl shadow-lg
        flex items-center justify-center gap-2
        transition-colors duration-200
        ${variant === 'primary' && 'bg-primary text-white hover:bg-primary-500 shadow-primary'}
        ${variant === 'secondary' && 'bg-gray-200 text-gray-900 hover:bg-gray-300'}
        ${variant === 'success' && 'bg-success text-white hover:bg-success-500'}
        ${variant === 'danger' && 'bg-danger text-white hover:bg-danger-500'}
        ${variant === 'warning' && 'bg-warning text-gray-900 hover:bg-warning-500'}
        ${size === 'small' && 'px-4 py-2 text-sm min-h-[36px]'}
        ${size === 'medium' && 'px-6 py-3 text-base min-h-[44px]'}
        ${size === 'large' && 'px-8 py-4 text-lg min-h-[52px]'}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {icon && <span className="text-xl">{icon}</span>}
      {children}
    </motion.button>
  );
}
