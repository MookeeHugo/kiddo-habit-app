/**
 * Dashboard 页面 - 主应用界面
 *
 * 功能：
 * - 显示用户统计信息
 * - 任务管理（显示、完成、添加、编辑、删除）
 * - 奖励商店（显示、兑换）
 * - 成就展示
 */

import { useState, useEffect, useRef } from 'react';
import { TaskCard } from '../components/TaskCard';
import { TaskForm } from '../components/TaskForm';
import { UserStats } from '../components/UserStats';
import { RewardCard } from '../components/RewardCard';
import { RewardForm } from '../components/RewardForm';
import { AchievementBadge } from '../components/AchievementBadge';
import { UserManagement } from '../components/UserManagement';
import { LoginPage } from './LoginPage';
import {
  WeeklyTaskChart,
  PointsTrendChart,
  AchievementProgressChart,
  TaskTypeChart,
  OverallStatsCard,
} from '../components/StatsCharts';
import { Button, useToast, Card } from '../components/ui';
import { useTasks } from '../hooks/useTasks';
import { useRewards } from '../hooks/useRewards';
import { useUser } from '../hooks/useUser';
import { useAchievements } from '../hooks/useAchievements';
import { useDataBackup } from '../hooks/useDataBackup';
import { useStats } from '../hooks/useStats';
import { useSound } from '../hooks/useSound';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { useAppConfig } from '../hooks/useAppConfig';
import { type Task, type Reward } from '../lib/db';

type Tab = 'tasks' | 'rewards' | 'achievements' | 'stats' | 'settings';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('tasks');
  const [taskFormOpen, setTaskFormOpen] = useState(false);
  const [taskFormMode, setTaskFormMode] = useState<'add' | 'edit'>('add');
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [rewardFormOpen, setRewardFormOpen] = useState(false);
  const [rewardFormMode, setRewardFormMode] = useState<'add' | 'edit'>('add');
  const [editingReward, setEditingReward] = useState<Reward | undefined>(undefined);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const { showToast } = useToast();

  // 数据和操作
  const { user } = useUser();
  const { checkAuth, logout } = useAuth();
  const { config, updateConfig, resetConfig } = useAppConfig();
  const {
    pendingTasks,
    completedTasks,
    toggleTaskCompletion,
    addTask,
    editTask,
    deleteTask,
    checkAndResetDaily,
  } = useTasks();
  const {
    availableRewards,
    redeemedRewards,
    redeemReward,
    addReward,
    editReward,
    deleteReward,
  } = useRewards();
  const {
    unlockedAchievements,
    lockedAchievements,
    getUserProgress,
  } = useAchievements();
  const {
    downloadData,
    importFromFile,
    clearAllData,
    getDataStats,
  } = useDataBackup();
  const {
    weeklyTaskStats,
    pointsTrendData,
    achievementStats,
    taskTypeDistribution,
    overallStats,
  } = useStats();
  const {
    soundEnabled,
    volume,
    play: playSound,
    toggleSound,
    changeVolume,
  } = useSound();
  const { theme, changeTheme, currentThemeConfig, allThemes } = useTheme();

  // 文件上传ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 数据统计状态
  const [dataStats, setDataStats] = useState({
    tasks: 0,
    rewards: 0,
    achievements: 0,
    dailyHistory: 0,
  });

  // 检查登录状态
  useEffect(() => {
    const checkLoginStatus = async () => {
      setIsCheckingAuth(true);
      const loggedInUser = await checkAuth();
      setIsLoggedIn(!!loggedInUser);
      setIsCheckingAuth(false);
    };

    checkLoginStatus();
  }, []);

  // 处理登出
  const handleLogout = () => {
    if (confirm('确定要登出吗？')) {
      logout();
      setIsLoggedIn(false);
      showToast('已登出', 'success');
    }
  };

  // 处理登录成功
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  // 应用启动时检查并执行每日重置
  useEffect(() => {
    const performDailyResetCheck = async () => {
      try {
        const wasReset = await checkAndResetDaily();
        if (wasReset) {
          showToast('新的一天开始了！任务已重置 🌅', 'success');
        }
      } catch (error) {
        console.error('每日重置检查失败:', error);
      }
    };

    performDailyResetCheck();
  }, []); // 仅在组件挂载时执行一次

  // 加载数据统计
  useEffect(() => {
    const loadStats = async () => {
      const stats = await getDataStats();
      setDataStats(stats);
    };

    if (activeTab === 'settings') {
      loadStats();
    }
  }, [activeTab, getDataStats]);

  // 打开添加任务表单
  const handleOpenAddTask = () => {
    setTaskFormMode('add');
    setEditingTask(undefined);
    setTaskFormOpen(true);
  };

  // 打开编辑任务表单
  const handleOpenEditTask = (taskId: string) => {
    const task = pendingTasks?.find((t) => t.id === taskId);
    if (task) {
      setTaskFormMode('edit');
      setEditingTask(task);
      setTaskFormOpen(true);
    }
  };

  // 处理任务表单提交
  const handleTaskFormSubmit = async (taskData: Partial<Task>) => {
    try {
      if (taskFormMode === 'add') {
        await addTask(taskData);
        playSound('success');
        showToast('任务添加成功！🎯', 'success');
      } else if (taskFormMode === 'edit' && editingTask) {
        await editTask(editingTask.id, taskData);
        playSound('success');
        showToast('任务更新成功！✏️', 'success');
      }
      setTaskFormOpen(false);
    } catch (error) {
      playSound('error');
      showToast('操作失败，请重试', 'error');
      console.error(error);
    }
  };

  // 处理任务完成
  const handleCompleteTask = async (taskId: string) => {
    try {
      await toggleTaskCompletion(taskId);
      playSound('task_complete');
      showToast('任务完成！获得奖励 🎉', 'success');
    } catch (error) {
      playSound('error');
      showToast('完成任务失败', 'error');
      console.error(error);
    }
  };

  // 打开添加奖励表单
  const handleOpenAddReward = () => {
    setRewardFormMode('add');
    setEditingReward(undefined);
    setRewardFormOpen(true);
  };

  // 打开编辑奖励表单
  const handleOpenEditReward = (rewardId: string) => {
    const reward = availableRewards?.find((r) => r.id === rewardId);
    if (reward) {
      setRewardFormMode('edit');
      setEditingReward(reward);
      setRewardFormOpen(true);
    }
  };

  // 处理奖励表单提交
  const handleRewardFormSubmit = async (rewardData: Partial<Reward>) => {
    try {
      if (rewardFormMode === 'add') {
        await addReward(rewardData);
        playSound('success');
        showToast('奖励添加成功！🎁', 'success');
      } else if (rewardFormMode === 'edit' && editingReward) {
        await editReward(editingReward.id, rewardData);
        playSound('success');
        showToast('奖励更新成功！✏️', 'success');
      }
      setRewardFormOpen(false);
    } catch (error) {
      playSound('error');
      showToast('操作失败，请重试', 'error');
      console.error(error);
    }
  };

  // 处理奖励兑换
  const handleRedeemReward = async (rewardId: string) => {
    try {
      await redeemReward(rewardId);
      playSound('reward_redeem');
      showToast('奖励兑换成功！🎁', 'success');
    } catch (error) {
      playSound('error');
      showToast(
        error instanceof Error ? error.message : '兑换失败',
        'error'
      );
      console.error(error);
    }
  };

  // 处理数据导出
  const handleExportData = async () => {
    try {
      await downloadData();
      showToast('数据导出成功！📦', 'success');
    } catch (error) {
      showToast('导出数据失败，请重试', 'error');
      console.error(error);
    }
  };

  // 处理数据导入
  const handleImportData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await importFromFile(file, false); // 覆盖模式
      showToast('数据导入成功！📥', 'success');

      // 刷新数据统计
      const stats = await getDataStats();
      setDataStats(stats);

      // 重置文件输入
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : '导入数据失败',
        'error'
      );
      console.error(error);
    }
  };

  // 处理数据清空
  const handleClearData = async () => {
    // 二次确认
    const confirmed = window.confirm(
      '⚠️ 确定要清空所有数据吗？\n\n此操作将：\n- 删除所有任务和奖励\n- 重置用户等级和积分\n- 清空历史记录\n- 重置所有成就\n\n此操作不可恢复！建议先导出数据备份。'
    );

    if (!confirmed) return;

    try {
      await clearAllData();
      showToast('所有数据已清空！🗑️', 'success');

      // 刷新数据统计
      const stats = await getDataStats();
      setDataStats(stats);
    } catch (error) {
      showToast('清空数据失败，请重试', 'error');
      console.error(error);
    }
  };

  // 标签页配置
  const tabs = [
    { id: 'tasks' as Tab, label: '我的任务', icon: '📝' },
    { id: 'rewards' as Tab, label: '奖励商店', icon: '🎁' },
    { id: 'achievements' as Tab, label: '成就墙', icon: '🏆' },
    { id: 'stats' as Tab, label: '数据统计', icon: '📊' },
    { id: 'settings' as Tab, label: '设置', icon: '⚙️' },
  ];

  // 显示登录页面
  if (!isLoggedIn) {
    if (isCheckingAuth) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <p className="text-gray-600">加载中...</p>
        </div>
      );
    }
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-gray-600">加载中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* 页面标题 - 响应式优化 */}
        <div className="text-center pt-2 sm:pt-0">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-1 sm:mb-2">
            🌟 {config.appName} 🌟
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            {config.appSlogan}
          </p>
        </div>

        {/* 用户统计信息 */}
        <UserStats user={user} />

        {/* 标签页导航 - 响应式优化 */}
        <div className="flex items-center justify-start sm:justify-center gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'primary' : 'secondary'}
              size="medium"
              className="sm:!text-lg flex-shrink-0"
              icon={tab.icon}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="whitespace-nowrap">{tab.label}</span>
            </Button>
          ))}
        </div>

        {/* 任务页面 */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            {/* 待完成任务 */}
            <section>
              <div className="flex items-center justify-between gap-3 mb-3 sm:mb-4">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
                  📋 待完成任务
                </h2>
                <Button
                  variant="success"
                  size="medium"
                  icon="➕"
                  onClick={handleOpenAddTask}
                >
                  <span className="hidden sm:inline">添加任务</span>
                  <span className="sm:hidden">添加</span>
                </Button>
              </div>

              {pendingTasks && pendingTasks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pendingTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onComplete={handleCompleteTask}
                      onEdit={handleOpenEditTask}
                      onDelete={deleteTask}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-6xl mb-4">🎉</p>
                  <p className="text-xl text-gray-600">
                    太棒了！所有任务都完成了！
                  </p>
                </div>
              )}
            </section>

            {/* 已完成任务 */}
            {completedTasks && completedTasks.length > 0 && (
              <section>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
                  ✅ 已完成任务
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {completedTasks.slice(0, 6).map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onComplete={handleCompleteTask}
                      onDelete={deleteTask}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* 奖励商店页面 */}
        {activeTab === 'rewards' && (
          <div className="space-y-6">
            {/* 可兑换奖励 */}
            <section>
              <div className="flex items-center justify-between gap-3 mb-3 sm:mb-4">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
                  🎁 可兑换奖励
                </h2>
                <Button
                  variant="warning"
                  size="medium"
                  icon="➕"
                  onClick={handleOpenAddReward}
                >
                  <span className="hidden sm:inline">添加奖励</span>
                  <span className="sm:hidden">添加</span>
                </Button>
              </div>

              {availableRewards && availableRewards.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableRewards.map((reward) => (
                    <RewardCard
                      key={reward.id}
                      reward={reward}
                      userPoints={user.availablePoints}
                      onRedeem={handleRedeemReward}
                      onEdit={handleOpenEditReward}
                      onDelete={deleteReward}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-6xl mb-4">🎁</p>
                  <p className="text-xl text-gray-600">
                    还没有可兑换的奖励，快去添加吧！
                  </p>
                </div>
              )}
            </section>

            {/* 已兑换奖励 */}
            {redeemedRewards && redeemedRewards.length > 0 && (
              <section>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
                  ✨ 已兑换奖励
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {redeemedRewards.slice(0, 6).map((reward) => (
                    <RewardCard
                      key={reward.id}
                      reward={reward}
                      userPoints={user.availablePoints}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* 成就墙页面 */}
        {activeTab === 'achievements' && (
          <div className="space-y-6">
            {/* 已解锁成就 */}
            {unlockedAchievements && unlockedAchievements.length > 0 && (
              <section>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
                  🏆 已解锁成就
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {unlockedAchievements.map((achievement) => (
                    <AchievementBadge
                      key={achievement.id}
                      achievement={achievement}
                      progress={getUserProgress(achievement)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* 待解锁成就 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                🔒 待解锁成就
              </h2>
              {lockedAchievements && lockedAchievements.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {lockedAchievements.map((achievement) => (
                    <AchievementBadge
                      key={achievement.id}
                      achievement={achievement}
                      progress={getUserProgress(achievement)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-6xl mb-4">🎉</p>
                  <p className="text-xl text-gray-600">
                    恭喜！你已经解锁了所有成就！
                  </p>
                </div>
              )}
            </section>
          </div>
        )}

        {/* 数据统计页面 */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            {/* 总体数据统计 */}
            <section>
              <OverallStatsCard stats={overallStats} />
            </section>

            {/* 图表展示 */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 每周任务完成趋势 */}
              <WeeklyTaskChart data={weeklyTaskStats} />

              {/* 积分累计趋势 */}
              <PointsTrendChart data={pointsTrendData} />
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 成就完成率 */}
              <AchievementProgressChart stats={achievementStats} />

              {/* 任务类型分布 */}
              <TaskTypeChart data={taskTypeDistribution} />
            </section>
          </div>
        )}

        {/* 设置页面 */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* 账号管理 */}
            <section>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
                👤 账号管理
              </h2>

              {/* 当前用户信息和登出 */}
              <Card className="mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-5xl">{user.avatar}</div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        {user.name}
                        {user.role === 'admin' && (
                          <span className="inline-flex items-center px-2 py-1 bg-warning text-gray-800 text-xs font-bold rounded-full">
                            👑 管理员
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-600">@{user.username}</p>
                    </div>
                  </div>
                  <Button
                    variant="danger"
                    size="medium"
                    icon="🚪"
                    onClick={handleLogout}
                  >
                    登出
                  </Button>
                </div>
              </Card>

              {/* 用户管理（仅管理员可见） */}
              {user.role === 'admin' && (
                <UserManagement currentUser={user} />
              )}
            </section>

            {/* 应用设置 */}
            <section>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
                ⚙️ 应用设置
              </h2>

              <Card className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  ✏️ 自定义名称和简介
                </h3>

                <div className="space-y-4">
                  {/* 应用名称 */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      应用名称
                    </label>
                    <input
                      type="text"
                      value={config.appName}
                      onChange={(e) => updateConfig({ appName: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none text-lg"
                      placeholder="例如：日新伴学小助手"
                    />
                  </div>

                  {/* 应用简介 */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      应用简介
                    </label>
                    <input
                      type="text"
                      value={config.appSlogan}
                      onChange={(e) => updateConfig({ appSlogan: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none text-lg"
                      placeholder="例如：坚持好习惯，成就小英雄！"
                    />
                  </div>

                  {/* 重置按钮 */}
                  <div className="pt-2">
                    <Button
                      variant="secondary"
                      size="medium"
                      icon="🔄"
                      onClick={() => {
                        if (confirm('确定要恢复默认名称和简介吗？')) {
                          resetConfig();
                          showToast('已恢复默认设置', 'success');
                        }
                      }}
                    >
                      恢复默认
                    </Button>
                  </div>
                </div>
              </Card>
            </section>

            {/* 数据管理 */}
            <section>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
                📦 数据管理
              </h2>

              {/* 数据统计卡片 */}
              <Card className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  📊 数据统计
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-primary">
                      {dataStats.tasks}
                    </p>
                    <p className="text-base text-gray-600 mt-2">任务</p>
                  </div>
                  <div className="text-center">
                    <p className="text-4xl font-bold text-warning">
                      {dataStats.rewards}
                    </p>
                    <p className="text-base text-gray-600 mt-2">奖励</p>
                  </div>
                  <div className="text-center">
                    <p className="text-4xl font-bold text-success">
                      {dataStats.achievements}
                    </p>
                    <p className="text-base text-gray-600 mt-2">成就</p>
                  </div>
                  <div className="text-center">
                    <p className="text-4xl font-bold text-secondary">
                      {dataStats.dailyHistory}
                    </p>
                    <p className="text-base text-gray-600 mt-2">历史记录</p>
                  </div>
                </div>
              </Card>

              {/* 数据操作按钮组 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 导出数据 */}
                <Card>
                  <div className="text-center">
                    <div className="text-7xl mb-4">📤</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">
                      导出数据
                    </h3>
                    <p className="text-base text-gray-600 mb-5">
                      将所有数据导出为JSON文件，可用于备份或迁移到其他设备
                    </p>
                    <Button
                      variant="primary"
                      size="large"
                      onClick={handleExportData}
                      className="w-full"
                    >
                      导出备份文件
                    </Button>
                  </div>
                </Card>

                {/* 导入数据 */}
                <Card>
                  <div className="text-center">
                    <div className="text-7xl mb-4">📥</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">
                      导入数据
                    </h3>
                    <p className="text-base text-gray-600 mb-5">
                      从备份文件恢复数据。注意：此操作将覆盖当前所有数据
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".json"
                      onChange={handleImportData}
                      className="hidden"
                    />
                    <Button
                      variant="success"
                      size="large"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full"
                    >
                      选择备份文件
                    </Button>
                  </div>
                </Card>

                {/* 清空数据 */}
                <Card>
                  <div className="text-center">
                    <div className="text-7xl mb-4">🗑️</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">
                      清空数据
                    </h3>
                    <p className="text-base text-gray-600 mb-5">
                      删除所有任务、奖励和历史记录，重置用户数据到初始状态
                    </p>
                    <Button
                      variant="danger"
                      size="large"
                      onClick={handleClearData}
                      className="w-full"
                    >
                      清空所有数据
                    </Button>
                  </div>
                </Card>
              </div>

              {/* 注意事项 */}
              <Card className="mt-6 bg-yellow-50 border-2 border-warning">
                <div className="flex items-start gap-4">
                  <span className="text-4xl">⚠️</span>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3">
                      重要提示
                    </h3>
                    <ul className="text-base text-gray-700 space-y-2 list-disc list-inside">
                      <li>建议定期导出数据进行备份，防止意外丢失</li>
                      <li>导入数据会覆盖当前所有数据，请先备份</li>
                      <li>清空数据操作不可恢复，请谨慎使用</li>
                      <li>数据仅保存在本地浏览器中，清除浏览器数据会导致数据丢失</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </section>

            {/* 音效设置 */}
            <section>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
                🔊 音效设置
              </h2>
              <Card>
                <div className="space-y-6">
                  {/* 音效开关 */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">启用音效</h3>
                      <p className="text-sm text-gray-600">
                        开启或关闭所有游戏音效提示
                      </p>
                    </div>
                    <Button
                      variant={soundEnabled ? 'success' : 'secondary'}
                      size="large"
                      onClick={toggleSound}
                    >
                      {soundEnabled ? '🔊 已开启' : '🔇 已关闭'}
                    </Button>
                  </div>

                  {/* 音量控制 */}
                  <div className={soundEnabled ? '' : 'opacity-50'}>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-lg font-bold text-gray-800">
                        音量
                      </label>
                      <span className="text-lg font-bold text-primary">
                        {Math.round(volume * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume * 100}
                      onChange={(e) => changeVolume(Number(e.target.value) / 100)}
                      disabled={!soundEnabled}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                      style={{
                        accentColor: '#4ECDC4',
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>静音</span>
                      <span>最大</span>
                    </div>
                  </div>

                  {/* 测试音效按钮 */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      测试音效
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="success"
                        onClick={() => playSound('success')}
                        disabled={!soundEnabled}
                      >
                        ✅ 成功提示
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => playSound('error')}
                        disabled={!soundEnabled}
                      >
                        ❌ 错误提示
                      </Button>
                      <Button
                        variant="primary"
                        onClick={() => playSound('task_complete')}
                        disabled={!soundEnabled}
                      >
                        🎯 任务完成
                      </Button>
                      <Button
                        variant="warning"
                        onClick={() => playSound('reward_redeem')}
                        disabled={!soundEnabled}
                      >
                        🎁 奖励兑换
                      </Button>
                    </div>
                  </div>

                  {/* 音效说明 */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <span className="text-xl">💡</span>
                      <div className="text-sm text-gray-700">
                        <p className="font-bold mb-1">音效说明：</p>
                        <p>
                          应用会在完成任务、兑换奖励等操作时播放音效。
                          如果音效文件未加载，系统会自动使用程序化音效作为替代。
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </section>

            {/* 主题设置 */}
            <section>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
                🎨 主题设置
              </h2>
              <Card>
                <div className="space-y-6">
                  {/* 当前主题 */}
                  <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">当前主题</h3>
                      <p className="text-sm text-gray-600">
                        {currentThemeConfig.icon} {currentThemeConfig.name}
                      </p>
                    </div>
                    <div
                      className="w-12 h-12 rounded-full border-2 border-gray-200"
                      style={{
                        backgroundColor: currentThemeConfig.primary,
                      }}
                    />
                  </div>

                  {/* 主题选择 */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-3">
                      选择主题
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {allThemes.map((themeConfig) => {
                        const isActive = theme === themeConfig.id;
                        return (
                          <button
                            key={themeConfig.id}
                            onClick={() => changeTheme(themeConfig.id)}
                            className={`
                              p-4 rounded-xl border-2 transition-all duration-300
                              hover:scale-105 hover:shadow-md
                              ${
                                isActive
                                  ? 'border-primary bg-primary-100 shadow-primary'
                                  : 'border-gray-200 bg-white hover:border-gray-300'
                              }
                            `}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className="w-10 h-10 rounded-full flex-shrink-0 border-2 border-white shadow-md"
                                style={{
                                  backgroundColor: themeConfig.primary,
                                }}
                              />
                              <div className="text-left">
                                <div className="font-bold text-gray-800 flex items-center gap-1">
                                  <span className="text-xl">{themeConfig.icon}</span>
                                  <span>{themeConfig.name}</span>
                                </div>
                                <p className="text-xs text-gray-600 mt-1">
                                  {themeConfig.description}
                                </p>
                              </div>
                            </div>
                            {isActive && (
                              <div className="mt-3 text-center">
                                <span className="inline-block px-3 py-1 bg-primary text-white text-xs font-bold rounded-full">
                                  ✓ 使用中
                                </span>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 主题说明 */}
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <span className="text-xl">🌈</span>
                      <div className="text-sm text-gray-700">
                        <p className="font-bold mb-1">主题说明：</p>
                        <p>
                          不同的主题颜色可以帮助你保持新鲜感！
                          选择你喜欢的颜色，让学习更有趣。
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </section>

            {/* 关于应用 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                ℹ️ 关于
              </h2>
              <Card>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    🌟 {config.appName} 🌟
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {config.appSlogan}
                  </p>
                  <div className="text-sm text-gray-500 space-y-1">
                    <p>版本：1.0.0</p>
                    <p>灵感来源：Habitica</p>
                    <p>使用技术：React + TypeScript + IndexedDB</p>
                  </div>
                </div>
              </Card>
            </section>
          </div>
        )}
      </div>

      {/* 任务表单 */}
      <TaskForm
        isOpen={taskFormOpen}
        onClose={() => setTaskFormOpen(false)}
        onSubmit={handleTaskFormSubmit}
        initialData={editingTask}
        mode={taskFormMode}
      />

      {/* 奖励表单 */}
      <RewardForm
        isOpen={rewardFormOpen}
        onClose={() => setRewardFormOpen(false)}
        onSubmit={handleRewardFormSubmit}
        initialData={editingReward}
        mode={rewardFormMode}
      />
    </div>
  );
}
