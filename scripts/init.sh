#!/bin/bash
# 初始化自动化脚本
# 设置 Git Hooks 和项目结构

set -e

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "🔧 初始化 GlobeNews 自动化..."

# 创建必要的目录
echo "📁 创建目录结构..."
mkdir -p docx/生产报告
mkdir -p scripts

# 设置 Git Hooks 符号链接
echo "🪝 设置 Git Hooks..."
if [ -f ".git/hooks/pre-commit" ]; then
    chmod +x .git/hooks/pre-commit
    echo "  ✅ pre-commit hook 已启用"
else
    echo "  ⚠️ pre-commit hook 不存在"
fi

# 设置脚本执行权限
echo "🔐 设置脚本权限..."
chmod +x scripts/*.sh
echo "  ✅ 脚本权限已设置"

# 初始化模块状态文件
if [ ! -f "docx/生产报告/模块状态.md" ]; then
    cat > "docx/生产报告/模块状态.md" << 'EOF'
# 模块状态报告

> 最后更新：2026-03-31

---

## 模块开发状态

| 模块 | 状态 | 完成时间 | 说明 |
|------|------|----------|------|
| 前端-粒子地球 | ⏳待开发 | - | ParticleEarth |
| 前端-地理边界 | ⏳待开发 | - | GeoLayer |
| 前端-交互管理 | ⏳待开发 | - | InteractionManager |
| 前端-数据层 | ⏳待开发 | - | DataLayer |
| 后端-API | ⏳待开发 | - | REST API |
| 后端-采集器 | ⏳待开发 | - | NewsFetcher |
| 后端-存储 | ⏳待开发 | - | Database |
EOF
    echo "  ✅ 模块状态文件已创建"
fi

echo ""
echo "🎉 初始化完成!"
echo ""
echo "使用说明:"
echo "  一键测试: ./scripts/build.sh <module>"
echo "  Git提交:  git commit 会自动生成生产报告"
echo "  模块状态: docx/生产报告/模块状态.md"
