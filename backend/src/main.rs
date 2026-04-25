//! 3D 全球新闻可视化平台 - 后端服务入口

use backend::api::routes::build_routes;
use backend::db;
use std::env;
use sqlx::sqlite::SqlitePoolOptions;
use axum::serve;
use std::net::SocketAddr;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // 加载 .env 文件
    dotenvy::dotenv().ok();

    // 初始化日志
    env_logger::init();

    let database_url = env::var("DATABASE_URL")
        .unwrap_or_else(|_| "sqlite:news.db".to_string());

    let port: u16 = env::var("PORT")
        .unwrap_or_else(|_| "7070".to_string())
        .parse()
        .expect("PORT must be a number");

    // 初始化数据库连接池
    let pool = SqlitePoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await?;

    db::init_database(&pool).await?;
    log::info!("数据库初始化完成");

    // 启动 HTTP 服务器
    let app = build_routes(pool);
    let addr = SocketAddr::from(([0, 0, 0, 0], port));
    log::info!("HTTP 服务器启动，监听 {}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await?;
    serve(listener, app.into_make_service()).await?;

    Ok(())
}
