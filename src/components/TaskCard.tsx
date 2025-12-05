/**
 * TaskCard 组件 - 任务卡片
 *
 * 功能：
 * - 显示任务信息（标题、描述、图标、难度）
 * - 显示 Streak 连续完成天数
 * - 完成/取消完成任务
 * - 显示子任务清单
 * - 显示积分奖励
 */

import { motion } from 'framer-motion';
import { type Task } from '../lib/db';
import { Badge, Button } from './ui';
import { getDifficultyInfo } from '../lib/gamification';

export interface TaskCardProps {
  task: Task;
  onComplete: (taskId: string) => void;
  onEdit?: (taskId: string) => void;
  onDelete?: (taskId: string) => void;
}

export function TaskCard({ task, onComplete, onEdit, onDelete }: TaskCardProps) {
  const difficultyInfo = getDifficultyInfo(task.difficulty);

  // 计算子任务完成度
  const checklistTotal = task.checklist?.length || 0;
  const checklistCompleted = task.checklist?.filter(item => item.completed).length || 0;
  const checklistProgress = checklistTotal > 0 ? (checklistCompleted / checklistTotal) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`
        bg-white rounded-3xl border-2 shadow-lg p-7
        ${task.completed ? 'border-success/30 bg-success/5' : 'border-gray-200'}
      `}
    >
      {/* 顶部：图标、标题、状态 */}
      <div className="flex items-start gap-4 mb-4">
        {/* 任务图标 */}
        <div className="text-5xl flex-shrink-0">{task.icon}</div>

        {/* 任务信息 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-3">
            <h3
              className={`
                text-2xl font-bold
                ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}
              `}
            >
              {task.title}
            </h3>

            {/* 完成按钮 - 增大到44px满足WCAG标准 */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => onComplete(task.id)}
              className={`
                flex-shrink-0 w-11 h-11 rounded-full border-3
                flex items-center justify-center
                transition-all duration-200
                ${
                  task.completed
                    ? 'bg-success border-success text-white shadow-md'
                    : 'border-gray-400 hover:border-primary hover:bg-primary/5 bg-white'
                }
              `}
            >
              <span
                className={`text-xl font-extrabold leading-none ${
                  task.completed ? 'text-white' : 'text-gray-400'
                }`}
              >
                ✓
              </span>
            </motion.button>
          </div>

          {/* 任务描述 */}
          {task.description && (
            <p className="text-base text-gray-600 mb-4">{task.description}</p>
          )}

          {/* 标签行：难度、积分、Streak */}
          <div className="flex flex-wrap gap-2">
            {/* 难度标签 */}
            <Badge
              variant={difficultyInfo.color as any}
              icon={difficultyInfo.icon}
              size="small"
            >
              {difficultyInfo.label}
            </Badge>

            {/* 积分奖励 */}
            <Badge variant="yellow" icon="⭐" size="small">
              +{task.points}分
            </Badge>

            {/* Streak 连续天数 */}
            {task.streak > 0 && (
              <Badge variant="danger" icon="🔥" size="small">
                {task.streak}天连续
              </Badge>
            )}

            {/* 任务类型 */}
            <Badge variant="gray" size="small">
              {task.type === 'daily' ? '每日' : '待办'}
            </Badge>
          </div>
        </div>
      </div>

      {/* 子任务清单 */}
      {task.checklist && task.checklist.length > 0 && (
        <div className="mt-5 pt-5 border-t border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-base font-semibold text-gray-700">
              子任务 ({checklistCompleted}/{checklistTotal})
            </span>
            {checklistProgress > 0 && (
              <span className="text-sm font-bold text-primary">
                {Math.round(checklistProgress)}%
              </span>
            )}
          </div>

          <div className="space-y-3">
            {task.checklist.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 text-base"
              >
                <div
                  className={`
                    w-6 h-6 rounded border-2 flex-shrink-0 flex items-center justify-center
                    transition-all duration-200
                    ${item.completed ? 'bg-success border-success' : 'border-gray-400 bg-white'}
                  `}
                >
                  {item.completed && (
                    <span className="text-white text-sm font-extrabold leading-none">✓</span>
                  )}
                </div>
                <span
                  className={item.completed ? 'line-through text-gray-400' : 'text-gray-700'}
                >
                  {item.text}
                </span>
              </div>
            ))}
          </div>

          {/* 进度条 */}
          {checklistProgress > 0 && (
            <div className="mt-4">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${checklistProgress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* 底部操作按钮 */}
      {(onEdit || onDelete) && (
        <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
          {onEdit && (
            <Button
              size="small"
              variant="secondary"
              onClick={() => onEdit(task.id)}
            >
              编辑
            </Button>
          )}
          {onDelete && (
            <Button
              size="small"
              variant="danger"
              onClick={() => onDelete(task.id)}
            >
              删除
            </Button>
          )}
        </div>
      )}
    </motion.div>
  );
}
