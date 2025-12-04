/**
 * UserStats 组件 - 用户统计信息
 *
 * 功能：
 * - 显示用户等级和称号
 * - 显示经验值进度条
 * - 显示总积分和可用积分
 * - 显示统计数据（完��任务数、最长Streak等）
 */

import { useState } from 'react';
import { type User } from '../lib/db';
import { Card, Badge, ProgressBar } from './ui';
import { getExpForNextLevel, getLevelTitle } from '../lib/gamification';
import { UserProfileEdit } from './UserProfileEdit';

export interface UserStatsProps {
  user: User;
}

export function UserStats({ user }: UserStatsProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const expForNextLevel = getExpForNextLevel(user.level);
  const levelTitle = getLevelTitle(user.level);

  return (
    <Card
      variant="primary"
      className="bg-gradient-to-br from-primary/10 to-primary/5"
    >
      <div className="space-y-6">
        {/* 用户头像和基本信息 - 响应式布局 */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* 头像显示 - 支持emoji和上传图片 */}
          {user.avatar.startsWith('data:image') ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-primary flex-shrink-0"
            />
          ) : (
            <div className="text-5xl sm:text-6xl flex-shrink-0">{user.avatar}</div>
          )}

          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1 truncate">
              {user.name}
            </h2>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="primary" size="small" className="sm:hidden">
                Lv.{user.level}
              </Badge>
              <Badge variant="primary" size="medium" className="hidden sm:inline-flex">
                Lv.{user.level}
              </Badge>
              <span className="text-xs sm:text-sm font-semibold text-gray-600 truncate">
                {levelTitle}
              </span>
            </div>
          </div>

          {/* 编辑按钮 */}
          <button
            type="button"
            onClick={() => setIsEditModalOpen(true)}
            className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full
                       bg-white/80 hover:bg-white border-2 border-gray-200
                       hover:border-primary transition-all duration-200
                       flex items-center justify-center text-xl sm:text-2xl
                       hover:scale-110 hover:shadow-md group"
            aria-label="编辑资料"
          >
            <span className="group-hover:rotate-12 transition-transform duration-200">
              ✏️
            </span>
          </button>
        </div>

        {/* 经验值进度条 */}
        <div>
          <ProgressBar
            value={user.experience}
            max={expForNextLevel}
            label="经验值"
            color="primary"
            size="large"
            animated
          />
        </div>

        {/* 积分展示 - 响应式优化 */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-white/80 rounded-xl p-3 sm:p-4 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-accent-yellow mb-1">
              ⭐ {user.availablePoints}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">可用积分</div>
          </div>

          <div className="bg-white/80 rounded-xl p-3 sm:p-4 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">
              💎 {user.totalPoints}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">总积分</div>
          </div>
        </div>

        {/* 统计数据 - 响应式优化 */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-danger mb-1">
              🔥 {user.longestStreak}
            </div>
            <div className="text-[10px] sm:text-xs text-gray-600">最长连续</div>
          </div>

          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-success mb-1">
              ✓ {user.totalTasksCompleted}
            </div>
            <div className="text-[10px] sm:text-xs text-gray-600">完成任务</div>
          </div>

          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-warning mb-1">
              ✨ {user.perfectDays}
            </div>
            <div className="text-[10px] sm:text-xs text-gray-600">完美日</div>
          </div>
        </div>

        {/* 成就数量 - 响应式优化 */}
        {user.unlockedAchievements.length > 0 && (
          <div className="pt-3 sm:pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-semibold text-gray-700">
                已解锁成就
              </span>
              <Badge variant="warning" icon="🏆">
                {user.unlockedAchievements.length}个
              </Badge>
            </div>
          </div>
        )}
      </div>

      {/* 用户资料编辑模态框 */}
      <UserProfileEdit
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </Card>
  );
}
