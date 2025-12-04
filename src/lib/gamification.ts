/**
 * 游戏化机制核心逻辑
 * 参考Habitica的statHelpers.js和scoreTask.js简化而来
 */

import type { Task, TaskDifficulty, User } from './db';

// ==================== 常量配置 ====================

/**
 * 游戏常量
 * 参考：habitica-reference/website/common/script/constants.js
 */
export const GAME_CONSTANTS = {
  MAX_LEVEL: 20,                    // 最大等级（简化版，Habitica是100）
  STARTING_POINTS: 0,               // 起始积分
  STARTING_LEVEL: 1,                // 起始等级

  // 任务难度对应的基础积分
  TASK_POINTS: {
    easy: 5,
    medium: 10,
    hard: 20,
  } as Record<TaskDifficulty, number>,

  // 经验值计算（积分的一半）
  POINTS_TO_EXP_RATIO: 0.5,         // 获得10积分 = 5经验值
} as const;

/**
 * Streak加成配置
 * 参考Habitica的streakBonus公式简化为分档制
 */
export const STREAK_BONUS = {
  TIER_1: { min: 1, max: 7, multiplier: 1.1 },    // 1-7天：+10%
  TIER_2: { min: 8, max: 14, multiplier: 1.2 },   // 8-14天：+20%
  TIER_3: { min: 15, max: Infinity, multiplier: 1.5 }, // 15+天：+50%
} as const;

/**
 * 等级称号
 */
export const LEVEL_TITLES: Record<number, string> = {
  1: '🌱 小小学习者',
  5: '🌿 努力小达人',
  10: '🌳 习惯小明星',
  15: '🏆 自律小英雄',
  20: '👑 学习小天才',
};

// ==================== 等级系统 ====================

/**
 * 计算升到下一级所需的经验值
 * 参考：habitica-reference/website/common/script/statHelpers.js 的 toNextLevel()
 *
 * Habitica原公式（复杂）：
 * - Level 1-4: 25 * lvl
 * - Level 5: 150
 * - Level 6+: Math.round(((lvl ** 2) * 0.25 + 10 * lvl + 139.75) / 10) * 10
 *
 * 儿童版简化公式（线性增长）：
 * - Level 1-5: 30 + (level - 1) * 20
 * - Level 6+: 50 + (level - 1) * 30
 */
export function getExpForNextLevel(currentLevel: number): number {
  if (currentLevel >= GAME_CONSTANTS.MAX_LEVEL) {
    return Infinity; // 已满级
  }

  const nextLevel = currentLevel + 1;

  // 前5级比较容易，鼓励新手
  if (nextLevel <= 5) {
    return 30 + (nextLevel - 1) * 20;
    // Lv1→2: 30 EXP
    // Lv2→3: 50 EXP
    // Lv3→4: 70 EXP
    // Lv4→5: 90 EXP
    // Lv5→6: 110 EXP
  }

  // 之后线性增长
  return 50 + (nextLevel - 1) * 30;
  // Lv6→7: 200 EXP
  // Lv7→8: 230 EXP
  // Lv10→11: 320 EXP
  // Lv15→16: 470 EXP
  // Lv19→20: 620 EXP
}

/**
 * 检查是否升级
 * @returns 升级信息或null
 */
export function checkLevelUp(
  currentExp: number,
  currentLevel: number
): { levelUp: boolean; newLevel: number; remainingExp: number } {
  if (currentLevel >= GAME_CONSTANTS.MAX_LEVEL) {
    return {
      levelUp: false,
      newLevel: currentLevel,
      remainingExp: currentExp,
    };
  }

  const requiredExp = getExpForNextLevel(currentLevel);

  if (currentExp >= requiredExp) {
    // 升级了！
    return {
      levelUp: true,
      newLevel: currentLevel + 1,
      remainingExp: currentExp - requiredExp,
    };
  }

  return {
    levelUp: false,
    newLevel: currentLevel,
    remainingExp: currentExp,
  };
}

/**
 * 获取等级称号
 */
export function getLevelTitle(level: number): string {
  // 找到小于等于当前等级的最大称号
  const titles = Object.keys(LEVEL_TITLES)
    .map(Number)
    .sort((a, b) => b - a); // 从大到小排序

  for (const titleLevel of titles) {
    if (level >= titleLevel) {
      return LEVEL_TITLES[titleLevel];
    }
  }

  return LEVEL_TITLES[1]; // 默认返回1级称号
}

// ==================== 奖励计算 ====================

/**
 * 计算Streak加成倍数
 * 参考：habitica-reference/website/server/libs/ops/scoreTask.js
 *
 * Habitica原公式：streakBonus = currStreak / 100 + 1 （无上限）
 * 儿童版简化：分档加成，有上限，更容易理解
 */
export function calculateStreakMultiplier(streak: number): number {
  if (streak >= STREAK_BONUS.TIER_3.min) {
    return STREAK_BONUS.TIER_3.multiplier; // +50%
  } else if (streak >= STREAK_BONUS.TIER_2.min) {
    return STREAK_BONUS.TIER_2.multiplier; // +20%
  } else if (streak >= STREAK_BONUS.TIER_1.min) {
    return STREAK_BONUS.TIER_1.multiplier; // +10%
  }
  return 1.0; // 无加成
}

/**
 * 计算任务完成奖励
 * 参考：habitica-reference/website/server/libs/ops/scoreTask.js
 *
 * Habitica原逻辑：
 * - gpMod = delta * task.priority * crit * perBonus
 * - 包含RPG属性、暴击等复杂计算
 *
 * 儿童版简化：
 * - 基础积分 = difficulty对应的分数
 * - 最终积分 = 基础积分 * Streak加成
 * - 经验值 = 积分 * 0.5
 */
export function calculateTaskReward(task: Task): {
  points: number;
  experience: number;
  streakBonus: number;
} {
  // 基础积分
  const basePoints = GAME_CONSTANTS.TASK_POINTS[task.difficulty];

  // Streak加成
  const streakMultiplier = calculateStreakMultiplier(task.streak);
  const bonusPoints = (streakMultiplier - 1) * 100; // 转换为百分比

  // 最终积分（向下取整）
  const totalPoints = Math.floor(basePoints * streakMultiplier);

  // 经验值计算
  const experience = Math.floor(totalPoints * GAME_CONSTANTS.POINTS_TO_EXP_RATIO);

  return {
    points: totalPoints,
    experience,
    streakBonus: bonusPoints, // 例如：10表示+10%
  };
}

// ==================== 成就检查 ====================

/**
 * 检查是否解锁新成就
 * @returns 新解锁的成就ID数组
 */
export function checkNewAchievements(user: User): string[] {
  const newAchievements: string[] = [];

  // 任务完成数量成就
  if (
    user.totalTasksCompleted === 1 &&
    !user.unlockedAchievements.includes('first_task')
  ) {
    newAchievements.push('first_task');
  }

  if (
    user.totalTasksCompleted >= 100 &&
    !user.unlockedAchievements.includes('tasks_100')
  ) {
    newAchievements.push('tasks_100');
  }

  // 连续打卡成就
  if (
    user.longestStreak >= 7 &&
    !user.unlockedAchievements.includes('streak_7')
  ) {
    newAchievements.push('streak_7');
  }

  if (
    user.longestStreak >= 30 &&
    !user.unlockedAchievements.includes('streak_30')
  ) {
    newAchievements.push('streak_30');
  }

  // 等级成就
  if (
    user.level >= 5 &&
    !user.unlockedAchievements.includes('level_5')
  ) {
    newAchievements.push('level_5');
  }

  if (
    user.level >= 10 &&
    !user.unlockedAchievements.includes('level_10')
  ) {
    newAchievements.push('level_10');
  }

  if (
    user.level >= 20 &&
    !user.unlockedAchievements.includes('level_20')
  ) {
    newAchievements.push('level_20');
  }

  // 积分成就
  if (
    user.totalPoints >= 100 &&
    !user.unlockedAchievements.includes('points_100')
  ) {
    newAchievements.push('points_100');
  }

  if (
    user.totalPoints >= 1000 &&
    !user.unlockedAchievements.includes('points_1000')
  ) {
    newAchievements.push('points_1000');
  }

  // 完美日成就
  if (
    user.perfectDays >= 7 &&
    !user.unlockedAchievements.includes('perfect_7')
  ) {
    newAchievements.push('perfect_7');
  }

  return newAchievements;
}

// ==================== 每日重置逻辑 ====================

/**
 * 重置每日任务
 * 参考：habitica-reference/website/server/libs/cron.js
 *
 * Habitica逻辑：
 * - 每天凌晨运行
 * - 未完成的Daily任务：扣除HP，重置Streak
 * - 已完成的Daily任务：保持Streak，重置completed状态
 * - 检查是否完美日
 *
 * 儿童版简化：
 * - 不扣除HP（无惩罚）
 * - 未完成：Streak重置为0，温和提醒
 * - 已完成：Streak保留，重置completed
 */
export interface DailyResetResult {
  completedCount: number;
  missedCount: number;
  perfect: boolean;
  streakLost: number; // 失去的最大Streak
}

/**
 * 计算正确的Streak值（基于连续性）
 * @param currentStreak 当前streak值
 * @param lastCompletedDate 上次完成日期
 * @returns 新的streak值
 */
export function calculateCorrectStreak(
  currentStreak: number,
  lastCompletedDate: Date | null | undefined
): number {
  if (!lastCompletedDate) {
    // 第一次完成
    return 1;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastCompleted = new Date(lastCompletedDate);
  lastCompleted.setHours(0, 0, 0, 0);

  // 计算天数差
  const daysDiff = Math.floor(
    (today.getTime() - lastCompleted.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysDiff === 0) {
    // 今天已经完成过了（不应该发生，因为应该先reset）
    return currentStreak;
  } else if (daysDiff === 1) {
    // 昨天完成的，连续打卡
    return currentStreak + 1;
  } else {
    // 超过1天未完成，重置streak
    return 1;
  }
}

export function shouldResetToday(lastResetDate: Date | null): boolean {
  if (!lastResetDate) return true;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastReset = new Date(lastResetDate);
  lastReset.setHours(0, 0, 0, 0);

  return today.getTime() > lastReset.getTime();
}

/**
 * 执行每日重置
 */
export function performDailyReset(dailyTasks: Task[]): DailyResetResult {
  const result: DailyResetResult = {
    completedCount: 0,
    missedCount: 0,
    perfect: true,
    streakLost: 0,
  };

  // 今天是星期几（0=周日, 6=周六）
  const today = new Date().getDay();

  dailyTasks.forEach((task) => {
    // 检查今天是否到期
    const isDueToday = task.repeatDays?.includes(today) ?? true;

    if (!isDueToday) {
      return; // 今天不需要做这个任务
    }

    if (task.completed) {
      // 任务已完成
      result.completedCount++;
      // Streak保留，不做任何处理
    } else {
      // 任务未完成
      result.missedCount++;
      result.perfect = false;

      // 记录失去的Streak
      if (task.streak > result.streakLost) {
        result.streakLost = task.streak;
      }

      // 重置Streak为0（儿童版简化，不像Habitica那样递减）
      task.streak = 0;
    }

    // 重置完成状态
    task.completed = false;

    // 重置子任务
    if (task.checklist) {
      task.checklist.forEach((item) => {
        item.completed = false;
      });
    }
  });

  return result;
}

// ==================== UI 辅助函数 ====================

/**
 * 获取难度信息（用于UI显示）
 */
export function getDifficultyInfo(difficulty: TaskDifficulty): {
  label: string;
  color: 'yellow' | 'warning' | 'danger';
  icon: string;
} {
  const info = {
    easy: {
      label: '简单',
      color: 'yellow' as const,
      icon: '⭐',
    },
    medium: {
      label: '中等',
      color: 'warning' as const,
      icon: '⚡',
    },
    hard: {
      label: '困难',
      color: 'danger' as const,
      icon: '🔥',
    },
  };

  return info[difficulty];
}

// ==================== 导出所有函数 ====================

export default {
  // 等级系统
  getExpForNextLevel,
  checkLevelUp,
  getLevelTitle,

  // 奖励计算
  calculateStreakMultiplier,
  calculateTaskReward,

  // 成就系统
  checkNewAchievements,

  // 每日重置
  shouldResetToday,
  performDailyReset,
  calculateCorrectStreak,

  // 常量
  GAME_CONSTANTS,
  STREAK_BONUS,
  LEVEL_TITLES,
};
