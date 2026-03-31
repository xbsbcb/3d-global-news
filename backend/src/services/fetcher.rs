//! 新闻采集服务

use crate::models::News;

pub struct NewsFetcher {
    // TODO: 实现新闻采集
}

impl NewsFetcher {
    pub fn new() -> Self {
        Self {}
    }

    pub async fn fetch_all(&self) -> Result<Vec<News>, String> {
        // TODO: 实现采集逻辑
        Ok(vec![])
    }
}
