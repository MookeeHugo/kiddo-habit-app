/**
 * AvatarPicker 组件 - 可爱的头像选择器
 *
 * 功能：
 * - 分类展示头像emoji
 * - 大号图标易于点击
 * - 动画效果
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AVATAR_CATEGORIES } from '../lib/avatarLibrary';

export interface AvatarPickerProps {
  value: string;
  onChange: (avatar: string) => void;
  className?: string;
}

export function AvatarPicker({
  value,
  onChange,
  className = '',
}: AvatarPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(
    Object.keys(AVATAR_CATEGORIES)[0]
  );

  const categoryKeys = Object.keys(AVATAR_CATEGORIES);
  const activeAvatars = AVATAR_CATEGORIES[activeCategory as keyof typeof AVATAR_CATEGORIES]?.avatars || [];

  return (
    <div className={`relative ${className}`}>
      {/* 当前选中的头像按钮 */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-primary
                   bg-gradient-to-br from-primary/10 to-primary/5
                   flex items-center justify-center text-6xl sm:text-7xl
                   transition-all duration-200 hover:scale-105 hover:shadow-xl
                   hover:border-primary-500"
      >
        {value}
      </button>

      {/* 头像选择面板 */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* 背景遮罩 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
            />

            {/* 选择面板 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-4 right-4 top-1/2 -translate-y-1/2
                         sm:left-1/2 sm:right-auto sm:-translate-x-1/2
                         w-auto sm:w-[480px] max-w-[calc(100vw-2rem)]
                         bg-white rounded-3xl shadow-2xl border-4 border-primary/20 p-6 z-50"
            >
              {/* 标题 */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                  选择头像 ✨
                </h3>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 rounded-full hover:bg-gray-100
                             flex items-center justify-center text-gray-500
                             transition-colors text-2xl"
                >
                  ✕
                </button>
              </div>

              {/* 分类标签 */}
              <div className="flex gap-2 overflow-x-auto pb-3 mb-4 -mx-2 px-2 scrollbar-hide">
                {categoryKeys.map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveCategory(key)}
                    className={`
                      px-4 py-2 rounded-full text-sm font-bold
                      whitespace-nowrap transition-all duration-200
                      ${
                        activeCategory === key
                          ? 'bg-primary text-white shadow-md scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                    `}
                  >
                    {AVATAR_CATEGORIES[key as keyof typeof AVATAR_CATEGORIES].label}
                  </button>
                ))}
              </div>

              {/* 头像网格 */}
              <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 max-h-80 overflow-y-auto p-1">
                {activeAvatars.map((avatar, index) => (
                  <motion.button
                    key={avatar}
                    type="button"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.015 }}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      onChange(avatar);
                      setIsOpen(false);
                    }}
                    className={`
                      w-14 h-14 rounded-2xl flex items-center justify-center
                      text-3xl transition-all duration-200
                      ${
                        value === avatar
                          ? 'bg-primary text-white shadow-lg ring-4 ring-primary ring-offset-2 scale-110'
                          : 'bg-gray-50 hover:bg-gray-100 hover:shadow-md'
                      }
                    `}
                  >
                    {avatar}
                  </motion.button>
                ))}
              </div>

              {/* 提示文字 */}
              <p className="mt-4 text-sm text-gray-500 text-center">
                点击头像选择，或按 ESC 关闭
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
