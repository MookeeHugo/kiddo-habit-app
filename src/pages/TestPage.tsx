/**
 * 测试页面 - 验证基础架构
 */

import { useState, useEffect } from 'react';
import { useUser } from '../hooks/useUser';
import { useTasks } from '../hooks/useTasks';
import { useRewards } from '../hooks/useRewards';
import { useAchievements } from '../hooks/useAchievements';
import {
  getExpForNextLevel,
  getLevelTitle,
  calculateStreakMultiplier,
  GAME_CONSTANTS,
} from '../lib/gamification';

export default function TestPage() {
  const { user, isLoading, completeTask, updateUserInfo } = useUser();
  const { tasks, createTask, toggleTaskCompletion, checkAndResetDaily } = useTasks();
  const { rewards, createReward, redeemReward } = useRewards();
  const { achievements, unlockedAchievements } = useAchievements();

  const [testResults, setTestResults] = useState<string[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);

  // 添加测试日志
  const addLog = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const prefix = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
    setTestResults((prev) => [...prev, `[${timestamp}] ${prefix} ${message}`]);
  };

  // 运行自动化测试
  const runTests = async () => {
    setIsRunningTests(true);
    setTestResults([]);

    try {
      addLog('开始测试基础架构...');

      // 测试1：用户数据
      addLog('测试1: 用户数据加载');
      if (!user) {
        addLog('用户数据未加载', 'error');
        return;
      }
      addLog(`用户: ${user.name}, 等级: ${user.level}, 积分: ${user.totalPoints}`, 'success');

      // 测试2：等级系统计算
      addLog('测试2: 等级系统计算');
      const requiredExp = getExpForNextLevel(user.level);
      const levelTitle = getLevelTitle(user.level);
      addLog(`升级所需经验: ${requiredExp}, 称号: ${levelTitle}`, 'success');

      // 测试3：Streak加成计算
      addLog('测试3: Streak加成计算');
      const streak1 = calculateStreakMultiplier(1);
      const streak8 = calculateStreakMultiplier(8);
      const streak15 = calculateStreakMultiplier(15);
      addLog(`Streak 1天: ${streak1}x, 8天: ${streak8}x, 15天: ${streak15}x`, 'success');

      // 测试4：创建测试任务
      addLog('测试4: 创建测试任务');
      const testTask = await createTask({
        type: 'daily',
        title: '测试任务：早晚刷牙',
        description: '这是一个测试任务',
        icon: '🦷',
        difficulty: 'easy',
        repeatDays: [1, 2, 3, 4, 5], // 周一到周五
      });
      addLog(`任务创建成功: ${testTask.title} (ID: ${testTask.id.substring(0, 8)}...)`, 'success');

      // 测试5：完成任务
      addLog('测试5: 完成任务并获取奖励');
      const result = await toggleTaskCompletion(testTask.id);
      if (result.reward) {
        addLog(
          `获得奖励: ${result.reward.reward.points}积分, ${result.reward.reward.experience}经验`,
          'success'
        );
        if (result.reward.levelUp) {
          addLog(`🎉 升级了！新等级: ${result.reward.newLevel}`, 'success');
        }
        if (result.reward.newAchievements.length > 0) {
          addLog(`🏆 解锁成就: ${result.reward.newAchievements.join(', ')}`, 'success');
        }
      }

      // 测试6：创建测试奖励
      addLog('测试6: 创建测试奖励');
      const testReward = await createReward({
        title: '测试奖励：玩具小汽车',
        description: '完成任务后可以兑换',
        cost: 50,
        icon: '🚗',
        category: 'toy',
      });
      addLog(`奖励创建成功: ${testReward.title} (需要${testReward.cost}积分)`, 'success');

      // 测试7：成就系统
      addLog('测试7: 成就系统');
      addLog(`总成就数: ${achievements.length}`, 'info');
      addLog(`已解锁: ${unlockedAchievements.length}`, 'info');
      addLog(`未解锁: ${achievements.length - unlockedAchievements.length}`, 'info');

      // 测试8：每日重置检查
      addLog('测试8: 检查每日重置');
      const needsReset = await checkAndResetDaily();
      addLog(needsReset ? '执行了每日重置' : '今日已重置，无需重复', 'success');

      addLog('✅ 所有测试通过！', 'success');
    } catch (error) {
      addLog(`测试失败: ${error}`, 'error');
      console.error('Test error:', error);
    } finally {
      setIsRunningTests(false);
    }
  };

  // 清空测试数据
  const clearTestData = async () => {
    if (!confirm('确定要清空所有测试数据吗？这将删除所有任务和奖励。')) {
      return;
    }

    try {
      // 删除所有任务
      for (const task of tasks) {
        await useTasks().deleteTask(task.id);
      }

      // 删除所有奖励（未兑换的）
      for (const reward of rewards) {
        if (!reward.redeemed) {
          await useRewards().deleteReward(reward.id);
        }
      }

      addLog('测试数据已清空', 'success');
    } catch (error) {
      addLog(`清空失败: ${error}`, 'error');
    }
  };

  // 检查每日重置
  useEffect(() => {
    if (user) {
      checkAndResetDaily().catch(console.error);
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center">
        <div className="text-2xl text-text-primary">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-primary p-6">
      <div className="max-w-4xl mx-auto">
        {/* 标题 */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-text-primary mb-2">
            🧪 基础架构测试页面
          </h1>
          <p className="text-text-secondary">
            验证数据库、游戏化逻辑和Hooks是否正常工作
          </p>
        </header>

        {/* 用户信息卡片 */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-text-primary mb-4">👤 用户信息</h2>
          {user ? (
            <div className="space-y-2">
              <p>
                <span className="font-semibold">昵称:</span> {user.avatar} {user.name}
              </p>
              <p>
                <span className="font-semibold">等级:</span> Lv.{user.level} -{' '}
                {getLevelTitle(user.level)}
              </p>
              <p>
                <span className="font-semibold">经验值:</span> {user.experience} /{' '}
                {getExpForNextLevel(user.level)}
              </p>
              <p>
                <span className="font-semibold">总积分:</span> {user.totalPoints} ⭐
              </p>
              <p>
                <span className="font-semibold">可用积分:</span> {user.availablePoints} ⭐
              </p>
              <p>
                <span className="font-semibold">最长连续:</span> {user.longestStreak} 天
              </p>
              <p>
                <span className="font-semibold">完成任务:</span> {user.totalTasksCompleted} 个
              </p>
              <p>
                <span className="font-semibold">完美日:</span> {user.perfectDays} 天
              </p>
            </div>
          ) : (
            <p className="text-red-500">用户数据未加载</p>
          )}
        </div>

        {/* 游戏常量 */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-text-primary mb-4">⚙️ 游戏常量</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">最大等级: {GAME_CONSTANTS.MAX_LEVEL}</p>
              <p className="font-semibold">
                经验值比例: {GAME_CONSTANTS.POINTS_TO_EXP_RATIO}
              </p>
            </div>
            <div>
              <p className="font-semibold">难度积分:</p>
              <ul className="ml-4">
                <li>简单: {GAME_CONSTANTS.TASK_POINTS.easy}⭐</li>
                <li>中等: {GAME_CONSTANTS.TASK_POINTS.medium}⭐</li>
                <li>困难: {GAME_CONSTANTS.TASK_POINTS.hard}⭐</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 数据统计 */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-text-primary mb-4">📊 数据统计</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary-400">{tasks.length}</p>
              <p className="text-text-secondary">任务总数</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-400">{rewards.length}</p>
              <p className="text-text-secondary">奖励总数</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-400">
                {unlockedAchievements.length}
              </p>
              <p className="text-text-secondary">已解锁成就</p>
            </div>
          </div>
        </div>

        {/* 测试控制按钮 */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={runTests}
            disabled={isRunningTests}
            className="flex-1 bg-primary-400 hover:bg-primary-500 disabled:bg-gray-300 text-white font-bold py-4 px-6 rounded-xl transition-colors"
          >
            {isRunningTests ? '测试运行中...' : '🚀 运行自动化测试'}
          </button>
          <button
            onClick={clearTestData}
            className="bg-red-400 hover:bg-red-500 text-white font-bold py-4 px-6 rounded-xl transition-colors"
          >
            🗑️ 清空测试数据
          </button>
        </div>

        {/* 测试日志 */}
        {testResults.length > 0 && (
          <div className="bg-gray-900 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">📝 测试日志</h2>
            <div className="font-mono text-sm space-y-1 max-h-96 overflow-y-auto">
              {testResults.map((log, index) => (
                <div
                  key={index}
                  className={`${
                    log.includes('✅')
                      ? 'text-green-400'
                      : log.includes('❌')
                        ? 'text-red-400'
                        : 'text-gray-300'
                  }`}
                >
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
