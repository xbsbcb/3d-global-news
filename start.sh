#!/bin/bash
# 一键启动 3D 全球新闻可视化平台 (生产环境)
# 端口: Frontend 3000, Backend 3001

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

echo "==> 停止旧容器..."
docker compose down 2>/dev/null || true

echo "==> 构建并启动容器..."
docker compose up --build -d

echo ""
echo "==> 启动完成!"
echo "   前端: http://localhost:3000"
echo "   后端: http://localhost:3001"
echo "   API:  http://localhost:3001/api"
echo ""
echo "==> 查看日志:"
echo "   docker compose logs -f"
echo ""
echo "==> 停止服务:"
echo "   docker compose down"
