/**
 * 统计数据Hook
 * 提供各种统计数据和图表数据
 */

import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../lib/db';

/**
 * 获取最近N天的日期数组
 */
function getRecentDays(days: number): Date[] {
  const dates: Date[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    dates.push(date);
  }

  return dates;
}

/**
 * 格式化日期为字符串（MM-DD）
 */
function formatDate(date: Date): string {
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${month}-${day}`;
}

/**
 * 统计Hook
 */
export function useStats() {
  // 获取所有历史记录
  const dailyHistory = useLiveQuery(() => db.dailyHistory.toArray(), []);

  // 获取所有任务
  const allTasks = useLiveQuery(() => db.tasks.toArray(), []);

  // 获取所有成就
  const allAchievements = useLiveQuery(() => db.achievements.toArray(), []);

  // 获取用户数据
  const user = useLiveQuery(async () => {
    const users = await db.user.toArray();
    return users[0] || null;
  }, []);

  /**
   * 获取最近7天的任务完成统计
   */
  const getWeeklyTaskStats = (): Array<{
    date: string;
    completed: number;
    total: number;
    rate: number;
  }> => {
    if (!dailyHistory || !allTasks) return [];

    const recentDays = getRecentDays(7);

    return recentDays.map(date => {
      const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD

      // 查找该日期的历史记录
      const historyRecord = dailyHistory.find(h => {
        const historyDate = new Date(h.date);
        historyDate.setHours(0, 0, 0, 0);
        return historyDate.toISOString().split('T')[0] === dateStr;
      });

      if (historyRecord) {
        const rate = historyRecord.totalTasks > 0
          ? Math.round((historyRecord.completedTasks / historyRecord.totalTasks) * 100)
          : 0;

        return {
          date: formatDate(date),
          completed: historyRecord.completedTasks,
          total: historyRecord.totalTasks,
          rate,
        };
      }

      // 如果没有历史记录，返回0
      return {
        date: formatDate(date),
        completed: 0,
        total: 0,
        rate: 0,
      };
    });
  };

  /**
   * 获取积分趋势数据（模拟，因为没有积分历史表）
   * 基于完成任务的时间推算
   */
  const getPointsTrendData = (): Array<{
    date: string;
    points: number;
  }> => {
    if (!allTasks || !user) return [];

    const recentDays = getRecentDays(7);
    let accumulatedPoints = 0;

    return recentDays.map(date => {
      const dateStr = date.toISOString().split('T')[0];

      // 统计该日期完成的任务获得的积分
      const tasksCompletedOnDate = allTasks.filter(task => {
        if (!task.completedAt) return false;

        const completedDate = task.completedAt instanceof Date
          ? task.completedAt
          : new Date(task.completedAt);
        completedDate.setHours(0, 0, 0, 0);

        return completedDate.toISOString().split('T')[0] === dateStr;
      });

      // 累加积分
      const dailyPoints = tasksCompletedOnDate.reduce((sum, task) => sum + task.points, 0);
      accumulatedPoints += dailyPoints;

      return {
        date: formatDate(date),
        points: accumulatedPoints,
      };
    });
  };

  /**
   * 获取成就统计
   */
  const getAchievementStats = (): {
    total: number;
    unlocked: number;
    rate: number;
  } => {
    if (!allAchievements) {
      return { total: 0, unlocked: 0, rate: 0 };
    }

    const total = allAchievements.length;
    const unlocked = allAchievements.filter(a => a.unlocked).length;
    const rate = total > 0 ? Math.round((unlocked / total) * 100) : 0;

    return { total, unlocked, rate };
  };

  /**
   * 获取任务类型分布
   */
  const getTaskTypeDistribution = (): Array<{
    type: string;
    count: number;
    color: string;
  }> => {
    if (!allTasks) return [];

    const dailyCount = allTasks.filter(t => t.type === 'daily').length;
    const todoCount = allTasks.filter(t => t.type === 'todo').length;

    return [
      { type: '每日任务', count: dailyCount, color: '#4ECDC4' },
      { type: '待办事项', count: todoCount, color: '#FFE66D' },
    ];
  };

  /**
   * 获取难度分布
   */
  const getDifficultyDistribution = (): Array<{
    difficulty: string;
    count: number;
    color: string;
  }> => {
    if (!allTasks) return [];

    const easyCount = allTasks.filter(t => t.difficulty === 'easy').length;
    const mediumCount = allTasks.filter(t => t.difficulty === 'medium').length;
    const hardCount = allTasks.filter(t => t.difficulty === 'hard').length;

    return [
      { difficulty: '简单', count: easyCount, color: '#6BCF7F' },
      { difficulty: '中等', count: mediumCount, color: '#FFE66D' },
      { difficulty: '困难', count: hardCount, color: '#FF6B6B' },
    ];
  };

  /**
   * 获取总体统计数据
   */
  const getOverallStats = () => {
    if (!user || !allTasks) {
      return {
        totalTasksCompleted: 0,
        totalPoints: 0,
        longestStreak: 0,
        perfectDays: 0,
        level: 1,
        completionRate: 0,
      };
    }

    const completedTasks = allTasks.filter(t => t.completed).length;
    const totalTasks = allTasks.length;
    const completionRate = totalTasks > 0
      ? Math.round((completedTasks / totalTasks) * 100)
      : 0;

    return {
      totalTasksCompleted: user.totalTasksCompleted,
      totalPoints: user.totalPoints,
      longestStreak: user.longestStreak,
      perfectDays: user.perfectDays,
      level: user.level,
      completionRate,
    };
  };

  return {
    weeklyTaskStats: getWeeklyTaskStats(),
    pointsTrendData: getPointsTrendData(),
    achievementStats: getAchievementStats(),
    taskTypeDistribution: getTaskTypeDistribution(),
    difficultyDistribution: getDifficultyDistribution(),
    overallStats: getOverallStats(),
  };
}
