/**
 * 图标库 - 为儿童友好应用提供丰富的emoji图标
 */

/**
 * 任务图标分类
 */
export const TASK_ICON_CATEGORIES = {
  // 学习类
  study: {
    label: '📚 学习',
    icons: [
      '📚', '📖', '✏️', '📝', '🖊️', '✍️',
      '📐', '📏', '🔬', '🔭', '🧪', '🧬',
      '💡', '🎓', '👨‍🎓', '📊', '📈', '🗂️',
    ],
  },
  // 运动类
  sports: {
    label: '⚽ 运动',
    icons: [
      '⚽', '🏀', '🏈', '⚾', '🎾', '🏐',
      '🏓', '🏸', '🥊', '🥋', '🤸', '🏃',
      '🚴', '🏊', '⛷️', '🏋️', '🧘', '🤾',
    ],
  },
  // 艺术类
  art: {
    label: '🎨 艺术',
    icons: [
      '🎨', '🖌️', '🖍️', '✂️', '📐', '🎭',
      '🎪', '🎬', '🎤', '🎧', '🎵', '🎶',
      '🎹', '🎸', '🎺', '🎻', '🥁', '🎼',
    ],
  },
  // 家务类
  chores: {
    label: '🧹 家务',
    icons: [
      '🧹', '🧽', '🧺', '🛏️', '🪣', '🧴',
      '🗑️', '♻️', '🌱', '💐', '🪴', '🌿',
      '🍽️', '🥄', '🔪', '🧊', '🫧', '✨',
    ],
  },
  // 健康类
  health: {
    label: '💪 健康',
    icons: [
      '💪', '🦷', '🪥', '🧼', '🛁', '🚿',
      '💊', '💉', '🩹', '🌡️', '😴', '🛌',
      '🥗', '🥦', '🥕', '🍎', '🍊', '🥛',
    ],
  },
  // 娱乐类
  fun: {
    label: '🎮 娱乐',
    icons: [
      '🎮', '🎯', '🎲', '🧩', '🪀', '🎪',
      '🎢', '🎡', '🎠', '🎨', '🎬', '📺',
      '📱', '💻', '🎧', '📷', '🎥', '🎸',
    ],
  },
  // 目标类
  goals: {
    label: '🎯 目标',
    icons: [
      '🎯', '🏆', '🥇', '🥈', '🥉', '🏅',
      '👑', '💎', '⭐', '🌟', '✨', '💫',
      '🚀', '🎊', '🎉', '🎈', '🎁', '🔥',
    ],
  },
  // 情绪类
  emotion: {
    label: '😊 情绪',
    icons: [
      '😊', '😄', '🥰', '😍', '🤗', '🤩',
      '😎', '🤓', '🧐', '🤔', '💪', '👍',
      '👏', '🙌', '👌', '✌️', '🤝', '❤️',
    ],
  },
};

/**
 * 获取所有任务图标
 */
export function getAllTaskIcons(): string[] {
  return Object.values(TASK_ICON_CATEGORIES)
    .flatMap(category => category.icons);
}

/**
 * 奖励图标分类
 */
export const REWARD_ICON_CATEGORIES = {
  // 玩具类
  toys: {
    label: '🎁 玩具',
    icons: [
      '🎁', '🧸', '🪆', '🎮', '🕹️', '🎯',
      '🎲', '🧩', '🪀', '🎪', '🎨', '✂️',
      '🧱', '🚂', '🚗', '✈️', '🚀', '🛸',
    ],
  },
  // 美食类
  food: {
    label: '🍕 美食',
    icons: [
      '🍕', '🍔', '🍟', '🌭', '🥪', '🌮',
      '🍦', '🍧', '🧁', '🎂', '🍰', '🍩',
      '🍪', '🍫', '🍬', '🍭', '🍮', '🧃',
    ],
  },
  // 活动类
  activities: {
    label: '🎪 活动',
    icons: [
      '🎪', '🎢', '🎡', '🎠', '🎭', '🎬',
      '🎤', '🎧', '🎵', '🎸', '🎮', '⚽',
      '🏀', '🎾', '🎳', '🎯', '🏊', '🚴',
    ],
  },
  // 特权类
  privileges: {
    label: '👑 特权',
    icons: [
      '👑', '💎', '⭐', '🌟', '✨', '💫',
      '🏆', '🥇', '🎖️', '🏅', '📱', '💻',
      '📺', '🎧', '🎮', '🕹️', '🔓', '🗝️',
    ],
  },
  // 奖杯类
  trophies: {
    label: '🏆 奖杯',
    icons: [
      '🏆', '🥇', '🥈', '🥉', '🏅', '🎖️',
      '👑', '💎', '💍', '📜', '🎗️', '🌟',
      '⭐', '✨', '💫', '🎯', '🔥', '💪',
    ],
  },
};

/**
 * 获取所有奖励图标
 */
export function getAllRewardIcons(): string[] {
  return Object.values(REWARD_ICON_CATEGORIES)
    .flatMap(category => category.icons);
}

/**
 * 成就图标配置
 */
export const ACHIEVEMENT_ICONS = {
  // 里程碑
  milestone: ['🏆', '🥇', '🎖️', '👑', '💎'],
  // 坚持类
  persistence: ['🔥', '💪', '⭐', '🌟', '✨'],
  // 完美类
  perfect: ['💯', '💎', '👑', '🎯', '✨'],
  // 速度类
  speed: ['⚡', '🚀', '💫', '🌠', '⏱️'],
  // 等级类
  level: ['📊', '📈', '🎓', '🧠', '💡'],
  // 社交类
  social: ['🤝', '👏', '🙌', '❤️', '🎉'],
};

/**
 * 空状态插图配置
 */
export const EMPTY_STATE_ILLUSTRATIONS = {
  noTasks: {
    icon: '📝',
    title: '还没有任务哦',
    description: '点击"添加任务"按钮创建你的第一个任务吧！',
    color: '#4ECDC4',
  },
  noRewards: {
    icon: '🎁',
    title: '还没有奖励哦',
    description: '添加一些奖励，让自己有更多动力完成任务！',
    color: '#FFE66D',
  },
  noAchievements: {
    icon: '🏆',
    title: '暂无成就',
    description: '完成更多任务，解锁你的第一个成就徽章！',
    color: '#6BCF7F',
  },
  allTasksComplete: {
    icon: '🎉',
    title: '太棒了！',
    description: '所有任务都已完成，你真是个小明星！',
    color: '#FF6B6B',
  },
  noData: {
    icon: '📊',
    title: '暂无数据',
    description: '开始使用应用后，这里就会显示统计信息啦！',
    color: '#8B5CF6',
  },
};

/**
 * 主题相关的装饰性图标
 */
export const DECORATIVE_ICONS = {
  celebration: ['🎉', '🎊', '🎈', '✨', '💫', '🌟', '⭐', '🎆', '🎇'],
  encouragement: ['💪', '👍', '👏', '🙌', '🤩', '😍', '🥰', '❤️', '💖'],
  thinking: ['🤔', '💭', '💡', '🧠', '📝', '✏️', '📖', '👀'],
  warning: ['⚠️', '❗', '❓', '⁉️', '💡', '🔔', '📢', '🚨'],
  success: ['✅', '✔️', '👍', '🎯', '💯', '🏆', '🥇', '⭐'],
  error: ['❌', '⛔', '🚫', '❗', '⚠️', '💔', '😢', '🔴'],
};

/**
 * 根据类别获取随机图标
 */
export function getRandomIcon(category: keyof typeof DECORATIVE_ICONS): string {
  const icons = DECORATIVE_ICONS[category];
  return icons[Math.floor(Math.random() * icons.length)];
}

/**
 * 获取推荐图标（根据关键词）
 */
export function getRecommendedIcons(keyword: string): string[] {
  const lowerKeyword = keyword.toLowerCase();
  const recommendations: string[] = [];

  // 任务关键词映射
  const taskKeywordMap: Record<string, string[]> = {
    '学习': TASK_ICON_CATEGORIES.study.icons,
    '读书': TASK_ICON_CATEGORIES.study.icons,
    '作业': TASK_ICON_CATEGORIES.study.icons,
    '运动': TASK_ICON_CATEGORIES.sports.icons,
    '锻炼': TASK_ICON_CATEGORIES.sports.icons,
    '跑步': TASK_ICON_CATEGORIES.sports.icons,
    '画画': TASK_ICON_CATEGORIES.art.icons,
    '音乐': TASK_ICON_CATEGORIES.art.icons,
    '唱歌': TASK_ICON_CATEGORIES.art.icons,
    '打扫': TASK_ICON_CATEGORIES.chores.icons,
    '整理': TASK_ICON_CATEGORIES.chores.icons,
    '刷牙': TASK_ICON_CATEGORIES.health.icons,
    '洗澡': TASK_ICON_CATEGORIES.health.icons,
    '睡觉': TASK_ICON_CATEGORIES.health.icons,
  };

  // 查找匹配的关键词
  for (const [key, icons] of Object.entries(taskKeywordMap)) {
    if (lowerKeyword.includes(key)) {
      recommendations.push(...icons.slice(0, 8));
    }
  }

  // 如果没有匹配，返回常用图标
  if (recommendations.length === 0) {
    return ['📝', '✏️', '📚', '🎯', '💪', '⭐', '🌟', '✨'];
  }

  // 去重并限制数量
  return [...new Set(recommendations)].slice(0, 12);
}
