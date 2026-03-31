//! 数据模型

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct News {
    pub id: i64,
    pub title: String,
    pub summary: Option<String>,
    pub content: Option<String>,
    pub source: String,
    pub source_url: Option<String>,
    pub category: String,
    pub country: Option<String>,
    pub city: Option<String>,
    pub latitude: Option<f64>,
    pub longitude: Option<f64>,
    pub published_at: Option<String>,
    pub fetched_at: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Category {
    pub id: i64,
    pub name: String,
    pub slug: String,
    pub color: Option<String>,
}
