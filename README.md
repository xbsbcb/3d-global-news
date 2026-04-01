# GlobeNews - 3D全球新闻可视化平台

> 基于 Vue 3 + Three.js + Rust 技术栈的实时新闻可视化项目

![GlobeNews](https://img.shields.io/badge/Status-MVP-brightgreen)
![Vue](https://img.shields.io/badge/Vue-3.5-blue)
![Three.js](https://img.shields.io/badge/Three.js-r183-orange)
![Rust](https://img.shields.io/badge/Rust-1.94-black)

## 功能特性

- 🌍 **3D粒子地球** - 使用 Three.js 实现可交互的粒子化地球
- 📰 **新闻可视化** - 将新闻以地理坐标形式展示在地球上
- 🔍 **实时搜索** - 关键词搜索新闻
- 🏷️ **分类筛选** - 按分类过滤新闻
- ✈️ **飞行动画** - 点击新闻飞向该地区
- 📊 **数据统计** - 实时显示新闻数量和分布

## 快速开始

### Docker 部署 (推荐)

```bash
# 克隆项目
git clone https://github.com/xbsbcb/3d-global-news.git
cd 3d-global-news

# 一键部署
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

访问 http://localhost:3000

### 开发模式

```bash
# 前端
cd frontend
npm install
npm run dev

# 后端 (需要 Rust)
cd backend
cargo run
```

## 项目结构

```
globe-news/
├── frontend/           # 前端 (Vue 3 + Three.js)
│   ├── src/
│   │   ├── modules/   # 3D地球核心模块
│   │   ├── components/# UI组件
│   │   ├── stores/    # Pinia状态管理
│   │   └── api/        # API服务
│   └── Dockerfile
│
├── backend/           # 后端 (Rust + Axum)
│   ├── src/
│   │   ├── api/       # API路由
│   │   ├── db/        # 数据库操作
│   │   ├── models/    # 数据模型
│   │   └── services/  # 业务逻辑
│   └── Dockerfile
│
├── scripts/           # 部署脚本
│   ├── deploy.sh      # 一键部署
│   └── dev.sh         # 开发模式
│
├── docker-compose.yml # Docker编排
└── docx/             # 项目文档
```

## API 端点

| 端点 | 方法 | 描述 |
|------|------|------|
| `/health` | GET | 健康检查 |
| `/api/news` | GET | 获取新闻列表 |
| `/api/news/:id` | GET | 获取单条新闻 |
| `/api/news` | POST | 创建新闻 |
| `/api/categories` | GET | 获取分类列表 |
| `/api/stats` | GET | 获取统计数据 |
| `/api/fetch` | POST | 触发新闻采集 |

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端框架 | Vue 3 + TypeScript |
| 3D渲染 | Three.js + GLSL |
| 状态管理 | Pinia |
| 后端框架 | Rust + Axum |
| 数据库 | SQLite |
| 新闻API | WorldNewsAPI |
| 部署 | Docker + Nginx |

## 开发计划

- [x] M1: 项目初始化
- [x] M2: 粒子地球模块
- [x] M3: 后端核心
- [x] M4: 前后端集成
- [x] M5: 部署配置

## 文档

- [项目计划书](docx/PROJECT_PROPOSAL.md)
- [技术计划](docx/plans/PLAN_v1.md)
- [前端方案](docx/前端.md)
- [API文档](apis/)

## License

MIT
