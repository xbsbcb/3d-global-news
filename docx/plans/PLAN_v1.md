# GlobeNews - 详细技术计划 v1.0

> 版本：v1.0
> 创建日期：2026-03-31
> 基于：PROJECT_PROPOSAL.md v2.0
> 状态：规划中

---

## 一、项目结构

```
globe-news/
├── frontend/                    # 前端 (Vue 3)
│   ├── src/
│   │   ├── components/         # 组件
│   │   │   ├── Earth/           # 3D地球组件
│   │   │   ├── News/            # 新闻相关组件
│   │   │   └── UI/             # 通用UI组件
│   │   ├── modules/            # 核心模块（按设计文档）
│   │   │   ├── EarthScene.ts
│   │   │   ├── ParticleEarth.ts
│   │   │   ├── GeoLayer.ts
│   │   │   ├── DataLayer.ts
│   │   │   └── InteractionManager.ts
│   │   ├── stores/             # 状态管理
│   │   ├── api/                # API调用
│   │   └── utils/              # 工具函数
│   └── tests/                  # 单元测试
│
├── backend/                     # 后端 (Rust)
│   ├── src/
│   │   ├── api/                # API路由
│   │   ├── models/             # 数据模型
│   │   ├── services/            # 业务逻辑
│   │   │   ├── fetcher/        # 新闻采集
│   │   │   └── database/       # 数据库操作
│   │   └── utils/              # 工具函数
│   └── tests/                   # 单元测试
│
├── scripts/                     # 自动化脚本
│   ├── build.sh
│   └── generate_report.sh
│
├── docx/
│   ├── plans/                  # 技术计划
│   ├── 生产报告/                # 生产报告
│   ├── PROJECT_PROPOSAL.md     # 项目计划书
│   └── 前端.md                 # 前端方案
│
└── docker-compose.yml          # Docker部署
```

---

## 二、前端开发计划

### 2.1 技术栈

| 技术 | 用途 | 版本 |
|------|------|------|
| Vue 3 | 框架 | 3.4+ |
| Three.js | 3D渲染 | 0.160+ |
| GSAP | 动画 | 3.12+ |
| D3-geo | 地理坐标 | 3.8+ |
| Vite | 构建 | 5.0+ |
| Vitest | 测试 | 1.0+ |

### 2.2 模块详细计划

#### Module 1: EarthScene（主场景）

**职责**：初始化 Three.js 场景、相机、渲染器、灯光

**文件**：`frontend/src/modules/EarthScene.ts`

**接口设计**：
```typescript
interface EarthSceneConfig {
  container: HTMLElement;
  width: number;
  height: number;
}

class EarthScene {
  constructor(config: EarthSceneConfig)
  getScene(): THREE.Scene
  getCamera(): THREE.PerspectiveCamera
  getRenderer(): THREE.WebGLRenderer
  resize(width: number, height: number): void
  dispose(): void
}
```

**依赖**：无
**测试**：场景初始化、resize、dispose

---

#### Module 2: ParticleEarth（粒子地球）

**职责**：生成粒子化地球、处理缩放聚拢动画

**文件**：`frontend/src/modules/ParticleEarth.ts`

**接口设计**：
```typescript
interface ParticleEarthConfig {
  scene: THREE.Scene;
  radius: number;
  particleCount: number;
}

class ParticleEarth {
  constructor(config: ParticleEarthConfig)
  setProgress(progress: number): void  // 0-1, 控制聚拢
  setZoomLevel(level: number): void    // 控制缩放
  getMesh(): THREE.Points
  dispose(): void
}
```

**依赖**：EarthScene、D3-geo
**测试**：粒子生成、聚拢动画

---

#### Module 3: GeoLayer（地理边界）

**职责**：加载GeoJSON、生成3D边界线

**文件**：`frontend/src/modules/GeoLayer.ts`

**接口设计**：
```typescript
interface GeoLayerConfig {
  scene: THREE.Scene;
  geoJsonUrl: string;
}

class GeoLayer {
  constructor(config: GeoLayerConfig)
  async load(): Promise<void>
  setVisible(visible: boolean): void
  getBoundaries(): THREE.Line[]
  dispose(): void
}
```

**依赖**：EarthScene
**测试**：GeoJSON加载、边界渲染

---

#### Module 4: DataLayer（数据层）

**职责**：管理热力图、连接弧线、新闻数据点

**文件**：`frontend/src/modules/DataLayer.ts`

**接口设计**：
```typescript
interface NewsPoint {
  id: string;
  lat: number;
  lng: number;
  title: string;
  category: string;
}

interface DataLayerConfig {
  scene: THREE.Scene;
}

class DataLayer {
  constructor(config: DataLayerConfig)
  setNewsData(news: NewsPoint[]): void
  showHeatmap(visible: boolean): void
  showConnections(visible: boolean): void
  addConnection(from: NewsPoint, to: NewsPoint): void
  clearConnections(): void
  dispose(): void
}
```

**依赖**：EarthScene
**测试**：数据点渲染、热力图、连接线

---

#### Module 5: InteractionManager（交互管理）

**职责**：处理点击、缩放、地区特写

**文件**：`frontend/src/modules/InteractionManager.ts`

**接口设计**：
```typescript
interface FlyToConfig {
  lat: number;
  lng: number;
  zoom: number;
  duration: number;
}

class InteractionManager {
  constructor(camera: THREE.PerspectiveCamera, controls: OrbitControls)
  flyTo(config: FlyToConfig): Promise<void>
  onRegionClick(callback: (lat: number, lng: number) => void): void
  onNewsClick(callback: (news: NewsPoint) => void): void
  setZoomRange(min: number, max: number): void
  dispose(): void
}
```

**依赖**：EarthScene
**测试**：Fly-to动画、事件回调

---

### 2.3 组件开发计划

| 组件 | 依赖模块 | 开发顺序 |
|------|----------|----------|
| GlobeView | EarthScene, ParticleEarth | 1 |
| NewsPopup | DataLayer | 2 |
| SearchBar | API | 3 |
| CategoryFilter | Store | 4 |
| StatsPanel | API | 5 |
| Header/Layout | 其他组件 | 6 |

---

## 三、后端开发计划

### 3.1 技术栈

| 技术 | 用途 | 备注 |
|------|------|------|
| Rust | 语言 | 最新稳定版 |
| Axum | Web框架 | 异步 |
| SQLite | 数据库 | 本地文件 |
| SeaORM | ORM | Rust ORM |
| Tokio | 异步运行时 | Axum依赖 |

### 3.2 数据模型

**news 表**：
```sql
CREATE TABLE news (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    summary TEXT,
    content TEXT,
    source TEXT NOT NULL,
    source_url TEXT,
    category TEXT,
    country TEXT,
    city TEXT,
    latitude REAL,
    longitude REAL,
    published_at DATETIME,
    fetched_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_news_category ON news(category);
CREATE INDEX idx_news_published ON news(published_at);
CREATE INDEX idx_news_lat_lng ON news(latitude, longitude);
```

**categories 表**：
```sql
CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    color TEXT
);
```

### 3.3 API 设计

| 方法 | 路径 | 描述 | 状态 |
|------|------|------|------|
| GET | /health | 健康检查 | ✅ |
| GET | /api/news | 获取新闻列表 | ⏳ |
| GET | /api/news/{id} | 获取新闻详情 | ⏳ |
| GET | /api/news/search | 搜索新闻 | ⏳ |
| GET | /api/categories | 获取分类 | ⏳ |
| POST | /api/fetch | 触发采集 | ⏳ |
| GET | /api/stats | 统计数据 | ⏳ |
| GET | /swagger-ui | API文档 | ⏳ |

### 3.4 新闻采集服务

**NewsFetcher**：
```rust
trait NewsFetcher {
    async fn fetch(&self, source: &str) -> Result<Vec<NewsItem>>;
    async fn fetch_all(&self) -> Result<Vec<NewsItem>>;
}
```

**数据源配置**：
```rust
struct NewsSource {
    name: String,
    api_url: String,
    api_key: String,  // 从环境变量读取
}
```

---

## 四、测试计划

### 4.1 前端测试

**测试框架**：Vitest + Vue Test Utils

**测试覆盖目标**：>70%

| 模块 | 测试用例数 | 优先级 |
|------|------------|--------|
| EarthScene | 5 | 高 |
| ParticleEarth | 8 | 高 |
| GeoLayer | 4 | 中 |
| DataLayer | 6 | 高 |
| InteractionManager | 5 | 中 |

### 4.2 后端测试

**测试框架**：Rust 内置测试 + doc tests

| 模块 | 测试用例数 | 优先级 |
|------|------------|--------|
| API路由 | 10 | 高 |
| 数据库操作 | 8 | 高 |
| 新闻采集 | 6 | 中 |

---

## 五、开发里程碑

### M1: 项目初始化 (Week 1)

- [ ] 搭建前端项目 (Vue 3 + Vite)
- [ ] 搭建后端项目 (Rust + Axum)
- [ ] 配置 Git Hooks
- [ ] 编写 README

**交付物**：空项目结构，可运行

### M2: 粒子地球模块 (Week 2)

- [ ] EarthScene 模块
- [ ] ParticleEarth 模块
- [ ] 基础粒子渲染
- [ ] 聚拢/散开动画
- [ ] 单元测试

**交付物**：可旋转的粒子地球

### M3: 地理与数据层 (Week 3)

- [ ] GeoLayer 模块
- [ ] DataLayer 模块
- [ ] 热力图功能
- [ ] 连接线功能
- [ ] 单元测试

**交付物**：带数据展示的地球

### M4: 后端核心 (Week 4)

- [ ] 数据库模型
- [ ] CRUD API
- [ ] 新闻采集服务
- [ ] Swagger 文档
- [ ] 单元测试

**交付物**：完整后端服务

### M5: 前后端集成 (Week 5)

- [ ] 前端API对接
- [ ] 交互功能完善
- [ ] 新闻详情弹窗
- [ ] 搜索/分类功能
- [ ] 集成测试

**交付物**：可用的新闻可视化

### M6: 部署与文档 (Week 6)

- [ ] Docker 配置
- [ ] 一键部署脚本
- [ ] 使用文档
- [ ] 性能优化
- [ ] 最终测试

**交付物**：可部署版本

---

## 六、环境变量

### 前端 (.env)
```
VITE_API_BASE_URL=http://localhost:8080
```

### 后端 (.env)
```
DATABASE_URL=./data/news.db
NEWS_API_KEY=your_api_key
PORT=8080
RUST_LOG=info
```

---

## 七、Git 提交规范

```
feat: 新功能
fix: 修复bug
docs: 文档更新
test: 测试相关
refactor: 重构
chore: 构建/工具

示例:
git commit -m "feat: 完成 ParticleEarth 模块"
git commit -m "fix: 修复缩放时粒子丢失问题"
git commit -m "test: 添加 ParticleEarth 单元测试"
```

---

## 八、注意事项

1. **模块独立性**：每个模块应可独立测试，不依赖其他未完成模块
2. **接口稳定性**：模块间通过接口通信，避免直接依赖具体实现
3. **测试优先**：每个模块完成后立即编写单元测试
4. **本地优先**：优先使用本地实现，减少外部依赖

---

*文档版本：v1.0*
*下一步：开始 M1 项目初始化*
