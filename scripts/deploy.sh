#!/bin/bash
# GlobeNews 一键部署脚本

set -e

echo "🌍 GlobeNews 部署脚本"
echo "====================="

# 检查 Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安装"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose 未安装"
    exit 1
fi

echo "✅ Docker 环境检查通过"

# 创建数据目录
mkdir -p data

# 设置 API key
if [ -z "$WORLDNEWS_API_KEY" ]; then
    echo "⚠️ 未设置 WORLDNEWS_API_KEY，使用默认值"
    export WORLDNEWS_API_KEY="cf06fcc50d56424d9f3fe328f91ceb91"
fi

# 清理旧容器
echo "🧹 清理旧容器..."
docker-compose down 2>/dev/null || true

# 构建并启动
echo "🔨 构建镜像..."
docker-compose build

# 启动服务
echo "🚀 启动服务..."
docker-compose up -d

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 5

# 检查状态
echo "📊 服务状态："
docker-compose ps

# 显示访问信息
echo ""
echo "🌍 GlobeNews 已部署完成！"
echo "====================="
echo "前端: http://localhost:3000"
echo "后端 API: http://localhost:8080"
echo "健康检查: http://localhost:8080/health"
echo ""
echo "📝 常用命令："
echo "  查看日志: docker-compose logs -f"
echo "  停止服务: docker-compose down"
echo "  重新部署: ./scripts/deploy.sh"
