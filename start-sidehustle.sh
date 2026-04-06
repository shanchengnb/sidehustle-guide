#!/bin/bash
# 副业学习指南 - 一键启动脚本

cd "$(dirname "$0")"

echo "=================================================="
echo "💰 副业致富指南 - 正在启动..."
echo "=================================================="

# 检查 node_modules
if [ ! -d "node_modules" ]; then
    echo "📦 首次运行，正在安装依赖..."
    npm install
fi

# 检查 Python 依赖
if ! python3 -c "import flask" 2>/dev/null; then
    echo "📦 安装 Python 依赖..."
    pip3 install flask flask-cors requests
fi

# 杀掉占用端口的进程
lsof -i :5000 2>/dev/null | grep LISTEN | awk '{print $2}' | xargs kill -9 2>/dev/null
lsof -i :5173 2>/dev/null | grep LISTEN | awk '{print $2}' | xargs kill -9 2>/dev/null
lsof -i :5174 2>/dev/null | grep LISTEN | awk '{print $2}' | xargs kill -9 2>/dev/null

echo ""
echo "🚀 启动服务中..."
echo ""

# 启动服务
npm run dev &

# 等待服务启动
sleep 5

# 打开浏览器
echo ""
echo "=================================================="
echo "✅ 启动成功！"
echo "=================================================="
echo ""
echo "📱 访问地址: http://localhost:5173"
echo "   (如果5173被占用，会使用5174)"
echo ""
echo "按 Ctrl+C 停止服务"
echo "=================================================="

# 等待
wait
