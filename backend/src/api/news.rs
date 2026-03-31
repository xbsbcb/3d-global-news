//! 新闻 API

use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct News {
    pub id: i64,
    pub title: String,
    pub summary: Option<String>,
    pub source: String,
    pub category: String,
    pub country: String,
    pub latitude: f64,
    pub longitude: f64,
    pub published_at: String,
}

/// 获取新闻列表
pub async fn list_news() -> Vec<News> {
    // TODO: 实现数据库查询
    vec![]
}
