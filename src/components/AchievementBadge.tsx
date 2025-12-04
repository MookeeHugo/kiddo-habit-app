/**
 * AchievementBadge 组件 - 成就徽章展示
 *
 * 功能：
 * - 显示成就图标、名称和描述
 * - 展示已解锁/未解锁状态
 * - 显示解锁进度
 * - 动画效果
 */

import { motion } from 'framer-motion';
import { type Achievement } from '../lib/db';
import { Card, Badge } from './ui';

export interface AchievementBadgeProps {
  achievement: Achievement;
  progress?: number; // 当前进度值 (0-condition.value)
  onClick?: () => void;
}

export function AchievementBadge({
  achievement,
  progress = 0,
  onClick,
}: AchievementBadgeProps) {
  const isUnlocked = achievement.unlocked;
  const progressPercentage = achievement.conditionValue > 0
    ? Math.min((progress / achievement.conditionValue) * 100, 100)
    : 0;

  // 条件类型中文映射
  const conditionTypeLabels: Record<string, string> = {
    tasks_completed: '完成任务',
    streak: '连续打卡',
    points_earned: '获得积分',
    perfect_days: '完美日数',
    level_reached: '达到等级',
  };

  const conditionLabel = conditionTypeLabels[achievement.conditionType] || '进度';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: onClick ? 1.05 : 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={onClick}
      className={onClick ? 'cursor-pointer' : ''}
    >
      <Card
        variant={isUnlocked ? 'primary' : 'default'}
        className={`
          text-center relative overflow-hidden
          ${!isUnlocked && 'opacity-60 grayscale'}
        `}
      >
        {/* 解锁状态标签 */}
        {isUnlocked && achievement.unlockedAt && (
          <div className="absolute top-2 right-2">
            <Badge variant="success" size="small" icon="✓">
              已解锁
            </Badge>
          </div>
        )}

        {/* 成就图标 */}
        <div className="mb-4">
          <motion.div
            animate={isUnlocked ? { rotate: [0, -10, 10, -10, 0] } : {}}
            transition={{
              duration: 0.5,
              repeat: isUnlocked ? Infinity : 0,
              repeatDelay: 3,
            }}
            className={`
              text-6xl mx-auto w-20 h-20 flex items-center justify-center
              ${isUnlocked && 'drop-shadow-lg'}
            `}
          >
            {achievement.icon}
          </motion.div>
        </div>

        {/* 成就名称 */}
        <h3 className={`
          text-xl font-bold mb-2
          ${isUnlocked ? 'text-primary' : 'text-gray-600'}
        `}>
          {achievement.title}
        </h3>

        {/* 成就描述 */}
        <p className="text-sm text-gray-600 mb-4">
          {achievement.description}
        </p>

        {/* 解锁条件和进度 */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2 text-sm">
            <span className="text-gray-600">{conditionLabel}:</span>
            <Badge
              variant={isUnlocked ? 'success' : 'gray'}
              size="small"
            >
              {progress} / {achievement.conditionValue}
            </Badge>
          </div>

          {/* 进度条 */}
          {!isUnlocked && (
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="bg-primary h-full rounded-full"
              />
            </div>
          )}

          {/* 解锁时间 */}
          {isUnlocked && achievement.unlockedAt && (
            <p className="text-xs text-gray-500 mt-2">
              解锁于: {new Date(achievement.unlockedAt).toLocaleDateString('zh-CN')}
            </p>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
