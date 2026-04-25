#!/bin/bash
# 一键启动 3D 全球新闻可视化平台 (本地开发/生产)
# 端口: Frontend 3000, Backend 3001

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

echo "==> 检查依赖..."
command -v cargo >/dev/null 2>&1 || { echo "需要安装 Rust: curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "需要安装 Node.js"; exit 1; }

# 停止旧进程
echo "==> 停止旧进程..."
fuser -k 3000/tcp 3001/tcp 2>/dev/null || true

# 编译后端
echo "==> 编译后端 (release)..."
cd "$SCRIPT_DIR/backend"
cargo build --release

# 构建前端
echo "==> 构建前端..."
cd "$SCRIPT_DIR/frontend"
npm install --ignore-scripts 2>/dev/null || true
npm run build

# 创建数据库文件
mkdir -p "$SCRIPT_DIR/backend/data"
touch "$SCRIPT_DIR/backend/data/globe_news.db"

# 启动后端
echo "==> 启动后端 (端口 3001)..."
cd "$SCRIPT_DIR/backend"
export DATABASE_URL="sqlite:///$SCRIPT_DIR/backend/data/globe_news.db"
export WORLDNEWS_API_KEY="cf06fcc50d56424d9f3fe328f91ceb91"
export RUST_LOG=info
export PORT=3001
./target/release/backend &
BACKEND_PID=$!

# 启动前端 (简单 static server)
echo "==> 启动前端 (端口 3000)..."
cd "$SCRIPT_DIR/frontend/dist"
# 用 Python 简单服务器 或 npx serve
npx --yes serve -l 3000 . &
FRONTEND_PID=$!

cd "$SCRIPT_DIR"

echo ""
echo "==> 启动完成!"
echo "   前端: http://localhost:3000"
echo "   后端: http://localhost:3001"
echo ""
echo "==> 进程 PID: backend=$BACKEND_PID frontend=$FRONTEND_PID"
echo ""
echo "==> 停止服务:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
