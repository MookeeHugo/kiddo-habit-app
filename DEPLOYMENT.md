# 部署指南

## 快速部署到Vercel（推荐）

### 步骤1: 准备代码
```bash
# 确保代码在Git仓库中
cd kiddo-habit-app
git init
git add .
git commit -m "准备部署"
```

### 步骤2: 推送到GitHub
1. 在 https://github.com 创建新仓库（可以是私有的）
2. 推送代码：
```bash
git remote add origin https://github.com/你的用户名/kiddo-habit-app.git
git branch -M main
git push -u origin main
```

### 步骤3: 部署到Vercel
1. 访问 https://vercel.com
2. 用GitHub账号登录
3. 点击 "Add New Project"
4. 选择你的 kiddo-habit-app 仓库
5. 点击 "Deploy"
6. 等待2-3分钟，完成！

**✅ 你会得到一个永久链接，例如：**
`https://kiddo-habit-app.vercel.app`

---

## 其他免费部署平台

### Netlify（同样简单）
1. 访问 https://netlify.com
2. 拖放 `dist` 文件夹（先运行 `npm run build`）
3. 获得永久链接

### GitHub Pages（适合静态站点）
1. 修改 `vite.config.ts`：
```typescript
export default defineConfig({
  base: '/kiddo-habit-app/',  // 你的仓库名
  // ...其他配置
})
```

2. 构建并部署：
```bash
npm run build
npx gh-pages -d dist
```

---

## 局域网访问（开发模式）

如果只是在家里或办公室内分享：

```bash
npm run dev -- --host
```

然后分享显示的局域网IP地址（例如：`http://192.168.31.28:5173/`）

**注意：** 电脑必须保持运行，其他人才能访问。

---

## 自托管（高级）

如果想完全掌控，可以：

### Docker部署
```bash
# 构建
npm run build

# 使用nginx提供服务
docker run -d -p 80:80 -v ./dist:/usr/share/nginx/html nginx
```

### Node.js服务器
```bash
npm install -g serve
npm run build
serve -s dist -p 3000
```

---

## PWA安装（移动端体验）

用户访问网站后：
- **iPhone**: Safari → 分享 → 添加到主屏幕
- **Android**: Chrome → 菜单 → 安装应用

可以像原生App一样使用！

---

## 常见问题

### Q: 数据会同步吗？
A: 目前数据存储在浏览器本地（IndexedDB），每个设备独立。如需同步，需要添加后端服务。

### Q: 免费版有限制吗？
A: Vercel/Netlify免费版对个人项目完全够用，无流量限制。

### Q: 如何更新网站？
A: 推送新代码到GitHub，Vercel会自动重新部署。
