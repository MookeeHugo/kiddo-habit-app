/**
 * Web Audio API 音效生成器
 * 在没有音效文件的情况下，使用Web Audio API生成简单的提示音
 */

import type { SoundType } from '../hooks/useSound';

/**
 * 音效生成器类
 */
export class SoundGenerator {
  private audioContext: AudioContext | null = null;

  constructor() {
    // 延迟初始化AudioContext（避免自动播放策略问题）
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      this.audioContext = new AudioContext();
    }
  }

  /**
   * 播放指定类型的音效
   */
  play(type: SoundType, volume: number = 0.5) {
    if (!this.audioContext) {
      return;
    }

    // 恢复AudioContext（处理浏览器自动播放策略）
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    switch (type) {
      case 'task_complete':
        this.playTaskComplete(volume);
        break;
      case 'task_delete':
        this.playTaskDelete(volume);
        break;
      case 'level_up':
        this.playLevelUp(volume);
        break;
      case 'achievement_unlock':
        this.playAchievementUnlock(volume);
        break;
      case 'reward_redeem':
        this.playRewardRedeem(volume);
        break;
      case 'button_click':
        this.playButtonClick(volume);
        break;
      case 'success':
        this.playSuccess(volume);
        break;
      case 'error':
        this.playError(volume);
        break;
    }
  }

  /**
   * 任务完成音效 - 上升的愉悦音调
   */
  private playTaskComplete(volume: number) {
    const ctx = this.audioContext!;
    const now = ctx.currentTime;

    // 创建振荡器和增益节点
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // 连接节点
    osc.connect(gain);
    gain.connect(ctx.destination);

    // 设置音调（C大调和弦：C-E-G）
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
    osc.frequency.setValueAtTime(783.99, now + 0.2); // G5

    // 设置音量包络
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(volume * 0.3, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

    // 播放
    osc.start(now);
    osc.stop(now + 0.4);
  }

  /**
   * 任务删除音效 - 下降音调
   */
  private playTaskDelete(volume: number) {
    const ctx = this.audioContext!;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now); // A4
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.2); // A3

    gain.gain.setValueAtTime(volume * 0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  /**
   * 升级音效 - 上升音阶
   */
  private playLevelUp(volume: number) {
    const ctx = this.audioContext!;
    const now = ctx.currentTime;

    // 创建一系列上升音符
    const frequencies = [523.25, 587.33, 659.25, 783.99, 880]; // C5-D5-E5-G5-A5
    const duration = 0.15;

    frequencies.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now + index * duration);

      gain.gain.setValueAtTime(0, now + index * duration);
      gain.gain.linearRampToValueAtTime(volume * 0.3, now + index * duration + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.01, now + (index + 1) * duration);

      osc.start(now + index * duration);
      osc.stop(now + (index + 1) * duration);
    });
  }

  /**
   * 成就解锁音效 - 闪亮的和弦
   */
  private playAchievementUnlock(volume: number) {
    const ctx = this.audioContext!;
    const now = ctx.currentTime;

    // C大调七和弦
    const frequencies = [523.25, 659.25, 783.99, 987.77]; // C5-E5-G5-B5

    frequencies.forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(volume * 0.2, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);

      osc.start(now);
      osc.stop(now + 0.6);
    });
  }

  /**
   * 奖励兑换音效 - 金币音效
   */
  private playRewardRedeem(volume: number) {
    const ctx = this.audioContext!;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1046.5, now); // C6
    osc.frequency.exponentialRampToValueAtTime(1318.51, now + 0.1); // E6

    gain.gain.setValueAtTime(volume * 0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  /**
   * 按钮点击音效 - 短促的咔哒声
   */
  private playButtonClick(volume: number) {
    const ctx = this.audioContext!;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'square';
    osc.frequency.setValueAtTime(800, now);

    gain.gain.setValueAtTime(volume * 0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  /**
   * 成功提示音效
   */
  private playSuccess(volume: number) {
    const ctx = this.audioContext!;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(659.25, now); // E5
    osc.frequency.setValueAtTime(783.99, now + 0.1); // G5

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(volume * 0.25, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  /**
   * 错误提示音效
   */
  private playError(volume: number) {
    const ctx = this.audioContext!;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.2);

    gain.gain.setValueAtTime(volume * 0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    osc.start(now);
    osc.stop(now + 0.2);
  }
}

// 导出单例实例
export const soundGenerator = new SoundGenerator();
