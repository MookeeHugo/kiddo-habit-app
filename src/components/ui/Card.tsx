/**
 * Card 组件 - 卡片容器
 *
 * 特点：
 * - 圆润的边框
 * - 柔和的阴影
 * - 可选的悬停效果
 */

import { motion } from 'framer-motion';
import { type ReactNode } from 'react';

export interface CardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  icon?: string;
  hoverable?: boolean;
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
}

export function Card({
  children,
  title,
  subtitle,
  icon,
  hoverable = false,
  onClick,
  className = '',
  variant = 'default',
}: CardProps) {
  // 变体样式
  const variantStyles = {
    default: 'bg-white border-gray-200',
    primary: 'bg-primary/5 border-primary/20',
    success: 'bg-success/5 border-success/20',
    warning: 'bg-warning/5 border-warning/20',
    danger: 'bg-danger/5 border-danger/20',
  };

  const CardContent = (
    <>
      {(title || subtitle || icon) && (
        <div className="flex items-start gap-4 mb-5">
          {icon && <span className="text-4xl">{icon}</span>}
          <div className="flex-1">
            {title && (
              <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
            )}
            {subtitle && (
              <p className="text-base text-gray-600 mt-2">{subtitle}</p>
            )}
          </div>
        </div>
      )}
      {children}
    </>
  );

  if (hoverable || onClick) {
    return (
      <motion.div
        whileHover={{ scale: 1.02, y: -4 }}
        whileTap={onClick ? { scale: 0.98 } : {}}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        onClick={onClick}
        className={`
          ${variantStyles[variant]}
          ${onClick ? 'cursor-pointer' : ''}
          rounded-3xl border-2 shadow-lg p-8
          transition-shadow duration-200
          hover:shadow-xl
          ${className}
        `}
      >
        {CardContent}
      </motion.div>
    );
  }

  return (
    <div
      className={`
        ${variantStyles[variant]}
        rounded-3xl border-2 shadow-lg p-8
        ${className}
      `}
    >
      {CardContent}
    </div>
  );
}
