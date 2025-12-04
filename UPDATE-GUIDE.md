# 🔄 功能更新操作指南

## 📋 更新流程概览

```
开发新功能 → 本地测试 → 提交代码 → 自动部署 → 用户自动更新
```

---

## 1️⃣ 开发新功能

### 步骤 1: 创建功能分支（推荐）

```bash
# 从 main 分支创建新分支
git checkout main
git pull origin main
git checkout -b feature/新功能名称

# 例如：添加"家长模式"功能
git checkout -b feature/parent-mode
```

### 步骤 2: 开发新功能

#### A. 如果需要修改数据库结构

**重要**：IndexedDB 版本升级需要谨慎处理！

修改 `src/lib/db.ts`:

```typescript
// 1. 增加版本号
class HabitDatabase extends Dexie {
  constructor() {
    super('KiddoHabitDB');

    // 旧版本（保留）
    this.version(1).stores({
      tasks: 'id, type, status, dueDate',
      user: 'id',
      rewards: 'id, redeemed',
      achievements: 'id, unlockedAt'
    });

    // 新版本 - 添加新字段或新表
    this.version(2).stores({
      tasks: 'id, type, status, dueDate',
      user: 'id',
      rewards: 'id, redeemed',
      achievements: 'id, unlockedAt',
      parentSettings: 'id'  // ✅ 新增表
    }).upgrade(tx => {
      // ✅ 数据迁移逻辑
      return tx.table('tasks').toCollection().modify(task => {
        // 为现有任务添加默认值
        task.parentApprovalRequired = false;
      });
    });
  }
}
```

**数据迁移最佳实践**：
- 只增加版本号，不删除旧版本
- 使用 `upgrade()` 函数迁移现有数据
- 为新字段提供默认值
- 测试从旧版本升级到新版本

#### B. 添加新组件

```bash
# 创建新组件
touch src/components/ParentMode.tsx
```

```typescript
// src/components/ParentMode.tsx
export function ParentMode() {
  // 新功能代码...
}
```

#### C. 更新现有组件

编辑现有文件，例如 `src/pages/Dashboard.tsx`:

```typescript
import { ParentMode } from '../components/ParentMode';

// 添加新功能到界面
```

### 步骤 3: 更新版本号

编辑 `package.json`:

```json
{
  "name": "kiddo-habit-app",
  "version": "1.1.0",  // ✅ 从 1.0.0 升级到 1.1.0
  ...
}
```

**语义化版本规则**：
- **主版本号** (1.x.x): 重大改动，可能不兼容
- **次版本号** (x.1.x): 新功能，向后兼容
- **修订号** (x.x.1): Bug 修复

---

## 2️⃣ 本地测试

### 测试清单

```bash
# 1. 开发环境测试
npm run dev
# 访问 http://localhost:5177
# 测试新功能是否正常工作

# 2. 检查 TypeScript 错误
npm run build
# 确保无编译错误

# 3. 测试生产构建
npm run preview
# 测试优化后的代码

# 4. 测试数据库升级（重要！）
# - 清除 IndexedDB 数据
# - 重新加载应用
# - 检查数据库版本是否正确升级
```

### 浏览器 DevTools 测试

1. **检查数据库升级**:
   - F12 → Application → IndexedDB
   - 查看数据库版本号
   - 检查新表/新字段是否存在

2. **检查 Service Worker**:
   - F12 → Application → Service Workers
   - 点击"Update"
   - 确认新版本被检测到

3. **测试离线功能**:
   - Network → Offline
   - 刷新页面，确保新功能离线可用

---

## 3️⃣ 提交代码

### Git 提交流程

```bash
# 1. 查看更改
git status

# 2. 添加文件
git add .

# 3. 提交（使用清晰的提交信息）
git commit -m "feat: 添加家长模式功能

- 新增 ParentMode 组件
- 添加 parentSettings 数据表
- 更新数据库到版本 2
- 添加家长密码保护功能

版本: 1.1.0"

# 4. 推送到远程仓库
git push origin feature/parent-mode
```

### 提交信息规范（推荐）

```
类型: 简短描述

详细说明...

相关问题: #123
```

**类型标签**：
- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建/工具相关

---

## 4️⃣ 合并到主分支

### 方法 A: Pull Request（推荐）

1. **在 GitHub 创建 Pull Request**:
   - 访问 GitHub 仓库
   - 点击"New Pull Request"
   - 选择 `feature/parent-mode` → `main`
   - 填写 PR 描述
   - 请求审查（如果有团队成员）

2. **审查和测试**:
   - 检查代码变更
   - 运行自动化测试（如果配置了 CI）
   - 测试部署预览（Vercel/Netlify 自动提供）

3. **合并 PR**:
   - 点击"Merge Pull Request"
   - 选择合并策略（通常选"Squash and merge"）
   - 删除功能分支（可选）

### 方法 B: 直接合并

```bash
# 1. 切换到 main 分支
git checkout main

# 2. 拉取最新代码
git pull origin main

# 3. 合并功能分支
git merge feature/parent-mode

# 4. 推送到远程
git push origin main

# 5. 删除功能分支（可选）
git branch -d feature/parent-mode
git push origin --delete feature/parent-mode
```

---

## 5️⃣ 自动部署

### Vercel（零配置）

✅ **推送到 `main` 分支后自动部署**

```bash
# 推送后 Vercel 自动执行：
# 1. 检测到新提交
# 2. 运行 npm install
# 3. 运行 npm run build
# 4. 部署到生产环境
# 5. 发送部署通知
```

**监控部署状态**：
- 访问 [vercel.com/dashboard](https://vercel.com/dashboard)
- 查看部署日志
- 获取新版本 URL

### Netlify

类似 Vercel，自动部署到 `main` 分支：

1. 推送代码
2. Netlify 自动构建
3. 部署到生产环境

---

## 6️⃣ 用户如何获得更新

### PWA 自动更新机制

我们的应用使用 `registerType: 'autoUpdate'`，更新流程：

```
用户访问应用
  ↓
Service Worker 检查更新
  ↓
发现新版本
  ↓
后台下载新资源
  ↓
下次启动时自动使用新版本
```

### 用户看到的更新流程

#### 桌面端（已安装 PWA）

1. **自动更新**（无需用户操作）：
   - 用户关闭应用
   - 重新打开应用
   - 自动使用新版本

2. **强制刷新**（可选）：
   - Ctrl+Shift+R (Windows)
   - Cmd+Shift+R (Mac)

#### 移动端（已安装 PWA）

1. **自动更新**：
   - 关闭应用（从后台杀掉进程）
   - 重新打开应用
   - 使用新版本

#### 浏览器访问（未安装）

- 直接刷新页面即可获得最新版本

---

## 7️⃣ 添加更新提示（可选）

### 实现"发现新版本"提示

创建 `src/components/UpdatePrompt.tsx`:

```typescript
import { useState, useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { Button } from './ui';

export function UpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  if (!needRefresh) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50
                    bg-white rounded-2xl shadow-2xl border-2 border-primary p-6">
      <div className="flex items-start gap-4 mb-4">
        <div className="text-4xl">✨</div>
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            发现新版本！
          </h3>
          <p className="text-sm text-gray-600">
            有新功能和改进可用，点击更新立即体验。
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          variant="primary"
          onClick={() => updateServiceWorker(true)}
          fullWidth
        >
          立即更新
        </Button>
        <Button
          variant="secondary"
          onClick={() => setNeedRefresh(false)}
        >
          稍后
        </Button>
      </div>
    </div>
  );
}
```

### 集成到 App.tsx

```typescript
import { UpdatePrompt } from './components/UpdatePrompt';

function App() {
  return (
    <ToastProvider>
      <Dashboard />
      <PWAInstallPrompt />
      <UpdatePrompt />  {/* ✅ 添加更新提示 */}
    </ToastProvider>
  );
}
```

### 更新 vite.config.ts

```typescript
VitePWA({
  registerType: 'prompt',  // ✅ 改为 prompt 模式
  // ... 其他配置
})
```

---

## 8️⃣ 数据库迁移示例

### 示例 1: 添加新字段

```typescript
// 版本 1 → 版本 2：为任务添加"标签"功能

this.version(2).stores({
  tasks: 'id, type, status, dueDate',
  // 表结构不变
}).upgrade(tx => {
  // 为所有现有任务添加默认标签
  return tx.table('tasks').toCollection().modify(task => {
    if (!task.tags) {
      task.tags = [];  // 默认空数组
    }
  });
});
```

### 示例 2: 添加新表

```typescript
// 版本 2 → 版本 3：添加"统计数据"表

this.version(3).stores({
  tasks: 'id, type, status, dueDate',
  user: 'id',
  rewards: 'id, redeemed',
  achievements: 'id, unlockedAt',
  statistics: 'id, date'  // ✅ 新表
}).upgrade(async tx => {
  // 初始化统计数据
  const user = await tx.table('user').get('default-user');
  if (user) {
    await tx.table('statistics').add({
      id: 'stats-' + Date.now(),
      date: new Date(),
      tasksCompleted: user.totalTasksCompleted || 0,
      pointsEarned: user.totalPoints || 0,
    });
  }
});
```

### 示例 3: 重命名字段

```typescript
// 版本 3 → 版本 4：重命名字段

this.version(4).stores({
  tasks: 'id, type, status, dueDate',
  // 表结构不变
}).upgrade(tx => {
  // 将 "difficulty" 重命名为 "level"
  return tx.table('tasks').toCollection().modify(task => {
    if (task.difficulty) {
      task.level = task.difficulty;
      delete task.difficulty;
    }
  });
});
```

---

## 9️⃣ 版本发布清单

### 发布前检查

- [ ] 所有新功能已测试
- [ ] 无 TypeScript 编译错误
- [ ] 数据库迁移脚本已测试
- [ ] 生产构建成功
- [ ] Lighthouse 分数 ≥90
- [ ] 文档已更新
- [ ] CHANGELOG.md 已更新
- [ ] 版本号已更新

### 发布流程

```bash
# 1. 确认在 main 分支
git checkout main
git pull origin main

# 2. 创建版本标签
git tag -a v1.1.0 -m "发布版本 1.1.0

新功能:
- 添加家长模式
- 支持任务标签
- 优化加载速度

Bug 修复:
- 修复按钮提交问题
- 修复离线数据同步

"

# 3. 推送标签
git push origin v1.1.0

# 4. 在 GitHub 创建 Release
# - 访问 GitHub Releases 页面
# - 点击"Draft a new release"
# - 选择标签 v1.1.0
# - 填写发布说明
# - 发布
```

---

## 🔟 回滚到之前版本

### 如果新版本有严重 Bug

#### 方法 A: Git 回滚

```bash
# 1. 回滚到上一个提交
git revert HEAD

# 2. 或回滚到特定版本
git revert <commit-hash>

# 3. 推送
git push origin main

# Vercel/Netlify 会自动部署回滚版本
```

#### 方法 B: Vercel 回滚

1. 访问 Vercel Dashboard
2. 选择项目
3. 找到之前的成功部署
4. 点击"Promote to Production"

#### 方法 C: 禁用问题功能

使用**功能开关**（Feature Flags）:

```typescript
// src/lib/config.ts
export const FEATURES = {
  PARENT_MODE: false,  // ✅ 临时禁用新功能
  TAGS_FEATURE: true,
};

// 在组件中
import { FEATURES } from '../lib/config';

{FEATURES.PARENT_MODE && <ParentMode />}
```

---

## 📊 监控更新效果

### 关键指标

1. **部署成功率**:
   - 检查 Vercel/Netlify 仪表板
   - 确认构建成功

2. **错误监控**（推荐集成 Sentry）:
   - 监控 JavaScript 错误
   - 追踪新版本的错误率

3. **用户反馈**:
   - 收集用户报告的问题
   - 监控应用商店评分（如果有）

4. **性能指标**:
   - 运行 Lighthouse
   - 对比新旧版本性能

---

## 📝 CHANGELOG.md 示例

创建 `CHANGELOG.md` 记录更新历史：

```markdown
# 更新日志

## [1.1.0] - 2025-12-10

### 新增
- 🎉 家长模式：家长可以审核孩子的奖励兑换
- 🏷️ 任务标签：支持为任务添加自定义标签
- 📊 统计增强：新增每月完成趋势图

### 改进
- ⚡ 优化应用加载速度（减少 30% 加载时间）
- 🎨 改进移动端布局
- ♿ 提升无障碍支持

### 修复
- 🐛 修复按钮 type 属性导致的表单意外提交问题
- 🐛 修复离线模式下数据不同步的问题
- 🐛 修复 iOS Safari 的显示问题

### 数据库
- 📦 数据库升级到版本 2
- 📦 添加 parentSettings 表

## [1.0.0] - 2025-12-05

### 首次发布
- 🎉 完整的任务管理系统
- 🎁 奖励兑换功能
- 🏆 成就系统
- 📱 PWA 支持
- 📊 数据可视化
```

---

## 💡 最佳实践

### 1. 小步快跑

- ✅ 频繁发布小更新
- ✅ 每次只添加 1-2 个新功能
- ❌ 避免一次性大改动

### 2. 测试优先

- 在本地彻底测试
- 使用 Vercel 预览部署测试
- 邀请测试用户试用

### 3. 渐进式发布

- 先发布到少数用户
- 监控反馈和错误
- 逐步推广到所有用户

### 4. 保持向后兼容

- 数据库结构改动要谨慎
- 提供迁移脚本
- 测试从旧版本升级

### 5. 文档同步更新

- 更新 README.md
- 更新相关指南
- 记录 CHANGELOG

---

## 🚨 紧急问题处理

### 如果用户报告严重 Bug

1. **立即确认**:
   ```bash
   # 在本地复现问题
   npm run dev
   ```

2. **快速修复**:
   ```bash
   # 创建 hotfix 分支
   git checkout -b hotfix/critical-bug

   # 修复 Bug
   # ...

   # 快速测试
   npm run build

   # 提交并部署
   git commit -m "fix: 修复关键 Bug"
   git push origin hotfix/critical-bug

   # 直接合并到 main（跳过 PR）
   git checkout main
   git merge hotfix/critical-bug
   git push origin main
   ```

3. **通知用户**:
   - 发布公告
   - 提示用户刷新应用

---

## ✅ 快速参考

### 常用命令

```bash
# 开发
npm run dev

# 构建测试
npm run build
npm run preview

# Git 操作
git status
git add .
git commit -m "feat: 新功能"
git push

# 版本标签
git tag v1.1.0
git push origin v1.1.0
```

### 文件检查

- `package.json` - 版本号
- `src/lib/db.ts` - 数据库版本
- `CHANGELOG.md` - 更新日志
- `README.md` - 文档更新

---

**祝功能更新顺利！** 🚀
