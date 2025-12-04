# ⭐ 小学生习惯培养助手

一个专为 6-9 岁小学生设计的游戏化习惯培养应用，帮助孩子建立良好习惯、管理任务、获得成就感。

[![PWA Ready](https://img.shields.io/badge/PWA-Ready-brightgreen.svg)](https://web.dev/progressive-web-apps/)
[![Built with Vite](https://img.shields.io/badge/Built%20with-Vite-646CFF.svg)](https://vitejs.dev/)
[![React 19](https://img.shields.io/badge/React-19-61DAFB.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6.svg)](https://www.typescriptlang.org/)

## 📱 功能特性

### 🎯 核心功能

- **任务管理** - 每日任务和待办事项，子任务清单，重复任务设置
- **奖励系统** - 积分获取与兑换，自定义奖励
- **游戏化元素** - 经验值和等级系统，用户称号，连续完成奖励（Streak），成就徽章
- **数据可视化** - 经验值进度条，每周完成统计图表，成就展示墙

### 💪 Progressive Web App (PWA)

- ✅ 离线使用 - ✅ 安装到桌面/主屏幕 - ✅ 独立窗口运行 - ✅ 自动更新

### 📱 响应式设计

- 桌面端 (≥1024px) - 平板端 (768-1023px) - 手机端 (≤767px) - 横竖屏自适应

## 🛠️ 技术栈

**前端**: React 19 + TypeScript 5.9 + Vite 7
**UI**: Tailwind CSS 4 + Framer Motion + Recharts
**数据**: Dexie.js (IndexedDB) + Zustand
**PWA**: vite-plugin-pwa + Workbox

## 🚀 快速开始

### 安装
```bash
# 克隆仓库（替换为你的仓库 URL）
git clone <repository-url>
cd kiddo-habit-app

# 安装依赖
npm install
```

### 开发
```bash
# 启动开发服务器
npm run dev

# 访问 http://localhost:5177
```

### 构建
```bash
# 构建生产版本
npm run build

# 预览构建
npm run preview
```

## 📖 文档指南

- **[PWA 使用指南](PWA-GUIDE.md)** - PWA 功能配置和测试
- **[测试指南](TESTING-GUIDE.md)** - 完整的功能测试清单
- **[部署指南](DEPLOYMENT-GUIDE.md)** - 生产环境部署步骤
- **[开发计划](C:\Users\PC\.claude\plans\radiant-twirling-shannon.md)** - 详细的开发路线图

## ✅ 开发进度

### ✅ Phase 1: 项目初始化
- [x] React 19 + Vite 7 + TypeScript配置
- [x] Tailwind CSS 4（青绿主题）
- [x] IndexedDB (Dexie)
- [x] 基础项目结构

### ✅ Phase 2: 核心功能开发
- [x] 任务管理系统（每日/待办）
- [x] 子任务支持
- [x] 奖励兑换系统
- [x] 数据持久化
- [x] 用户等级系统

### ✅ Phase 3: 游戏化增强
- [x] 成就系统（10+ 成就）
- [x] 经验值和升级
- [x] Streak 连续完成奖励
- [x] 统计图表（Recharts）
- [x] 完成动画（canvas-confetti）

### ✅ Phase 4: UI 优化与主题
- [x] 响应式设计（手机/平板/桌面）
- [x] 儿童友好主题
- [x] Framer Motion 动画
- [x] UI 组件库（Button, Card, Badge, Modal, Toast...）

### ✅ Phase 5: PWA 配置
- [x] vite-plugin-pwa 配置
- [x] Service Worker
- [x] Manifest 配置
- [x] 离线支持
- [x] 安装提示组件
- [x] PWA 图标生成器

### ✅ Phase 6: 测试与优化
- [x] 功能测试清单（50+ 测试场景）
- [x] 性能优化指南
- [x] Lighthouse 审计
- [x] 部署文档（Vercel/Netlify）
- [x] 用户测试计划

### 📝 测试页面功能

访问 http://localhost:5173 可以看到完整的测试页面，包括：

1. **用户信息卡片** - 显示等级、经验、积分、Streak等数据
2. **游戏常量** - 显示最大等级、积分比例、难度积分等配置
3. **数据统计** - 显示任务、奖励、成就的数量
4. **自动化测试按钮** - 点击运行完整测试流程
5. **清空测试数据按钮** - 清除所有测试数据

### 🧪 自动化测试项目

点击"运行自动化测试"按钮会执行以下测试：

1. ✅ 用户数据加载
2. ✅ 等级系统计算（升级所需经验、等级称号）
3. ✅ Streak加成计算（1天/8天/15天的加成倍数）
4. ✅ 创建测试任务
5. ✅ 完成任务并获取奖励（积分、经验）
6. ✅ 检测升级和成就解锁
7. ✅ 创建测试奖励
8. ✅ 成就系统统计
9. ✅ 每日重置检查

### 🎨 UI 组件测试

访问 **http://localhost:5174** 查看 UI 组件展示页面，包括：
- ✅ 所有按钮变体和尺寸展示
- ✅ 卡片组件多种样式
- ✅ 徽章/标签展示
- ✅ 进度条动画效果
- ✅ 模态框交互测试
- ✅ Toast 通知系统测试

### ⏳ 下一步开发
- [ ] 任务卡片组件（TaskCard）
- [ ] 任务列表页面（TaskList）
- [ ] 奖励商店页面（RewardShop）
- [ ] 个人中心页面（Profile）
- [ ] 成就展示页面（Achievements）

## 📁 项目结构

```
kiddo-habit-app/
├── src/
│   ├── lib/               # 核心逻辑库
│   │   ├── db.ts          # Dexie数据库配置 (450行)
│   │   ├── gamification.ts # 游戏化机制 (420行)
│   │   ├── animations.ts  # 动画配置 (230行)
│   │   └── utils.ts       # 工具函数 (150行)
│   ├── stores/            # Zustand状态管理
│   │   └── userStore.ts
│   ├── hooks/             # React Hooks
│   │   ├── useUser.ts     # 用户操作
│   │   ├── useTasks.ts    # 任务管理
│   │   ├── useRewards.ts  # 奖励管理
│   │   └── useAchievements.ts # 成就管理
│   ├── components/        # React组件（待创建）
│   ├── pages/             # 页面
│   │   └── TestPage.tsx   # 测试页面
│   ├── index.css          # 全局样式
│   └── App.tsx            # 主应用
├── docs/                  # 设计文档
│   ├── habitica-analysis.md
│   ├── game-mechanics.md
│   └── ui-mockup/
│       ├── color-scheme-analysis.md
│       ├── page-prototypes.md
│       └── animation-specifications.md
├── tailwind.config.js     # TailwindCSS配置
└── package.json
```

## 🎮 游戏化机制

### 等级系统
- **最大等级**：20级
- **升级公式**：
  - Lv1-5: 30 + (level-1) * 20
  - Lv6+: 50 + (level-1) * 30

### Streak加成（连续完成）
- 1-7天：+10%
- 8-14天：+20%
- 15+天：+50%

### 任务难度积分
- **简单**：5⭐
- **中等**：10⭐
- **困难**：20⭐

### 成就系统（10个核心成就）
- 🎯 第一步（完成1个任务）
- ⭐ 坚持之星（连续7天）
- 🏆 习惯大师（连续30天）
- 🌿 努力小达人（达到5级）
- 🌳 习惯小明星（达到10级）
- 👑 学习小天才（达到20级）
- 💰 积分新手（累计100积分）
- 💎 积分大户（累计1000积分）
- ✨ 完美一周（7个完美日）
- 🎖️ 任务达人（完成100个任务）

## 🎨 配色方案（青绿主题）

### 主色
- **主色**：#4ECDC4
- **黄色（积分/星星）**：#FFE66D
- **红色（Streak/火焰）**：#FF6B6B
- **绿色（成功）**：#6BCF7F

### 背景和文字
- **主背景**：#F7FFF7（浅绿白）
- **卡片背景**：#FFFFFF
- **主文字**：#2C3E50
- **次要文字**：#7F8C8D

完整配色定义见 `tailwind.config.js`

## 📚 参考文档

- **UI设计**：`docs/ui-mockup/`
- **Habitica分析**：`docs/habitica-analysis.md`
- **游戏机制**：`docs/game-mechanics.md`
- **动画规范**：`docs/ui-mockup/animation-specifications.md`

## 🐛 已知问题

暂无

## 📝 开发日志

### 2025-12-04（下午）
- ✅ 修复所有 IndexedDB Schema 错误
  - 移除布尔值字段索引（completed, redeemed, unlocked）
  - 移除 Date 类型字段索引（date）
  - 修复 React StrictMode 主键冲突（改用 put/bulkPut）
  - 更新所有 Hooks 的查询逻辑
- ✅ 安装 Playwright 进行浏览器自动化测试
- ✅ 数据库测试完全通过
- ✅ **完成基础 UI 组件库开发**
  - Button 组件（5种变体，3种尺寸，动画效果）
  - Card 组件（多变体，悬停效果）
  - Badge 组件（6种颜色）
  - ProgressBar 组件（动画进度）
  - Modal 组件（动画进出场）
  - Toast 通知系统（4种类型，自动堆叠）
- ✅ 创建 UI 组件测试页面
- ✅ 所有 UI 组件测试通过

### 2025-12-04（上午）
- ✅ 完成项目初始化（React 19 + Vite 6 + TypeScript 5）
- ✅ 配置 TailwindCSS 3（青绿主题）
- ✅ 完成 IndexedDB 数据库配置（Dexie）
- ✅ 实现游戏化核心逻辑（等级、Streak、奖励计算）
- ✅ 创建 Zustand Store 和所有 React Hooks
- ✅ 创建基础架构测试页面
- ✅ 启动开发服务器成功
