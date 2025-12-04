/**
 * 应用配置管理
 */

export interface AppConfig {
  appName: string;
  appSlogan: string;
}

const DEFAULT_CONFIG: AppConfig = {
  appName: '日新伴学小助手',
  appSlogan: '坚持好习惯，成就小英雄！',
};

const CONFIG_STORAGE_KEY = 'app_config';

/**
 * 获取应用配置
 */
export const getAppConfig = (): AppConfig => {
  try {
    const stored = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        appName: parsed.appName || DEFAULT_CONFIG.appName,
        appSlogan: parsed.appSlogan || DEFAULT_CONFIG.appSlogan,
      };
    }
  } catch (error) {
    console.error('Failed to load app config:', error);
  }
  return { ...DEFAULT_CONFIG };
};

/**
 * 保存应用配置
 */
export const saveAppConfig = (config: AppConfig): void => {
  try {
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
  } catch (error) {
    console.error('Failed to save app config:', error);
    throw error;
  }
};

/**
 * 重置为默认配置
 */
export const resetAppConfig = (): AppConfig => {
  const defaultConfig = { ...DEFAULT_CONFIG };
  saveAppConfig(defaultConfig);
  return defaultConfig;
};
