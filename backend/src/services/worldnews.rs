//! WorldNews API 服务
//!
//! 基于 https://api.worldnewsapi.com 的新闻采集

use crate::db::DbPool;
use crate::models::{CreateNews, WorldNewsItem, WorldNewsSearchResponse};
use serde::Deserialize;

const BASE_URL: &str = "https://api.worldnewsapi.com";

/// WorldNews 服务
pub struct WorldNewsService {
    api_key: String,
    client: reqwest::Client,
}

impl WorldNewsService {
    pub fn new(api_key: String) -> Self {
        Self {
            api_key,
            client: reqwest::Client::new(),
        }
    }

    /// 从 worldnewsapi 搜索新闻
    pub async fn search_news(
        &self,
        text: &str,
        language: &str,
        offset: i64,
        number: i64,
    ) -> Result<WorldNewsSearchResponse, reqwest::Error> {
        let url = format!("{}/search-news", BASE_URL);

        let params = [
            ("text", text),
            ("language", language),
            ("offset", &offset.to_string()),
            ("number", &number.to_string()),
            ("api-key", &self.api_key),
        ];

        let response = self.client.get(&url).query(&params).send().await?;
        let data: WorldNewsSearchResponse = response.json().await?;
        Ok(data)
    }

    /// 获取热门新闻
    pub async fn get_top_news(
        &self,
        source_country: &str,
        language: &str,
    ) -> Result<serde_json::Value, reqwest::Error> {
        let url = format!("{}/top-news", BASE_URL);

        let params = [
            ("source-country", source_country),
            ("language", language),
            ("api-key", &self.api_key),
        ];

        let response = self.client.get(&url).query(&params).send().await?;
        let data: serde_json::Value = response.json().await?;
        Ok(data)
    }

    /// 从 API 采集新闻并存入数据库
    pub async fn fetch_news(&self, pool: &DbPool) -> Result<usize, String> {
        log::info!("开始从 worldnewsapi 采集新闻...");

        let mut total_fetched = 0;

        // 搜索全球新闻
        let search_terms = ["world", "international", "global"];
        let languages = ["en", "zh"];

        for lang in &languages {
            for term in &search_terms {
                match self.search_news(term, lang, 0, 20).await {
                    Ok(response) => {
                        if let Some(news_list) = response.news {
                            for item in news_list {
                                // 跳过没有坐标的新闻
                                if item.latitude().is_none() || item.longitude().is_none() {
                                    continue;
                                }

                                let category = item.category.as_ref()
                                    .and_then(|c| c.first())
                                    .cloned()
                                    .unwrap_or_else(|| "general".to_string());

                                let news = CreateNews {
                                    title: item.title.clone().unwrap_or_default(),
                                    summary: item.summary.clone(),
                                    content: item.text.clone(),
                                    source: item.source.clone().unwrap_or_default(),
                                    source_url: item.url.clone(),
                                    category: category.clone(),
                                    country: item.source_country.clone(),
                                    city: None,
                                    latitude: item.latitude(),
                                    longitude: item.longitude(),
                                    published_at: item.published_at.clone(),
                                };

                                // 尝试插入数据库
                                if let Err(e) = crate::db::create_news(pool, &news).await {
                                    log::warn!("Failed to insert news: {}", e);
                                } else {
                                    total_fetched += 1;
                                }
                            }
                        }
                        log::info!("{} {}: 找到 {} 条新闻",
                            lang, term,
                            response.news.as_ref().map(|n| n.len()).unwrap_or(0)
                        );
                    }
                    Err(e) => {
                        log::error!("搜索 {} {} 失败: {}", lang, term, e);
                    }
                }
            }
        }

        log::info!("共采集 {} 条新闻", total_fetched);
        Ok(total_fetched)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_search_news() {
        let api_key = "test_key";
        let service = WorldNewsService::new(api_key.to_string());
        assert_eq!(service.api_key, "test_key");
    }
}
