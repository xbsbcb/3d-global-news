//! API 路由

use axum::{
    routing::{get, post},
    Router,
};
use tower_http::cors::{CorsLayer, Any};

use crate::db::DbPool;
use super::handlers;

/// 构建 API 路由
pub fn build_routes(pool: DbPool) -> Router {
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    Router::new()
        .route("/api/news", get(handlers::get_news))
        .route("/api/news/:id", get(handlers::get_news_by_id))
        .route("/api/categories", get(handlers::get_categories))
        .route("/api/stats", get(handlers::get_stats))
        .route("/api/health", get(handlers::health))
        .route("/api/fetch-news", post(handlers::fetch_country_news))
        .layer(cors)
        .with_state(pool)
}
