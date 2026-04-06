# 副业致富指南 - 部署指南

## 方式一：本地启动（推荐）

### 双击启动
桌面已创建快捷方式：**副业指南启动.command**
双击即可启动，会自动打开浏览器。

### 终端命令
```bash
cd ~/ai-daily-news && npm run dev
```

---

## 方式二：云端部署（随时随地访问）

### 选项1：Vercel + Render（免费）

**前端部署到 Vercel：**
1. 访问 https://vercel.com 用 GitHub 登录
2. 点击 "Import Project"
3. 连接你的 GitHub 仓库
4. 选择 ai-daily-news 项目
5. 点击 Deploy
6. 获得永久链接如：https://ai-daily-news.vercel.app

**后端部署到 Render：**
1. 访问 https://render.com 注册
2. 创建新的 Web Service
3. 连接 GitHub 仓库
4. 设置：
   - Build Command: `pip install flask flask-cors requests`
   - Start Command: `python server/server.py`
5. 获得后端链接：https://xxx.onrender.com

### 选项2：Railway（全栈免费）

1. 访问 https://railway.app
2. 用 GitHub 登录
3. 部署整个项目
4. 获得永久链接

### 选项3：PythonAnywhere（简单免费）

1. 访问 https://www.pythonanywhere.com
2. 上传 server.py
3. 创建 Web App
4. 免费域名：https://xxx.pythonanywhere.com

---

## 方式三：内网穿透（临时访问）

### 使用 ngrok（临时外网链接）
```bash
# 安装 ngrok
brew install ngrok

# 启动服务
cd ~/ai-daily-news && npm run dev

# 另开终端，创建外网链接
ngrok http 5173
```
获得临时外网链接，可分享给他人，但每次链接会变。

### 使用 Cloudflare Tunnel（免费稳定）
```bash
# 安装
brew install cloudflared

# 创建隧道
cloudflared tunnel --url http://localhost:5173
```

---

## 推荐方案

| 方案 | 成本 | 稳定性 | 访问方式 |
|------|------|--------|----------|
| 桌面快捷方式 | 免费 | 需要电脑开机 | 双击启动 |
| Vercel + Render | 免费 | 高 | 随时随地 |
| Railway | 免费 | 高 | 随时随地 |
| ngrok | 免费 | 低（链接会变） | 临时分享 |

**推荐：Vercel + Render**
- 完全免费
- 稳定可靠
- 获得永久链接

---

## 需要我帮你部署吗？

告诉我你想用哪种方式，我可以：
1. 帮你准备 Vercel 部署配置
2. 帮你修改代码适配云端环境
3. 生成一键部署脚本
