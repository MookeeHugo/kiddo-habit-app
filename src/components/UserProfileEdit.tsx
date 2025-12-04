/**
 * UserProfileEdit 组件 - 用户资料编辑
 *
 * 功能：
 * - 编辑用户昵称
 * - 选择头像
 * - 保存到数据库
 */

import { useState, useEffect, useRef } from 'react';
import { Modal, Button } from './ui';
import { AvatarPicker } from './AvatarPicker';
import { useUser } from '../hooks/useUser';
import { useToast } from './ui/Toast';

export interface UserProfileEditProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserProfileEdit({ isOpen, onClose }: UserProfileEditProps) {
  const { user, updateUserInfo } = useUser();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('😊');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  // 初始化表单数据
  useEffect(() => {
    if (user && isOpen) {
      setName(user.name);
      setAvatar(user.avatar);
      // 检查是否是上传的图片(以data:image开头)
      if (user.avatar.startsWith('data:image')) {
        setUploadedImage(user.avatar);
      } else {
        setUploadedImage(null);
      }
    }
  }, [user, isOpen]);

  // 处理图片上传
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      showToast('请选择图片文件', 'warning');
      return;
    }

    // 检查文件大小(限制5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('图片大小不能超过5MB', 'warning');
      return;
    }

    // 读取文件并转换为base64
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      setUploadedImage(base64String);
      setAvatar(base64String);
      showToast('图片上传成功！', 'success');
    };
    reader.onerror = () => {
      showToast('图片读取失败，请重试', 'error');
    };
    reader.readAsDataURL(file);
  };

  // 移除上传的图片
  const handleRemoveImage = () => {
    setUploadedImage(null);
    setAvatar('😊');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 处理保存
  const handleSave = async () => {
    if (!name.trim()) {
      showToast('请输入昵称', 'warning');
      return;
    }

    if (name.trim().length > 20) {
      showToast('昵称不能超过20个字符', 'warning');
      return;
    }

    setIsSubmitting(true);

    try {
      await updateUserInfo({
        name: name.trim(),
        avatar: avatar,
      });

      showToast('资料更新成功！🎉', 'success');
      onClose();
    } catch (error) {
      console.error('Failed to update user profile:', error);
      showToast('更新失败，请重试', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="编辑个人资料"
      footer={
        <div className="flex gap-3 w-full">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            fullWidth
            disabled={isSubmitting}
          >
            取消
          </Button>
          <Button
            type="button"
            variant="success"
            onClick={handleSave}
            fullWidth
            disabled={isSubmitting}
          >
            {isSubmitting ? '保存中...' : '保存'}
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* 头像选择 */}
        <div className="flex flex-col items-center space-y-4">
          <label className="text-sm font-semibold text-gray-700">
            选择头像
          </label>

          {/* 显示当前头像 */}
          <div className="relative">
            {uploadedImage ? (
              // 上传的图片
              <div className="relative group">
                <img
                  src={uploadedImage}
                  alt="头像"
                  className="w-28 h-28 rounded-full object-cover border-4 border-primary shadow-lg"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-danger text-white rounded-full
                             flex items-center justify-center text-lg font-bold
                             hover:scale-110 transition-transform shadow-lg
                             opacity-0 group-hover:opacity-100"
                >
                  ×
                </button>
              </div>
            ) : (
              // Emoji头像选择器
              <AvatarPicker
                value={avatar}
                onChange={(newAvatar) => {
                  setAvatar(newAvatar);
                  setUploadedImage(null);
                }}
              />
            )}
          </div>

          {/* 上传按钮 */}
          {!uploadedImage && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="secondary"
                onClick={() => fileInputRef.current?.click()}
                icon="📷"
                size="small"
              >
                上传照片
              </Button>
              <p className="text-xs text-gray-500 text-center">
                支持 JPG、PNG、GIF 格式，最大 5MB
              </p>
            </>
          )}

          {uploadedImage && (
            <Button
              type="button"
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
              icon="🔄"
              size="small"
            >
              更换照片
            </Button>
          )}
        </div>

        {/* 昵称编辑 */}
        <div className="space-y-2">
          <label
            htmlFor="username"
            className="block text-sm font-semibold text-gray-700"
          >
            昵称
          </label>
          <input
            id="username"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="输入你的昵称"
            maxLength={20}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-300
                       focus:border-primary focus:ring-4 focus:ring-primary/20
                       outline-none transition-all duration-200
                       text-base font-medium placeholder:text-gray-400"
          />
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500">
              {name.length}/20 字符
            </p>
            {name.trim() && name.trim().length > 20 && (
              <p className="text-xs text-danger">
                昵称太长了
              </p>
            )}
          </div>
        </div>

        {/* 预览 */}
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-4">
          <p className="text-xs font-semibold text-gray-600 mb-2 text-center">
            预览效果
          </p>
          <div className="flex items-center gap-3 justify-center">
            {uploadedImage ? (
              <img
                src={uploadedImage}
                alt="预览"
                className="w-16 h-16 rounded-full object-cover border-2 border-primary"
              />
            ) : (
              <div className="text-5xl">{avatar}</div>
            )}
            <div>
              <p className="text-xl font-bold text-gray-800">
                {name || '小朋友'}
              </p>
              <p className="text-sm text-gray-600">
                {user?.level ? `Lv.${user.level}` : 'Lv.1'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
