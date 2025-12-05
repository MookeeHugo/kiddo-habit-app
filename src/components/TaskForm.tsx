/**
 * TaskForm 组件 - 任务添加/编辑表单
 *
 * 功能：
 * - 添加新任务
 * - 编辑现有任务
 * - 表单验证
 * - 支持所有任务字段配置
 */

import { useState, useEffect } from 'react';
import { Modal, Button } from './ui';
import { type Task, type TaskDifficulty, type TaskType } from '../lib/db';
import { IconPicker } from './IconPicker';
import { TASK_ICON_CATEGORIES } from '../lib/iconLibrary';

export interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: Partial<Task>) => Promise<void>;
  initialData?: Task;
  mode: 'add' | 'edit';
}

export function TaskForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
}: TaskFormProps) {
  // 表单状态
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('📝');
  const [type, setType] = useState<TaskType>('daily');
  const [difficulty, setDifficulty] = useState<TaskDifficulty>('medium');
  const [repeatType, setRepeatType] = useState<'daily' | 'weekly' | 'none'>('daily');
  const [repeatDays, setRepeatDays] = useState<number[]>([1, 2, 3, 4, 5]); // 周一到周五
  const [dueDate, setDueDate] = useState('');
  const [checklist, setChecklist] = useState<string[]>([]);
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 初始化表单数据
  useEffect(() => {
    if (initialData && mode === 'edit') {
      setTitle(initialData.title);
      setDescription(initialData.description || '');
      setIcon(initialData.icon);
      setType(initialData.type);
      setDifficulty(initialData.difficulty);
      // repeatType 根据 repeatDays 推断
      setRepeatType(initialData.repeatDays && initialData.repeatDays.length > 0 ? 'weekly' : 'daily');
      setRepeatDays(initialData.repeatDays || []);
      setDueDate(
        initialData.dueDate
          ? new Date(initialData.dueDate).toISOString().split('T')[0]
          : ''
      );
      setChecklist(
        initialData.checklist?.map((item) => item.text) || []
      );
    } else {
      // 重置表单
      setTitle('');
      setDescription('');
      setIcon('📝');
      setType('daily');
      setDifficulty('medium');
      setRepeatType('daily');
      setRepeatDays([1, 2, 3, 4, 5]);
      setDueDate('');
      setChecklist([]);
    }
  }, [initialData, mode, isOpen]);

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('请输入任务标题');
      return;
    }

    setIsSubmitting(true);

    try {
      const taskData: Partial<Task> = {
        title: title.trim(),
        description: description.trim(),
        icon,
        type,
        difficulty,
        repeatDays: repeatType === 'weekly' ? repeatDays : undefined,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        checklist: checklist.map((text, index) => ({
          id: `checklist-${Date.now()}-${index}`,
          text,
          completed: false,
        })),
      };

      if (mode === 'edit' && initialData) {
        taskData.id = initialData.id;
      }

      await onSubmit(taskData);
      onClose();
    } catch (error) {
      console.error('提交任务失败:', error);
      alert('提交失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 添加子任务
  const addChecklistItem = () => {
    if (newChecklistItem.trim()) {
      setChecklist([...checklist, newChecklistItem.trim()]);
      setNewChecklistItem('');
    }
  };

  // 删除子任务
  const removeChecklistItem = (index: number) => {
    setChecklist(checklist.filter((_, i) => i !== index));
  };

  // 切换重复日期
  const toggleRepeatDay = (day: number) => {
    if (repeatDays.includes(day)) {
      setRepeatDays(repeatDays.filter((d) => d !== day));
    } else {
      setRepeatDays([...repeatDays, day].sort());
    }
  };

  const weekDays = [
    { value: 0, label: '日' },
    { value: 1, label: '一' },
    { value: 2, label: '二' },
    { value: 3, label: '三' },
    { value: 4, label: '四' },
    { value: 5, label: '五' },
    { value: 6, label: '六' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'add' ? '➕ 添加新任务' : '✏️ 编辑任务'}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 任务标题 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            任务标题 *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="例如：每天阅读30分钟"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none text-lg"
            required
          />

          {/* 常用标签快捷按钮 */}
          <div className="mt-3">
            <p className="text-xs font-semibold text-gray-600 mb-2">📌 常用标签（点击填充）</p>
            <div className="flex flex-wrap gap-2">
              {[
                '练字15分钟',
                '四本课外练习',
                '读课外书15分钟',
                '英语打卡15分钟',
                '健身锻炼20分钟',
                '整理书包',
                '礼貌用语',
              ].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setTitle(tag)}
                  className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-primary hover:text-white text-gray-700 rounded-lg transition-colors duration-200 border border-gray-200 hover:border-primary"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 任务描述 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            任务描述
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="详细说明任务内容..."
            rows={3}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none resize-none"
          />
        </div>

        {/* 图标选择 */}
        <div>
          <label className="block text-base font-semibold text-gray-700 mb-3">
            选择图标 ✨
          </label>
          <IconPicker
            value={icon}
            onChange={setIcon}
            categories={TASK_ICON_CATEGORIES}
          />
        </div>

        {/* 任务类型 - 响应式优化 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            任务类型
          </label>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant={type === 'daily' ? 'primary' : 'secondary'}
              onClick={() => setType('daily')}
              size="small"
            >
              每日任务
            </Button>
            <Button
              type="button"
              variant={type === 'todo' ? 'primary' : 'secondary'}
              onClick={() => setType('todo')}
              size="small"
            >
              待办事项
            </Button>
          </div>
        </div>

        {/* 难度选择 - 响应式优化 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            任务难度
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <Button
              type="button"
              variant={difficulty === 'easy' ? 'primary' : 'secondary'}
              icon="⭐"
              onClick={() => setDifficulty('easy')}
              size="small"
              fullWidth
            >
              简单 (+5分)
            </Button>
            <Button
              type="button"
              variant={difficulty === 'medium' ? 'primary' : 'secondary'}
              icon="⚡"
              onClick={() => setDifficulty('medium')}
              size="small"
              fullWidth
            >
              中等 (+10分)
            </Button>
            <Button
              type="button"
              variant={difficulty === 'hard' ? 'primary' : 'secondary'}
              icon="🔥"
              onClick={() => setDifficulty('hard')}
              size="small"
              fullWidth
            >
              困难 (+20分)
            </Button>
          </div>
        </div>

        {/* 重复设置 (仅每日任务) */}
        {type === 'daily' && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              重复设置
            </label>
            <div className="space-y-3">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={repeatType === 'daily' ? 'primary' : 'secondary'}
                  onClick={() => setRepeatType('daily')}
                >
                  每天
                </Button>
                <Button
                  type="button"
                  variant={repeatType === 'weekly' ? 'primary' : 'secondary'}
                  onClick={() => setRepeatType('weekly')}
                >
                  每周
                </Button>
              </div>

              {repeatType === 'weekly' && (
                <div className="flex gap-2">
                  {weekDays.map((day) => (
                    <button
                      key={day.value}
                      type="button"
                      onClick={() => toggleRepeatDay(day.value)}
                      className={`
                        w-10 h-10 rounded-full font-bold transition-all
                        ${
                          repeatDays.includes(day.value)
                            ? 'bg-primary text-white scale-110'
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }
                      `}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 截止日期 (仅待办事项) */}
        {type === 'todo' && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              截止日期
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
            />
          </div>
        )}

        {/* 子任务清单 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            子任务清单
          </label>
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={newChecklistItem}
                onChange={(e) => setNewChecklistItem(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addChecklistItem())}
                placeholder="添加子任务..."
                className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
              />
              <Button type="button" onClick={addChecklistItem} icon="➕">
                添加
              </Button>
            </div>

            {checklist.length > 0 && (
              <div className="space-y-2">
                {checklist.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-xl"
                  >
                    <span className="text-gray-700">{item}</span>
                    <button
                      type="button"
                      onClick={() => removeChecklistItem(index)}
                      className="text-danger hover:text-danger/80 font-bold text-xl"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 提交按钮 */}
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            variant="success"
            fullWidth
            disabled={isSubmitting}
            icon={mode === 'add' ? '➕' : '💾'}
          >
            {isSubmitting
              ? '提交中...'
              : mode === 'add'
              ? '添加任务'
              : '保存修改'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            取消
          </Button>
        </div>
      </form>
    </Modal>
  );
}
