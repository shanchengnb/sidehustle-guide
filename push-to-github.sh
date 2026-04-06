#!/bin/bash
# 一键推送到 GitHub 脚本

echo "=================================================="
echo "🚀 正在推送代码到 GitHub..."
echo "=================================================="

cd /Users/shancheng/ai-daily-news

# 设置远程仓库
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/shanchengnb/sidehustle-guide.git

# 推送
git branch -M main
git push -u origin main

echo ""
echo "=================================================="
echo "✅ 推送完成！"
echo "=================================================="
echo ""
echo "📦 仓库地址: https://github.com/shanchengnb/sidehustle-guide"
echo ""
echo "下一步："
echo "1. 访问 https://vercel.com/new"
echo "2. 选择 sidehustle-guide 仓库"
echo "3. 点击 Deploy"
echo "4. 获得永久链接！"
echo "=================================================="
