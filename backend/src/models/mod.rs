//! 数据模型

use serde::{Deserialize, Serialize};
use sqlx::FromRow;

/// 新闻条目
#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
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

/// 分类
#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct Category {
    pub id: i64,
    pub name: String,
    pub slug: String,
    pub color: Option<String>,
}

/// 创建新闻的请求
#[derive(Debug, Deserialize)]
pub struct CreateNews {
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
}

/// 新闻查询参数
#[derive(Debug, Deserialize)]
pub struct NewsQuery {
    pub category: Option<String>,
    pub country: Option<String>,
    pub keyword: Option<String>,
    pub limit: Option<i64>,
    pub offset: Option<i64>,
}

/// API 响应结构
#[derive(Debug, Serialize)]
pub struct ApiResponse<T> {
    pub success: bool,
    pub data: Option<T>,
    pub message: Option<String>,
}

impl<T> ApiResponse<T> {
    pub fn success(data: T) -> Self {
        Self {
            success: true,
            data: Some(data),
            message: None,
        }
    }

    pub fn error(message: impl Into<String>) -> ApiResponse<()> {
        ApiResponse {
            success: false,
            data: None,
            message: Some(message.into()),
        }
    }
}

/// 分页响应
#[derive(Debug, Serialize)]
pub struct PaginatedResponse<T> {
    pub items: Vec<T>,
    pub total: i64,
    pub limit: i64,
    pub offset: i64,
}
