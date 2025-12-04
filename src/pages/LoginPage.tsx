/**
 * 登录页面
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button, useToast } from '../components/ui';
import { useAuth } from '../hooks/useAuth';

export interface LoginPageProps {
  onLoginSuccess: () => void;
}

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuth();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      showToast('请输入用户名和密码', 'warning');
      return;
    }

    const success = await login(username.trim(), password);

    if (success) {
      showToast('登录成功！欢迎回来 🎉', 'success');
      onLoginSuccess();
    } else {
      showToast(error || '登录失败', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-success/20 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo和标题 */}
        <div className="text-center mb-8">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1,
            }}
            className="text-8xl mb-4"
          >
            🌟
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            习惯养成小助手
          </h1>
          <p className="text-gray-600">
            坚持好习惯，成就小英雄！
          </p>
        </div>

        {/* 登录表单 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-2xl p-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            登录
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 用户名 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                用户名
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="请输入用户名"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none text-lg transition-colors"
                disabled={isLoading}
              />
            </div>

            {/* 密码 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                密码
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none text-lg transition-colors"
                disabled={isLoading}
              />
            </div>

            {/* 错误提示 */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-danger/10 border-2 border-danger text-danger px-4 py-3 rounded-xl text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* 登录按钮 */}
            <Button
              type="submit"
              variant="primary"
              size="large"
              fullWidth
              disabled={isLoading}
              icon="🔐"
            >
              {isLoading ? '登录中...' : '登录'}
            </Button>
          </form>

        </motion.div>

        {/* 装饰元素 */}
        <div className="mt-8 flex justify-center gap-3 opacity-30">
          {['⭐', '✨', '💫', '🌟'].map((emoji, index) => (
            <motion.span
              key={index}
              animate={{
                y: [0, -10, 0],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.3,
              }}
              className="text-3xl"
            >
              {emoji}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
