/**
 * RewardForm 组件 - 奖励添加/编辑表单
 *
 * 功能：
 * - 添加新奖励
 * - 编辑现有奖励
 * - 表单验证
 */

import { useState, useEffect } from 'react';
import { Modal, Button, Badge } from './ui';
import { type Reward, type RewardCategory } from '../lib/db';
import { IconPicker } from './IconPicker';
import { REWARD_ICON_CATEGORIES } from '../lib/iconLibrary';

export interface RewardFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rewardData: Partial<Reward>) => Promise<void>;
  initialData?: Reward;
  mode: 'add' | 'edit';
}

export function RewardForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
}: RewardFormProps) {
  // 表单状态
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('🎁');
  const [category, setCategory] = useState<RewardCategory>('activity');
  const [cost, setCost] = useState(50);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 初始化表单数据
  useEffect(() => {
    if (initialData && mode === 'edit') {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setIcon(initialData.icon);
      setCategory(initialData.category);
      setCost(initialData.cost);
    } else {
      // 重置表单
      setTitle('');
      setDescription('');
      setIcon('🎁');
      setCategory('activity');
      setCost(50);
    }
  }, [initialData, mode, isOpen]);

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('请输入奖励名称');
      return;
    }

    if (cost <= 0) {
      alert('积分必须大于0');
      return;
    }

    setIsSubmitting(true);

    try {
      const rewardData: Partial<Reward> = {
        title: title.trim(),
        description: description.trim(),
        icon,
        category,
        cost,
      };

      if (mode === 'edit' && initialData) {
        rewardData.id = initialData.id;
      }

      await onSubmit(rewardData);
      onClose();
    } catch (error) {
      console.error('提交奖励失败:', error);
      alert('提交失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 奖励类别配置
  const categories = [
    { value: 'toy' as RewardCategory, label: '玩具', icon: '🎁', color: 'yellow' as const },
    { value: 'activity' as RewardCategory, label: '活动', icon: '🎮', color: 'primary' as const },
    { value: 'privilege' as RewardCategory, label: '特权', icon: '👑', color: 'warning' as const },
  ];

  // 积分预设选项
  const costPresets = [20, 50, 100, 200, 500];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'add' ? '➕ 添加新奖励' : '✏️ 编辑奖励'}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 奖励名称 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            奖励名称 *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="例如：看30分钟动画片"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none text-lg"
            required
          />
        </div>

        {/* 奖励描述 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            奖励描述
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="详细说明奖励内容..."
            rows={3}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none resize-none"
          />
        </div>

        {/* 图标选择 - 响应式优化 */}
        <div>
          <label className="block text-base font-semibold text-gray-700 mb-3">
            选择图标 ✨
          </label>
          <IconPicker
            value={icon}
            onChange={setIcon}
            categories={REWARD_ICON_CATEGORIES}
          />
        </div>

        {/* 奖励类型 - 响应式优化 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            奖励类型
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {categories.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setCategory(cat.value)}
                className={`
                  p-4 rounded-xl border-2 transition-all
                  ${
                    category === cat.value
                      ? 'border-primary bg-primary/10 scale-105'
                      : 'border-gray-200 hover:border-primary/50'
                  }
                `}
              >
                <div className="text-3xl mb-1">{cat.icon}</div>
                <div className="font-bold text-sm">{cat.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 积分设置 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            所需积分 *
          </label>

          {/* 积分输入 */}
          <div className="flex items-center gap-3 mb-3">
            <input
              type="number"
              value={cost}
              onChange={(e) => setCost(parseInt(e.target.value) || 0)}
              min="1"
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none text-lg font-bold text-center"
              required
            />
            <Badge variant="yellow" icon="⭐" size="large">
              积分
            </Badge>
          </div>

          {/* 积分快捷选择 */}
          <div className="flex gap-2 flex-wrap">
            {costPresets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setCost(preset)}
                className={`
                  px-4 py-2 rounded-xl border-2 transition-all font-semibold
                  ${
                    cost === preset
                      ? 'border-accent-yellow bg-accent-yellow/10 text-accent-yellow'
                      : 'border-gray-200 text-gray-600 hover:border-accent-yellow/50'
                  }
                `}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* 预览卡片 */}
        <div className="bg-gray-50 p-6 rounded-xl border-2 border-gray-200">
          <p className="text-xs font-semibold text-gray-600 mb-3">预览</p>
          <div className="bg-white rounded-xl p-4 text-center">
            <div className="text-6xl mb-2">{icon}</div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">
              {title || '奖励名称'}
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              {description || '奖励描述'}
            </p>
            <div className="flex items-center justify-center gap-2">
              <Badge
                variant={categories.find((c) => c.value === category)?.color}
                icon={categories.find((c) => c.value === category)?.icon}
              >
                {categories.find((c) => c.value === category)?.label}
              </Badge>
              <Badge variant="yellow" icon="⭐">
                {cost} 积分
              </Badge>
            </div>
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
              ? '添加奖励'
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
