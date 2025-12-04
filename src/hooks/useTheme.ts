/**
 * 主题管理Hook
 * 提供多主题切换功能
 */

import { useState, useEffect, useCallback } from 'react';

/**
 * 主题类型定义
 */
export type ThemeType = 'default' | 'sunshine' | 'ocean' | 'blossom';

/**
 * 主题配置
 */
export const THEMES = {
  default: {
    id: 'default' as ThemeType,
    name: '默认青绿',
    icon: '🌊',
    description: '清新自然的青绿色调',
    primary: '#4ECDC4',
  },
  sunshine: {
    id: 'sunshine' as ThemeType,
    name: '活力黄',
    icon: '☀️',
    description: '明亮温暖的黄色调',
    primary: '#FFD93D',
  },
  ocean: {
    id: 'ocean' as ThemeType,
    name: '清新蓝',
    icon: '🌈',
    description: '宁静清爽的蓝色调',
    primary: '#6BCF7F',
  },
  blossom: {
    id: 'blossom' as ThemeType,
    name: '温暖粉',
    icon: '🌸',
    description: '柔和可爱的粉色调',
    primary: '#FF9ECD',
  },
};

/**
 * 主题存储key
 */
const THEME_STORAGE_KEY = 'kiddo-habit-theme';

/**
 * 主题Hook
 */
export function useTheme() {
  // 从localStorage读取主题，默认为default
  const [theme, setTheme] = useState<ThemeType>(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return (saved as ThemeType) || 'default';
  });

  /**
   * 应用主题到DOM
   */
  const applyTheme = useCallback((themeName: ThemeType) => {
    // 设置body的data-theme属性
    document.documentElement.setAttribute('data-theme', themeName);
  }, []);

  /**
   * 初始化：从localStorage应用主题
   */
  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  /**
   * 切换主题
   * @param newTheme 新主题名称
   */
  const changeTheme = useCallback((newTheme: ThemeType) => {
    setTheme(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    applyTheme(newTheme);
  }, [applyTheme]);

  /**
   * 获取当前主题配置
   */
  const currentThemeConfig = THEMES[theme];

  /**
   * 获取所有主题列表
   */
  const allThemes = Object.values(THEMES);

  return {
    theme,
    changeTheme,
    currentThemeConfig,
    allThemes,
  };
}
