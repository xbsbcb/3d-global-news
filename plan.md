# GlobeNews - 3D全球新闻可视化平台 项目计划

> 文档版本：v1.0
> 创建日期：2026-03-26
> 项目路径：/mnt/e/Git/Program/3d-global-news

---

## 一、项目概述

### 1.1 项目背景
随着全球化信息流通加速，新闻数据量呈指数级增长。传统的新闻列表展示方式难以直观呈现新闻的地理分布和关联性。本项目旨在通过3D地球可视化技术，将全球实时新闻以地理空间的形式整合展示，让用户能够直观地探索和理解世界动态。

### 1.2 项目目标
构建一个网页端3D全球实时新闻数据整合平台，实现：
- 3D地球可视化展示全球新闻分布
- RSS + RSSHub多源新闻数据采集
- 搜索、分类、时间线等交互功能
- 内网/本地部署，支持离线使用

### 1.3 项目范围
**包含范围：**
- React + Three.js (Globe.gl) 前端
- Express.js 后端API
- PostgreSQL 数据存储
- RSSHub 新闻采集服务
- Docker 容器化部署

---

## 二、技术架构

### 2.1 整体架构图
```
┌─────────────────────────────────────────────────────────────┐
│                        Client (Browser)                      │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                    React + Vite                         │ │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────────────┐    │ │
│  │  │Globe.gl   │  │ Zustand   │  │ Tailwind CSS      │    │ │
│  │  │3D地球组件  │  │ 状态管理   │  │ 样式              │    │ │
│  │  └───────────┘  └───────────┘  └───────────────────┘    │ │
│  └─────────────────────────────────────────────────────────┘ │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/REST
┌────────────────────────┴────────────────────────────────────┐
│                       Backend (Node.js)                       │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                   Express.js API                         │ │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────────────┐    │ │
│  │  │ News API  │  │ RSS Parser│  │ Scheduler         │    │ │
│  │  │ 新闻接口   │  │ RSS解析   │  │ 定时任务          │    │ │
│  │  └───────────┘  └───────────┘  └───────────────────┘    │ │
│  └─────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                    PostgreSQL                            │ │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────────────┐    │ │
│  │  │ news      │  │ categories│  │ config            │    │ │
│  │  │ 新闻表    │  │ 分类表    │  │ 配置表            │    │ │
│  │  └───────────┘  └───────────┘  └───────────────────┘    │ │
│  └─────────────────────────────────────────────────────────┘ │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────┴────────────────────────────────────┐
│                    Data Sources                              │
│  ┌───────────┐  ┌───────────┐  ┌───────────────────┐         │
│  │ RSSHub    │  │ GitHub    │  │ 公开News API     │         │
│  │ RSS聚合   │  │ Trending  │  │ 备用源            │         │
│  └───────────┘  └───────────┘  └───────────────────┘         │
└───────────────────────────────────────────────────────────────┘
```

### 2.2 技术栈详情

#### 前端技术栈
| 技术 | 版本 | 用途 |
|------|------|------|
| React | 18.x | UI框架 |
| Vite | 5.x | 构建工具 |
| Three.js | - | 3D渲染引擎 |
| Globe.gl | - | 3D地球可视化 |
| Zustand | 4.x | 状态管理 |
| Tailwind CSS | 3.x | 样式框架 |
| React Query | 5.x | 数据请求 |
| TypeScript | 5.x | 类型安全 |

#### 后端技术栈
| 技术 | 版本 | 用途 |
|------|------|------|
| Node.js | 20.x | 运行时 |
| Express.js | 4.x | Web框架 |
| TypeScript | 5.x | 类型安全 |
| Prisma | 5.x | ORM |
| PostgreSQL | 15.x | 数据库 |
| node-cron | - | 定时任务 |
| rss-parser | - | RSS解析 |

#### 基础设施
| 技术 | 用途 |
|------|------|
| Docker | 容器化 |
| Nginx | 反向代理/Web服务器 |
| docker-compose | 多容器编排 |

### 2.3 项目目录结构
```
3d-global-news/
├── client/                     # 前端项目
│   ├── public/
│   │   └── favicon.ico
│   ├── src/
│   │   ├── assets/             # 静态资源
│   │   ├── components/         # React组件
│   │   │   ├── Globe/           # 3D地球组件
│   │   │   │   ├── Globe.tsx
│   │   │   │   ├── NewsMarker.tsx
│   │   │   │   └── NewsPopup.tsx
│   │   │   ├── Search/          # 搜索组件
│   │   │   │   └── SearchBar.tsx
│   │   │   ├── Filter/          # 筛选组件
│   │   │   │   └── CategoryFilter.tsx
│   │   │   ├── Timeline/        # 时间线组件
│   │   │   │   └── Timeline.tsx
│   │   │   └── Layout/           # 布局组件
│   │   │       ├── Header.tsx
│   │   │       └── Footer.tsx
│   │   ├── hooks/               # 自定义Hooks
│   │   │   ├── useNews.ts
│   │   │   └── useGlobe.ts
│   │   ├── services/            # API服务
│   │   │   └── api.ts
│   │   ├── stores/              # Zustand状态
│   │   │   └── newsStore.ts
│   │   ├── types/               # TypeScript类型
│   │   │   └── news.ts
│   │   ├── utils/               # 工具函数
│   │   │   └── geo.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── server/                     # 后端项目
│   ├── src/
│   │   ├── controllers/         # 控制器
│   │   │   └── newsController.ts
│   │   ├── services/            # 业务逻辑
│   │   │   ├── newsService.ts
│   │   │   └── rssService.ts
│   │   ├── routes/              # 路由
│   │   │   └── newsRoutes.ts
│   │   ├── prisma/              # 数据库
│   │   │   └── schema.prisma
│   │   ├── types/               # 类型定义
│   │   │   └── index.ts
│   │   ├── utils/               # 工具函数
│   │   │   └── geo.ts
│   │   ├── config/              # 配置文件
│   │   │   └── index.ts
│   │   └── index.ts             # 入口文件
│   ├── package.json
│   └── tsconfig.json
│
├── rss-server/                 # RSSHub服务（可选独立部署）
│   └── Dockerfile
│
├── nginx/                      # Nginx配置
│   ├── nginx.conf
│   └── conf.d/
│       └── client.conf
│
├── docker-compose.yml          # 容器编排
├── Dockerfile.client            # 前端Dockerfile
├── Dockerfile.server            # 后端Dockerfile
├── .env.example                # 环境变量示例
├── README.md                   # 项目文档
├── PROJECT_PROPOSAL.md         # 项目计划书
└── plan.md                     # 本文件
```

---

## 三、数据库设计

### 3.1 ER图
```
┌─────────────────┐       ┌─────────────────┐
│     news        │       │    category     │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │──────<│ id (PK)         │
│ title           │       │ name            │
│ summary         │       │ slug            │
│ content         │       │ color           │
│ source          │       └─────────────────┘
│ source_url      │
│ category_id(FK) │       ┌─────────────────┐
│ country         │       │      config     │
│ city            │       ├─────────────────┤
│ latitude        │       │ id (PK)         │
│ longitude       │       │ key             │
│ published_at    │       │ value           │
│ fetched_at      │       │ updated_at      │
│ is_translated   │       └─────────────────┘
│ language        │
│ status          │
│ created_at      │
│ updated_at      │
└─────────────────┘
```

### 3.2 表结构详解

#### news 表
```sql
CREATE TABLE news (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title           VARCHAR(500) NOT NULL,
    summary         TEXT,
    content         TEXT,
    source          VARCHAR(255),
    source_url      TEXT,
    category_id     UUID REFERENCES category(id),
    country         VARCHAR(100),
    city            VARCHAR(100),
    latitude        DECIMAL(10, 8),
    longitude       DECIMAL(11, 8),
    published_at    TIMESTAMP,
    fetched_at      TIMESTAMP DEFAULT NOW(),
    is_translated    BOOLEAN DEFAULT FALSE,
    language        VARCHAR(10) DEFAULT 'en',
    status          VARCHAR(20) DEFAULT 'active',
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_news_published_at ON news(published_at DESC);
CREATE INDEX idx_news_category ON news(category_id);
CREATE INDEX idx_news_lat_lng ON news(latitude, longitude);
CREATE INDEX idx_news_status ON news(status);
```

#### category 表
```sql
CREATE TABLE category (
    id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name    VARCHAR(50) NOT NULL UNIQUE,
    slug    VARCHAR(50) NOT NULL UNIQUE,
    color   VARCHAR(20) DEFAULT '#00d4ff'
);
```

#### config 表
```sql
CREATE TABLE config (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key         VARCHAR(100) NOT NULL UNIQUE,
    value       TEXT,
    updated_at  TIMESTAMP DEFAULT NOW()
);
```

### 3.3 初始数据
```sql
-- 分类数据
INSERT INTO category (name, slug, color) VALUES
('金融', 'finance', '#4ecdc4'),
('政治', 'politics', '#ff6b6b'),
('科技', 'technology', '#00d4ff'),
('财经', 'business', '#ffe66d');

-- 配置数据
INSERT INTO config (key, value) VALUES
('update_interval', '86400'),      -- 24小时
('max_news_per_fetch', '100'),
('rss_sources', '[]');
```

---

## 四、API设计

### 4.1 API概览
| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/news | 获取新闻列表 |
| GET | /api/news/:id | 获取单条新闻 |
| GET | /api/news/search | 搜索新闻 |
| GET | /api/categories | 获取分类列表 |
| POST | /api/news/fetch | 手动触发抓取 |
| PUT | /api/config | 更新配置 |
| GET | /api/health | 健康检查 |

### 4.2 详细API规格

#### GET /api/news
新闻列表接口

**请求参数：**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | 否 | 页码，默认1 |
| limit | number | 否 | 每页数量，默认50 |
| category | string | 否 | 分类slug |
| country | string | 否 | 国家 |
| startDate | string | 否 | 开始日期 |
| endDate | string | 否 | 结束日期 |

**响应示例：**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "title": "新闻标题",
        "summary": "新闻摘要",
        "source": "来源",
        "category": { "id": "uuid", "name": "科技", "slug": "technology", "color": "#00d4ff" },
        "country": "中国",
        "city": "北京",
        "latitude": 39.9042,
        "longitude": 116.4074,
        "publishedAt": "2026-03-26T10:00:00Z",
        "language": "zh"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 1234,
      "totalPages": 25
    }
  }
}
```

#### GET /api/news/search
搜索接口

**请求参数：**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| q | string | 是 | 搜索关键词 |
| page | number | 否 | 页码 |
| limit | number | 否 | 每页数量 |

**响应示例：**
```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {...}
  }
}
```

#### GET /api/categories
分类列表接口

**响应示例：**
```json
{
  "success": true,
  "data": [
    { "id": "uuid", "name": "金融", "slug": "finance", "color": "#4ecdc4" },
    { "id": "uuid", "name": "政治", "slug": "politics", "color": "#ff6b6b" },
    { "id": "uuid", "name": "科技", "slug": "technology", "color": "#00d4ff" },
    { "id": "uuid", "name": "财经", "slug": "business", "color": "#ffe66d" }
  ]
}
```

#### POST /api/news/fetch
手动触发抓取

**响应示例：**
```json
{
  "success": true,
  "data": {
    "message": "抓取任务已启动",
    "estimatedCount": 50
  }
}
```

---

## 五、前端组件设计

### 5.1 组件树
```
App
├── Layout
│   ├── Header
│   │   ├── Logo
│   │   ├── SearchBar
│   │   └── CategoryFilter
│   ├── Main
│   │   └── Globe
│   │       ├── GlobeCanvas (Globe.gl)
│   │       ├── NewsMarkers
│   │       │   └── NewsMarker (点标记)
│   │       └── NewsPopup (点击弹窗)
│   ├── Timeline
│   │   └── TimelineSlider
│   └── Footer
│       ├── DataSources
│       └── UpdateStatus
└── Providers
    ├── QueryClientProvider
    └── GlobalStore
```

### 5.2 核心组件规格

#### Globe.tsx
3D地球主组件

**Props：**
```typescript
interface GlobeProps {
  news: NewsItem[];
  onMarkerClick: (news: NewsItem) => void;
  onRegionClick: (region: string) => void;
}
```

**状态：**
- zoomLevel: number (缩放级别)
- rotation: { x, y } (旋转角度)
- hoveredMarker: string | null (悬停标记)

**功能：**
- 初始化Globe.gl实例
- 渲染新闻点标记
- 处理缩放、旋转事件
- 地区点击放大

#### NewsMarker.tsx
新闻标记点组件

**Props：**
```typescript
interface NewsMarkerProps {
  news: NewsItem;
  isActive: boolean;
  onClick: () => void;
}
```

**视觉规格：**
- 默认：圆形，直径8px，颜色按分类
- 悬停：直径12px，发光效果
- 选中：直径16px，高亮环

#### NewsPopup.tsx
新闻详情弹窗

**Props：**
```typescript
interface NewsPopupProps {
  news: NewsItem;
  onClose: () => void;
  position: { x: number; y: number };
}
```

**功能：**
- 显示新闻标题、摘要、来源
- 原文链接跳转
- 关闭按钮

#### SearchBar.tsx
搜索栏组件

**状态：**
- query: string
- isSearching: boolean

**功能：**
- 实时搜索（防抖300ms）
- 回车确认搜索
- 清空搜索

#### CategoryFilter.tsx
分类筛选组件

**Props：**
```typescript
interface CategoryFilterProps {
  categories: Category[];
  selected: string[];
  onChange: (slugs: string[]) => void;
}
```

**功能：**
- 多选分类
- 颜色标识
- 清除全部

#### Timeline.tsx
时间线组件

**Props：**
```typescript
interface TimelineProps {
  startDate: Date;
  endDate: Date;
  currentDate: Date;
  onChange: (date: Date) => void;
}
```

**功能：**
- 滑块选择日期
- 快进快退按钮
- 日期显示

---

## 六、状态管理

### 6.1 Zustand Store 设计

```typescript
// stores/newsStore.ts
interface NewsState {
  // 数据
  news: NewsItem[];
  categories: Category[];
  selectedNews: NewsItem | null;

  // 筛选状态
  selectedCategories: string[];
  searchQuery: string;
  dateRange: { start: Date | null; end: Date | null };

  // UI状态
  isLoading: boolean;
  error: string | null;
  globeState: {
    zoom: number;
    rotation: { x: number; y: number };
  };

  // Actions
  setNews: (news: NewsItem[]) => void;
  setCategories: (categories: Category[]) => void;
  setSelectedNews: (news: NewsItem | null) => void;
  setSelectedCategories: (categories: string[]) => void;
  setSearchQuery: (query: string) => void;
  setDateRange: (range: { start: Date | null; end: Date | null }) => void;
  setGlobeState: (state: Partial<GlobeState>) => void;
  fetchNews: () => Promise<void>;
}
```

---

## 七、后端服务设计

### 7.1 RSS采集服务

#### 数据源配置
```typescript
interface RSSSource {
  name: string;
  url: string;
  category: string;
  language: string;
  country: string;
  city?: string;
  coordinates?: { lat: number; lng: number };
}
```

#### 内置数据源
```typescript
const DEFAULT_SOURCES: RSSSource[] = [
  {
    name: 'BBC News',
    url: 'https://feeds.bbci.co.uk/news/world/rss.xml',
    category: 'politics',
    language: 'en',
    country: 'UK'
  },
  {
    name: 'Reuters World',
    url: 'https://www.reutersagency.com/feed/?best-topics=world-news',
    category: 'politics',
    language: 'en',
    country: 'USA'
  },
  // ... 更多源
];
```

#### 采集流程
```
定时任务触发
    ↓
读取配置的数据源列表
    ↓
并发抓取各RSS源 (Promise.all)
    ↓
解析XML为JSON
    ↓
提取标题、摘要、内容、发布时间
    ↓
地理标引（国家/城市 → 经纬度）
    ↓
分类映射
    ↓
去重检查（基于标题hash）
    ↓
写入数据库
    ↓
更新配置表记录
```

### 7.2 地理标引服务

```typescript
// utils/geo.ts
interface GeoResult {
  country: string;
  city: string;
  latitude: number;
  longitude: number;
}

// 使用简单国家匹配 + 城市坐标库
// 备选：GeoNames API（内网环境需离线数据）
```

---

## 八、开发规范

### 8.1 Git工作流
```
main (保护分支)
└── develop (开发分支)
    ├── feature/globe-component
    ├── feature/rss-service
    └── ...
```

### 8.2 代码规范
- ESLint + Prettier
- 提交信息：Conventional Commits
- 分支命名：feature/, bugfix/, hotfix/

### 8.3 TypeScript规范
- 严格模式
- 接口命名：PascalCase
- 类型定义单独文件

---

## 九、测试策略

### 9.1 测试分层
| 层级 | 工具 | 覆盖率目标 |
|------|------|-----------|
| 单元测试 | Vitest | 70% |
| 组件测试 | React Testing Library | 60% |
| E2E测试 | Playwright | 核心流程 |

### 9.2 核心测试场景
1. 新闻列表加载
2. 搜索功能
3. 分类筛选
4. 3D地球交互
5. 新闻详情弹窗
6. 时间线滑动

---

## 十、部署方案

### 10.1 Docker部署
```yaml
# docker-compose.yml
services:
  client:
    build: ./client
    ports:
      - "3000:80"
    depends_on:
      - server

  server:
    build: ./server
    ports:
      - "4000:4000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/globenews
    depends_on:
      - db

  db:
    image: postgres:15
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=globenews
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass

  rss-cache:
    image: diygod/rsshub:latest
    ports:
      - "1200:1200"

volumes:
  pgdata:
```

### 10.2 Nginx配置
```nginx
server {
    listen 80;
    server_name localhost;

    # 前端静态文件
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # API代理
    location /api {
        proxy_pass http://server:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 十一、迭代计划

### Sprint 1: 基础设施 (Day 1-2)
- [ ] 项目脚手架搭建
- [ ] Docker环境配置
- [ ] 数据库表创建
- [ ] 前后端联调基础

### Sprint 2: 后端核心 (Day 3-4)
- [ ] RSS采集服务
- [ ] 新闻API开发
- [ ] 定时任务配置
- [ ] 数据导入验证

### Sprint 3: 前端核心 (Day 5-7)
- [ ] Globe.gl集成
- [ ] 新闻标记显示
- [ ] 搜索功能
- [ ] 分类筛选

### Sprint 4: 完善功能 (Day 8-10)
- [ ] 新闻详情弹窗
- [ ] 时间线组件
- [ ] 响应式适配
- [ ] 性能优化

### Sprint 5: 测试部署 (Day 11-14)
- [ ] 功能测试
- [ ] Bug修复
- [ ] 文档编写
- [ ] 部署上线

---

## 十二、关键文件清单

### 必须创建的文件
```
3d-global-news/
├── client/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── index.html
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── index.css
│       ├── types/news.ts
│       ├── services/api.ts
│       ├── stores/newsStore.ts
│       └── components/
│           ├── Globe/Globe.tsx
│           ├── Globe/NewsMarker.tsx
│           ├── Globe/NewsPopup.tsx
│           ├── Search/SearchBar.tsx
│           ├── Filter/CategoryFilter.tsx
│           ├── Timeline/Timeline.tsx
│           └── Layout/
│               ├── Header.tsx
│               └── Footer.tsx
│
├── server/
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts
│       ├── config/index.ts
│       ├── routes/newsRoutes.ts
│       ├── controllers/newsController.ts
│       ├── services/newsService.ts
│       ├── services/rssService.ts
│       ├── prisma/schema.prisma
│       ├── types/index.ts
│       └── utils/geo.ts
│
├── docker-compose.yml
├── Dockerfile.client
├── Dockerfile.server
├── .env.example
└── README.md
```

---

## 十三、验收标准

### 13.1 MVP验收
- [ ] 3D地球正常渲染
- [ ] 新闻点标记显示
- [ ] 搜索功能可用
- [ ] 分类筛选有效
- [ ] 点击标记显示详情
- [ ] 可本地Docker部署

### 13.2 性能指标
- 页面加载 < 5秒
- 渲染帧率 > 30fps
- API响应 < 500ms

---

*文档结束*
*下一步：开始项目搭建*
