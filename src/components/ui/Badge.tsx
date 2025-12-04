/**
 * Badge 组件 - 徽章/标签
 *
 * 用途：
 * - 显示任务难度
 * - 显示 Streak 天数
 * - 显示积分
 * - 显示成就状态
 */

import { type ReactNode } from 'react';

export interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'gray' | 'yellow';
  size?: 'small' | 'medium' | 'large';
  icon?: string;
  className?: string;
}

export function Badge({
  children,
  variant = 'primary',
  size = 'medium',
  icon,
  className = '',
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        font-bold rounded-full
        ${variant === 'primary' && 'bg-primary text-white'}
        ${variant === 'success' && 'bg-success text-white'}
        ${variant === 'warning' && 'bg-warning text-gray-800'}
        ${variant === 'danger' && 'bg-danger text-white'}
        ${variant === 'gray' && 'bg-gray-200 text-gray-800'}
        ${variant === 'yellow' && 'bg-accent-yellow text-gray-800'}
        ${size === 'small' && 'px-3 py-1.5 text-sm'}
        ${size === 'medium' && 'px-4 py-2 text-base'}
        ${size === 'large' && 'px-5 py-2.5 text-lg'}
        ${className}
      `}
    >
      {icon && (
        <span className={`
          ${size === 'small' && 'text-base'}
          ${size === 'medium' && 'text-lg'}
          ${size === 'large' && 'text-xl'}
        `}>
          {icon}
        </span>
      )}
      {children}
    </span>
  );
}
