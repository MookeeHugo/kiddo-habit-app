/**
 * RewardCard 组件 - 奖励卡片
 *
 * 功能：
 * - 显示奖励信息（图标、名称、描述、积分）
 * - 显示已兑换/可兑换状态
 * - 兑换按钮
 * - 动画效果
 */

import { motion } from 'framer-motion';
import { type Reward } from '../lib/db';
import { Card, Badge, Button } from './ui';

export interface RewardCardProps {
  reward: Reward;
  userPoints: number; // 用户当前可用积分
  onRedeem?: (rewardId: string) => void;
  onEdit?: (rewardId: string) => void;
  onDelete?: (rewardId: string) => void;
}

export function RewardCard({
  reward,
  userPoints,
  onRedeem,
  onEdit,
  onDelete,
}: RewardCardProps) {
  const canAfford = userPoints >= reward.cost;
  const isRedeemed = reward.redeemed;

  // 奖励类型标签和颜色
  const categoryInfo = {
    toy: { label: '玩具', color: 'yellow' as const, icon: '🎁' },
    activity: { label: '活动', color: 'primary' as const, icon: '🎮' },
    privilege: { label: '特权', color: 'warning' as const, icon: '👑' },
  };

  const category = categoryInfo[reward.category];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`
        ${isRedeemed && 'opacity-60'}
      `}
    >
      <Card
        variant={isRedeemed ? 'default' : canAfford ? 'primary' : 'default'}
        className={`
          relative
          ${!canAfford && !isRedeemed && 'border-gray-300'}
        `}
      >
        {/* 已兑换标记 */}
        {isRedeemed && (
          <div className="absolute top-2 right-2">
            <Badge variant="success" size="small" icon="✓">
              已兑换
            </Badge>
          </div>
        )}

        {/* 奖励图标 */}
        <div className="text-center mb-4">
          <motion.div
            animate={!isRedeemed && canAfford ? { scale: [1, 1.1, 1] } : {}}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatDelay: 2,
            }}
            className="text-7xl"
          >
            {reward.icon}
          </motion.div>
        </div>

        {/* 奖励信息 */}
        <div className="space-y-4">
          {/* 奖励名称 */}
          <h3 className="text-2xl font-bold text-gray-800 text-center">
            {reward.title}
          </h3>

          {/* 奖励描述 */}
          <p className="text-base text-gray-600 text-center min-h-[3.5rem]">
            {reward.description}
          </p>

          {/* 奖励类型和积分 */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <Badge variant={category.color} icon={category.icon}>
              {category.label}
            </Badge>
            <Badge
              variant={canAfford ? 'yellow' : 'gray'}
              icon="⭐"
              size="medium"
            >
              {reward.cost} 积分
            </Badge>
          </div>

          {/* 兑换时间 */}
          {isRedeemed && reward.redeemedAt && (
            <p className="text-xs text-gray-500 text-center">
              兑换于: {new Date(reward.redeemedAt).toLocaleDateString('zh-CN')}
            </p>
          )}

          {/* 操作按钮 */}
          {!isRedeemed && (
            <div className="pt-2 space-y-2">
              {/* 兑换按钮 */}
              <Button
                variant={canAfford ? 'success' : 'secondary'}
                fullWidth
                disabled={!canAfford}
                onClick={() => onRedeem?.(reward.id)}
                icon={canAfford ? '🎁' : '🔒'}
              >
                {canAfford ? '立即兑换' : `还需 ${reward.cost - userPoints} 积分`}
              </Button>

              {/* 编辑和删除按钮 */}
              {(onEdit || onDelete) && (
                <div className="flex gap-2">
                  {onEdit && (
                    <Button
                      variant="secondary"
                      size="small"
                      fullWidth
                      onClick={() => onEdit(reward.id)}
                    >
                      编辑
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="danger"
                      size="small"
                      fullWidth
                      onClick={() => onDelete(reward.id)}
                    >
                      删除
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
