/**
 * 音效管理Hook
 * 提供游戏音效播放功能和开关控制
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { soundGenerator } from '../lib/soundGenerator';

/**
 * 音效类型定义
 */
export type SoundType =
  | 'task_complete'      // 任务完成
  | 'task_delete'        // 任务删除
  | 'level_up'           // 升级
  | 'achievement_unlock' // 成就解锁
  | 'reward_redeem'      // 奖励兑换
  | 'button_click'       // 按钮点击
  | 'success'            // 成功提示
  | 'error';             // 错误提示

/**
 * 音效配置映射
 * 使用免费的音效URL或本地文件路径
 */
const SOUND_URLS: Record<SoundType, string> = {
  task_complete: '/sounds/task-complete.mp3',
  task_delete: '/sounds/task-delete.mp3',
  level_up: '/sounds/level-up.mp3',
  achievement_unlock: '/sounds/achievement-unlock.mp3',
  reward_redeem: '/sounds/reward-redeem.mp3',
  button_click: '/sounds/button-click.mp3',
  success: '/sounds/success.mp3',
  error: '/sounds/error.mp3',
};

/**
 * 音效设置存储key
 */
const SOUND_ENABLED_KEY = 'kiddo-habit-sound-enabled';
const SOUND_VOLUME_KEY = 'kiddo-habit-sound-volume';

/**
 * 音效Hook
 */
export function useSound() {
  // 音效开关状态
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem(SOUND_ENABLED_KEY);
    return saved !== null ? saved === 'true' : true; // 默认开启
  });

  // 音量设置（0-1）
  const [volume, setVolume] = useState<number>(() => {
    const saved = localStorage.getItem(SOUND_VOLUME_KEY);
    return saved !== null ? parseFloat(saved) : 0.5; // 默认50%音量
  });

  // 音效实例缓存
  const audioCache = useRef<Map<SoundType, HTMLAudioElement>>(new Map());
  // 记录加载失败的音效类型
  const failedSounds = useRef<Set<SoundType>>(new Set());

  /**
   * 预加载音效文件
   */
  useEffect(() => {
    // 预加载所有音效
    Object.entries(SOUND_URLS).forEach(([type, url]) => {
      const audio = new Audio(url);
      audio.volume = volume;
      audio.preload = 'auto';

      // 监听加载错误，标记为失败
      audio.addEventListener('error', () => {
        console.warn(`音效文件加载失败，将使用程序化音效: ${type} (${url})`);
        failedSounds.current.add(type as SoundType);
      });

      audioCache.current.set(type as SoundType, audio);
    });

    // 清理函数
    return () => {
      audioCache.current.forEach((audio) => {
        audio.pause();
        audio.src = '';
      });
      audioCache.current.clear();
    };
  }, [volume]);

  /**
   * 播放指定音效
   * @param type 音效类型
   */
  const play = useCallback((type: SoundType) => {
    // 检查音效是否开启
    if (!soundEnabled) {
      return;
    }

    // 如果音效文件加载失败，使用程序化音效
    if (failedSounds.current.has(type)) {
      soundGenerator.play(type, volume);
      return;
    }

    const audio = audioCache.current.get(type);
    if (!audio) {
      console.warn(`音效未找到: ${type}`);
      soundGenerator.play(type, volume);
      return;
    }

    try {
      // 重置播放位置
      audio.currentTime = 0;
      audio.volume = volume;

      // 播放音效（Promise处理防止报错）
      audio.play().catch((error) => {
        // 播放失败时使用程序化音效作为后备
        console.debug(`音效播放失败，使用程序化音效: ${type}`, error);
        soundGenerator.play(type, volume);
      });
    } catch (error) {
      console.debug(`音效播放异常，使用程序化音效: ${type}`, error);
      soundGenerator.play(type, volume);
    }
  }, [soundEnabled, volume]);

  /**
   * 切换音效开关
   */
  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const newValue = !prev;
      localStorage.setItem(SOUND_ENABLED_KEY, String(newValue));
      return newValue;
    });
  }, []);

  /**
   * 设置音量
   * @param newVolume 音量值（0-1）
   */
  const changeVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);
    localStorage.setItem(SOUND_VOLUME_KEY, String(clampedVolume));

    // 更新所有音效实例的音量
    audioCache.current.forEach((audio) => {
      audio.volume = clampedVolume;
    });
  }, []);

  /**
   * 启用音效
   */
  const enableSound = useCallback(() => {
    setSoundEnabled(true);
    localStorage.setItem(SOUND_ENABLED_KEY, 'true');
  }, []);

  /**
   * 禁用音效
   */
  const disableSound = useCallback(() => {
    setSoundEnabled(false);
    localStorage.setItem(SOUND_ENABLED_KEY, 'false');
  }, []);

  return {
    soundEnabled,
    volume,
    play,
    toggleSound,
    changeVolume,
    enableSound,
    disableSound,
  };
}
