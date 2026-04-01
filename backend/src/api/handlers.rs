//! API 处理器

use crate::db::{self, DbPool};
use crate::models::{ApiResponse, CreateNews, NewsQuery};
use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    response::{IntoResponse, Response},
    Json,
};

/// 应用状态
#[derive(Clone)]
pub struct AppState {
    pub db: DbPool,
}

/// 健康检查
pub async fn health_check() -> &'static str {
    "OK"
}

/// 获取新闻列表
pub async fn get_news(
    State(state): State<AppState>,
    Query(query): Query<NewsQuery>,
) -> Response {
    match db::get_news_list(&state.db, &query).await {
        Ok(news_list) => (StatusCode::OK, Json(ApiResponse::success(news_list))).into_response(),
        Err(e) => {
            log::error!("Failed to get news list: {}", e);
            (StatusCode::INTERNAL_SERVER_ERROR, Json(ApiResponse::<()>::error("Failed to get news list"))).into_response()
        }
    }
}

/// 获取单条新闻
pub async fn get_news_by_id(
    State(state): State<AppState>,
    Path(id): Path<i64>,
) -> Response {
    match db::get_news_by_id(&state.db, id).await {
        Ok(Some(news)) => (StatusCode::OK, Json(ApiResponse::success(news))).into_response(),
        Ok(None) => (StatusCode::NOT_FOUND, Json(ApiResponse::<()>::error("News not found"))).into_response(),
        Err(e) => {
            log::error!("Failed to get news: {}", e);
            (StatusCode::INTERNAL_SERVER_ERROR, Json(ApiResponse::<()>::error("Failed to get news"))).into_response()
        }
    }
}

/// 创建新闻
pub async fn create_news(
    State(state): State<AppState>,
    Json(news): Json<CreateNews>,
) -> Response {
    match db::create_news(&state.db, &news).await {
        Ok(created) => (StatusCode::CREATED, Json(ApiResponse::success(created))).into_response(),
        Err(e) => {
            log::error!("Failed to create news: {}", e);
            (StatusCode::INTERNAL_SERVER_ERROR, Json(ApiResponse::<()>::error("Failed to create news"))).into_response()
        }
    }
}

/// 获取分类列表
pub async fn get_categories(State(state): State<AppState>) -> Response {
    match db::get_categories(&state.db).await {
        Ok(categories) => (StatusCode::OK, Json(ApiResponse::success(categories))).into_response(),
        Err(e) => {
            log::error!("Failed to get categories: {}", e);
            (StatusCode::INTERNAL_SERVER_ERROR, Json(ApiResponse::<()>::error("Failed to get categories"))).into_response()
        }
    }
}

/// 获取统计数据
pub async fn get_stats(State(state): State<AppState>) -> Response {
    match db::get_stats(&state.db).await {
        Ok(stats) => (StatusCode::OK, Json(ApiResponse::success(stats))).into_response(),
        Err(e) => {
            log::error!("Failed to get stats: {}", e);
            (StatusCode::INTERNAL_SERVER_ERROR, Json(ApiResponse::<()>::error("Failed to get stats"))).into_response()
        }
    }
}

/// 从 worldnewsapi 采集新闻
pub async fn fetch_news(State(state): State<AppState>) -> Response {
    use crate::services::worldnews::WorldNewsService;

    let api_key = std::env::var("WORLDNEWS_API_KEY")
        .unwrap_or_else(|_| "cf06fcc50d56424d9f3fe328f91ceb91".to_string());

    let service = WorldNewsService::new(api_key);

    match service.fetch_news(&state.db).await {
        Ok(count) => (StatusCode::OK, Json(ApiResponse::success(serde_json::json!({ "fetched": count })))).into_response(),
        Err(e) => {
            log::error!("Failed to fetch news: {}", e);
            (StatusCode::INTERNAL_SERVER_ERROR, Json(ApiResponse::<()>::error(format!("Failed to fetch: {}", e)))).into_response()
        }
    }
}
