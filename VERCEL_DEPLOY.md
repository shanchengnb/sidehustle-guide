# Vercel 部署指南

## 🚀 一键部署到 Vercel

### 方式一：通过 GitHub（推荐）

#### 1. 上传到 GitHub

```bash
# 初始化 Git（如果还没有）
cd ~/ai-daily-news
git init
git add .
git commit -m "Initial commit: 副业致富指南"

# 创建 GitHub 仓库并推送
# 在 GitHub.com 创建新仓库后：
git remote add origin https://github.com/你的用户名/ai-daily-news.git
git push -u origin main
```

#### 2. 一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/你的用户名/ai-daily-news)

或者手动操作：

1. 访问 https://vercel.com
2. 用 GitHub 登录
3. 点击 "Add New" → "Project"
4. 选择你的 ai-daily-news 仓库
5. 点击 "Deploy"
6. 等待部署完成（约2分钟）
7. 获得**永久链接**：`https://ai-daily-news.vercel.app`

---

### 方式二：直接部署（无需 GitHub）

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录
vercel login

# 部署
cd ~/ai-daily-news
vercel

# 按提示操作，完成后获得链接
```

---

## 📋 部署后配置

### 设置环境变量（可选）

在 Vercel Dashboard → Settings → Environment Variables：

| 变量名 | 值 |
|--------|-----|
| WQ_API_KEY | e6thjxhllw5rn8sikp36nj4xng7xxtbwaj29 |

---

## ✅ 部署成功后

你将获得：
- 📱 **永久访问链接**：https://xxx.vercel.app
- 🔗 **可分享给他人**
- 🆓 **完全免费**
- 🚀 **自动 HTTPS**
- 📊 **访问统计**

---

## 🔄 更新部署

每次 `git push` 到 GitHub，Vercel 会自动重新部署。

```bash
git add .
git commit -m "更新内容"
git push
```

---

## ⚠️ 注意事项

1. **API 密钥安全**：代码中的 API Key 已公开，建议在 Vercel 环境变量中设置

2. **Python 版本**：Vercel 默认使用 Python 3.9

3. **函数超时**：Vercel 免费版函数超时为 10 秒，已设置合适的 timeout

---

## 🆘 常见问题

### Q: 部署失败怎么办？
A: 检查 Vercel Dashboard 的 Build Logs，通常会显示具体错误

### Q: API 调用失败？
A: 确保环境变量已正确设置

### Q: 如何查看访问日志？
A: Vercel Dashboard → Analytics

---

## 📞 需要帮助？

如果遇到问题，告诉我具体的错误信息，我来帮你解决！
