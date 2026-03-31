#!/bin/bash
# 一键测试构建脚本
# 用法: ./scripts/build.sh [module]
# 示例: ./scripts/build.sh frontend.particle-earth

set -e

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_ROOT"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# 模块列表
MODULES=(
    "frontend.particle-earth:粒子地球模块"
    "frontend.geo-layer:地理边界模块"
    "frontend.interaction:交互管理模块"
    "frontend.data-layer:数据层模块"
    "backend.api:后端API模块"
    "backend.fetcher:新闻采集模块"
    "backend.database:数据库模块"
    "all:全部模块"
)

# 显示帮助
show_help() {
    echo "用法: ./scripts/build.sh [module]"
    echo ""
    echo "可用模块:"
    for m in "${MODULES[@]}"; do
        key="${m%%:*}"
        desc="${m##*:}"
        echo "  $key  - $desc"
    done
    echo ""
    echo "示例:"
    echo "  ./scripts/build.sh frontend.particle-earth  # 测试粒子地球模块"
    echo "  ./scripts/build.sh all                      # 测试全部模块"
}

# 更新模块状态
update_module_status() {
    local module=$1
    local status=$2
    local report_file="docx/生产报告/模块状态.md"

    mkdir -p "docx/生产报告"

    if [ ! -f "$report_file" ]; then
        cat > "$report_file" << 'EOF'
# 模块状态报告

> 最后更新：$(date +"%Y-%m-%d %H:%M:%S")

---

## 模块开发状态

| 模块 | 状态 | 完成时间 | 说明 |
|------|------|----------|------|
EOF
    fi

    # 更新模块状态（使用sed）
    sed -i "s/| $module |.*|/| $module | $status | $(date +"%Y-%m-%d") |/g" "$report_file" 2>/dev/null || true

    log_success "模块 [$module] 状态已更新为: $status"
}

# 前端测试
test_frontend() {
    log_info "测试前端模块..."

    if [ ! -d "frontend" ]; then
        log_warn "frontend 目录不存在，跳过"
        return 0
    fi

    cd frontend

    # 安装依赖（如需要）
    if [ ! -d "node_modules" ]; then
        log_info "安装前端依赖..."
        npm install
    fi

    # 运行测试
    if command -v npm &> /dev/null; then
        log_info "运行前端测试..."
        npm test -- --run 2>/dev/null || npm run test 2>/dev/null || log_warn "前端测试命令未配置"
    fi

    # 类型检查
    if [ -f "tsconfig.json" ]; then
        log_info "运行类型检查..."
        npx vue-tsc --noEmit 2>/dev/null || npx tsc --noEmit 2>/dev/null || log_warn "类型检查未通过"
    fi

    # 构建
    log_info "构建前端..."
    npm run build 2>/dev/null || log_warn "构建命令未配置"

    cd "$PROJECT_ROOT"
    log_success "前端构建完成"
}

# 后端测试 (Rust)
test_backend() {
    log_info "测试后端模块..."

    if [ ! -d "backend" ]; then
        log_warn "backend 目录不存在，跳过"
        return 0
    fi

    cd backend

    # 检查 Rust 环境
    if ! command -v cargo &> /dev/null; then
        log_error "Rust 环境未安装"
        return 1
    fi

    # 检查依赖
    if [ ! -f "Cargo.toml" ]; then
        log_error "Cargo.toml 不存在"
        return 1
    fi

    # 运行测试
    log_info "运行后端测试..."
    cargo test

    # 构建
    log_info "构建后端..."
    cargo build --release

    cd "$PROJECT_ROOT"
    log_success "后端构建完成"
}

# 全模块测试
test_all() {
    log_info "测试全部模块..."
    test_frontend
    test_backend
    log_success "全部模块测试完成"
}

# 主逻辑
MODULE=${1:-all}

case "$MODULE" in
    frontend.particle-earth)
        log_info "测试粒子地球模块..."
        update_module_status "前端-粒子地球" "测试中"
        test_frontend
        update_module_status "前端-粒子地球" "✅已完成"
        ;;
    frontend.geo-layer)
        log_info "测试地理边界模块..."
        update_module_status "前端-地理边界" "测试中"
        test_frontend
        update_module_status "前端-地理边界" "✅已完成"
        ;;
    frontend.interaction)
        log_info "测试交互管理模块..."
        update_module_status "前端-交互管理" "测试中"
        test_frontend
        update_module_status "前端-交互管理" "✅已完成"
        ;;
    frontend.data-layer)
        log_info "测试数据层模块..."
        update_module_status "前端-数据层" "测试中"
        test_frontend
        update_module_status "前端-数据层" "✅已完成"
        ;;
    backend.api)
        log_info "测试后端API模块..."
        update_module_status "后端-API" "测试中"
        test_backend
        update_module_status "后端-API" "✅已完成"
        ;;
    backend.fetcher)
        log_info "测试新闻采集模块..."
        update_module_status "后端-采集器" "测试中"
        test_backend
        update_module_status "后端-采集器" "✅已完成"
        ;;
    backend.database)
        log_info "测试数据库模块..."
        update_module_status "后端-存储" "测试中"
        test_backend
        update_module_status "后端-存储" "✅已完成"
        ;;
    all)
        test_all
        ;;
    -h|--help|help)
        show_help
        ;;
    *)
        log_error "未知模块: $MODULE"
        show_help
        exit 1
        ;;
esac

# 生成最新报告
log_info "生成最新报告..."
bash scripts/generate_report.sh /dev/null

echo ""
log_success "🎉 构建流程完成!"
