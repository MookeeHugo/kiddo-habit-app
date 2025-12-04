/**
 * EmptyState 组件 - 友好的空状态展示
 *
 * 特点：
 * - 可爱的插图
 * - 鼓励性的文案
 * - 明确的操作指引
 */

import { motion } from 'framer-motion';
import { Button } from './Button';

export interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  color?: string;
  size?: 'small' | 'medium' | 'large';
}

export function EmptyState({
  icon,
  title,
  description,
  actionText,
  onAction,
  color = '#4ECDC4',
  size = 'medium',
}: EmptyStateProps) {
  const sizeStyles = {
    small: {
      icon: 'text-6xl',
      title: 'text-xl',
      description: 'text-sm',
      padding: 'py-8',
    },
    medium: {
      icon: 'text-8xl',
      title: 'text-2xl',
      description: 'text-base',
      padding: 'py-12',
    },
    large: {
      icon: 'text-9xl',
      title: 'text-3xl',
      description: 'text-lg',
      padding: 'py-16',
    },
  };

  const currentSize = sizeStyles[size];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`text-center ${currentSize.padding}`}
    >
      {/* 图标动画 */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 1,
        }}
        className={`${currentSize.icon} mb-6`}
        style={{
          filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.1))',
        }}
      >
        {icon}
      </motion.div>

      {/* 标题 */}
      <h3
        className={`${currentSize.title} font-bold text-gray-800 mb-3`}
      >
        {title}
      </h3>

      {/* 描述 */}
      <p
        className={`${currentSize.description} text-gray-600 mb-6 max-w-md mx-auto`}
      >
        {description}
      </p>

      {/* 操作按钮 */}
      {actionText && onAction && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            onClick={onAction}
            variant="primary"
            size="large"
            icon="✨"
            style={{
              backgroundColor: color,
              borderColor: color,
            }}
          >
            {actionText}
          </Button>
        </motion.div>
      )}

      {/* 装饰性元素 */}
      <div className="mt-8 flex justify-center gap-3 opacity-30">
        {['⭐', '✨', '💫'].map((emoji, index) => (
          <motion.span
            key={index}
            animate={{
              y: [0, -10, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: index * 0.3,
            }}
            className="text-2xl"
          >
            {emoji}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}
