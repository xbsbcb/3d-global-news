//! API 处理器

use axum::{
    extract::{Query, Path, State},
    http::StatusCode,
    response::Json,
    Json as AxumJson,
};
use std::env;
use crate::db::{self, DbPool};
use crate::models::{ApiResponse, News, NewsQuery, PaginatedResponse, Category};
use crate::services::worldnews::WorldNewsService;
use serde::{Deserialize, Serialize};

/// 获取新闻列表
/// GET /api/news
pub async fn get_news(
    pool: axum::extract::State<DbPool>,
    Query(query): Query<NewsQuery>,
) -> Result<Json<ApiResponse<PaginatedResponse<News>>>, StatusCode> {
    match db::get_news_list(&pool, &query).await {
        Ok(data) => Ok(Json(ApiResponse::success(data))),
        Err(e) => {
            log::error!("获取新闻列表失败: {}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

/// 获取单条新闻
/// GET /api/news/:id
pub async fn get_news_by_id(
    pool: axum::extract::State<DbPool>,
    Path(id): Path<i64>,
) -> Result<Json<ApiResponse<News>>, StatusCode> {
    match db::get_news_by_id(&pool, id).await {
        Ok(Some(news)) => Ok(Json(ApiResponse::success(news))),
        Ok(None) => Err(StatusCode::NOT_FOUND),
        Err(e) => {
            log::error!("获取新闻失败: {}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

/// 获取分类列表
/// GET /api/categories
pub async fn get_categories(
    pool: axum::extract::State<DbPool>,
) -> Result<Json<ApiResponse<Vec<Category>>>, StatusCode> {
    match db::get_categories(&pool).await {
        Ok(categories) => Ok(Json(ApiResponse::success(categories))),
        Err(e) => {
            log::error!("获取分类失败: {}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

/// 获取统计信息
/// GET /api/stats
pub async fn get_stats(
    pool: axum::extract::State<DbPool>,
) -> Result<Json<ApiResponse<serde_json::Value>>, StatusCode> {
    match db::get_stats(&pool).await {
        Ok(stats) => Ok(Json(ApiResponse::success(stats))),
        Err(e) => {
            log::error!("获取统计失败: {}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

#[derive(Debug, Deserialize)]
pub struct FetchNewsRequest {
    pub country: String,
    pub language: Option<String>,
}

/// 检查数据是否在12小时内新鲜
fn is_fresh(fetched_at: &Option<String>) -> bool {
    if let Some(ts) = fetched_at {
        if let Some(fetched_secs) = parse_datetime_to_secs(ts) {
            let now_secs = std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_secs();
            return now_secs.saturating_sub(fetched_secs) < 12 * 3600;
        }
    }
    false
}

/// 解析 "YYYY-MM-DD HH:MM:SS" 为 Unix 秒数（UTC）
fn parse_datetime_to_secs(s: &str) -> Option<u64> {
    let parts: Vec<&str> = s.split(' ').collect();
    if parts.len() != 2 { return None; }
    let date_parts: Vec<u64> = parts[0].split('-').filter_map(|x| x.parse().ok()).collect();
    let time_parts: Vec<u64> = parts[1].split(':').filter_map(|x| x.parse().ok()).collect();
    if date_parts.len() != 3 || time_parts.len() != 3 { return None; }
    let (y, m, d) = (date_parts[0], date_parts[1], date_parts[2]);
    let (h, min, sec) = (time_parts[0], time_parts[1], time_parts[2]);

    // 计算从1970-01-01到该日期的天数
    let mut days: u64 = 0;
    for yr in 1970..y {
        days += if yr % 4 == 0 && (yr % 100 != 0 || yr % 400 == 0) { 366 } else { 365 };
    }
    let month_days = [31u64, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let leap = y % 4 == 0 && (y % 100 != 0 || y % 400 == 0);
    for mo in 1..m {
        let md = if mo == 2 && leap { 29 } else { month_days[(mo - 1) as usize] };
        days += md;
    }
    days += d - 1;
    Some(days * 86400 + h * 3600 + min * 60 + sec)
}

#[derive(Debug, Serialize)]
pub struct FetchNewsResponse {
    pub fetched: usize,
    pub already_fetched: bool,
    /// 数据是否新鲜（12h内）
    pub is_fresh: bool,
}

/// 触发获取指定国家的 top_news
/// POST /api/fetch-news
pub async fn fetch_country_news(
    State(pool): State<DbPool>,
    AxumJson(payload): AxumJson<FetchNewsRequest>,
) -> Json<serde_json::Value> {
    let country = payload.country.to_lowercase();
    let language = payload.language.unwrap_or_else(|| "en".to_string());

    // 检查是否在12小时内抓取过
    let latest = db::get_latest_fetched_at(&pool, &country).await.ok().flatten();
    if is_fresh(&latest) {
        return Json(serde_json::json!({
            "success": true,
            "data": { "fetched": 0, "already_fetched": true, "is_fresh": true }
        }));
    }

    // 获取 API key
    let api_key = match env::var("WORLDNEWS_API_KEY") {
        Ok(key) => key,
        Err(_) => {
            log::error!("WORLDNEWS_API_KEY not set");
            return Json(serde_json::json!({
                "success": false,
                "message": "WORLDNEWS_API_KEY not configured"
            }));
        }
    };

    let service = WorldNewsService::new(api_key);
    match service.fetch_country_top_news(&pool, &country, &language).await {
        Ok(count) => {
            log::info!("国家 {} 获取了 {} 条新闻", country, count);
            if count == 0 {
                // API 调用成功但无新数据（可能全被去重过滤），视为失败
                Json(serde_json::json!({
                    "success": false,
                    "message": "API returned no new articles"
                }))
            } else {
                Json(serde_json::json!({
                    "success": true,
                    "data": { "fetched": count, "already_fetched": false, "is_fresh": true }
                }))
            }
        }
        Err(e) => {
            log::error!("获取国家 {} 新闻失败: {}", country, e);
            Json(serde_json::json!({
                "success": false,
                "message": format!("获取新闻失败: {}", e)
            }))
        }
    }
}

/// 健康检查
/// GET /api/health
pub async fn health() -> Json<serde_json::Value> {
    Json(serde_json::json!({
        "status": "ok"
    }))
}
