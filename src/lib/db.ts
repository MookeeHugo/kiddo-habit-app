/**
 * IndexedDB数据库配置
 * 使用Dexie.js封装，参考Habitica的数据模型简化而来
 */

import Dexie, { type Table } from 'dexie';

// ==================== 数据类型定义 ====================

/**
 * 任务类型（简化为2种）
 * 参考：habitica-reference/website/server/models/task.js
 */
export type TaskType = 'daily' | 'todo';

/**
 * 任务难度
 * 参考Habitica的priority字段，简化为3档
 */
export type TaskDifficulty = 'easy' | 'medium' | 'hard';

/**
 * 任务状态
 */
export type TaskStatus = 'pending' | 'completed';

/**
 * 子任务清单项
 */
export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

/**
 * 任务数据模型
 * 参考Habitica简化，保留核心字段
 */
export interface Task {
  id: string;                           // UUID
  type: TaskType;                       // 任务类型
  title: string;                        // 任务标题
  description?: string;                 // 任务描述
  icon: string;                         // 图标emoji
  difficulty: TaskDifficulty;           // 难度（简化为3档）
  points: number;                       // 完成可获得积分
  status: TaskStatus;                   // 状态

  // Streak相关（参考Habitica）
  streak: number;                       // 连续完成天数 ⭐ 重要
  lastCompletedDate?: Date;             // 上次完成日期（用于判断连续性）⭐ 重要

  // Daily任务特有字段
  repeatDays?: number[];                // 重复日期（0=周日, 1=周一...6=周六）

  // Todo任务特有字段
  dueDate?: Date;                       // 截止日期

  // 共享字段
  checklist?: ChecklistItem[];          // 子任务清单
  completed: boolean;                   // 今日是否完成
  completedAt?: Date;                   // 完成时间
  createdAt: Date;                      // 创建时间
  order: number;                        // 排序顺序
}

/**
 * 奖励类型
 */
export type RewardCategory = 'toy' | 'activity' | 'privilege';

/**
 * 奖励数据模型
 */
export interface Reward {
  id: string;
  title: string;                        // 奖励名称
  description: string;                  // 奖励描述
  cost: number;                         // 需要的积分
  icon: string;                         // 图标emoji
  category: RewardCategory;             // 奖励类型
  redeemed: boolean;                    // 是否已兑换
  redeemedAt?: Date;                    // 兑换时间
  createdAt: Date;
}

/**
 * 成就数据模型
 */
export interface Achievement {
  id: string;
  title: string;                        // 成就名称
  description: string;                  // 成就描述
  icon: string;                         // 徽章图标
  conditionType: 'tasks_completed' | 'streak' | 'points_earned' | 'level_reached' | 'perfect_days';
  conditionValue: number;               // 解锁条件值
  unlocked: boolean;                    // 是否已解锁
  unlockedAt?: Date;                    // 解锁时间
}

/**
 * 用户数据模型
 * 参考：habitica-reference/website/server/models/user/schema.js
 */
export interface User {
  id: string;
  name: string;                         // 用户昵称
  avatar: string;                       // 头像（emoji）

  // 核心游戏化数据（参考Habitica简化）
  level: number;                        // 等级（参考Habitica的lvl）
  experience: number;                   // 当前经验值（参考exp）
  totalPoints: number;                  // 累计积分（参考gp金币）
  availablePoints: number;              // 可用积分

  // 成就统计（参考Habitica的achievements）
  longestStreak: number;                // 最长连续打卡天数
  totalTasksCompleted: number;          // 累计完成任务数
  perfectDays: number;                  // 完美日数量
  unlockedAchievements: string[];       // 已解锁的徽章ID列表

  // 时间戳
  createdAt: Date;
  lastLoginAt: Date;
}

/**
 * 每日重置历史记录
 * 用于跟踪每日任务的完成情况
 */
export interface DailyResetHistory {
  id: string;
  date: Date;                           // 重置日期
  completedTasks: number;               // 完成任务数
  totalTasks: number;                   // 总任务数
  isPerfectDay: boolean;                // 是否完美日
}

// ==================== Dexie数据库类 ====================

class KiddoHabitDatabase extends Dexie {
  tasks!: Table<Task>;
  rewards!: Table<Reward>;
  achievements!: Table<Achievement>;
  user!: Table<User>;
  dailyHistory!: Table<DailyResetHistory>;

  constructor() {
    super('KiddoHabitDB');

    // 版本5（最终修复版本）- 移除 Date 类型索引
    this.version(5).stores({
      tasks: 'id, type, status, order',       // 移除 completed（布尔值不能作为索引）
      rewards: 'id, cost',                     // 移除 redeemed（布尔值）
      achievements: 'id',                      // 移除 unlocked（布尔值）
      user: 'id',
      dailyHistory: 'id',                      // 移除 date（Date类型不能作为索引）
    }).upgrade(async (trans) => {
      // 升级时清空所有表以避免主键冲突
      await trans.table('tasks').clear();
      await trans.table('rewards').clear();
      await trans.table('achievements').clear();
      await trans.table('user').clear();
      await trans.table('dailyHistory').clear();
      console.log('✅ 数据库已升级到版本5，所有旧数据已清除');
    });
  }
}

// 创建数据库实例
export const db = new KiddoHabitDatabase();

// ==================== 初始化数据 ====================

/**
 * 初始化默认用户数据
 */
export const initializeDefaultUser = async (): Promise<User> => {
  const existingUser = await db.user.toArray();

  if (existingUser.length > 0) {
    return existingUser[0];
  }

  const defaultUser: User = {
    id: 'default-user',
    name: '小朋友',
    avatar: '😊',
    level: 1,
    experience: 0,
    totalPoints: 0,
    availablePoints: 0,
    longestStreak: 0,
    totalTasksCompleted: 0,
    perfectDays: 0,
    unlockedAchievements: [],
    createdAt: new Date(),
    lastLoginAt: new Date(),
  };

  // 使用 put 代替 add，避免 React StrictMode 双重渲染导致的主键冲突
  await db.user.put(defaultUser);
  return defaultUser;
};

/**
 * 初始化默认成就
 * 参考Habitica的achievements简化为10个核心成就
 */
export const initializeAchievements = async (): Promise<void> => {
  const existingAchievements = await db.achievements.toArray();

  if (existingAchievements.length > 0) {
    return; // 已经初始化过了
  }

  const defaultAchievements: Achievement[] = [
    {
      id: 'first_task',
      title: '🎯 第一步',
      description: '完成第一个任务',
      icon: '🎯',
      conditionType: 'tasks_completed',
      conditionValue: 1,
      unlocked: false,
    },
    {
      id: 'streak_7',
      title: '⭐ 坚持之星',
      description: '连续7天打卡',
      icon: '⭐',
      conditionType: 'streak',
      conditionValue: 7,
      unlocked: false,
    },
    {
      id: 'streak_30',
      title: '🏆 习惯大师',
      description: '连续30天打卡',
      icon: '🏆',
      conditionType: 'streak',
      conditionValue: 30,
      unlocked: false,
    },
    {
      id: 'level_5',
      title: '🌿 努力小达人',
      description: '达到5级',
      icon: '🌿',
      conditionType: 'level_reached',
      conditionValue: 5,
      unlocked: false,
    },
    {
      id: 'level_10',
      title: '🌳 习惯小明星',
      description: '达到10级',
      icon: '🌳',
      conditionType: 'level_reached',
      conditionValue: 10,
      unlocked: false,
    },
    {
      id: 'level_20',
      title: '👑 学习小天才',
      description: '达到20级（满级）',
      icon: '👑',
      conditionType: 'level_reached',
      conditionValue: 20,
      unlocked: false,
    },
    {
      id: 'points_100',
      title: '💰 积分新手',
      description: '累计获得100积分',
      icon: '💰',
      conditionType: 'points_earned',
      conditionValue: 100,
      unlocked: false,
    },
    {
      id: 'points_1000',
      title: '💎 积分大户',
      description: '累计获得1000积分',
      icon: '💎',
      conditionType: 'points_earned',
      conditionValue: 1000,
      unlocked: false,
    },
    {
      id: 'perfect_7',
      title: '✨ 完美一周',
      description: '完成7个完美日',
      icon: '✨',
      conditionType: 'perfect_days',
      conditionValue: 7,
      unlocked: false,
    },
    {
      id: 'tasks_100',
      title: '🎖️ 任务达人',
      description: '累计完成100个任务',
      icon: '🎖️',
      conditionType: 'tasks_completed',
      conditionValue: 100,
      unlocked: false,
    },
  ];

  // 使用 bulkPut 代替 bulkAdd，避免 React StrictMode 双重渲染导致的主键冲突
  await db.achievements.bulkPut(defaultAchievements);
};

/**
 * 初始化数据库（首次运行时调用）
 */
export const initializeDatabase = async (): Promise<void> => {
  await initializeDefaultUser();
  await initializeAchievements();
};
