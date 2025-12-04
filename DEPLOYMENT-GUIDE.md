# 🚀 生产环境部署指南

## 📋 目录

1. [部署前准备](#部署前准备)
2. [Vercel 部署（推荐）](#vercel-部署推荐)
3. [Netlify 部署](#netlify-部署)
4. [自托管部署](#自托管部署)
5. [部署后验证](#部署后验证)
6. [常见问题](#常见问题)

---

## 部署前准备

### 1. 生成 PWA 图标

⚠️ **必须完成！** PWA 需要图标才能正常安装。

```bash
# 在浏览器中打开
http://localhost:5177/generate-icons.html

# 点击"生成并下载所有图标"
# 将下载的4个PNG文件移动到 kiddo-habit-app/public/
```

确保 `public/` 文件夹包含：
- `pwa-64x64.png`
- `pwa-192x192.png`
- `pwa-512x512.png`
- `maskable-icon-512x512.png`

### 2. 本地测试生产构建

```bash
# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 在浏览器中访问 http://localhost:4173
# 测试所有功能是否正常
```

### 3. 运行 Lighthouse 审计

1. 打开 Chrome DevTools (F12)
2. 切换到"Lighthouse"标签
3. 选择所有类别
4. 点击"Analyze page load"
5. 确保分数：
   - PWA: 100
   - Performance: ≥90
   - Accessibility: ≥90

### 4. 提交代码到 Git

```bash
# 检查状态
git status

# 添加所有文件
git add .

# 提交
git commit -m "准备生产部署"

# 推送到 GitHub（如果还没有仓库，先创建）
git push origin main
```

---

## Vercel 部署（推荐）

### 为什么选择 Vercel？

- ✅ **零配置**: 自动检测 Vite 项目
- ✅ **免费**: 个人项目完全免费
- ✅ **自动 HTTPS**: 自动配置 SSL 证书
- ✅ **全球 CDN**: 快速访问
- ✅ **自动部署**: 每次 Git push 自动部署
- ✅ **预览部署**: Pull Request 自动生成预览

### 步骤 1: 创建 GitHub 仓库

如果还没有 GitHub 仓库：

```bash
# 初始化 Git（如果还没有）
git init

# 创建 .gitignore
echo "node_modules
dist
.env.local
.DS_Store" > .gitignore

# 提交
git add .
git commit -m "Initial commit"

# 在 GitHub 创建新仓库：https://github.com/new
# 仓库名称：kiddo-habit-app
# 公开或私有都可以

# 添加远程仓库
git remote add origin https://github.com/你的用户名/kiddo-habit-app.git

# 推送
git branch -M main
git push -u origin main
```

### 步骤 2: 部署到 Vercel

#### 方法 A: 通过 Vercel 网站（推荐）

1. **访问 Vercel**:
   - 打开 [vercel.com](https://vercel.com)
   - 使用 GitHub 账号登录

2. **导入项目**:
   - 点击"Add New..." → "Project"
   - 选择 GitHub 仓库 `kiddo-habit-app`
   - 点击"Import"

3. **配置项目**:
   - **Framework Preset**: Vite（自动检测）
   - **Root Directory**: `./`（默认）
   - **Build Command**: `npm run build`（自动填充）
   - **Output Directory**: `dist`（自动填充）
   - **Install Command**: `npm install`（自动填充）

4. **环境变量**（如果需要）:
   - 点击"Environment Variables"
   - 添加必要的环境变量（如果有）

5. **部署**:
   - 点击"Deploy"
   - 等待 1-3 分钟
   - 部署完成！

6. **获取 URL**:
   - 部署成功后，Vercel 会生成一个 URL
   - 格式：`https://kiddo-habit-app.vercel.app`
   - 或自定义域名

#### 方法 B: 通过 Vercel CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel

# 按照提示操作：
# - Set up and deploy? Y
# - Which scope? 选择你的账号
# - Link to existing project? N
# - What's your project's name? kiddo-habit-app
# - In which directory is your code located? ./
# - Want to override the settings? N

# 生产部署
vercel --prod
```

### 步骤 3: 验证部署

1. 访问生成的 URL
2. 测试所有功能
3. 测试 PWA 安装
4. 运行 Lighthouse 审计

### 步骤 4: 配置自定义域名（可选）

1. 在 Vercel 项目设置中，点击"Domains"
2. 添加你的域名（例如：`habit.example.com`）
3. 按照指引配置 DNS 记录
4. 等待 DNS 传播（通常 5-30 分钟）

### 自动部署

配置完成后，每次推送到 `main` 分支都会自动部署：

```bash
# 修改代码
git add .
git commit -m "更新功能"
git push

# Vercel 自动检测并部署
# 可以在 Vercel 仪表板查看部署状态
```

---

## Netlify 部署

### 步骤 1: 准备配置文件

创建 `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

提交配置文件：

```bash
git add netlify.toml
git commit -m "添加 Netlify 配置"
git push
```

### 步骤 2: 部署到 Netlify

#### 方法 A: 通过 Netlify 网站

1. **访问 Netlify**:
   - 打开 [netlify.com](https://netlify.com)
   - 使用 GitHub 登录

2. **添加站点**:
   - 点击"Add new site" → "Import an existing project"
   - 选择 GitHub
   - 授权 Netlify 访问你的仓库
   - 选择 `kiddo-habit-app` 仓库

3. **配置构建设置**:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Deploy settings**: 自动检测 `netlify.toml`

4. **部署**:
   - 点击"Deploy site"
   - 等待构建完成
   - 获得 URL：`https://随机名称.netlify.app`

#### 方法 B: 通过 Netlify CLI

```bash
# 安装 Netlify CLI
npm i -g netlify-cli

# 登录
netlify login

# 初始化
netlify init

# 部署
netlify deploy --prod
```

### 步骤 3: 配置自定义域名

1. 在 Netlify 仪表板，点击"Domain settings"
2. 添加自定义域名
3. 配置 DNS（使用 Netlify DNS 或外部 DNS）
4. 启用 HTTPS（自动通过 Let's Encrypt）

---

## 自托管部署

如果你有自己的服务器（VPS、云服务器等）：

### 方式 1: 使用 Nginx

#### 1. 构建项目

```bash
npm run build
# 生成 dist/ 文件夹
```

#### 2. 上传到服务器

```bash
# 使用 SCP 或 SFTP
scp -r dist/* user@your-server.com:/var/www/habit-app/
```

#### 3. 配置 Nginx

创建 `/etc/nginx/sites-available/habit-app`:

```nginx
server {
    listen 80;
    server_name habit.example.com;

    root /var/www/habit-app;
    index index.html;

    # Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # SPA 路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Service Worker 缓存控制
    location /sw.js {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### 4. 启用站点

```bash
sudo ln -s /etc/nginx/sites-available/habit-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 5. 配置 HTTPS (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d habit.example.com
```

### 方式 2: 使用 Docker

创建 `Dockerfile`:

```dockerfile
# 构建阶段
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 生产阶段
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

创建 `nginx.conf`:

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /sw.js {
        add_header Cache-Control "no-cache";
    }
}
```

构建和运行:

```bash
# 构建镜像
docker build -t habit-app .

# 运行容器
docker run -d -p 80:80 --name habit-app habit-app
```

---

## 部署后验证

### 1. 功能验证清单

访问生产 URL 并测试：

- [ ] 页面正常加载
- [ ] 所有图片和资源加载成功
- [ ] 添加任务功能正常
- [ ] 完成任务功能正常
- [ ] 奖励兑换功能正常
- [ ] 成就解锁功能正常
- [ ] 数据持久化正常（刷新页面后数据保留）

### 2. PWA 验证清单

- [ ] HTTPS 已启用（浏览器显示 🔒）
- [ ] PWA 安装提示出现
- [ ] 可以成功安装到桌面/主屏幕
- [ ] 安装后可以离线使用
- [ ] Service Worker 注册成功
- [ ] manifest.json 正确加载
- [ ] 图标显示正确

验证 Service Worker:
1. F12 → Application → Service Workers
2. 应该看到 Service Worker 激活状态

验证 Manifest:
1. F12 → Application → Manifest
2. 检查所有字段是否正确

### 3. 性能验证

运行 Lighthouse 审计（生产环境）:

```
目标分数：
- Performance: ≥90
- Accessibility: ≥90
- Best Practices: ≥90
- SEO: ≥80
- PWA: 100
```

### 4. 跨浏览器测试

在以下浏览器测试：
- [ ] Chrome (桌面 + Android)
- [ ] Edge (桌面)
- [ ] Safari (iOS)
- [ ] Firefox (桌面)

### 5. 响应式测试

测试以下设备：
- [ ] 桌面（1920x1080）
- [ ] 笔记本（1366x768）
- [ ] 平板（iPad - 768x1024）
- [ ] 手机（iPhone - 390x844）

---

## 常见问题

### Q1: 部署后 PWA 安装提示不显示

**可能原因**:
- 未使用 HTTPS
- Service Worker 未正确注册
- Manifest 配置错误

**解决方法**:
1. 确认使用 HTTPS（http:// 不支持 PWA）
2. 检查 DevTools Console 是否有错误
3. 验证 Service Worker 和 Manifest

### Q2: 图标不显示

**可能原因**:
- 图标文件未上传到 `public/` 文件夹
- 文件路径或名称错误

**解决方法**:
1. 确认 `public/` 文件夹包含所有 4 个图标文件
2. 重新构建并部署
3. 清除浏览器缓存

### Q3: 离线功能不工作

**可能原因**:
- Service Worker 未激活
- 缓存策略配置错误

**解决方法**:
1. DevTools → Application → Service Workers → Update
2. 检查 Service Worker 状态
3. 查看 Console 错误日志

### Q4: 部署后出现 404 错误

**可能原因**:
- SPA 路由未正确配置
- 输出目录配置错误

**解决方法**:

**Vercel**: 自动处理，无需配置

**Netlify**: 确保有 `netlify.toml` 重定向配置

**Nginx**: 确保有 `try_files` 配置

### Q5: 构建失败

**常见错误**:

**错误 1**: `npm ERR! missing script: build`
```bash
# package.json 中确保有 build 脚本
"scripts": {
  "build": "tsc -b && vite build"
}
```

**错误 2**: 依赖安装失败
```bash
# 删除 node_modules 和 package-lock.json
rm -rf node_modules package-lock.json
npm install
```

**错误 3**: TypeScript 编译错误
```bash
# 检查并修复 TypeScript 错误
npm run build
# 查看错误信息并修复
```

### Q6: 更新代码后，用户看到的还是旧版本

**原因**: Service Worker 缓存

**解决方法**:

1. **用户端**: 硬刷新（Ctrl+Shift+R 或 Cmd+Shift+R）

2. **开发端**: 更新 Service Worker 版本
   ```javascript
   // 在 vite.config.ts 中
   VitePWA({
     // Service Worker 会在检测到新版本后自动更新
     registerType: 'autoUpdate'
   })
   ```

3. **手动更新提示**（可选）:
   可以添加"发现新版本"提示，让用户主动刷新

---

## 监控和维护

### 设置错误监控（可选）

推荐使用：
- **Sentry**: 前端错误跟踪
- **Google Analytics**: 用户行为分析
- **Vercel Analytics**: 性能监控（Vercel 用户）

### 定期维护

- 每月检查依赖更新：`npm outdated`
- 每季度运行 Lighthouse 审计
- 定期备份用户反馈
- 监控应用性能指标

---

## 下一步

部署成功后：

1. ✅ 分享 URL 给测试用户
2. ✅ 收集用户反馈
3. ✅ 持续优化和改进
4. ✅ 考虑添加新功能

---

## 🎉 恭喜！

你已经成功部署了"小学生习惯培养助手"！

**分享你的应用**:
- 生成 URL: `https://你的应用.vercel.app`
- 或使用自定义域名

**获得帮助**:
- [Vercel 文档](https://vercel.com/docs)
- [Netlify 文档](https://docs.netlify.com)
- [PWA 最佳实践](https://web.dev/progressive-web-apps/)

祝你的应用帮助更多孩子培养好习惯！🌟
