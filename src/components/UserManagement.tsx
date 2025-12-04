/**
 * 用户管理组件（仅管理员）
 */

import { useState, useEffect } from 'react';
import { Button, Card, Modal, useToast } from './ui';
import { useAuth } from '../hooks/useAuth';
import { type User } from '../lib/db';
import { AvatarPicker } from './AvatarPicker';

export function UserManagement({ currentUser }: { currentUser: User }) {
  const [users, setUsers] = useState<User[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newName, setNewName] = useState('');
  const [newAvatar, setNewAvatar] = useState('😊');
  const { getAllUsers, createUser, deleteUser, isLoading } = useAuth();
  const { showToast } = useToast();

  // 加载用户列表
  const loadUsers = async () => {
    const allUsers = await getAllUsers();
    setUsers(allUsers);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // 创建用户
  const handleCreateUser = async () => {
    if (!newUsername.trim() || !newPassword.trim() || !newName.trim()) {
      showToast('请填写所有必填字段', 'warning');
      return;
    }

    const result = await createUser(
      newUsername.trim(),
      newPassword,
      newName.trim(),
      newAvatar,
      'user'
    );

    if (result.success) {
      showToast('用户创建成功！🎉', 'success');
      setIsCreateModalOpen(false);
      // 重置表单
      setNewUsername('');
      setNewPassword('');
      setNewName('');
      setNewAvatar('😊');
      // 重新加载用户列表
      await loadUsers();
    } else {
      showToast(result.error || '创建用户失败', 'error');
    }
  };

  // 删除用户
  const handleDeleteUser = async (userId: string, username: string) => {
    if (!confirm(`确定要删除用户 "${username}" 吗？\n\n此操作不可恢复！`)) {
      return;
    }

    const success = await deleteUser(userId, currentUser.id);

    if (success) {
      showToast('用户已删除', 'success');
      await loadUsers();
    } else {
      showToast('删除用户失败', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">👥 用户管理</h2>
        <Button
          variant="primary"
          icon="➕"
          onClick={() => setIsCreateModalOpen(true)}
        >
          添加用户
        </Button>
      </div>

      {/* 用户列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <Card key={user.id} className="p-6">
            <div className="flex items-start gap-4">
              {/* 头像 */}
              <div className="text-5xl flex-shrink-0">{user.avatar}</div>

              {/* 用户信息 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold text-gray-800 truncate">
                    {user.name}
                  </h3>
                  {user.role === 'admin' && (
                    <span className="inline-flex items-center px-2 py-1 bg-warning text-gray-800 text-xs font-bold rounded-full">
                      👑 管理员
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  @{user.username}
                </p>

                <div className="text-sm text-gray-500 space-y-1">
                  <p>等级: Lv.{user.level}</p>
                  <p>积分: {user.totalPoints} ⭐</p>
                  <p>
                    创建: {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* 操作按钮 */}
                {user.id !== currentUser.id && user.role !== 'admin' && (
                  <div className="mt-4">
                    <Button
                      variant="danger"
                      size="small"
                      icon="🗑️"
                      onClick={() => handleDeleteUser(user.id, user.username)}
                      disabled={isLoading}
                    >
                      删除
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* 创建用户模态框 */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="➕ 添加新用户"
        footer={
          <div className="flex gap-3">
            <Button
              variant="success"
              onClick={handleCreateUser}
              disabled={isLoading}
              fullWidth
            >
              {isLoading ? '创建中...' : '创建用户'}
            </Button>
            <Button
              variant="secondary"
              onClick={() => setIsCreateModalOpen(false)}
              disabled={isLoading}
            >
              取消
            </Button>
          </div>
        }
      >
        <div className="space-y-6">
          {/* 用户名 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              登录用户名 *
            </label>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="例如：xiaoming"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
              disabled={isLoading}
            />
            <p className="mt-1 text-xs text-gray-500">
              用于登录的用户名，只能包含字母、数字和下划线
            </p>
          </div>

          {/* 密码 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              登录密码 *
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="请设置密码"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
              disabled={isLoading}
            />
          </div>

          {/* 显示名称 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              显示名称 *
            </label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="例如：小明"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
              disabled={isLoading}
            />
          </div>

          {/* 头像选择 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              选择头像 ✨
            </label>
            <AvatarPicker
              value={newAvatar}
              onChange={setNewAvatar}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
