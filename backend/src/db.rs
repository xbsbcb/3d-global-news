//! 数据库操作模块

use crate::models::{Category, CreateNews, News, NewsQuery, PaginatedResponse};
use sqlx::{sqlite::SqlitePool, Row};

/// 数据库连接池
pub type DbPool = SqlitePool;

/// 初始化数据库
pub async fn init_database(pool: &DbPool) -> Result<(), sqlx::Error> {
    // 创建 news 表
    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS news (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            summary TEXT,
            content TEXT,
            source TEXT NOT NULL,
            source_url TEXT,
            category TEXT NOT NULL DEFAULT 'general',
            country TEXT,
            city TEXT,
            latitude REAL,
            longitude REAL,
            published_at TEXT,
            fetched_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
        "#,
    )
    .execute(pool)
    .await?;

    // 创建分类表
    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            slug TEXT NOT NULL UNIQUE,
            color TEXT
        )
        "#,
    )
    .execute(pool)
    .await?;

    // 创建索引
    sqlx::query("CREATE INDEX IF NOT EXISTS idx_news_category ON news(category)")
        .execute(pool)
        .await?;
    sqlx::query("CREATE INDEX IF NOT EXISTS idx_news_published ON news(published_at)")
        .execute(pool)
        .await?;
    sqlx::query("CREATE INDEX IF NOT EXISTS idx_news_lat_lng ON news(latitude, longitude)")
        .execute(pool)
        .await?;

    // 插入默认分类
    let categories = [
        ("政治", "politics", "#ff6b6b"),
        ("财经", "finance", "#4ecdc4"),
        ("科技", "technology", "#00d4ff"),
        ("社会", "society", "#ffe66d"),
        ("体育", "sports", "#95e1d3"),
        ("娱乐", "entertainment", "#f38181"),
    ];

    for (name, slug, color) in categories {
        sqlx::query(
            "INSERT OR IGNORE INTO categories (name, slug, color) VALUES (?, ?, ?)",
        )
        .bind(name)
        .bind(slug)
        .bind(color)
        .execute(pool)
        .await?;
    }

    // 初始化 API 请求记录表
    init_api_requests_table(pool).await?;

    Ok(())
}

/// 新闻操作
pub async fn get_news_list(
    pool: &DbPool,
    query: &NewsQuery,
) -> Result<PaginatedResponse<News>, sqlx::Error> {
    let limit = query.limit.unwrap_or(50).min(100);
    let offset = query.offset.unwrap_or(0);

    // 构建查询条件
    let mut conditions = Vec::new();
    let mut params: Vec<String> = Vec::new();

    if query.category.is_some() {
        conditions.push("category = ?");
        params.push(query.category.clone().unwrap());
    }
    if query.country.is_some() {
        conditions.push("country = ?");
        params.push(query.country.clone().unwrap());
    }
    if query.keyword.is_some() {
        conditions.push("(title LIKE ? OR summary LIKE ?)");
        let kw = format!("%{}%", query.keyword.clone().unwrap());
        params.push(kw.clone());
        params.push(kw);
    }

    let where_clause = if conditions.is_empty() {
        String::new()
    } else {
        format!("WHERE {}", conditions.join(" AND "))
    };

    // 获取总数
    let count_sql = format!("SELECT COUNT(*) as count FROM news {}", where_clause);
    let mut count_q = sqlx::query(&count_sql);
    for p in &params {
        count_q = count_q.bind(p);
    }
    let count_row = count_q.fetch_all(pool).await?.pop().unwrap();
    let total: i64 = count_row.get("count");

    // 获取列表
    let sql = format!(
        "SELECT * FROM news {} ORDER BY fetched_at DESC LIMIT ? OFFSET ?",
        where_clause
    );

    let mut q = sqlx::query_as::<_, News>(&sql);
    for p in &params {
        q = q.bind(p);
    }
    q = q.bind(limit).bind(offset);

    let items = q.fetch_all(pool).await?;

    Ok(PaginatedResponse {
        items,
        total,
        limit,
        offset,
    })
}

/// 删除指定国家的所有新闻（重新抓取前清除旧数据）
pub async fn delete_news_for_country(pool: &DbPool, country: &str) -> Result<(), sqlx::Error> {
    sqlx::query("DELETE FROM news WHERE country = ?")
        .bind(country)
        .execute(pool)
        .await?;
    Ok(())
}

/// 检查指定国家是否已有新闻
pub async fn has_news_for_country(pool: &DbPool, country: &str) -> Result<bool, sqlx::Error> {
    let row = sqlx::query("SELECT COUNT(*) as count FROM news WHERE country = ?")
        .bind(country)
        .fetch_one(pool)
        .await?;
    Ok(row.get::<i64, _>("count") > 0)
}

/// 检查标题是否已存在（去重用）
pub async fn title_exists(pool: &DbPool, title: &str) -> Result<bool, sqlx::Error> {
    let row = sqlx::query("SELECT COUNT(*) as count FROM news WHERE title = ?")
        .bind(title)
        .fetch_one(pool)
        .await?;
    Ok(row.get::<i64, _>("count") > 0)
}

/// 获取某国最新新闻的 fetched_at 时间
pub async fn get_latest_fetched_at(pool: &DbPool, country: &str) -> Result<Option<String>, sqlx::Error> {
    let row = sqlx::query("SELECT fetched_at FROM news WHERE country = ? ORDER BY fetched_at DESC LIMIT 1")
        .bind(country)
        .fetch_optional(pool)
        .await?;
    Ok(row.map(|r| r.get("fetched_at")))
}

/// 获取单条新闻
pub async fn get_news_by_id(pool: &DbPool, id: i64) -> Result<Option<News>, sqlx::Error> {
    let news = sqlx::query_as::<_, News>("SELECT * FROM news WHERE id = ?")
        .bind(id)
        .fetch_optional(pool)
        .await?;
    Ok(news)
}

/// 创建新闻
pub async fn create_news(pool: &DbPool, news: &CreateNews) -> Result<News, sqlx::Error> {
    let result = sqlx::query(
        r#"
        INSERT INTO news (title, summary, content, source, source_url, category, country, city, latitude, longitude, published_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        "#,
    )
    .bind(&news.title)
    .bind(&news.summary)
    .bind(&news.content)
    .bind(&news.source)
    .bind(&news.source_url)
    .bind(&news.category)
    .bind(&news.country)
    .bind(&news.city)
    .bind(news.latitude)
    .bind(news.longitude)
    .bind(news.published_at.clone())
    .execute(pool)
    .await?;

    let id = result.last_insert_rowid();
    get_news_by_id(pool, id).await?.ok_or(sqlx::Error::RowNotFound)
}

/// 获取分类列表
pub async fn get_categories(pool: &DbPool) -> Result<Vec<Category>, sqlx::Error> {
    let categories = sqlx::query_as::<_, Category>("SELECT * FROM categories ORDER BY id")
        .fetch_all(pool)
        .await?;
    Ok(categories)
}

/// 获取统计数据
pub async fn get_stats(pool: &DbPool) -> Result<serde_json::Value, sqlx::Error> {
    let total_news: i64 = sqlx::query("SELECT COUNT(*) as count FROM news")
        .fetch_one(pool)
        .await?
        .get("count");

    let category_counts: Vec<(String, i64)> = sqlx::query("SELECT category, COUNT(*) as count FROM news GROUP BY category")
        .fetch_all(pool)
        .await?
        .into_iter()
        .map(|row| (row.get("category"), row.get("count")))
        .collect();

    Ok(serde_json::json!({
        "total_news": total_news,
        "category_counts": category_counts,
    }))
}

// ==================== API 请求记录 ====================

/// API 请求记录表
pub async fn init_api_requests_table(pool: &DbPool) -> Result<(), sqlx::Error> {
    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS api_requests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            endpoint TEXT NOT NULL,
            country_code TEXT,
            requested_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
            date_key TEXT NOT NULL
        )
        "#,
    )
    .execute(pool)
    .await?;

    sqlx::query("CREATE INDEX IF NOT EXISTS idx_api_requests_date ON api_requests(date_key)")
        .execute(pool)
        .await?;

    Ok(())
}

/// 检查今日 top_news 请求次数
pub async fn get_today_top_news_count(pool: &DbPool) -> Result<i64, sqlx::Error> {
    let today = get_date_key();
    let row = sqlx::query(
        "SELECT COUNT(*) as count FROM api_requests WHERE endpoint = 'top_news' AND date_key = ?"
    )
    .bind(&today)
    .fetch_one(pool)
    .await?;
    Ok(row.get("count"))
}

/// 记录一次 top_news 请求
pub async fn record_top_news_request(pool: &DbPool, country_code: &str) -> Result<(), sqlx::Error> {
    let today = get_date_key();
    sqlx::query(
        "INSERT INTO api_requests (endpoint, country_code, date_key) VALUES ('top_news', ?, ?)"
    )
    .bind(country_code)
    .bind(&today)
    .execute(pool)
    .await?;
    Ok(())
}

/// 获取今日日期字符串 (YYYY-MM-DD)
pub fn get_date_key() -> String {
    use std::time::{SystemTime, UNIX_EPOCH};
    let duration = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap();
    let secs = duration.as_secs();
    // 简单计算，不依赖 chrono
    let days = secs / 86400;
    let year_base = 1970;
    let mut year = year_base;
    let mut remaining_days = days as i64;
    while remaining_days >= 365 {
        let leap = if year % 4 == 0 && (year % 100 != 0 || year % 400 == 0) { 366 } else { 365 };
        if remaining_days >= leap {
            remaining_days -= leap;
            year += 1;
        } else {
            break;
        }
    }
    let mut month = 1;
    let month_days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    for &mdays in month_days.iter() {
        let days_in_month = if month == 2 && year % 4 == 0 && (year % 100 != 0 || year % 400 == 0) { 29 } else { mdays };
        if remaining_days >= days_in_month {
            remaining_days -= days_in_month;
            month += 1;
        } else {
            break;
        }
    }
    let day = remaining_days + 1;
format!("{:04}-{:02}-{:02}", year, month, day)
}

/// 检查指定国家当天是否已请求过 top_news
pub async fn has_fetched_country_today(pool: &DbPool, country: &str) -> Result<bool, sqlx::Error> {
    let today = get_date_key();
    let row = sqlx::query(
        "SELECT COUNT(*) as count FROM api_requests WHERE endpoint = 'top_news' AND country_code = ? AND date_key = ?"
    )
    .bind(country)
    .bind(&today)
    .fetch_one(pool)
    .await?;
    Ok(row.get::<i64, _>("count") > 0)
}

/// 记录国家当天请求（同一国家同一天只记录一次，用 INSERT OR IGNORE）
pub async fn record_country_fetch(pool: &DbPool, country: &str) -> Result<(), sqlx::Error> {
    let today = get_date_key();
    sqlx::query(
        "INSERT OR IGNORE INTO api_requests (endpoint, country_code, date_key) VALUES ('top_news', ?, ?)"
    )
    .bind(country)
    .bind(&today)
    .execute(pool)
    .await?;
    Ok(())
}
