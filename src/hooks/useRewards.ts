/**
 * 奖励数据Hook
 */

import { useLiveQuery } from 'dexie-react-hooks';
import { db, type Reward } from '../lib/db';
import { generateId } from '../lib/utils';
import { useUser } from './useUser';

/**
 * 奖励Hook
 */
export function useRewards() {
  const { redeemReward: userRedeemReward } = useUser();

  // 所有奖励
  const rewards = useLiveQuery(() => db.rewards.toArray(), []);

  // 未兑换的奖励（redeemed不是索引，需要手动过滤）
  const availableRewards = useLiveQuery(async () => {
    const allRewards = await db.rewards.toArray();
    return allRewards.filter(r => r.redeemed === false);
  }, []);

  // 已兑换的奖励（redeemed不是索引，需要手动过滤和排序）
  const redeemedRewards = useLiveQuery(async () => {
    const allRewards = await db.rewards.toArray();
    return allRewards
      .filter(r => r.redeemed === true)
      .sort((a, b) => {
        if (!a.redeemedAt || !b.redeemedAt) return 0;
        return b.redeemedAt.getTime() - a.redeemedAt.getTime();
      });
  }, []);

  /**
   * 创建新奖励
   */
  const createReward = async (rewardData: {
    title: string;
    description: string;
    cost: number;
    icon: string;
    category: 'toy' | 'activity' | 'privilege';
  }): Promise<Reward> => {
    const newReward: Reward = {
      id: generateId(),
      title: rewardData.title,
      description: rewardData.description,
      cost: rewardData.cost,
      icon: rewardData.icon,
      category: rewardData.category,
      redeemed: false,
      createdAt: new Date(),
    };

    await db.rewards.add(newReward);
    return newReward;
  };

  /**
   * 更新奖励
   */
  const updateReward = async (
    rewardId: string,
    updates: Partial<Reward>
  ): Promise<void> => {
    await db.rewards.update(rewardId, updates);
  };

  /**
   * 删除奖励
   */
  const deleteReward = async (rewardId: string): Promise<void> => {
    await db.rewards.delete(rewardId);
  };

  /**
   * 兑换奖励
   */
  const redeemReward = async (rewardId: string): Promise<void> => {
    const reward = await db.rewards.get(rewardId);
    if (!reward) throw new Error('奖励不存在');

    if (reward.redeemed) throw new Error('奖励已被兑换');

    // 调用用户的兑换方法（会检查积分是否足够）
    await userRedeemReward(rewardId, reward.cost);
  };

  /**
   * 添加奖励（用于表单）
   */
  const addReward = async (rewardData: Partial<Reward>): Promise<Reward> => {
    const newReward: Reward = {
      id: generateId(),
      title: rewardData.title || '',
      description: rewardData.description || '',
      cost: rewardData.cost || 0,
      icon: rewardData.icon || '🎁',
      category: rewardData.category || 'activity',
      redeemed: false,
      createdAt: new Date(),
    };

    await db.rewards.add(newReward);
    return newReward;
  };

  /**
   * 编辑奖励（用于表单）
   */
  const editReward = async (rewardId: string, rewardData: Partial<Reward>): Promise<void> => {
    await db.rewards.update(rewardId, {
      title: rewardData.title,
      description: rewardData.description,
      cost: rewardData.cost,
      icon: rewardData.icon,
      category: rewardData.category,
    });
  };

  return {
    rewards: rewards || [],
    availableRewards: availableRewards || [],
    redeemedRewards: redeemedRewards || [],
    createReward,
    updateReward,
    deleteReward,
    redeemReward,
    addReward,
    editReward,
  };
}
