//! GlobeNews Backend API
//!
//! 基于 worldnewsapi 的新闻聚合服务

mod api;
mod db;
mod models;
mod services;

use api::handlers::{self, AppState};
use axum::{
    routing::{get, post},
    Router,
};
use std::net::SocketAddr;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // 初始化日志
    env_logger::init();
    log::info!("GlobeNews API 启动中...");

    // 初始化数据库
    let database_url = std::env::var("DATABASE_URL").unwrap_or_else(|_| {
        "sqlite:./data/globe_news.db?mode=rwc".to_string()
    });

    // 确保数据目录存在
    std::fs::create_dir_all("./data")?;

    log::info!("连接数据库: {}", database_url);
    let pool = sqlx::sqlite::SqlitePool::connect(&database_url).await?;

    // 初始化表结构
    db::init_database(&pool).await?;
    log::info!("数据库初始化完成");

    // 创建应用状态
    let state = AppState { db: pool };

    // 构建路由
    let app = Router::new()
        .route("/health", get(handlers::health_check))
        .route("/api/news", get(handlers::get_news).post(handlers::create_news))
        .route("/api/news/:id", get(handlers::get_news_by_id))
        .route("/api/categories", get(handlers::get_categories))
        .route("/api/stats", get(handlers::get_stats))
        .route("/api/fetch", post(handlers::fetch_news))
        .with_state(state);

    // 启动服务器
    let addr = SocketAddr::from(([0, 0, 0, 0], 8080));
    log::info!("服务器启动在 http://{}", addr);

    let listener = tokio::net::TcpListener::bind(&addr).await?;
    log::info!("GlobeNews API 已启动!");
    axum::serve(listener, app).await?;

    Ok(())
}
