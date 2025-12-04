/** @type {import('tailwindcss').Config} */
export default {
  // 强制生成所有需要的颜色类,确保动态类名被正确识别
  safelist: [
    // Button组件需要的背景色类
    'bg-primary', 'bg-success', 'bg-danger', 'bg-warning', 'bg-gray-200',
    'bg-primary-500', 'bg-success-500', 'bg-danger-500', 'bg-warning-500',
    // 文字颜色类
    'text-white', 'text-gray-900', 'text-gray-800',
    // Hover状态类
    'hover:bg-primary-500', 'hover:bg-success-500',
    'hover:bg-danger-500', 'hover:bg-warning-500', 'hover:bg-gray-300',
  ],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 主色系 - 青绿主题
        primary: {
          DEFAULT: '#4ECDC4',  // 默认主色
          100: '#E6F9F7',
          200: '#B3EDE8',
          300: '#80E1D9',
          400: '#4ECDC4',
          500: '#3AB5AD',
          600: '#2D9791',
        },
        // 成功色 - 绿色
        success: {
          DEFAULT: '#6BCF7F',  // 默认成功色
          100: '#E8F8F0',
          200: '#B3E6CC',
          300: '#7FD4A8',
          400: '#6BCF7F',
          500: '#27AE60',
        },
        // 危险色 - 红色
        danger: {
          DEFAULT: '#FF6B6B',  // 默认危险色
          100: '#FFE6E6',
          200: '#FFB3B3',
          300: '#FF8080',
          400: '#FF6B6B',
          500: '#E74C3C',
          600: '#C0392B',
        },
        // 警告色 - 黄色
        warning: {
          DEFAULT: '#FFE66D',  // 默认警告色
          100: '#FFF9E6',
          200: '#FFF3B3',
          300: '#FFEC80',
          400: '#FFE66D',
          500: '#FFD700',
          600: '#F0B800',
        },
        // 辅助：黄色（积分/星星） - 保留向后兼容
        yellow: {
          DEFAULT: '#FFE66D',
          100: '#FFF9E6',
          200: '#FFF3B3',
          300: '#FFEC80',
          400: '#FFE66D',
          500: '#FFD700',
          600: '#F0B800',
        },
        // 辅助：红色（Streak/重要） - 保留向后兼容
        red: {
          DEFAULT: '#FF6B6B',
          100: '#FFE6E6',
          200: '#FFB3B3',
          300: '#FF8080',
          400: '#FF6B6B',
          500: '#E74C3C',
          600: '#C0392B',
        },
        // 辅助：绿色 - 保留向后兼容
        green: {
          DEFAULT: '#6BCF7F',
          100: '#E8F8F0',
          200: '#B3E6CC',
          300: '#7FD4A8',
          400: '#6BCF7F',
          500: '#27AE60',
        },
        // 强调黄色（特殊）
        'accent-yellow': '#FFE66D',

        // 背景色
        background: {
          DEFAULT: '#F7FFF7',    // 默认背景
          primary: '#F7FFF7',    // 主背景
          secondary: '#FFFFFF',  // 卡片背景
        },
        // 文字色
        text: {
          DEFAULT: '#2C3E50',      // 默认文字
          primary: '#2C3E50',      // 主文字
          secondary: '#7F8C8D',    // 次要文字
          tertiary: '#BDC3C7',     // 三级文字
        },
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        '2xl': '24px',
        '3xl': '28px',
      },
      boxShadow: {
        'sm': '0 2px 4px rgba(0, 0, 0, 0.06)',
        'md': '0 4px 8px rgba(0, 0, 0, 0.08)',
        'lg': '0 8px 16px rgba(0, 0, 0, 0.10)',
        'xl': '0 12px 24px rgba(0, 0, 0, 0.12)',
        '2xl': '0 16px 32px rgba(0, 0, 0, 0.14)',
        'primary': '0 4px 16px rgba(78, 205, 196, 0.35)',
        'yellow': '0 4px 16px rgba(255, 230, 109, 0.45)',
        'soft': '0 4px 12px rgba(0, 0, 0, 0.05)',
      },
      fontFamily: {
        sans: [
          'PingFang SC',
          'Microsoft YaHei',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
}
