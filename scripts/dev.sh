#!/bin/bash
# GlobeNews 开发模式脚本

set -e

echo "🛠️ GlobeNews 开发模式"
echo "====================="

# 启动后端开发服务器
if ! command -v cargo &> /dev/null; then
    echo "⚠️ Rust 未安装，跳过后端"
else
    echo "🚀 启动后端开发服务器..."
    cd backend
    cargo run &
    cd ..
fi

# 启动前端开发服务器
echo "🚀 启动前端开发服务器..."
cd frontend
npm run dev &
cd ..

echo ""
echo "🛠️ 开发服务器已启动："
echo "  前端: http://localhost:5173"
echo "  后端: http://localhost:8080"
echo ""
echo "按 Ctrl+C 停止所有服务"

# 等待 Ctrl+C
wait
