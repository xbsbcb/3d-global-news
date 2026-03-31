//! GlobeNews Backend API
//!
//! A Rust-based news aggregation API using Axum framework.

use axum::{routing::get, Router};
use std::net::SocketAddr;

mod api;
mod models;
mod services;

#[tokio::main]
async fn main() {
    // 初始化日志
    env_logger::init();

    // 构建路由
    let app = Router::new()
        .route("/health", get(health_check))
        .route("/api/news", get(api::news::list_news))
        .route("/api/categories", get(api::categories::list_categories))
        .route("/swagger-ui", get(swagger_ui));

    // 启动服务器
    let addr = SocketAddr::from(([0, 0, 0, 0], 8080));
    log::info!("服务器启动在 http://{}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

/// 健康检查端点
async fn health_check() -> &'static str {
    "OK"
}

/// Swagger UI（占位）
async fn swagger_ui() -> &'static str {
    "Swagger UI - 待实现"
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_health_check() {
        let result = health_check().await;
        assert_eq!(result, "OK");
    }
}
