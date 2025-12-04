/**
 * 认证Hook
 */

import { useState } from 'react';
import { db, verifyPassword, encryptPassword, type User, type UserRole } from '../lib/db';
import { useUserStore } from '../stores/userStore';

export function useAuth() {
  const { setUser, reset } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 登录
   */
  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // 查找用户
      const user = await db.user.where('username').equals(username).first();

      if (!user) {
        setError('用户名或密码错误');
        return false;
      }

      // 验证密码
      if (!verifyPassword(password, user.password)) {
        setError('用户名或密码错误');
        return false;
      }

      // 更新最后登录时间
      await db.user.update(user.id, {
        lastLoginAt: new Date(),
      });

      // 设置当前用户
      setUser({ ...user, lastLoginAt: new Date() });

      // 保存登录状态到localStorage
      localStorage.setItem('currentUserId', user.id);

      return true;
    } catch (err) {
      setError('登录失败，请重试');
      console.error('Login error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 登出
   */
  const logout = () => {
    reset();
    localStorage.removeItem('currentUserId');
  };

  /**
   * 检查登录状态
   */
  const checkAuth = async (): Promise<User | null> => {
    const userId = localStorage.getItem('currentUserId');

    if (!userId) {
      return null;
    }

    try {
      const user = await db.user.get(userId);
      if (user) {
        setUser(user);
        return user;
      }
    } catch (err) {
      console.error('Check auth error:', err);
    }

    return null;
  };

  /**
   * 创建新用户（仅管理员）
   */
  const createUser = async (
    username: string,
    password: string,
    name: string,
    avatar: string,
    role: UserRole = 'user'
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    setError(null);

    try {
      // 检查用户名是否已存在
      const existingUser = await db.user.where('username').equals(username).first();

      if (existingUser) {
        setError('用户名已存在');
        return { success: false, error: '用户名已存在' };
      }

      const newUser: User = {
        id: `user-${Date.now()}`,
        username,
        password: encryptPassword(password),
        name,
        avatar,
        role,
        level: 1,
        experience: 0,
        totalPoints: 0,
        availablePoints: 0,
        longestStreak: 0,
        totalTasksCompleted: 0,
        perfectDays: 0,
        unlockedAchievements: [],
        createdAt: new Date(),
        lastLoginAt: new Date(),
      };

      await db.user.add(newUser);

      return { success: true };
    } catch (err) {
      const errorMsg = '创建用户失败';
      setError(errorMsg);
      console.error('Create user error:', err);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 获取所有用户（仅管理员）
   */
  const getAllUsers = async (): Promise<User[]> => {
    try {
      return await db.user.toArray();
    } catch (err) {
      console.error('Get all users error:', err);
      return [];
    }
  };

  /**
   * 删除用户（仅管理员，不能删除自己）
   */
  const deleteUser = async (userId: string, currentUserId: string): Promise<boolean> => {
    if (userId === currentUserId) {
      setError('不能删除当前登录的用户');
      return false;
    }

    try {
      await db.user.delete(userId);
      return true;
    } catch (err) {
      setError('删除用户失败');
      console.error('Delete user error:', err);
      return false;
    }
  };

  return {
    login,
    logout,
    checkAuth,
    createUser,
    getAllUsers,
    deleteUser,
    isLoading,
    error,
  };
}
