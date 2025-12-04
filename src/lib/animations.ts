/**
 * 动画配置
 * 参考：docs/ui-mockup/animation-specifications.md
 */

/**
 * 缓动函数配置
 * 使用cubic-bezier值
 */
export const easings = {
  // 标准缓动
  easeOut: [0.33, 1, 0.68, 1] as [number, number, number, number],           // 快入慢出（按钮点击）
  easeInOut: [0.65, 0, 0.35, 1] as [number, number, number, number],         // 平滑过渡（页面切换）

  // 弹性缓动（儿童友好）
  bounceOut: [0.34, 1.56, 0.64, 1] as [number, number, number, number],      // 轻微反弹（任务完成）
  bounceLarge: [0.68, -0.55, 0.265, 1.55] as [number, number, number, number], // 大幅反弹（升级动画）

  // 特殊效果
  anticipate: [0.68, -0.6, 0.32, 1.6] as [number, number, number, number],   // 预期效果（成就解锁）
  backOut: [0.34, 1.35, 0.64, 1] as [number, number, number, number],        // 后退弹出（卡片hover）
} as const;

/**
 * 时长配置（秒）
 */
export const durations = {
  instant: 0.15,      // 150ms - 即时反馈
  fast: 0.25,         // 250ms - 快速交互
  normal: 0.35,       // 350ms - 标准动画
  slow: 0.5,          // 500ms - 慢速过渡
  celebration: 1.2,   // 1200ms - 庆祝动画
} as const;

/**
 * 检测用户是否偏好减少动画
 */
export const shouldReduceMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * 通用动画变体生成器
 */
export const createVariants = (config: {
  initial?: object;
  animate?: object;
  exit?: object;
  duration?: number;
  ease?: [number, number, number, number];
}) => ({
  initial: config.initial || { opacity: 0 },
  animate: config.animate || { opacity: 1 },
  exit: config.exit || { opacity: 0 },
  transition: {
    duration: config.duration || durations.normal,
    ease: config.ease || easings.easeInOut,
  },
});

// ==================== 预定义动画变体 ====================

/**
 * 基础动画
 */
export const animations = {
  // 淡入淡出
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },

  // 上滑入场
  slideUp: {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 },
  },

  // 下滑入场
  slideDown: {
    initial: { y: -20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 20, opacity: 0 },
  },

  // 缩放入场
  scaleIn: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 },
  },

  // 任务卡片hover
  taskCardHover: {
    hover: {
      y: -4,
      scale: 1.01,
      boxShadow: '0 12px 24px rgba(0, 0, 0, 0.12)',
      transition: { duration: durations.fast, ease: easings.backOut },
    },
    tap: {
      scale: 0.99,
      transition: { duration: durations.instant },
    },
  },

  // 复选框动画
  checkbox: {
    unchecked: {
      scale: 1,
      backgroundColor: 'var(--background-secondary)',
      borderColor: 'var(--primary-400)',
    },
    checked: {
      scale: [1, 1.1, 1],
      backgroundColor: 'var(--primary-400)',
      borderColor: 'var(--primary-400)',
      transition: { duration: 0.4, ease: easings.bounceOut },
    },
  },

  // 模态框动画
  modal: {
    backdrop: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.25 },
    },
    content: {
      initial: { y: '100%' },
      animate: {
        y: 0,
        transition: { type: 'spring', damping: 25, stiffness: 300 },
      },
      exit: {
        y: '100%',
        transition: { duration: 0.3 },
      },
    },
  },

  // 列表项动画（瀑布流）
  listItem: (index: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        delay: index * 0.05, // 每个延迟50ms
        ease: easings.easeOut,
      },
    },
  }),
} as const;

/**
 * 开发模式下显示动画性能警告
 */
export const enableAnimationDebug = (): void => {
  if (import.meta.env.DEV && typeof window !== 'undefined') {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 16.67) {
          // 超过一帧的时间（60fps）
          console.warn(
            `🐌 Slow animation detected: ${entry.name} (${entry.duration.toFixed(2)}ms)`
          );
        }
      }
    });

    try {
      observer.observe({ entryTypes: ['measure'] });
    } catch (error) {
      // 某些浏览器可能不支持
      console.log('Performance Observer not supported');
    }
  }
};

/**
 * 触发任务完成粒子效果
 * 使用canvas-confetti库
 */
export const triggerTaskCompletionConfetti = async (
  checkboxPosition: { x: number; y: number }
): Promise<void> => {
  // 动态导入confetti（代码分割）
  const confetti = (await import('canvas-confetti')).default;

  confetti({
    particleCount: 20,
    spread: 60,
    origin: {
      x: checkboxPosition.x / window.innerWidth,
      y: checkboxPosition.y / window.innerHeight,
    },
    colors: ['#FFE66D', '#FFD700', '#FFA500'], // 黄色星星
    shapes: ['star'],
    scalar: 0.8,
    gravity: 1.2,
    drift: 0,
  });
};

/**
 * 触发升级庆祝动画
 */
export const triggerLevelUpCelebration = async (): Promise<void> => {
  const confetti = (await import('canvas-confetti')).default;

  const duration = 3000;
  const end = Date.now() + duration;

  const frame = () => {
    // 左侧彩纸
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#4ECDC4', '#FFE66D', '#FF6B6B', '#95E1D3'],
    });

    // 右侧彩纸
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#4ECDC4', '#FFE66D', '#FF6B6B', '#95E1D3'],
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };

  frame();
};

/**
 * 触发成就解锁动画
 */
export const triggerAchievementUnlock = async (): Promise<void> => {
  const confetti = (await import('canvas-confetti')).default;

  // 从中心爆炸
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#FFD700', '#FFA500', '#FF6B6B'],
  });
};

// 导出所有配置
export default {
  easings,
  durations,
  shouldReduceMotion,
  createVariants,
  animations,
  enableAnimationDebug,
  triggerTaskCompletionConfetti,
  triggerLevelUpCelebration,
  triggerAchievementUnlock,
};
