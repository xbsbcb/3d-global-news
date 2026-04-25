//! WorldNews API 服务
//!
//! 基于 worldnewsapi SDK: https://api.worldnewsapi.com

use crate::db::DbPool;
use crate::models::CreateNews;
use worldnewsapi::apis::configuration::Configuration;
use worldnewsapi::apis::news_api;
use worldnewsapi::models::{SearchNews200Response, TopNews200Response};

/// WorldNews API 错误类型
#[derive(Debug)]
pub enum WorldNewsError {
    ApiError(String),
    DatabaseError(String),
    RateLimitExceeded,
}

impl std::fmt::Display for WorldNewsError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            WorldNewsError::ApiError(msg) => write!(f, "API Error: {}", msg),
            WorldNewsError::DatabaseError(msg) => write!(f, "Database Error: {}", msg),
            WorldNewsError::RateLimitExceeded => write!(f, "Rate limit exceeded: 50 requests per day"),
        }
    }
}

impl std::error::Error for WorldNewsError {}

/// WorldNews 服务
#[derive(Clone)]
pub struct WorldNewsService {
    api_key: String,
}

impl WorldNewsService {
    /// 创建新的 WorldNewsService
    pub fn new(api_key: String) -> Self {
        Self { api_key }
    }

    /// 创建 SDK Configuration
    fn create_config(&self) -> Configuration {
        let mut config = Configuration::default();
        config.api_key = Some(worldnewsapi::apis::configuration::ApiKey {
            prefix: None,
            key: self.api_key.clone(),
        });
        config
    }

    /// 从 worldnewsapi 搜索新闻
    pub async fn search_news(
        &self,
        text: &str,
        language: &str,
        offset: i32,
        number: i32,
    ) -> Result<SearchNews200Response, WorldNewsError> {
        let config = self.create_config();

        news_api::search_news(
            &config,
            Some(text),           // text
            None,                 // text_match_indexes
            None,                 // source_country
            Some(language),       // language
            None,                 // min_sentiment
            None,                 // max_sentiment
            None,                 // earliest_publish_date
            None,                 // latest_publish_date
            None,                 // news_sources
            None,                 // authors
            None,                 // categories
            None,                 // entities
            None,                 // location_filter
            None,                 // sort
            None,                 // sort_direction
            Some(offset),         // offset
            Some(number),         // number
        )
        .await
        .map_err(|e| WorldNewsError::ApiError(format!("{:?}", e)))
    }

    /// 获取热门新闻
    pub async fn get_top_news(
        &self,
        source_country: &str,
        language: &str,
    ) -> Result<worldnewsapi::models::TopNews200Response, WorldNewsError> {
        let config = self.create_config();

        news_api::top_news(
            &config,
            source_country,
            language,
            None,       // date
            Some(true), // headlines_only - 只获取标题
        )
        .await
.map_err(|e| WorldNewsError::ApiError(format!("{:?}", e)))
    }

    /// 获取单个国家的 top_news 并存入数据库
    pub async fn fetch_country_top_news(
        &self,
        pool: &DbPool,
        country_code: &str,
        language: &str,
    ) -> Result<usize, WorldNewsError> {
        // 先删除该国旧新闻，避免去重逻辑把新数据全部过滤
        if let Err(e) = crate::db::delete_news_for_country(pool, country_code).await {
            log::warn!("删除旧新闻失败: {}", e);
        }
        // 调用 API 获取新闻
        let response = self.get_top_news(country_code, language).await?;
        // 存入数据库
        let count = save_top_news_to_db(pool, &response, country_code).await?;
        // 记录请求
        if let Err(e) = crate::db::record_country_fetch(pool, country_code).await {
            log::warn!("记录国家请求失败: {}", e);
        }
        Ok(count)
    }

    /// 从 API 采集新闻并存入数据库
    pub async fn fetch_news(&self, pool: &DbPool) -> Result<usize, WorldNewsError> {
        log::info!("开始从 worldnewsapi 采集新闻...");

        let mut total_fetched = 0;

        // 搜索全球新闻
        let search_terms = ["world", "international", "global"];
        let languages = ["en", "zh"];

        for lang in &languages {
            for term in search_terms {
                match self.search_news(term, lang, 0, 20).await {
                    Ok(response) => {
                        let news_list = &response.news;
                        let news_count = news_list.as_ref().map(|n| n.len()).unwrap_or(0);

                        if let Some(items) = news_list {
                            for item in items {
                                // 提取分类（SDK模型使用 Option<Option<String>>）
                                let category = item.category
                                    .as_ref()
                                    .and_then(|c| c.as_ref())
                                    .cloned()
                                    .unwrap_or_else(|| "general".to_string());

                                // 提取标题（SDK模型使用 Option<Option<String>>）
                                let title = item.title
                                    .as_ref()
                                    .and_then(|t| t.as_ref())
                                    .cloned()
                                    .unwrap_or_default();

                                // 如果标题为空，跳过
                                if title.is_empty() {
                                    continue;
                                }

                                // 提取URL
                                let source_url = item.url
                                    .as_ref()
                                    .and_then(|u| u.as_ref())
                                    .cloned();

                                // 提取来源国家
                                let country = item.source_country
                                    .as_ref()
                                    .and_then(|c| c.as_ref())
                                    .cloned();

                                let news = CreateNews {
                                    title,
                                    summary: item.summary.as_ref().and_then(|s| s.as_ref()).cloned(),
                                    content: item.text.as_ref().and_then(|t| t.as_ref()).cloned(),
                                    source: source_url.as_ref()
                                        .and_then(|u| u.split('/').nth(2))
                                        .unwrap_or("unknown")
                                        .to_string(),
                                    source_url,
                                    category,
                                    country,
                                    city: None,
                                    latitude: None,
                                    longitude: None,
                                    published_at: item.publish_date.as_ref().and_then(|d| d.as_ref()).cloned(),
                                };

                                // 尝试插入数据库
                                match crate::db::create_news(pool, &news).await {
                                    Ok(_) => total_fetched += 1,
                                    Err(e) => log::warn!("Failed to insert news: {}", e),
                                }
                            }
                        }
                        log::info!("{} {}: 找到 {} 条新闻", lang, term, news_count);
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

    /// 从 top_news API 采集热门新闻并存入数据库
    /// 每天最多50次请求，覆盖前50国家
    pub async fn fetch_top_news(&self, pool: &DbPool) -> Result<usize, WorldNewsError> {
        log::info!("开始从 top_news API 采集热门新闻...");

        // 检查今日请求次数
        let today_count = crate::db::get_today_top_news_count(pool)
            .await
            .map_err(|e| WorldNewsError::DatabaseError(e.to_string()))?;

        if today_count >= 50 {
            log::warn!("今日 top_news 请求次数已达上限 (50次)");
            return Err(WorldNewsError::RateLimitExceeded);
        }

        let remaining = 50 - today_count as usize;
        log::info!("今日剩余请求次数: {}", remaining);

        // 世界前50重要国家，覆盖所有主要语言
        let countries = [
            // East Asia
            "CN", "JP", "KR", "MN", "TW",
            // South Asia
            "IN", "PK", "BD", "NP", "AF", "LK", "BT",
            // Southeast Asia
            "ID", "TH", "VN", "PH", "MY", "SG", "MM", "KH", "LA",
            // Middle East
            "TR", "IR", "SA", "IQ", "IL", "JO", "LB", "SY", "EG", "AE", "KW", "QA", "BH", "OM", "YE",
            // Europe
            "RU", "DE", "FR", "IT", "ES", "PL", "UA", "GB", "NL", "BE", "SE", "AT", "CH", "GR", "CZ", "RO", "HU",
            // Africa
            "NG", "ZA", "KE", "ET", "GH", "TZ", "UG", "ZM", "ZW", "MW",
            // Americas
            "US", "MX", "BR", "CO", "AR", "PE", "CL", "CA", "GT", "CU", "EC",
        ];

        let mut total_fetched = 0;
        let mut request_count = 0;

        for country in &countries {
            // 检查是否已达上限
            if request_count >= remaining {
                log::info!("已达到今日请求上限");
                break;
            }

            // 每个国家用英语和当地语言请求
            let languages = get_languages_for_country(country);

            for lang in languages {
                // 再次检查请求次数限制
                if request_count >= remaining {
                    break;
                }

                match self.get_top_news(country, lang).await {
                    Ok(response) => {
                        let count = save_top_news_to_db(pool, &response, country).await?;
                        total_fetched += count;
                        request_count += 1;

                        // 记录请求
                        if let Err(e) = crate::db::record_top_news_request(pool, country).await {
                            log::warn!("记录 API 请求失败: {}", e);
                        }

                        log::info!("{}/{}: 获取 {} 条新闻", country, lang, count);
                    }
                    Err(e) => {
                        log::error!("获取 {}/{} 热门新闻失败: {}", country, lang, e);
                        // 记录这次失败请求（配额已消耗）
                        request_count += 1;
                        if let Err(e) = crate::db::record_top_news_request(pool, country).await {
                            log::warn!("记录 API 请求失败: {}", e);
                        }
                        // 如果是配额用完 (402)，立即停止
                        if format!("{:?}", e).contains("402") {
                            log::warn!("API 配额已用完，停止采集");
                            break;
                        }
                    }
                }

                // 请求间隔 500ms，避免触发限流
                tokio::time::sleep(tokio::time::Duration::from_millis(500)).await;
            }
        }

        log::info!("top_news 共采集 {} 条新闻，消耗 {} 次请求配额", total_fetched, request_count);
        Ok(total_fetched)
    }
}

/// 根据国家获取应请求的语言
fn get_languages_for_country(country: &str) -> Vec<&'static str> {
    match country {
        // East Asia
        "CN" => vec!["zh", "en"],
        "JP" => vec!["ja", "en"],
        "KR" => vec!["ko", "en"],
        "MN" => vec!["mn", "en"],
        "TW" => vec!["zh", "en"],
        // South Asia
        "IN" => vec!["hi", "en"],
        "PK" => vec!["ur", "en"],
        "BD" => vec!["bn", "en"],
        "NP" => vec!["ne", "en"],
        "AF" => vec!["ps", "en"],
        "LK" => vec!["si", "en"],
        "BT" => vec!["dz", "en"],
        // Southeast Asia
        "ID" => vec!["id", "en"],
        "TH" => vec!["th", "en"],
        "VN" => vec!["vi", "en"],
        "PH" => vec!["en", "tl"],
        "MY" => vec!["ms", "en"],
        "SG" => vec!["en", "zh"],
        "MM" => vec!["my", "en"],
        "KH" => vec!["km", "en"],
        "LA" => vec!["lo", "en"],
        // Middle East
        "TR" => vec!["tr", "en"],
        "IR" => vec!["fa", "en"],
        "SA" => vec!["ar", "en"],
        "IQ" => vec!["ar", "en"],
        "IL" => vec!["he", "ar", "en"],
        "JO" => vec!["ar", "en"],
        "LB" => vec!["ar", "en"],
        "SY" => vec!["ar", "en"],
        "EG" => vec!["ar", "en"],
        "AE" => vec!["ar", "en"],
        "KW" => vec!["ar", "en"],
        "QA" => vec!["ar", "en"],
        "BH" => vec!["ar", "en"],
        "OM" => vec!["ar", "en"],
        "YE" => vec!["ar", "en"],
        // Europe
        "RU" => vec!["ru", "en"],
        "DE" => vec!["de", "en"],
        "FR" => vec!["fr", "en"],
        "IT" => vec!["it", "en"],
        "ES" => vec!["es", "en"],
        "PL" => vec!["pl", "en"],
        "UA" => vec!["uk", "ru", "en"],
        "GB" => vec!["en"],
        "NL" => vec!["nl", "en"],
        "BE" => vec!["nl", "fr", "de"],
        "SE" => vec!["sv", "en"],
        "AT" => vec!["de", "en"],
        "CH" => vec!["de", "fr", "it"],
        "GR" => vec!["el", "en"],
        "CZ" => vec!["cs", "en"],
        "RO" => vec!["ro", "en"],
        "HU" => vec!["hu", "en"],
        // Africa
        "NG" => vec!["en", "ha"],
        "ZA" => vec!["en", "af", "zu"],
        "KE" => vec!["en", "sw"],
        "ET" => vec!["en", "am"],
        "GH" => vec!["en", "ak"],
        "TZ" => vec!["sw", "en"],
        "UG" => vec!["en", "sw"],
        "ZM" => vec!["en"],
        "ZW" => vec!["en", "sn"],
        "MW" => vec!["en", "ny"],
        // Americas
        "US" => vec!["en"],
        "MX" => vec!["es", "en"],
        "BR" => vec!["pt", "en"],
        "CO" => vec!["es", "en"],
        "AR" => vec!["es", "en"],
        "PE" => vec!["es", "en"],
        "CL" => vec!["es", "en"],
        "CA" => vec!["en", "fr"],
        "GT" => vec!["es", "en"],
        "CU" => vec!["es", "en"],
        "EC" => vec!["es", "en"],
        _ => vec!["en"],
    }
}

/// 将 top_news 响应存入数据库
async fn save_top_news_to_db(
    pool: &DbPool,
    response: &TopNews200Response,
    country_code: &str
) -> Result<usize, WorldNewsError> {
    let mut count = 0;

    if let Some(top_news_list) = &response.top_news {
        for top_news in top_news_list {
            if let Some(news_items) = &top_news.news {
                for item in news_items {
                    // 提取标题
                    let title = item.title
                        .as_ref()
                        .and_then(|t| t.as_ref())
                        .cloned()
                        .unwrap_or_default();

                    if title.is_empty() {
                        continue;
                    }

                    // 检查标题是否已存在（去重）
                    if crate::db::title_exists(pool, &title).await.unwrap_or(false) {
                        continue;
                    }

                    // 提取URL
                    let source_url = item.url
                        .as_ref()
                        .and_then(|u| u.as_ref())
                        .cloned();

                    let news = CreateNews {
                        title,
                        summary: item.summary.as_ref().and_then(|s| s.as_ref()).cloned(),
                        content: item.text.as_ref().and_then(|t| t.as_ref()).cloned(),
                        source: source_url.as_ref()
                            .and_then(|u| u.split('/').nth(2))
                            .unwrap_or("unknown")
                            .to_string(),
                        source_url,
                        category: "general".to_string(),
                        country: Some(country_code.to_lowercase()),
                        city: None,
                        latitude: None,
                        longitude: None,
                        published_at: item.publish_date.as_ref().and_then(|d| d.as_ref()).cloned(),
                    };

                    match crate::db::create_news(pool, &news).await {
                        Ok(_) => count += 1,
                        Err(e) => log::warn!("Failed to insert news: {}", e),
                    }
                }
            }
        }
    }

    Ok(count)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_new_service() {
        let api_key = "test_key";
        let service = WorldNewsService::new(api_key.to_string());
        assert_eq!(service.api_key, "test_key");
    }
}
