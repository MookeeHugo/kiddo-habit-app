/**
 * PWAInstallPrompt 组件 - PWA 安装提示
 *
 * 功能：
 * - 检测 PWA 安装能力
 * - 显示儿童友好的安装提示
 * - 处理安装流程
 * - 可关闭和记住用户选择
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui';

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // 检查是否已安装
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // 检查用户是否之前拒绝过安装
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed === 'true') {
      return;
    }

    // 监听 beforeinstallprompt 事件
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);

      // 延迟显示提示（等用户使用一会儿再提示）
      setTimeout(() => {
        setShowPrompt(true);
      }, 30000); // 30秒后显示
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 监听安装完成事件
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // 处理安装
  const handleInstall = async () => {
    if (!deferredPrompt) return;

    // 显示安装提示
    deferredPrompt.prompt();

    // 等待用户响应
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('用户接受了安装');
    } else {
      console.log('用户拒绝了安装');
    }

    // 清除 prompt
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  // 关闭提示
  const handleDismiss = () => {
    setShowPrompt(false);
    // 记住用户选择（7天内不再显示）
    localStorage.setItem('pwa-install-dismissed', 'true');
    setTimeout(() => {
      localStorage.removeItem('pwa-install-dismissed');
    }, 7 * 24 * 60 * 60 * 1000); // 7天
  };

  // 如果已安装或不显示提示，不渲染
  if (isInstalled || !showPrompt || !deferredPrompt) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md z-50"
      >
        <div className="bg-white rounded-2xl shadow-2xl border-2 border-primary p-6">
          {/* 顶部图标和标题 */}
          <div className="flex items-start gap-4 mb-4">
            <div className="text-5xl flex-shrink-0">📱</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                安装到主屏幕 ⭐
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                将"习惯助手"添加到主屏幕，像普通应用一样使用，随时打开培养好习惯！
              </p>
            </div>
          </div>

          {/* 特性列表 */}
          <div className="bg-primary/5 rounded-xl p-4 mb-4">
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-success text-lg">✓</span>
                <span className="text-gray-700">离线也能使用</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-success text-lg">✓</span>
                <span className="text-gray-700">启动更快速</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-success text-lg">✓</span>
                <span className="text-gray-700">像原生应用一样</span>
              </li>
            </ul>
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-3">
            <Button
              variant="primary"
              onClick={handleInstall}
              fullWidth
              icon="⬇️"
              size="medium"
            >
              立即安装
            </Button>
            <Button
              variant="secondary"
              onClick={handleDismiss}
              size="medium"
            >
              稍后
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
