# GlobeNews - 3D全球新闻可视化平台

一个网页端3D全球实时新闻数据可视化整合平台。

## 功能特性

- 🌍 3D地球可视化展示全球新闻分布
- 📰 RSS + RSSHub 多源新闻数据采集
- 🔍 关键词搜索和分类筛选
- 📅 时间线浏览历史新闻
- 🌓 暗色NASA风格主题
- 📱 响应式设计，支持移动端

## 技术栈

- **前端**: React 18 + Vite + Three.js + Globe.gl + Tailwind CSS
- **后端**: Node.js + Express.js + TypeScript + Prisma ORM
- **数据库**: PostgreSQL 15
- **部署**: Docker + Nginx

## 快速开始

### 前置要求

- Node.js 20+
- Docker & Docker Compose
- pnpm (推荐) 或 npm

### 开发环境

```bash
# 克隆项目
git clone <repo-url>
cd 3d-global-news

# 安装依赖
npm install

# 复制环境变量
cp .env.example .env

# 启动数据库 (需要Docker)
docker-compose up -d db

# 运行数据库迁移
npm run db:push --workspace=server

# 启动开发服务
npm run dev
```

访问 http://localhost:5173

### Docker部署

```bash
# 构建并启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

访问 http://localhost:3000

## 项目结构

```
3d-global-news/
├── client/          # 前端应用
│   ├── src/
│   │   ├── components/   # React组件
│   │   ├── hooks/        # 自定义Hooks
│   │   ├── services/     # API服务
│   │   ├── stores/       # 状态管理
│   │   └── types/        # 类型定义
│   └── ...
├── server/          # 后端API
│   ├── src/
│   │   ├── controllers/  # 控制器
│   │   ├── services/     # 业务逻辑
│   │   ├── routes/       # 路由
│   │   └── prisma/       # 数据库模型
│   └── ...
├── docker-compose.yml
└── plan.md          # 详细项目计划
```

## API文档

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/news | 获取新闻列表 |
| GET | /api/news/:id | 获取单条新闻 |
| GET | /api/news/search | 搜索新闻 |
| GET | /api/categories | 获取分类列表 |
| POST | /api/news/fetch | 手动触发抓取 |
| GET | /api/health | 健康检查 |

## 配置说明

环境变量详见 `.env.example`

## 开发指南

### 前端开发
```bash
cd client
npm run dev     # 开发服务器
npm run build   # 生产构建
```

### 后端开发
```bash
cd server
npm run dev     # 开发服务器 (tsx watch)
npm run build    # TypeScript编译
npm run db:push  # 推送数据库变更
```

## License

MIT
