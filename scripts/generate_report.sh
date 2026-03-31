#!/bin/bash
# 生成生产报告脚本
# 每次git提交前自动调用

set -e

REPORT_DIR="docx/生产报告"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
REPORT_FILE="${REPORT_DIR}/报告_${TIMESTAMP}.md"

# 确保目录存在
mkdir -p "$REPORT_DIR"

echo "📊 生成生产报告..."

# 获取git信息
BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
COMMIT_MSG=$(cat "$1" 2>/dev/null || echo "no message")
LAST_COMMIT=$(git log -1 --pretty="%H %s" 2>/dev/null || echo "no commits")
STATUS=$(git status --short 2>/dev/null || echo "unknown")

# 统计文件变化
FILES_CHANGED=$(git diff --cached --name-only | wc -l)
INSERTIONS=$(git diff --cached --numstat | awk '{sum+=$1} END {print sum}')
DELETIONS=$(git diff --cached --numstat | awk '{sum+=$2} END {print sum}')

# 生成报告
cat > "$REPORT_FILE" << EOF
# 生产报告

> 生成时间：$(date +"%Y-%m-%d %H:%M:%S")
> 分支：$BRANCH
> 提交触发

---

## 📋 提交信息

**提交说明：**
\`\`\`
$COMMIT_MSG
\`\`\`

**最近提交：**
$LAST_COMMIT

---

## 📊 代码统计

| 指标 | 数值 |
|------|------|
| 文件变化 | $FILES_CHANGED |
| 新增行数 | $INSERTIONS |
| 删除行数 | $DELETIONS |

---

## 📁 变更文件

$(git diff --cached --name-only | sed 's/^/- /')

---

## 📝 当前状态

\`\`\`bash
$STATUS
\`\`\`

---

## 🔧 项目模块状态

| 模块 | 状态 | 说明 |
|------|------|------|
| 前端-粒子地球 | 待开发 | ParticleEarth |
| 前端-地理边界 | 待开发 | GeoLayer |
| 前端-交互管理 | 待开发 | InteractionManager |
| 前端-数据层 | 待开发 | DataLayer |
| 后端-API | 待开发 | REST API |
| 后端-采集器 | 待开发 | NewsFetcher |
| 后端-存储 | 待开发 | Database |

---

*此报告由 Git Hook 自动生成*
EOF

echo "✅ 报告已生成: $REPORT_FILE"

# 如果是交互式终端，显示报告位置
if [ -t 1 ]; then
    echo ""
    echo "📄 报告位置: $REPORT_FILE"
fi
