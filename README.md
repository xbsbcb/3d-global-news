# GlobeNews - 3D全球新闻可视化平台

> 基于 Vue 3 + Three.js + Rust 技术栈的实时新闻可视化项目

## 项目结构

```
globe-news/
├── frontend/           # 前端 (Vue 3 + Three.js)
├── backend/           # 后端 (Rust + Axum)
├── scripts/           # 自动化脚本
├── docx/              # 项目文档
│   ├── plans/        # 技术计划
│   └── 生产报告/     # 生产报告
└── docker-compose.yml
```

## 快速开始

### 前端

```bash
cd frontend
npm install
npm run dev
```

### 后端 (需要 Rust)

```bash
cd backend
cargo run
```

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端框架 | Vue 3 + TypeScript |
| 3D渲染 | Three.js + GLSL |
| 动画 | GSAP |
| 后端语言 | Rust |
| Web框架 | Axum |
| 数据库 | SQLite |

## 开发脚本

```bash
./scripts/build.sh <module>  # 测试指定模块
git commit                  # 自动生成生产报告
```

## 文档

- [项目计划书](docx/PROJECT_PROPOSAL.md)
- [技术计划](docx/plans/PLAN_v1.md)
- [前端方案](docx/前端.md)

## License

MIT
