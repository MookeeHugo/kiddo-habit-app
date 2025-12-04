/**
 * 应用配置Hook
 */

import { useState, useEffect } from 'react';
import { getAppConfig, saveAppConfig, resetAppConfig, type AppConfig } from '../lib/appConfig';

export function useAppConfig() {
  const [config, setConfig] = useState<AppConfig>(getAppConfig());

  // 监听localStorage变化（支持多标签页同步）
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'app_config') {
        setConfig(getAppConfig());
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  /**
   * 更新配置
   */
  const updateConfig = (updates: Partial<AppConfig>) => {
    const newConfig = {
      ...config,
      ...updates,
    };
    saveAppConfig(newConfig);
    setConfig(newConfig);
  };

  /**
   * 重置配置
   */
  const reset = () => {
    const defaultConfig = resetAppConfig();
    setConfig(defaultConfig);
  };

  return {
    config,
    updateConfig,
    resetConfig: reset,
  };
}
