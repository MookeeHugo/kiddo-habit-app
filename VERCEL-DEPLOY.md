# Vercel部署指南

## 🚀 快速部署步骤

### 第1步：访问Vercel
打开浏览器，访问：https://vercel.com

### 第2步：登录/注册
1. 点击右上角 **"Sign Up"** 或 **"Log In"**
2. 选择 **"Continue with GitHub"**
3. 授权Vercel访问你的GitHub账号

###第3步：导入项目
1. 登录后，点击 **"Add New..."** → **"Project"**
2. 在 "Import Git Repository" 页面，找到 **`kiddo-habit-app`** 仓库
3. 点击仓库右侧的 **"Import"** 按钮

### 第4步：配置项目（保持默认即可）
Vercel会自动识别Vite项目，配置如下：

```
Framework Preset: Vite
Root Directory: ./
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

**✅ 保持默认设置，无需修改！**

### 第5步：部署
1. 点击底部的 **"Deploy"** 按钮
2. 等待2-3分钟，Vercel会：
   - 📦 安装依赖
   - 🔨 构建项目
   - 🚀 部署到全球CDN

### 第6步：完成！🎉
部署成功后，你会看到：
- ✅ 一个类似这样的链接：`https://kiddo-habit-app.vercel.app`
- 🌍 你的项目现在可以在全球任何地方访问！

---

## 📱 分享给用户

部署完成后，你可以：
1. **直接分享链接**：`https://kiddo-habit-app.vercel.app`
2. **生成二维码**：让用户扫码访问
3. **添加到手机桌面**：
   - iPhone：Safari → 分享 → 添加到主屏幕
   - Android：Chrome → 菜单 → 安装应用

---

## 🔄 自动部署

以后每次你推送代码到GitHub：
```bash
git add .
git commit -m "更新说明"
git push
```

Vercel会**自动重新部署**，无需手动操作！

---

## 🎨 自定义域名（可选）

如果你有自己的域名，可以：
1. 进入Vercel项目设置
2. 点击 "Domains"
3. 添加你的域名（如：`www.你的域名.com`）
4. 按照指引配置DNS

---

## 🐛 常见问题

### Q: 部署失败怎么办？
A: 点击 "View Build Logs" 查看错误信息，通常是依赖问题。

### Q: 如何查看部署历史？
A: 在项目页面点击 "Deployments" 可以看到所有历史版本。

### Q: 可以回滚到之前的版本吗？
A: 可以！在Deployments列表中，找到之前的版本，点击 "..." → "Promote to Production"

---

## 📊 监控和分析

Vercel提供免费的：
- 📈 访问统计
- ⚡ 性能分析
- 🌍 全球访问速度
- 🔍 错误追踪

在项目页面的 "Analytics" 查看详细数据。

---

## 💡 优化建议

### 1. 添加自定义404页面
创建 `public/404.html` 文件

### 2. 配置环境变量
在Vercel项目设置 → "Environment Variables" 添加

### 3. 启用预览部署
每次提交Pull Request都会自动生成预览链接

---

祝部署顺利！🚀
