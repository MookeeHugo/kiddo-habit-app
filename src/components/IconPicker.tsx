/**
 * IconPicker 组件 - 可爱的图标选择器
 *
 * 功能：
 * - 分类展示图标
 * - 搜索和过滤
 * - 大号图标易于点击
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface IconPickerProps {
  value: string;
  onChange: (icon: string) => void;
  categories: {
    [key: string]: {
      label: string;
      icons: string[];
    };
  };
  className?: string;
}

export function IconPicker({
  value,
  onChange,
  categories,
  className = '',
}: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(
    Object.keys(categories)[0]
  );

  const categoryKeys = Object.keys(categories);
  const activeIcons = categories[activeCategory]?.icons || [];

  return (
    <div className={`relative ${className}`}>
      {/* 当前选中的图标按钮 */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-20 h-20 rounded-2xl border-2 border-gray-300 hover:border-primary
                   bg-white flex items-center justify-center text-5xl
                   transition-all duration-200 hover:scale-105 hover:shadow-md"
      >
        {value}
      </button>

      {/* 图标选择面板 */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* 背景遮罩 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 z-40"
            />

            {/* 选择面板 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed sm:absolute left-4 right-4 sm:left-0 sm:right-auto
                         top-1/2 sm:top-full -translate-y-1/2 sm:translate-y-0 mt-0 sm:mt-2
                         w-auto sm:w-96 max-w-[calc(100vw-2rem)]
                         bg-white rounded-3xl shadow-2xl border-2 border-gray-200 p-4 sm:p-6 z-50"
            >
              {/* 标题 - 响应式字体 */}
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                  选择图标 ✨
                </h3>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-gray-100
                             flex items-center justify-center text-gray-500
                             transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* 分类标签 - 优化移动端滚动 */}
              <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-3 mb-3 sm:mb-4 -mx-2 px-2 scrollbar-hide">
                {categoryKeys.map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveCategory(key)}
                    className={`
                      px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold
                      whitespace-nowrap transition-all duration-200
                      ${
                        activeCategory === key
                          ? 'bg-primary text-white shadow-md scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                    `}
                  >
                    {categories[key].label}
                  </button>
                ))}
              </div>

              {/* 图标网格 - 响应式列数 */}
              <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 max-h-64 sm:max-h-72 overflow-y-auto">
                {activeIcons.map((icon, index) => (
                  <motion.button
                    key={icon}
                    type="button"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.02 }}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      onChange(icon);
                      setIsOpen(false);
                    }}
                    className={`
                      w-12 h-12 rounded-xl flex items-center justify-center
                      text-2xl transition-all duration-200
                      ${
                        value === icon
                          ? 'bg-primary text-white shadow-md ring-2 ring-primary ring-offset-2'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }
                    `}
                  >
                    {icon}
                  </motion.button>
                ))}
              </div>

              {/* 提示文字 - 响应式 */}
              <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-500 text-center">
                点击图标选择，或按 ESC 关闭
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
