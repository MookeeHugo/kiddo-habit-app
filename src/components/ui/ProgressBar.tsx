/**
 * ProgressBar 组件 - 进度条
 *
 * 用途：
 * - 显示经验值进度
 * - 显示任务完成度
 * - 显示成就进度
 */

import { motion } from 'framer-motion';

export interface ProgressBarProps {
  value: number;                    // 当前值
  max: number;                      // 最大值
  label?: string;                   // 标签文本
  showPercentage?: boolean;         // 是否显示百分比
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'yellow';
  size?: 'small' | 'medium' | 'large';
  animated?: boolean;               // 是否动画
  className?: string;
}

export function ProgressBar({
  value,
  max,
  label,
  showPercentage = true,
  color = 'primary',
  size = 'medium',
  animated = true,
  className = '',
}: ProgressBarProps) {
  const percentage = Math.min(Math.round((value / max) * 100), 100);

  // 颜色样式
  const colorStyles = {
    primary: 'bg-primary',
    success: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-danger',
    yellow: 'bg-accent-yellow',
  };

  // 尺寸样式
  const sizeStyles = {
    small: 'h-2',
    medium: 'h-3',
    large: 'h-4',
  };

  return (
    <div className={`w-full ${className}`}>
      {/* 顶部标签和百分比 */}
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-sm font-semibold text-gray-700">{label}</span>
          )}
          {showPercentage && (
            <span className="text-sm font-bold text-gray-600">
              {value}/{max} ({percentage}%)
            </span>
          )}
        </div>
      )}

      {/* 进度条容器 */}
      <div
        className={`
          ${sizeStyles[size]}
          w-full bg-gray-200 rounded-full overflow-hidden
        `}
      >
        {/* 进度条填充 */}
        <motion.div
          className={`
            ${colorStyles[color]}
            ${sizeStyles[size]}
            rounded-full
          `}
          initial={animated ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={
            animated
              ? { duration: 1, ease: 'easeOut' }
              : { duration: 0 }
          }
        />
      </div>
    </div>
  );
}
