#!/bin/bash
# AI每日资讯启动脚本

echo "🚀 启动AI每日资讯服务..."

# 检查Python依赖
pip3 install -q flask flask-cors requests 2>/dev/null

# 启动后端
cd "$(dirname "$0")"
python3 server/server.py &
BACKEND_PID=$!

# 等待后端启动
sleep 2

# 启动前端
npm run dev:client &
FRONTEND_PID=$!

echo ""
echo "✅ 服务已启动:"
echo "   前端: http://localhost:5173"
echo "   后端: http://localhost:5000"
echo ""
echo "按 Ctrl+C 停止服务"

# 等待任意子进程退出
wait
