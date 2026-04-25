# 3D Global News — 全球新闻可视化平台

基于 Vue 3 + Three.js + Rust/Axum 的 3D 地球新闻可视化平台。点击地球上的国家，自动获取该国最新新闻并展示。

## 功能特性

- 🌍 **3D 粒子地球** — 50,000 粒子构成的交互式地球
- 🗺️ **国家地理边界** — GeoJSON 多边形填充 + 边界线渲染
- 🖱️ **点击高亮** — 点击国家高亮填充面和边界线
- 📰 **新闻自动获取** — 后端调用 WorldNewsAPI，12h 数据新鲜度检测
- 📡 **底部滑入面板** — 横向滚动展示新闻卡片
- ✈️ **飞行定位** — 支持飞向指定经纬度
- 🔄 **自动回正** — 3 秒无操作后 Y 轴自动回正

## 快速开始

### Docker 部署（推荐）

```bash
git clone https://github.com/xbsbcb/3d-global-news.git
cd 3d-global-news

# 配置 API Key（复制 .env.example 为 .env，填入 WORLDNEWS_API_KEY）
cp .env.example .env

# 一键启动
./start.sh
```

访问 http://localhost:3000

### 本地开发

```bash
# 前端
cd frontend
npm install
npm run dev

# 后端
cd backend
cp .env.example .env   # 填入 WORLDNEWS_API_KEY
cargo run
```

## 项目结构

```
3d-global-news/
├── frontend/                  # Vue 3 + Three.js 前端
│   ├── src/
│   │   ├── modules/          # 3D 地球核心模块
│   │   │   ├── EarthScene.ts       # 场景初始化 (相机/灯光/Renderer)
│   │   │   ├── ParticleEarth.ts    # 粒子地球渲染
│   │   │   ├── GeoLayer.ts         # 国家地理边界 (填充+线条+点击检测)
│   │   │   ├── DataLayer.ts        # 热点数据/飞线层
│   │   │   ├── InteractionManager.ts # 点击/飞行/自动回正
│   │   │   └── useGlobe.ts         # Vue Composable 封装
│   │   ├── components/Earth/ # 地球视图组件 (底部新闻面板)
│   │   ├── stores/           # Pinia 状态管理
│   │   └── api/              # 后端 API 调用
│   ├── public/
│   │   └── countries.geojson # 国家边界数据 (14MB 本地静态)
│   └── Dockerfile
│
├── backend/                   # Rust + Axum 后端
│   ├── src/
│   │   ├── api/
│   │   │   ├── routes.rs     # 路由构建 (含 CORS)
│   │   │   └── handlers.rs   # API 处理器
│   │   ├── db.rs             # SQLite 数据库操作
│   │   ├── models/           # 数据模型
│   │   ├── services/
│   │   │   └── worldnews.rs  # WorldNewsAPI 服务
│   │   ├── lib.rs            # 库入口
│   │   └── main.rs           # 程序入口
│   ├── worldnewsapi/         # WorldNewsAPI Rust SDK (本地生成)
│   └── Dockerfile
│
├── scripts/                   # 辅助脚本
│   ├── build.sh              # 构建脚本
│   ├── deploy.sh             # 部署脚本
│   ├── dev.sh                # 开发模式
│   └── init.sh               # 初始化脚本
│
├── docker-compose.yml        # Docker Compose 编排 (含 Nginx)
├── start.sh                  # Docker 一键启动
└── start-local.sh            # 本地开发启动
```

## API 端点

| 端点 | 方法 | 描述 |
|------|------|------|
| `/api/health` | GET | 健康检查 |
| `/api/news` | GET | 获取新闻列表 |
| `/api/news/:id` | GET | 获取单条新闻 |
| `/api/categories` | GET | 获取分类列表 |
| `/api/stats` | GET | 获取统计数据 |
| `/api/fetch-news` | POST | 触发指定国家新闻抓取 |

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端框架 | Vue 3 + TypeScript |
| 3D 渲染 | Three.js |
| 状态管理 | Pinia |
| 后端框架 | Rust 1.94 + Axum 0.7 |
| 数据库 | SQLite (sqlx 0.7) |
| 新闻 API | WorldNewsAPI |
| 部署 | Docker + Nginx |

## License

MIT
