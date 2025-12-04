/**
 * 成就数据Hook
 */

import { useLiveQuery } from 'dexie-react-hooks';
import { db, type Achievement } from '../lib/db';

/**
 * 成就Hook
 */
export function useAchievements() {
  // 获取用户数据
  const user = useLiveQuery(async () => {
    const users = await db.user.toArray();
    return users[0] || null;
  }, []);

  // 所有成就
  const achievements = useLiveQuery(() => db.achievements.toArray(), []);

  // 已解锁的成就（unlocked不是索引，需要手动过滤和排序）
  const unlockedAchievements = useLiveQuery(async () => {
    const allAchievements = await db.achievements.toArray();
    return allAchievements
      .filter(a => a.unlocked === true)
      .sort((a, b) => {
        if (!a.unlockedAt || !b.unlockedAt) return 0;
        return b.unlockedAt.getTime() - a.unlockedAt.getTime();
      });
  }, []);

  // 未解锁的成就（unlocked不是索引，需要手动过滤）
  const lockedAchievements = useLiveQuery(async () => {
    const allAchievements = await db.achievements.toArray();
    return allAchievements.filter(a => a.unlocked === false);
  }, []);

  /**
   * 获取成就详情
   */
  const getAchievement = async (achievementId: string): Promise<Achievement | undefined> => {
    return await db.achievements.get(achievementId);
  };

  /**
   * 获取用户在某个成就上的当前进度值
   * @param achievement 成就对象
   * @returns 用户当前进度值
   */
  const getUserProgress = (achievement: Achievement): number => {
    if (!user) return 0;

    switch (achievement.conditionType) {
      case 'tasks_completed':
        return user.totalTasksCompleted || 0;
      case 'streak':
        return user.longestStreak || 0;
      case 'points_earned':
        return user.totalPoints || 0;
      case 'level_reached':
        return user.level || 1;
      case 'perfect_days':
        return user.perfectDays || 0;
      default:
        return 0;
    }
  };

  /**
   * 获取成就进度
   * @param achievement 成就对象
   * @param userValue 用户当前值
   * @returns 进度百分比（0-100）
   */
  const getAchievementProgress = (achievement: Achievement, userValue: number): number => {
    if (achievement.unlocked) return 100;

    const progress = (userValue / achievement.conditionValue) * 100;
    return Math.min(Math.round(progress), 100);
  };

  return {
    achievements: achievements || [],
    unlockedAchievements: unlockedAchievements || [],
    lockedAchievements: lockedAchievements || [],
    getAchievement,
    getUserProgress,
    getAchievementProgress,
  };
}
