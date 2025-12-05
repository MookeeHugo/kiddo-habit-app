/**
 * 任务数据Hook
 */

import { useLiveQuery } from 'dexie-react-hooks';
import { db, type Task, type TaskType, type TaskDifficulty } from '../lib/db';
import { generateId, getTodayWeekday } from '../lib/utils';
import { performDailyReset, shouldResetToday, calculateCorrectStreak } from '../lib/gamification';
import { useUser } from './useUser';

/**
 * 任务Hook
 */
export function useTasks() {
  const { completeTask } = useUser();

  // 实时查询所有任务
  const tasks = useLiveQuery(() => db.tasks.orderBy('order').toArray(), []);

  // 今日任务（已过滤）
  const todayTasks = useLiveQuery(async () => {
    const allTasks = await db.tasks.orderBy('order').toArray();
    const today = getTodayWeekday();

    return allTasks.filter((task) => {
      if (task.type === 'todo') return true; // Todo任务始终显示

      // Daily任务：检查是否今天到期
      if (task.type === 'daily') {
        return task.repeatDays?.includes(today) ?? true;
      }

      return false;
    });
  }, []);

  // Daily任务列表
  const dailyTasks = useLiveQuery(() =>
    db.tasks.where('type').equals('daily').sortBy('order'),
    []
  );

  // Todo任务列表
  const todoTasks = useLiveQuery(() =>
    db.tasks.where('type').equals('todo').sortBy('order'),
    []
  );

  // 已完成任务（completed不是索引，需要手动过滤）
  const completedTasks = useLiveQuery(async () => {
    const allTasks = await db.tasks.toArray();
    return allTasks
      .filter(t => t.completed === true)
      .sort((a, b) => {
        if (!a.completedAt || !b.completedAt) return 0;

        // 防御性编程：确保completedAt是Date对象
        const aTime = a.completedAt instanceof Date
          ? a.completedAt.getTime()
          : new Date(a.completedAt).getTime();
        const bTime = b.completedAt instanceof Date
          ? b.completedAt.getTime()
          : new Date(b.completedAt).getTime();

        return bTime - aTime;
      });
  }, []);

  /**
   * 创建新任务
   */
  const createTask = async (taskData: {
    type: TaskType;
    title: string;
    description?: string;
    icon: string;
    difficulty: TaskDifficulty;
    repeatDays?: number[]; // For daily tasks
    dueDate?: Date; // For todo tasks
  }): Promise<Task> => {
    const allTasks = await db.tasks.toArray();
    const maxOrder = allTasks.length > 0
      ? Math.max(...allTasks.map(t => t.order))
      : 0;

    const newTask: Task = {
      id: generateId(),
      type: taskData.type,
      title: taskData.title,
      description: taskData.description,
      icon: taskData.icon,
      difficulty: taskData.difficulty,
      points: 0, // 将在完成时计算
      status: 'pending',
      streak: 0,
      repeatDays: taskData.repeatDays,
      dueDate: taskData.dueDate,
      completed: false,
      createdAt: new Date(),
      order: maxOrder + 1,
    };

    await db.tasks.add(newTask);
    return newTask;
  };

  /**
   * 更新任务
   */
  const updateTask = async (
    taskId: string,
    updates: Partial<Task>
  ): Promise<void> => {
    await db.tasks.update(taskId, updates);
  };

  /**
   * 删除任务
   */
  const deleteTask = async (taskId: string): Promise<void> => {
    await db.tasks.delete(taskId);
  };

  /**
   * 切换任务完成状态
   */
  const toggleTaskCompletion = async (taskId: string): Promise<{
    success: boolean;
    reward?: Awaited<ReturnType<typeof completeTask>>;
  }> => {
    const task = await db.tasks.get(taskId);
    if (!task) throw new Error('任务不存在');

    const newCompleted = !task.completed;

    if (newCompleted) {
      // 标记为完成
      const newStreak = task.type === 'daily'
        ? calculateCorrectStreak(task.streak, task.lastCompletedDate)
        : task.streak;

      // 创建更新后的任务对象用于计算积分
      const updatedTask = { ...task, completed: true, streak: newStreak };

      // 获得奖励（这会计算积分）
      const reward = await completeTask(updatedTask);

      // 更新任务，包括计算出的积分
      await db.tasks.update(taskId, {
        completed: true,
        completedAt: new Date(),
        lastCompletedDate: new Date(), // 记录完成日期
        streak: newStreak,
        points: reward.reward.points, // 保存实际获得的积分
      });

      return { success: true, reward };
    } else {
      // 取消完成
      const newStreak = task.type === 'daily' && task.streak > 0
        ? task.streak - 1
        : task.streak;

      await db.tasks.update(taskId, {
        completed: false,
        completedAt: undefined,
        streak: newStreak,
        points: 0, // 重置积分
      });

      return { success: true };
    }
  };

  /**
   * 重新排序任务
   */
  const reorderTasks = async (taskIds: string[]): Promise<void> => {
    await db.transaction('rw', db.tasks, async () => {
      for (let i = 0; i < taskIds.length; i++) {
        await db.tasks.update(taskIds[i], { order: i });
      }
    });
  };

  /**
   * 执行每日重置
   */
  const performReset = async (): Promise<void> => {
    const allDailyTasks = await db.tasks.where('type').equals('daily').toArray();

    const resetResult = performDailyReset(allDailyTasks);

    // 批量更新任务
    await db.transaction('rw', db.tasks, async () => {
      for (const task of allDailyTasks) {
        await db.tasks.update(task.id, {
          completed: task.completed,
          streak: task.streak,
        });
      }
    });

    // 如果是完美日，记录到历史并更新用户perfectDays
    if (resetResult.perfect && resetResult.completedCount > 0) {
      // 记录到历史
      await db.dailyHistory.add({
        id: generateId(),
        date: new Date(),
        completedTasks: resetResult.completedCount,
        totalTasks: resetResult.completedCount + resetResult.missedCount,
        isPerfectDay: true,
      });

      // 更新用户的完美日计数
      const users = await db.user.toArray();
      if (users.length > 0) {
        const currentUser = users[0];
        await db.user.update(currentUser.id, {
          perfectDays: currentUser.perfectDays + 1,
        });
      }
    }

    return;
  };

  /**
   * 检查并执行每日重置（如果需要）
   */
  const checkAndResetDaily = async (): Promise<boolean> => {
    // 从LocalStorage获取上次重置日期
    const lastResetStr = localStorage.getItem('lastDailyReset');
    const lastResetDate = lastResetStr ? new Date(lastResetStr) : null;

    if (shouldResetToday(lastResetDate)) {
      await performReset();
      localStorage.setItem('lastDailyReset', new Date().toISOString());
      return true;
    }

    return false;
  };

  /**
   * 添加任务（用于表单）
   */
  const addTask = async (taskData: Partial<Task>): Promise<Task> => {
    const allTasks = await db.tasks.toArray();
    const maxOrder = allTasks.length > 0
      ? Math.max(...allTasks.map(t => t.order))
      : 0;

    const newTask: Task = {
      id: generateId(),
      type: taskData.type || 'daily',
      title: taskData.title || '',
      description: taskData.description,
      icon: taskData.icon || '📝',
      difficulty: taskData.difficulty || 'medium',
      points: 0,
      status: 'pending',
      streak: 0,
      repeatDays: taskData.repeatDays,
      dueDate: taskData.dueDate,
      checklist: taskData.checklist || [],
      completed: false,
      createdAt: new Date(),
      order: maxOrder + 1,
    };

    await db.tasks.add(newTask);
    return newTask;
  };

  /**
   * 编辑任务（用于表单）
   */
  const editTask = async (taskId: string, taskData: Partial<Task>): Promise<void> => {
    await db.tasks.update(taskId, {
      title: taskData.title,
      description: taskData.description,
      icon: taskData.icon,
      type: taskData.type,
      difficulty: taskData.difficulty,
      repeatDays: taskData.repeatDays,
      dueDate: taskData.dueDate,
      checklist: taskData.checklist,
    });
  };

  // 获取待完成任务（用于Dashboard显示）
  const pendingTasks = useLiveQuery(async () => {
    const allTasks = await db.tasks.toArray();
    return allTasks
      .filter(t => t.completed === false)
      .sort((a, b) => a.order - b.order);
  }, []);

  return {
    tasks: tasks || [],
    todayTasks: todayTasks || [],
    dailyTasks: dailyTasks || [],
    todoTasks: todoTasks || [],
    completedTasks: completedTasks || [],
    pendingTasks: pendingTasks || [],
    createTask,
    updateTask,
    deleteTask,
    addTask,
    editTask,
    toggleTaskCompletion,
    completeTask: toggleTaskCompletion, // 别名，保持向后兼容
    reorderTasks,
    performReset,
    checkAndResetDaily,
  };
}
