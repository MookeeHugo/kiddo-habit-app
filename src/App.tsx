/**
 * 主应用组件
 */

import { useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import { ToastProvider } from './components/ui';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { enableAnimationDebug } from './lib/animations';

function App() {
  // 开发模式下启用动画调试
  useEffect(() => {
    enableAnimationDebug();
  }, []);

  return (
    <ToastProvider>
      <Dashboard />
      <PWAInstallPrompt />
    </ToastProvider>
  );
}

export default App;
