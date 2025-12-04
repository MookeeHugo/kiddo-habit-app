/**
 * 数据备份Hook
 * 提供数据导出、导入和清空功能
 */

import { db } from '../lib/db';
import type { Task, Reward, Achievement, User, DailyResetHistory } from '../lib/db';

/**
 * 转换日期字符串为Date对象
 */
function convertDatesToObjects(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'string') {
    // 尝试解析ISO日期字符串
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
    if (isoDateRegex.test(obj)) {
      return new Date(obj);
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(convertDatesToObjects);
  }

  if (typeof obj === 'object') {
    const converted: any = {};
    for (const key in obj) {
      converted[key] = convertDatesToObjects(obj[key]);
    }
    return converted;
  }

  return obj;
}

/**
 * 完整的数据备份结构
 */
export interface DataBackup {
  version: string;              // 备份格式版本
  timestamp: string;            // 备份时间
  data: {
    tasks: Task[];
    rewards: Reward[];
    achievements: Achievement[];
    user: User[];
    dailyHistory: DailyResetHistory[];
  };
}

/**
 * 数据备份Hook
 */
export function useDataBackup() {
  /**
   * 导出所有数据为JSON格式
   * @returns DataBackup对象
   */
  const exportData = async (): Promise<DataBackup> => {
    try {
      // 读取所有表的数据
      const [tasks, rewards, achievements, user, dailyHistory] = await Promise.all([
        db.tasks.toArray(),
        db.rewards.toArray(),
        db.achievements.toArray(),
        db.user.toArray(),
        db.dailyHistory.toArray(),
      ]);

      // 构建备份对象
      const backup: DataBackup = {
        version: '1.0',
        timestamp: new Date().toISOString(),
        data: {
          tasks,
          rewards,
          achievements,
          user,
          dailyHistory,
        },
      };

      return backup;
    } catch (error) {
      console.error('导出数据失败:', error);
      throw new Error('导出数据失败，请重试');
    }
  };

  /**
   * 下载数据为JSON文件
   */
  const downloadData = async (): Promise<void> => {
    try {
      const backup = await exportData();

      // 创建Blob对象
      const blob = new Blob([JSON.stringify(backup, null, 2)], {
        type: 'application/json',
      });

      // 创建下载链接
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `kiddo-habit-backup-${new Date().toISOString().split('T')[0]}.json`;

      // 触发下载
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // 释放URL对象
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('下载数据失败:', error);
      throw error;
    }
  };

  /**
   * 从JSON导入数据
   * @param backup 备份数据对象
   * @param mergeMode 是否合并模式（true=合并，false=覆盖）
   */
  const importData = async (
    backup: DataBackup,
    mergeMode: boolean = false
  ): Promise<void> => {
    try {
      // 验证备份格式
      if (!backup.version || !backup.data) {
        throw new Error('备份文件格式错误');
      }

      // 验证必需的数据表
      const { tasks, rewards, achievements, user, dailyHistory } = backup.data;

      if (!Array.isArray(tasks) || !Array.isArray(rewards) ||
          !Array.isArray(achievements) || !Array.isArray(user) ||
          !Array.isArray(dailyHistory)) {
        throw new Error('备份数据格式错误');
      }

      // 转换所有日期字符串为Date对象
      const convertedTasks = convertDatesToObjects(tasks);
      const convertedRewards = convertDatesToObjects(rewards);
      const convertedAchievements = convertDatesToObjects(achievements);
      const convertedUser = convertDatesToObjects(user);
      const convertedDailyHistory = convertDatesToObjects(dailyHistory);

      // 开始事务导入
      await db.transaction('rw', [db.tasks, db.rewards, db.achievements, db.user, db.dailyHistory], async () => {
        if (!mergeMode) {
          // 覆盖模式：先清空所有表
          await Promise.all([
            db.tasks.clear(),
            db.rewards.clear(),
            db.achievements.clear(),
            db.user.clear(),
            db.dailyHistory.clear(),
          ]);
        }

        // 导入数据（使用bulkPut支持覆盖已存在的记录）
        await Promise.all([
          db.tasks.bulkPut(convertedTasks),
          db.rewards.bulkPut(convertedRewards),
          db.achievements.bulkPut(convertedAchievements),
          db.user.bulkPut(convertedUser),
          db.dailyHistory.bulkPut(convertedDailyHistory),
        ]);
      });

      console.log('✅ 数据导入成功');
    } catch (error) {
      console.error('导入数据失败:', error);
      throw new Error('导入数据失败，请检查文件格式');
    }
  };

  /**
   * 从文件读取并导入数据
   * @param file JSON文件
   * @param mergeMode 是否合并模式
   */
  const importFromFile = async (
    file: File,
    mergeMode: boolean = false
  ): Promise<void> => {
    try {
      // 验证文件类型
      if (!file.name.endsWith('.json')) {
        throw new Error('请选择JSON格式的备份文件');
      }

      // 读取文件内容
      const text = await file.text();
      const backup: DataBackup = JSON.parse(text);

      // 导入数据
      await importData(backup, mergeMode);
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error('文件格式错误，无法解析JSON');
      }
      throw error;
    }
  };

  /**
   * 清空所有数据（保留成就定义和用户基本信息）
   */
  const clearAllData = async (): Promise<void> => {
    try {
      // 注意：事务必须包含所有要访问的表
      await db.transaction('rw', [db.tasks, db.rewards, db.dailyHistory, db.user, db.achievements], async () => {
        // 清空任务、奖励和历史记录
        await Promise.all([
          db.tasks.clear(),
          db.rewards.clear(),
          db.dailyHistory.clear(),
        ]);

        // 重置用户数据（保留ID和昵称）
        const users = await db.user.toArray();
        if (users.length > 0) {
          const user = users[0];
          await db.user.update(user.id, {
            level: 1,
            experience: 0,
            totalPoints: 0,
            availablePoints: 0,
            longestStreak: 0,
            totalTasksCompleted: 0,
            perfectDays: 0,
            unlockedAchievements: [],
          });
        }

        // 重置所有成就为未解锁
        const achievements = await db.achievements.toArray();
        for (const achievement of achievements) {
          await db.achievements.update(achievement.id, {
            unlocked: false,
            unlockedAt: undefined,
          });
        }
      });

      console.log('✅ 所有数据已清空');
    } catch (error) {
      console.error('清空数据失败:', error);
      throw new Error('清空数据失败，请重试');
    }
  };

  /**
   * 完全清空所有数据（包括用户和成就）
   */
  const clearAllDataCompletely = async (): Promise<void> => {
    try {
      await db.transaction('rw', [db.tasks, db.rewards, db.achievements, db.user, db.dailyHistory], async () => {
        await Promise.all([
          db.tasks.clear(),
          db.rewards.clear(),
          db.achievements.clear(),
          db.user.clear(),
          db.dailyHistory.clear(),
        ]);
      });

      console.log('✅ 所有数据已完全清空');
    } catch (error) {
      console.error('完全清空数据失败:', error);
      throw new Error('完全清空数据失败，请重试');
    }
  };

  /**
   * 获取数据库统计信息
   */
  const getDataStats = async (): Promise<{
    tasks: number;
    rewards: number;
    achievements: number;
    dailyHistory: number;
  }> => {
    try {
      const [tasksCount, rewardsCount, achievementsCount, historyCount] = await Promise.all([
        db.tasks.count(),
        db.rewards.count(),
        db.achievements.count(),
        db.dailyHistory.count(),
      ]);

      return {
        tasks: tasksCount,
        rewards: rewardsCount,
        achievements: achievementsCount,
        dailyHistory: historyCount,
      };
    } catch (error) {
      console.error('获取数据统计失败:', error);
      return {
        tasks: 0,
        rewards: 0,
        achievements: 0,
        dailyHistory: 0,
      };
    }
  };

  return {
    exportData,
    downloadData,
    importData,
    importFromFile,
    clearAllData,
    clearAllDataCompletely,
    getDataStats,
  };
}
