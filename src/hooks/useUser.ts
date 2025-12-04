/**
 * 用户数据Hook
 */

import { useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, initializeDatabase, type User, type Task } from '../lib/db';
import { useUserStore } from '../stores/userStore';
import {
  checkLevelUp,
  checkNewAchievements,
  calculateTaskReward,
} from '../lib/gamification';

/**
 * 用户数据Hook
 */
export function useUser() {
  const { user, setUser, updateUser, setLoading, setError } = useUserStore();

  // 使用Dexie的useLiveQuery实时监听数据库变化
  const dbUser = useLiveQuery(async () => {
    const users = await db.user.toArray();
    return users[0] || null;
  });

  // 初始化数据库
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        await initializeDatabase();
        const users = await db.user.toArray();
        if (users.length > 0) {
          setUser(users[0]);
        }
      } catch (error: any) {
        console.error('Failed to initialize database:', error);
        console.error('Error name:', error?.name);
        console.error('Error message:', error?.message);
        console.error('Error stack:', error?.stack);
        setError(`数据库初始化失败: ${error?.message || error}`);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  // 同步数据库用户数据到Store
  useEffect(() => {
    if (dbUser) {
      setUser(dbUser);
    }
  }, [dbUser]);

  /**
   * 更新用户信息
   */
  const updateUserInfo = async (updates: Partial<User>): Promise<void> => {
    if (!user) return;

    try {
      await db.user.update(user.id, updates);
      updateUser(updates);
    } catch (error) {
      console.error('Failed to update user:', error);
      throw error;
    }
  };

  /**
   * 完成任务，获得奖励
   */
  const completeTask = async (task: Task): Promise<{
    reward: ReturnType<typeof calculateTaskReward>;
    levelUp: boolean;
    newLevel?: number;
    newAchievements: string[];
  }> => {
    if (!user) throw new Error('用户未登录');

    // 计算奖励
    const reward = calculateTaskReward(task);

    // 更新用户数据
    const newExperience = user.experience + reward.experience;
    const newTotalPoints = user.totalPoints + reward.points;
    const newAvailablePoints = user.availablePoints + reward.points;
    const newTasksCompleted = user.totalTasksCompleted + 1;

    // 更新最长Streak
    const newLongestStreak = Math.max(user.longestStreak, task.streak + 1);

    // 检查升级
    const levelUpResult = checkLevelUp(newExperience, user.level);

    const updates: Partial<User> = {
      experience: levelUpResult.levelUp
        ? levelUpResult.remainingExp
        : newExperience,
      totalPoints: newTotalPoints,
      availablePoints: newAvailablePoints,
      totalTasksCompleted: newTasksCompleted,
      longestStreak: newLongestStreak,
      ...(levelUpResult.levelUp && { level: levelUpResult.newLevel }),
    };

    // 检查新成就
    const tempUser: User = { ...user, ...updates };
    const newAchievements = checkNewAchievements(tempUser);

    if (newAchievements.length > 0) {
      updates.unlockedAchievements = [
        ...user.unlockedAchievements,
        ...newAchievements,
      ];

      // 更新成就表
      await Promise.all(
        newAchievements.map((achievementId) =>
          db.achievements.update(achievementId, {
            unlocked: true,
            unlockedAt: new Date(),
          })
        )
      );
    }

    // 更新用户
    await updateUserInfo(updates);

    return {
      reward,
      levelUp: levelUpResult.levelUp,
      newLevel: levelUpResult.levelUp ? levelUpResult.newLevel : undefined,
      newAchievements,
    };
  };

  /**
   * 兑换奖励
   */
  const redeemReward = async (rewardId: string, cost: number): Promise<void> => {
    if (!user) throw new Error('用户未登录');

    if (user.availablePoints < cost) {
      throw new Error('积分不足');
    }

    // 扣除积分
    const newAvailablePoints = user.availablePoints - cost;

    await db.transaction('rw', [db.user, db.rewards], async () => {
      // 更新用户积分
      await db.user.update(user.id, {
        availablePoints: newAvailablePoints,
      });

      // 标记奖励为已兑换
      await db.rewards.update(rewardId, {
        redeemed: true,
        redeemedAt: new Date(),
      });
    });

    updateUser({ availablePoints: newAvailablePoints });
  };

  /**
   * 记录完美日
   */
  const recordPerfectDay = async (): Promise<void> => {
    if (!user) return;

    const newPerfectDays = user.perfectDays + 1;

    await updateUserInfo({ perfectDays: newPerfectDays });

    // 保存到历史记录
    await db.dailyHistory.add({
      id: crypto.randomUUID(),
      date: new Date(),
      completedTasks: 0, // 这些值应该从任务统计中计算
      totalTasks: 0,
      isPerfectDay: true,
    });
  };

  return {
    user,
    isLoading: useUserStore((state) => state.isLoading),
    error: useUserStore((state) => state.error),
    updateUserInfo,
    completeTask,
    redeemReward,
    recordPerfectDay,
  };
}
