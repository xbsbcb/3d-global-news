//! 分类 API

use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Category {
    pub id: i64,
    pub name: String,
    pub slug: String,
    pub color: String,
}

/// 获取分类列表
pub async fn list_categories() -> Vec<Category> {
    // TODO: 实现数据库查询
    vec![]
}
