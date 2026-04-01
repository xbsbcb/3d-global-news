Latest News ("latest" endpoint)
The latest news endpoint provides access to the latest and breaking news. The news articles are sorted by the published date. With the "Latest" endpoint, you can access the news articles up to the past 48 hours.

Retrieving the latest news allows you to build experience such as showcasing the latest news, breaking news tickers and analyzing News to better understand their content.

Note: For Free users, news articles are delayed by 12 hours.

Resource URL

https://newsdata.io/api/1/latest?apikey=pub_97dd70200c904bdebbc400249e37ee6f

Resource Information

Response Format
JSON
Requires Authentication
Yes
Rate Limited
Yes
Requests per 15 min window
1800 credits (paid plans)
Parameters
Below are the Request Parameters you need to put in your query to run the API.

Name	Required	Description	Default Value	Example
apikey
Required
You need to add your API Key while accessing the newsdata API. 
How to get the NewsData.io API key.
id
Optional
Search the specific news article from its unique article_id string. You can add up to 50 article id strings in a single query or as per your specified limit.
id=article_id
id=article_id_1,article_id_2,
article_id_3
q
Optional
Search news articles for specific keywords or phrases present in the news title, content, URL, meta keywords and meta description. The value must be URL-encoded and the maximum character limit permitted is 512 characters.
Please refer Advanced Search for more details
q=pizza
qInTitle
Optional
Search news articles for specific keywords or phrases present in the news titles only. The value must be URL-encoded and the maximum character limit permitted is 512 characters.
Note: qInTitle can't be used with q or qInMeta parameter in the same query.
qInTitle=pizza
qInMeta
Optional
Search news articles for specific keywords or phrases present in the news titles, URL, meta keywords and meta description only. The value must be URL-encoded and the maximum character limit permitted is 512 characters.
Note: qInMeta can't be used with q or qInTitle parameter in the same query.
qInMeta=pizza
timeframe
Optional
Search the news articles for a specific timeframe (Minutes and Hours). For hours, you can set a timeframe of 1 to 48, and for minutes, you can define a timeframe of 1m to 2880m. For example, if you want to get the news for the past 6 hours then use timeframe=6 and if you want to get news for the last 15 min then use timeframe=15m.
Note - You can only use timeframe either in hours or minutes.
For Hours -
timeframe=1
timeframe=6
timeframe=24
For Minutes -
timeframe=15m
timeframe=45m
timeframe=90m
country
Optional
Search news articles from specific countries. Include up to 5 countries per query on Free and Basic plans. Professional and Corporate plans support up to 10 countries.
Check the codes for all the countries here.
country=au,jp
excludecountry
Optional
Exclude news articles from specific countries. Include up to 5 countries per query on Free and Basic plans. Professional and Corporate plans support up to 10 countries.
Check the codes for all the countries here.
Note: You can use either the 'country' parameter to include specific countries or the 'excludecountry' parameter to exclude them, but not both simultaneously.
excludecountry=au,jp
category
Optional
Search the news articles for a specific category. Include up to 5 categories per query on Free and Basic plans. Professional and Corporate plans support up to 10 categories.
Check the codes for all the categories here.
category=sports,top
excludecategory
Optional
You can exclude specific categories to search for news articles. Exclude up to 5 categories per query on Free and Basic plans. Professional and Corporate plans support up to 10 categories.
Note: You can use either the 'category' parameter to include specific categories or the 'excludecategory' parameter to exclude them, but not both simultaneously.
excludecategory=top
language
Optional
Search the news articles for a specific language. Include up to 5 languages per query on Free and Basic plans. Professional and Corporate plans support up to 10 languages. 
Check the codes for all the languages here.
language=fr,en
excludelanguage
Optional
You can exclude specific languages to search for news articles. Exclude up to 5 languages per query on Free and Basic plans. Professional and Corporate plans support up to 10 languages. 
Note: You can use either the 'language' parameter to include specific languages or the 'excludelanguage' parameter to exclude them, but not both simultaneously.
excludelanguage=fr,en
sort
Optional
You can sort the search results based on your preferred criteria to organize how news articles appear in the response. You can use the sort parameter with one of the following options: 
pubdateasc – Sort articles by publish date in ascending order (oldest to newest).
relevancy – Sort articles by most relevant results first based on your query.
source – Sort results by source priority (top to low).
fetched_at - Sort articles by their fetched date.
Note: By default, results are sorted by publish date (newest first) if no sort parameter is specified.
sort=relevancy
sort=fetched_at
datatype
Optional
Specifies the type of the article.
Supported values: news, blog, multimedia, forum, press_release, review, research, opinion, analysis, podcast. Available for latest and market. Include up to 5 datatype per query on Free and Basic plans. Professional and Corporate plans support up to 10 datatype.
datatype=news,blog
sentiment_score
Optional
Filters articles by sentiment score. Returns only articles with a sentiment score greater than or equal to the specified value.
Note: Works only when the sentiment parameter is enabled.
(Available only for Professional and Corporate users)
sentiment_score=70
creator
Optional
Search by name of the article author or content creator.
Include up to 5 creators per query on Free and Basic plans. Professional and Corporate plans support up to 10 creators.
creator=chintan haria
creator=liz carolan,luca socci
url
Optional
You can search for a specific news article by providing its URL.
url=https://newsdata.io/blog/multiple-api-key-newsdata-io
tag
Optional
Search the news articles for specific AI-classified tags. Include up to 10 tags per query.
(Available only for Professional and Corporate users)
Check the codes for all the AI tags here.
With Custom AI Tags (Corporate Yearly Plan only), you can request your own tag to classify articles based on your specific topic or tag
tag=food,tourism
sentiment
Optional
Search the news articles based on the sentiment of the news article (positive, negative, neutral).
(Available only for Professional and Corporate users)
sentiment=positive
organization
Optional
Search the news articles related to specific organizations. Include up to 10 tags per query.
(Available only Corporate users)
organization=uber,apple
region
Optional
Search the news articles for specific geographical regions. The region could be a city, district, county, state, country, or continent. Include 5 regions per query, and it can be customized up to 10 regions per query.
(Available only for Corporate users).
Check out NewsData.io Region blog for practical understanding.
region=city1,city2
region=city1-state1-country1,
city2-country2
region=state-country
region=los
angeles-california-usa
region=new york,chicago
domain
Optional
Search the news articles for specific domains or news sources. Include up to 5 domains per query on Free and Basic plans. Professional and Corporate plans support up to 10 domains. 
You can check the name of the domains here
domain=nytimes,bbc
domainurl
Optional
Search the news articles for specific domains or news sources. Include up to 5 domains per query on Free and Basic plans. Professional and Corporate plans support up to 10 domains.
Note: If the domain is incorrect, It will give suggestions in the response
domainurl=nytimes.com,
bbc.com,bbc.co.uk
excludedomain
Optional
You can exclude specific domains or news sources to search the news articles. Exclude up to 5 domains per query on Free and Basic plans. Professional and Corporate plans support up to 10 domains.
Note: If the domain is incorrect, It will give suggestions in the response
excludedomain=nytimes.com,
bbc.com,bbc.co.uk
excludefield
Optional
you can limit the response object to search for news articles. You can exclude multiple response objects in a single query.
Note: You cannot exclude article ID from the response field
excludefield=pubdate
excludefield=source_icon,
pubdate,link
prioritydomain
Optional
Search the news articles only from top news domains. We have categorized prioritydomain in 3 categories.
Top: Fetches news articles from the top 10% of the news domains
Medium: Fetches news articles from the top 30% of the news domains. It means it already includes all the news articles of 'top' priority.
Low: Fetches news articles from the top 50% of the news domains. It means it already includes all the news articles of 'top' and 'medium' priorities.
prioritydomain=top
prioritydomain=medium
prioritydomain=low
timezone
Optional
Search the news articles for a specific timezone. You can add any specific timezone.
You can check the timezone here
timezone=America/New_york
timezone=Asia/Kolkata
timezone=Asia/Qatar
timezone=Europe/Berli
full_content
Optional
Search the news articles with full content or without full content. Use '1' for news articles which contain the full_content response object and '0' for news articles which don't contain full_content response object.
full_content=1
full_content=0
image
Optional
Search the news articles with featured image or without featured image. Use 1 for articles with featured image and 0 for articles without featured image.
image=1
image=0
video
Optional
Search the news articles with videos or without videos. Use 1 for articles with videos and 0 for articles without videos.
video=1
video=0
removeduplicate
Optional
The 'removeduplicate' parameter will allow users to filter out duplicate articles. Use 1 to remove duplicate articles.
(Note: The overall 'removeduplicate' parameter functioning works on the basis of Newsdata.io's internal algorithm. It doesn't imply that the article which has a 'removeduplicate=1' parameter is actually a duplicate article.)
removeduplicate=1
size
Optional
You can customize the number of articles you get per API request from 1 to 50.
Free user - 10
Paid user - 50
size=25
page
Optional
Use page parameter to navigate to the next page. To know more:
click here
Example Queries

1. News from Australia and United States of America

https://newsdata.io/api/1/latest?apikey=pub_97dd70200c904bdebbc400249e37ee6f&country=au,us

{
status: "success"
totalResults: 243
results: [
0: {
article_id: "aada56e13cf2e0e28123e0dbf6e0fe13"
link: "https://fortune.com/2026/03/31/energy-vulnerable-india-seeks-us-help-oil-wean-russia-middle-east/"
title: "Energy ‘vulnerable’ India seeks U.S. help to produce more oil and wean itself off Russia, Middle Ea..."
description: "Cairn Oil & Gas aims to rapidly grow as India's top private energy producer."
content: "India imports nearly 90% of its crude oil—largely from Russia and the Middle East. With geopolitica..."
keywords: [
0: "crude oil"
1: "iran"
2: "india"
]
creator: [
0: "jordan blum"
]
language: "english"
country: [
0: "united states of america"
]
category: [
0: "technology"
1: "business"
]
datatype: "news"
pubDate: "2026-03-31 06:03:00"
pubDateTZ: "UTC"
fetched_at: "2026-03-31 06:31:38"
image_url: "https://fortune.com/img-assets/wp-content/uploads/2026/03/GettyImages-2267789722-e1774907987576.jpg..."
video_url: null
source_id: "fortune"
source_name: "Fortune"
source_priority: 1002
source_url: "https://fortune.com"
source_icon: "https://n.bytvi.com/fortune.png"
sentiment: "positive"
sentiment_stats: {
negative: 0.54
neutral: 36.74
positive: 62.72
}
ai_tag: [
0: "energy"
]
ai_region: [
0: "middle east"
1: "india,asia"
2: "russia,ohio,united states of america,north america"
]
ai_org: [
0: "cairn oil & gas"
]
ai_summary: "An article discusses India's potential to become energy self-sufficient by exploring its oil reserv..."
duplicate: false
}
1: {
article_id: "39a82538137c2d5228263006d5b65554"
link: "https://ca.finance.yahoo.com/news/truist-financial-initiates-american-tower-054234488.html"
title: "Truist Financial Initiates American Tower Corporation (AMT) with Buy, Sees Long-Term Upside"
description: "American Tower Corporation (NYSE:AMT) is included among the 14 Safest Stocks with Highest Dividends..."
content: "American Tower Corporation (NYSE:AMT) is included among the 14 Safest Stocks with Highest Dividends..."
keywords: [
0: "organic growth"
1: "financial analyst"
2: "rodney smith"
3: "american tower corporation"
4: "dan dennis"
]
creator: [
0: "vardah gill"
]
language: "english"
country: [
0: "canada"
]
category: [
0: "sports"
]
datatype: "news"
pubDate: "2026-03-31 05:42:34"
pubDateTZ: "UTC"
fetched_at: "2026-03-31 06:00:53"
image_url: null
video_url: null
source_id: "yahoo"
source_name: "Yahoo! News"
source_priority: 17
source_url: "https://news.yahoo.com"
source_icon: "https://n.bytvi.com/yahoo.png"
sentiment: "positive"
sentiment_stats: {
negative: 0.05
neutral: 0.19
positive: 99.76
}
ai_tag: [
0: "financial markets"
]
ai_region: null
ai_org: [
0: "truist financial"
1: "sees long term upside american tower corporation"
2: "nyse"
3: "amt"
]
ai_summary: "American Tower Corporation, a global real estate investment trust, is expected to see organic growt..."
duplicate: false
}
2: {
article_id: "67f3d8bcaa34cea5f815f8bed09cdf7c"
link: "https://financialpost.com/pmn/business-pmn/malaysia-raises-growth-outlook-sees-war-impact-contained"
title: "Malaysia Raises Growth Outlook, Sees War Impact Contained"
description: "Malaysia lifted its economic growth forecast for 2026, expecting strong domestic demand and investm..."
content: "(Bloomberg) — Malaysia lifted its economic growth forecast for 2026, expecting strong domestic dema..."
keywords: [
0: "nlp category: business"
1: "0c692b70-905d-415f-8e39-888369d89ced"
2: "category: pmn business"
3: "nlp entity tokens: malaysia"
4: "wired"
5: "financialpost.com"
]
creator: [
0: "bloomberg news"
]
language: "english"
country: [
0: "canada"
]
category: [
0: "business"
1: "top"
]
datatype: "news"
pubDate: "2026-03-31 04:08:38"
pubDateTZ: "UTC"
fetched_at: "2026-03-31 04:33:15"
image_url: null
video_url: null
source_id: "financialpost"
source_name: "Financial Post"
source_priority: 7235
source_url: "https://financialpost.com"
source_icon: "https://n.bytvi.com/financialpost.png"
sentiment: "positive"
sentiment_stats: {
negative: 0.24
neutral: 8.03
positive: 91.73
}
ai_tag: [
0: "economy"
]
ai_region: [
0: "malaysia,asia"
]
ai_org: null
ai_summary: "The article discusses the impact of the Middle East conflict on global markets, with a focus on com..."
duplicate: false
}
3: {
article_id: "9113a95cb2a26f042857c8218f891702"
link: "https://www.vogue.com/article/we-need-to-tell-the-bfc-story-better-ceo-laura-weir-breaks-down-her-n..."
title: "“We Need to Tell the BFC Story Better”: CEO Laura Weir Breaks Down Her New Strategy"
description: "A journalist by trade and training, Weir brings an editorial lens to everything she does. Almost a ..."
content: "It’s a rare occurrence to be interviewing your former boss, but this is what I found myself doing b..."
keywords: [
0: "latest"
1: "web"
2: "companies"
3: "fashion"
4: "no apple news"
5: "splitscreenimageleftinset"
6: "_syndication_noshow"
7: "business"
8: "storytype:interview"
9: "paywall subscriber only content"
10: "executive interviews"
11: "do not show on encore"
12: "bfc"
]
creator: [
0: "elektra kotsoni"
]
language: "english"
country: [
0: "united states of america"
]
category: [
0: "entertainment"
]
datatype: "news"
pubDate: "2026-03-31 04:00:00"
pubDateTZ: "UTC"
fetched_at: "2026-03-31 04:30:35"
image_url: "https://assets.vogue.com/photos/69caa05a520da2f7ca63d77e/16:9/w_2992,h_1683,c_limit/laura-weir-vogu..."
video_url: null
source_id: "vogue"
source_name: "Vogue"
source_priority: 2581
source_url: "https://www.vogue.com"
source_icon: "https://n.bytvi.com/vogue.png"
sentiment: "neutral"
sentiment_stats: {
negative: 2.09
neutral: 64.52
positive: 33.39
}
ai_tag: [
0: "real estate"
]
ai_region: null
ai_org: null
ai_summary: null
duplicate: true
}
4: {
article_id: "81612617abd14c26723380d64951a28b"
link: "https://www.moneycontrol.com/news/business/us-recession-fears-surge-as-iran-war-fuels-inflation-sho..."
title: "US recession fears surge as Iran war fuels inflation shock, odds hit 37%"
description: "Speaking against this backdrop, Jerome Powell, Chair of the Federal Reserve, warned that energy-dri..."
content: "As the West Asia war continues well over a month, its ripple effects are increasingly visible in th..."
keywords: [
0: "iran news"
1: "tehran news"
2: "strait of hormuz"
3: "israel attacks iran news"
4: "iran news live"
5: "israel iran attack news"
6: "us israel iran war"
7: "iran war"
8: "benjamin netanyahu"
9: "israel iran news"
]
creator: [
0: "moneycontrol news"
]
language: "english"
country: [
0: "india"
]
category: [
0: "business"
1: "top"
]
datatype: "news"
pubDate: "2026-03-31 03:57:28"
pubDateTZ: "UTC"
fetched_at: "2026-03-31 04:01:45"
image_url: "https://images.moneycontrol.com/static-mcnews/2026/02/20260220150820_Trump-Davos-3.jpg"
video_url: null
source_id: "moneycontrol"
source_name: "Moneycontrol"
source_priority: 2087
source_url: "https://www.moneycontrol.com"
source_icon: "https://n.bytvi.com/moneycontrol.png"
sentiment: "negative"
sentiment_stats: {
negative: 93.56
neutral: 6.4
positive: 0.04
}
ai_tag: [
0: "financial markets"
1: "economy"
]
ai_region: [
0: "united states of america,north america"
1: "iran,asia"
]
ai_org: [
0: "federal reserve"
]
ai_summary: "The article discusses the potential risks of inflation and its impact on the US economy, including ..."
duplicate: false
}
5: {
article_id: "328757b4da1315c4bf119f21a7f5fa14"
link: "https://investinglive.com/news/investinglive-asia-pacific-fx-news-trump-open-to-ending-war-without-..."
title: "investingLive Asia-Pacific FX news: Trump open to ending war without Hormuz opening (WSJ)"
description: "Global stocks see biggest selling in a year. Hedge funds ramp shorts (Goldman Sachs data) China fac..."
content: "Global stocks see biggest selling in a year. Hedge funds ramp shorts (Goldman Sachs data) China fac..."
keywords: [
0: "forex fx news summary"
]
creator: [
0: "eamonn sheridan"
]
language: "english"
country: [
0: "united states of america"
]
category: [
0: "business"
1: "top"
]
datatype: "news"
pubDate: "2026-03-31 03:46:48"
pubDateTZ: "UTC"
fetched_at: "2026-03-31 04:02:36"
image_url: "https://images.investinglive.com/images/oitl%20wrap%2031%20March%202026_id_7ba2b610-37b4-4094-8c8a-..."
video_url: null
source_id: "forexlive"
source_name: "Forexlive"
source_priority: 9087
source_url: "https://www.forexlive.com"
source_icon: "https://n.bytvi.com/forexlive.png"
sentiment: "neutral"
sentiment_stats: {
negative: 5.51
neutral: 90.72
positive: 3.77
}
ai_tag: [
0: "financial markets"
]
ai_region: [
0: "hormuz,hormozgan,iran,asia"
1: "china,maine,united states of america,north america"
2: "asia pacific"
3: "china,texas,united states of america,north america"
]
ai_org: [
0: "wsj"
1: "goldman sachs"
2: "trump"
]
ai_summary: null
duplicate: false
}
6: {
article_id: "e17816dc5f28d73cfeec323976fee070"
link: "https://www.news18.com/explainers/zelenskyy-says-russia-wants-iran-war-to-drag-on-5-reasons-why-its..."
title: "Zelenskyy Says Russia Wants Iran War To Drag On. 5 Reasons Why It's A Strategic Win For Putin"
description: "As global attention shifts to escalating tensions in West Asia, Ukraine risks slipping down the pri..."
content: "Zelenskyy Says Russia Wants Iran War To Drag On. 5 Reasons Why It's A Strategic Win For Putin As gl..."
keywords: [
0: "global energy markets"
1: "higher oil prices"
2: "russia benefits from iran war"
3: "middle east distraction"
4: "iran conflict impact"
5: "russia ukraine war"
6: "zelenskyy interview"
7: "western sanctions on russia"
]
creator: [
0: "apoorva misra"
]
language: "english"
country: [
0: "india"
]
category: [
0: "politics"
1: "top"
]
datatype: "news"
pubDate: "2026-03-31 03:22:40"
pubDateTZ: "UTC"
fetched_at: "2026-03-31 03:33:05"
image_url: "https://images.news18.com/ibnlive/uploads/2026/03/Russia-Ukraine-war-2026-03-9d1240db60bfeea0f2b4df..."
video_url: null
source_id: "news18"
source_name: "News 18"
source_priority: 1063
source_url: "https://www.news18.com"
source_icon: "https://n.bytvi.com/news18.png"
sentiment: "negative"
sentiment_stats: {
negative: 77.66
neutral: 21.44
positive: 0.9
}
ai_tag: [
0: "conflicts & war"
]
ai_region: [
0: "west asia"
1: "russia,europe/asia"
2: "ukraine,europe"
]
ai_org: null
ai_summary: "The article discusses the potential impact of the Iran conflict on global tensions, particularly in..."
duplicate: false
}
7: {
article_id: "cc6b3b52b20edbcceb9b05c37317abca"
link: "https://au.investing.com/news/transcripts/earnings-call-transcript-biosyent-q4-2025-misses-revenue-..."
title: "Earnings call transcript: BioSyent Q4 2025 misses revenue forecast, EPS steady"
description: "Earnings call transcript: BioSyent Q4 2025 misses revenue forecast, EPS steady"
content: "Trump tells aides he’s willing to end Iran war without reopening Hormuz- WSJ BioSyent Inc. reported..."
keywords: null
creator: [
0: "investing.com"
]
language: "english"
country: [
0: "australia"
]
category: [
0: "business"
1: "top"
]
datatype: "news"
pubDate: "2026-03-31 03:04:09"
pubDateTZ: "UTC"
fetched_at: "2026-03-31 03:32:50"
image_url: "https://i-invdn-com.investing.com/news/LYNXNPEB6R0AQ_L.jpg"
video_url: null
source_id: "investing_au"
source_name: "Investing Australia"
source_priority: 1205
source_url: "https://au.investing.com"
source_icon: "https://n.bytvi.com/investing_au.jpg"
sentiment: "negative"
sentiment_stats: {
negative: 92.08
neutral: 7.84
positive: 0.08
}
ai_tag: [
0: "financial markets"
]
ai_region: null
ai_org: [
0: "biosyent"
1: "none trump"
]
ai_summary: "BioSyent reported a 10% year-over-year revenue growth, with a 23% EBITDA EBITDA EBITDA EBITDA EBITD..."
duplicate: true
}
8: {
article_id: "e74219abca8a4d342cb2ed13dcf8fe65"
link: "https://uk.investing.com/news/transcripts/earnings-call-transcript-biosyent-q4-2025-misses-revenue-..."
title: "Earnings call transcript: BioSyent Q4 2025 misses revenue forecast, EPS steady"
description: "Earnings call transcript: BioSyent Q4 2025 misses revenue forecast, EPS steady"
content: "European stocks rise as Iran war enters second month BioSyent Inc. reported its financial results f..."
keywords: null
creator: [
0: "investing.com"
]
language: "english"
country: [
0: "united kingdom"
]
category: [
0: "business"
1: "top"
]
datatype: "news"
pubDate: "2026-03-31 03:04:08"
pubDateTZ: "UTC"
fetched_at: "2026-03-31 03:32:57"
image_url: "https://i-invdn-com.investing.com/news/LYNXMPEA601YK_L.jpg"
video_url: null
source_id: "investing_uk"
source_name: "Investing Uk"
source_priority: 1205
source_url: "https://uk.investing.com"
source_icon: "https://n.bytvi.com/investing_uk.jpg"
sentiment: "negative"
sentiment_stats: {
negative: 94.54
neutral: 5.42
positive: 0.04
}
ai_tag: [
0: "financial markets"
]
ai_region: [
0: "iran,asia"
]
ai_org: [
0: "biosyent"
]
ai_summary: "BioSyent reported a 10% year-over-year revenue increase to CAD 9 million, consistent EPS forecast, ..."
duplicate: true
}
9: {
article_id: "04aa002466aac0e2af3f6f626f5df420"
link: "https://www.business-standard.com/world-news/us-eyes-alternatives-after-wto-talks-fail-on-ecommerce..."
title: "US eyes alternatives after WTO talks fail on ecommerce duty moratorium"
description: "US Trade Representative Jamieson Greer said Washington would work with like-minded partners outside..."
content: "Countries at the World Trade Organization failed to agree on reforms or extend a long-standing e-co..."
keywords: [
0: "jamieson greer"
1: "us trade policy"
2: "global trade"
3: "wto talks"
4: "brazil"
5: "world trade organization"
6: "digital trade tariffs"
7: "multilateralism"
8: "e-commerce moratorium"
9: "turkey"
10: "yaounde cameroon"
]
creator: [
0: "reuters"
]
language: "english"
country: [
0: "india"
]
category: [
0: "world"
]
datatype: "news"
pubDate: "2026-03-31 02:46:18"
pubDateTZ: "UTC"
fetched_at: "2026-03-31 03:02:42"
image_url: "https://bsmedia.business-standard.com/_media/bs/img/article/default/1260331/thumb-126033100101.jpg"
video_url: null
source_id: "business-standard"
source_name: "Business Standard"
source_priority: 9158
source_url: "https://www.business-standard.com"
source_icon: "https://n.bytvi.com/business-standard.png"
sentiment: "neutral"
sentiment_stats: {
negative: 1.58
neutral: 95.26
positive: 3.16
}
ai_tag: [
0: "government"
]
ai_region: [
0: "washington,vermont,united states of america,north america"
1: "washington,georgia,united states of america,north america"
2: "washington,maine,united states of america,north america"
3: "united states of america,north america"
4: "washington,indiana,united states of america,north america"
5: "washington,missouri,united states of america,north america"
6: "washington,virginia,united states of america,north america"
7: "washington,iowa,united states of america,north america"
8: "washington,utah,united states of america,north america"
9: "washington,new jersey,united states of america,north america"
10: "washington,united states of america,north america"
11: "washington,north carolina,united states of america,north america"
12: "washington,pennsylvania,united states of america,north america"
13: "washington,west virginia,united states of america,north america"
14: "washington,connecticut,united states of america,north america"
15: "washington,illinois,united states of america,north america"
16: "washington,kansas,united states of america,north america"
]
ai_org: [
0: "wto"
]
ai_summary: "A WTO meeting resulted in an agreement to move forward with a baseline framework for digital trade ..."
duplicate: false
}
10: {
article_id: "b86d22565fca38d9eb938337f8d8f526"
link: "https://phys.org/news/2026-03-german-firms-china.html"
title: "German firms trapped between US and China, study finds"
description: "Germany's largest companies are deeply entangled with rival businesses in China and the US, and una..."
content: "Germany's largest companies are deeply entangled with rival businesses in China and the US, and una..."
keywords: [
0: "physics news"
1: "technology"
2: "nanotech"
3: "science"
4: "technology news"
5: "science news"
6: "physics"
7: "materials"
]
creator: [
0: "vicky welstead"
]
language: "english"
country: [
0: "united states of america"
]
category: [
0: "science"
]
datatype: "news"
pubDate: "2026-03-31 02:40:01"
pubDateTZ: "UTC"
fetched_at: "2026-03-31 03:02:16"
image_url: "https://scx2.b-cdn.net/gfx/news/hires/2026/mercedes-benz-logo.jpg"
video_url: null
source_id: "phys"
source_name: "Phys.org"
source_priority: 4210
source_url: "https://phys.org"
source_icon: "https://n.bytvi.com/phys.jpg"
sentiment: "negative"
sentiment_stats: {
negative: 96.88
neutral: 3.08
positive: 0.04
}
ai_tag: [
0: "supply chain and logistics"
]
ai_region: [
0: "china,maine,united states of america,north america"
1: "germany,europe"
2: "china,texas,united states of america,north america"
]
ai_org: null
ai_summary: "The article discusses the complex interdependencies between US and Chinese firms across various ind..."
duplicate: true
}
11: {
article_id: "13566c96842a58f470a6d5830983bc3e"
link: "https://www.bangkokpost.com/world/3227699/cubans-ready-for-russian-oil-but-some-say-not-enough"
title: "Cubans ready for Russian oil but some say not enough"
description: "MATANZAS (CUBA) - Cubans on Monday cautiously welcomed the imminent arrival of a Russian oil shipme..."
content: "The Anatoly Kolodkin, a tanker under US sanctions carrying 730,000 barrels of crude, was due to arr..."
keywords: [
0: "cuba energy sector"
1: "anatoliy kolodkin tanker"
2: "venezuela oil supplier"
3: "matanzas port"
4: "cuba oil crisis"
5: "russian oil shipment cuba"
6: "us sanctions cuba"
7: "havana fuel rationing"
]
creator: [
0: "afp"
]
language: "english"
country: [
0: "thailand"
]
category: [
0: "world"
]
datatype: "news"
pubDate: "2026-03-31 01:45:00"
pubDateTZ: "UTC"
fetched_at: "2026-03-31 02:32:11"
image_url: "https://static.bangkokpost.com/media/content/20260331/c1_6029669.jpg"
video_url: null
source_id: "bangkokpost"
source_name: "Bangkok Post"
source_priority: 7679
source_url: "http://BangkokPost.com"
source_icon: "https://n.bytvi.com/bangkokpost.png"
sentiment: "neutral"
sentiment_stats: {
negative: 3.44
neutral: 96.3
positive: 0.26
}
ai_tag: [
0: "conflicts & war"
1: "national security"
]
ai_region: [
0: "matanzas,matanzas province,cuba,north america"
1: "cuba,north america"
]
ai_org: null
ai_summary: null
duplicate: true
}
12: {
article_id: "487bb815bf55ff4506ff61f7620b01f8"
link: "https://uk.finance.yahoo.com/news/jpmorgan-sees-australia-ipo-demand-013546545.html"
title: "JPMorgan Sees Australia IPO Demand Resilient to Stock Turmoil"
description: "(Bloomberg) -- Australia’s pipeline for initial public offerings is showing signs of resilience, ev..."
content: "(Bloomberg) -- Australia’s pipeline for initial public offerings is showing signs of resilience, ev..."
keywords: [
0: "jpmorgan chase"
1: "global equity markets"
2: "australia"
3: "initial public offerings"
4: "iran"
5: "philip hart"
6: "bloomberg"
7: "australian securities and investment commission"
]
creator: [
0: "carmeli argana"
]
language: "english"
country: [
0: "united kingdom"
]
category: [
0: "business"
]
datatype: "news"
pubDate: "2026-03-31 01:35:46"
pubDateTZ: "UTC"
fetched_at: "2026-03-31 03:33:16"
image_url: null
video_url: null
source_id: "yahoo"
source_name: "Yahoo! News"
source_priority: 17
source_url: "https://news.yahoo.com"
source_icon: "https://n.bytvi.com/yahoo.png"
sentiment: "positive"
sentiment_stats: {
negative: 0.03
neutral: 7.01
positive: 92.96
}
ai_tag: [
0: "financial markets"
]
ai_region: [
0: "australia,australia/oceania"
1: "iran,asia"
]
ai_org: [
0: "bloomberg"
1: "jpmorgan sees australia"
]
ai_summary: "The Australian Securities and Investments Commission (ASIC) is trialling a shortened IPO timetable ..."
duplicate: true
}
13: {
article_id: "18eb143e0a07ccd7e32b5eb2ec12122b"
link: "https://timesofindia.indiatimes.com/business/india-business/e-commerce-turns-deal-breaker-at-wto-me..."
title: "E-commerce turns deal breaker at WTO meet"
description: "India Business News: NEW DELHI: WTO member nations failed to agree to any meaningful outcome at the..."
content: "NEW DELHI: WTO member nations failed to agree to any meaningful outcome at the second ministerial m..."
keywords: [
0: "digital downloads tariffs"
1: "india e-commerce negotiations"
2: "wto ministerial meeting africa"
3: "trips agreement non-violation complaints"
4: "wto e-commerce moratorium"
]
creator: [
0: "tnn"
]
language: "english"
country: [
0: "india"
]
category: [
0: "business"
]
datatype: "news"
pubDate: "2026-03-31 01:29:16"
pubDateTZ: "UTC"
fetched_at: "2026-03-31 02:01:10"
image_url: "https://static.toiimg.com/thumb/resizemode-4,width-1280,height-720,msid-129914134/129914134.jpg"
video_url: null
source_id: "toi"
source_name: "The Times Of India"
source_priority: 2178
source_url: "https://timesofindia.indiatimes.com"
source_icon: "https://n.bytvi.com/toi.png"
sentiment: "negative"
sentiment_stats: {
negative: 80.18
neutral: 19.79
positive: 0.03
}
ai_tag: [
0: "supply chain and logistics"
]
ai_region: [
0: "africa"
1: "india,asia"
2: "new delhi,delhi,india,asia"
]
ai_org: [
0: "wto"
]
ai_summary: "India engaged constructively in WTO negotiations, blocking China-driven investment facilitation des..."
duplicate: false
}
14: {
article_id: "6aa04e18a47b64529bba80ac357c24d3"
link: "https://www.abc.net.au/news/rural/2026-03-31/cobram-estate-california-olive-ranch-purchase-approved..."
title: "Cobram Estate completes $260m purchase of huge US olive grove"
description: "Australia's largest olive oil producer has completed its purchase of a massive olive grove in Calif..."
content: "In short: Cobram Estate Olives has completed its purchase of California Olive Ranch in a deal worth..."
keywords: [
0: "extra virgin olive oil"
1: "cobram estate olives"
2: "robert mcgavin"
3: "rob mcgavin"
4: "usa"
5: "olives"
6: "united states"
7: "cobram estate"
8: "california"
9: "olive oil"
10: "extra-virgin olive oil"
11: "oil"
]
creator: [
0: "angus verley"
]
language: "english"
country: [
0: "australia"
]
category: [
0: "business"
1: "top"
]
datatype: "news"
pubDate: "2026-03-31 01:05:28"
pubDateTZ: "UTC"
fetched_at: "2026-03-31 01:31:59"
image_url: "https://live-production.wcms.abc-cdn.net.au/249f312eff548e8a43765e975da41613?impolicy=wcms_crop_res..."
video_url: null
source_id: "abc_net"
source_name: "Abc"
source_priority: 3795
source_url: "https://www.abc.net.au"
source_icon: "https://n.bytvi.com/abc_net.png"
sentiment: "positive"
sentiment_stats: {
negative: 0.07
neutral: 3.71
positive: 96.22
}
ai_tag: [
0: "real estate"
]
ai_region: [
0: "california,missouri,united states of america,north america"
1: "australia,australia/oceania"
2: "california,pennsylvania,united states of america,north america"
3: "california,united states of america,north america"
4: "united states of america,north america"
5: "california,maryland,united states of america,north america"
]
ai_org: [
0: "cobram estate"
]
ai_summary: null
duplicate: false
}
15: {
article_id: "d351ddd7bee19da935283aa83586bf7b"
link: "https://ca.finance.yahoo.com/news/itafos-inc-itfs-q4-2025-010034235.html"
title: "Itafos Inc (ITFS) Q4 2025 Earnings Call Highlights: Record Revenue and Strategic Growth Amid ..."
description: "Itafos Inc (ITFS) reports a robust financial year with significant revenue growth and strategic adv..."
content: "This article first appeared on GuruFocus. - Revenue: $558 million for 2025. - Adjusted EBITDA: $159..."
keywords: [
0: "itafos inc"
1: "operating margins"
2: "david delaney"
3: "phosphate products"
4: "itfs"
]
creator: [
0: "gurufocus news"
]
language: "english"
country: [
0: "canada"
]
category: [
0: "sports"
]
datatype: "news"
pubDate: "2026-03-31 01:00:34"
pubDateTZ: "UTC"
fetched_at: "2026-03-31 01:01:14"
image_url: "https://s.yimg.com/cv/apiv2/cv/apiv2/social/images/yahoo-finance-default-logo.png"
video_url: null
source_id: "yahoo"
source_name: "Yahoo! News"
source_priority: 17
source_url: "https://news.yahoo.com"
source_icon: "https://n.bytvi.com/yahoo.png"
sentiment: "positive"
sentiment_stats: {
negative: 0.02
neutral: 0.05
positive: 99.93
}
ai_tag: [
0: "corporate news"
1: "financial markets"
]
ai_region: null
ai_org: [
0: "itfs"
1: "itafos inc"
]
ai_summary: "ITFS Inc reported a successful year with record production and a significant increase in adjusted E..."
duplicate: false
}
16: {
article_id: "0f97701ba14b52928ce9f174c321d2d5"
link: "https://www.firstpost.com/business/us-fed-powell-backs-wait-and-see-iran-war-muddies-inflation-outl..."
title: "Powell backs ‘wait-and-see’ as Iran war muddies inflation outlook"
description: "Jerome Powell says the US Federal Reserve can “wait and see” the impact of the Iran war on inflatio..."
content: "US Federal Reserve Chair Jerome Powell on Monday signalled a cautious, “wait-and-see” approach to m..."
keywords: [
0: "kevin warsh"
1: "oil prices"
2: "iran war"
3: "us federal reserve"
4: "us economy"
5: "interest rates"
6: "jerome powell"
7: "donald trump"
8: "federal open market committee"
9: "inflation"
]
creator: [
0: "fp business desk"
]
language: "english"
country: [
0: "india"
]
category: [
0: "business"
]
datatype: "news"
pubDate: "2026-03-31 00:09:59"
pubDateTZ: "UTC"
fetched_at: "2026-03-31 00:32:57"
image_url: "https://images.firstpost.com/uploads/2026/01/AFP__20251210__87QG9X6__v1__HighRes__UsEconomyFedRates..."
video_url: null
source_id: "firstpost"
source_name: "Firstpost"
source_priority: 5906
source_url: "https://www.firstpost.com"
source_icon: "https://n.bytvi.com/firstpost.png"
sentiment: "neutral"
sentiment_stats: {
negative: 13.18
neutral: 85.32
positive: 1.5
}
ai_tag: null
ai_region: [
0: "iran,asia"
]
ai_org: [
0: "us federal reserve"
]
ai_summary: "The article discusses the Federal Reserve's delicate balancing act between managing inflation and s..."
duplicate: false
}
17: {
article_id: "97df9e70daff5f052f951251b66b54a5"
link: "https://economictimes.indiatimes.com/news/international/us/palm-beach-international-airport-to-be-r..."
title: "Palm Beach International Airport to be renamed after Donald Trump? Here’s what Florida Governor Ron..."
description: "Palm Beach International Airport: Florida Governor Ron DeSantis has signed a bill to rename Palm Be..."
content: "Palm Beach International Airport: Florida Governor Ron DeSantis, a prominent ally of US president D..."
keywords: [
0: "ron desantis"
1: "airport renaming controversy"
2: "donald trump"
3: "trump organization"
4: "palm beach international airport"
]
creator: [
0: "shreya biswas"
]
language: "english"
country: [
0: "india"
]
category: [
0: "business"
1: "top"
]
datatype: "news"
pubDate: "2026-03-30 23:35:39"
pubDateTZ: "UTC"
fetched_at: "2026-03-31 00:03:03"
image_url: "https://img.etimg.com/thumb/msid-129913622,resizemode-4,width-1200,height-900,imgsize-196742,overla..."
video_url: null
source_id: "economictimes_indiatimes"
source_name: "The Economic Times"
source_priority: 231
source_url: "https://economictimes.indiatimes.com"
source_icon: "https://n.bytvi.com/economictimes_indiatimes.png"
sentiment: "neutral"
sentiment_stats: {
negative: 18.56
neutral: 72.37
positive: 9.07
}
ai_tag: null
ai_region: [
0: "florida,florida,puerto rico,north america"
1: "florida,florida,uruguay,south america"
2: "florida,puerto rico,north america"
]
ai_org: [
0: "palm beach international airport"
]
ai_summary: "The article discusses the controversy surrounding Donald Trump's involvement in legislation related..."
duplicate: false
}
18: {
article_id: "17ec6a141177d81a0382618dbf52c6d7"
link: "https://indianexpress.com/article/india/jaishankar-meets-russian-minister-discusses-west-asia-war-1..."
title: "Jaishankar meets Russian minister, discusses West Asia war"
description: "The meeting comes at a time when Delhi is facing a shortage of energy supply in the wake of the US-..."
content: "External Affairs minister S Jaishankar and Foreign Secretary Vikram Misri on Monday met Russian Dep..."
keywords: [
0: "donald trump waiver russian oil india sanctions"
1: "hardeep singh puri pavel sorokin lng deal talks"
2: "india russia trade target 100 billion by 2030"
3: "us israel iran war global energy crisis"
4: "strait of hormuz disruption global oil trade"
5: "lng lpg supply talks india russia"
6: "west asia war impact on india oil imports"
7: "india russian oil imports surge 2026"
8: "s jaishankar andrey rudenko meeting new delhi"
9: "india russia energy cooperation talks 2026"
10: "india russia strategic partnership energy supply"
11: "indian express"
12: "india crude oil dependency imports 88 percent"
]
creator: [
0: "shubhajit roy"
]
language: "english"
country: [
0: "india"
]
category: [
0: "politics"
1: "top"
]
datatype: "news"
pubDate: "2026-03-30 23:33:50"
pubDateTZ: "UTC"
fetched_at: "2026-03-31 00:28:31"
image_url: "https://images.indianexpress.com/2026/03/External-Affairs-Minister-S-Jaishankar-with-Russian-Deputy..."
video_url: null
source_id: "indianexpress"
source_name: "The Indian Express"
source_priority: 1386
source_url: "https://indianexpress.com"
source_icon: "https://n.bytvi.com/indianexpress.png"
sentiment: "neutral"
sentiment_stats: {
negative: 3.88
neutral: 95.89
positive: 0.23
}
ai_tag: [
0: "conflicts & war"
]
ai_region: [
0: "west asia"
1: "delhi,india,asia"
2: "us-israel iran"
3: "delhi,delhi,india,asia"
]
ai_org: null
ai_summary: "Russia and India discussed increasing LNG supplies and the potential for LPG deliveries, with busin..."
duplicate: false
}
19: {
article_id: "3c73b73c52abaea3eeba39ecc2649468"
link: "https://timesofindia.indiatimes.com/blogs/toi-edit-page/bettor-is-best/"
title: "Bettor Is Best?"
description: "Will markets for prediction be any better at guessing the future than ‘experts’? Can they be manipu..."
content: "Will markets for prediction be any better at guessing the future than ‘experts’? Can they be manipu..."
keywords: [
0: "toi edit page blog"
1: "toi edit blog"
2: "india blog"
]
creator: [
0: "toi edit"
]
language: "english"
country: [
0: "india"
]
category: [
0: "science"
]
datatype: "news"
pubDate: "2026-03-30 23:30:44"
pubDateTZ: "UTC"
fetched_at: "2026-03-31 00:03:47"
image_url: "https://static.toiimg.com/imagenext/toiblogs/thumb/blogs/wp-content/uploads/2019/01/toiedit-logo.jp..."
video_url: null
source_id: "toi"
source_name: "The Times Of India"
source_priority: 2178
source_url: "https://timesofindia.indiatimes.com"
source_icon: "https://n.bytvi.com/toi.png"
sentiment: "neutral"
sentiment_stats: {
negative: 0.18
neutral: 98.06
positive: 1.76
}
ai_tag: [
0: "research"
]
ai_region: null
ai_org: null
ai_summary: "The article discusses the ethical and legal implications of profiting from classified information, ..."
duplicate: false
}
20: {
article_id: "9add36a148f29e6eaea6f1a1bafc7a32"
link: "https://sg.news.yahoo.com/cubans-ready-russian-oil-not-233009743.html"
title: "Cubans ready for Russian oil but some say not enough"
description: "Cubans on Monday cautiously welcomed the imminent arrival of a Russian oil shipment, with some warn..."
content: "Cubans on Monday cautiously welcomed the imminent arrival of a Russian oil shipment, with some warn..."
keywords: [
0: "cuba"
1: "cubans"
2: "anatoly kolodkin"
3: "matanzas"
4: "donald trump"
5: "oil"
]
creator: [
0: "lisandra cots"
]
language: "english"
country: [
0: "singapore"
]
category: [
0: "politics"
1: "top"
]
datatype: "news"
pubDate: "2026-03-30 23:30:09"
pubDateTZ: "UTC"
fetched_at: "2026-03-31 00:01:00"
image_url: "https://media.zenfs.com/en/afp.com.sg/a8ed83720d3a7aef6592d7d7946cae38"
video_url: null
source_id: "yahoo_sg"
source_name: "Yahoo!news"
source_priority: 17
source_url: "https://sg.news.yahoo.com"
source_icon: "https://n.bytvi.com/yahoo_sg.png"
sentiment: "neutral"
sentiment_stats: {
negative: 25.9
neutral: 74.03
positive: 0.07
}
ai_tag: [
0: "conflicts & war"
1: "national security"
]
ai_region: null
ai_org: null
ai_summary: "Russia sends oil tanker to Cuba amid US sanctions, with President Trump stating Cubans must survive..."
duplicate: true
}
21: {
article_id: "3a7a39f67b20a4a238b2fefb145412f2"
link: "https://www.ctvnews.ca/windsor/article/amherstburg-lands-838k-in-provincial-funding-to-prepare-indu..."
title: "Amherstburg lands $838K in provincial funding to prepare industrial park for future jobs"
description: "The Town of Amherstburg has secured $838,000 in provincial funding to help prepare more than 700 ac..."
content: "The Town of Amherstburg has secured $838,000 in provincial funding to help prepare more than 700 ac..."
keywords: null
creator: [
0: "chris campbell"
]
language: "english"
country: [
0: "canada"
]
category: [
0: "business"
1: "top"
]
datatype: "news"
pubDate: "2026-03-30 21:49:55"
pubDateTZ: "UTC"
fetched_at: "2026-03-30 22:01:55"
image_url: "https://www.ctvnews.ca/resizer/v2/44GJC4TWGNF23MX3PRKMR6A4WE.jpg?auth=6335b8502f8246a0f0f35d6ebd2e9..."
video_url: null
source_id: "ctvnews"
source_name: "Ctv News"
source_priority: 5458
source_url: "https://regina.ctvnews.ca"
source_icon: "https://n.bytvi.com/ctvnews.png"
sentiment: "positive"
sentiment_stats: {
negative: 0.02
neutral: 0.12
positive: 99.86
}
ai_tag: [
0: "real estate"
]
ai_region: [
0: "amherstburg,ontario,canada,north america"
1: "the town of amherstburg"
]
ai_org: null
ai_summary: "Amherstburg, Ontario, is considering a large-scale development project on 700 acres, potentially at..."
duplicate: false
}
22: {
article_id: "959ca7a94ebf714f690667d740ce1081"
link: "https://www.hindustantimes.com/world-news/cuba-to-receive-sanctioned-russian-oil-tanker-as-it-strug..."
title: "Cuba to receive sanctioned Russian oil tanker as it struggles under US blockade"
description: "It comes a day after US President Donald Trump told reporters he had “no problem” with the Russian ..."
content: "Cuba prepared Monday to receive a sanctioned Russian tanker carrying roughly 730,000 barrels of oil..."
keywords: [
0: "matanzas port"
1: "russian tanker"
2: "u.s. oil blockade"
3: "oil delivery"
4: "cuba"
]
creator: [
0: "ap"
]
language: "english"
country: [
0: "india"
]
category: [
0: "world"
]
datatype: "news"
pubDate: "2026-03-30 21:33:22"
pubDateTZ: "UTC"
fetched_at: "2026-03-30 22:02:31"
image_url: "https://www.hindustantimes.com/ht-img/img/2026/03/30/1600x900/logo/CUBA-RUSSIA-US-OIL-5_17749063229..."
video_url: null
source_id: "hindustantimes"
source_name: "Hindustan Times"
source_priority: 2173
source_url: "http://www.hindustantimes.com"
source_icon: "https://n.bytvi.com/hindustantimes.png"
sentiment: "neutral"
sentiment_stats: {
negative: 15.28
neutral: 80.8
positive: 3.92
}
ai_tag: [
0: "national security"
]
ai_region: [
0: "cuba,missouri,united states of america,north america"
1: "cuba,illinois,united states of america,north america"
2: "cuba,new york,united states of america,north america"
3: "united states of america,north america"
]
ai_org: null
ai_summary: "The article discusses the implications of President Trump's decision to allow Russian oil tankers t..."
duplicate: false
}
23: {
article_id: "1ecea716632ba4875b7d32eb2e4d7f60"
link: "https://www.bostonglobe.com/2026/03/30/nation/trumps-birthright-citizenship-order-supreme-court-spl..."
title: "Trump's birthright citizenship order at Supreme Court splits conservative scholars"
description: "For generations, most legal experts and the courts have agreed that the Constitution guarantees cit..."
content: "News analysis WASHINGTON — For generations, most legal experts and the courts have agreed that the ..."
keywords: null
creator: [
0: "ann e. marimow"
]
language: "english"
country: [
0: "united states of america"
]
category: [
0: "politics"
1: "top"
]
datatype: "news"
pubDate: "2026-03-30 21:24:17"
pubDateTZ: "UTC"
fetched_at: "2026-03-30 21:31:41"
image_url: "https://www.bostonglobe.com/pf/resources/images/logo-bg.jpg?d=642"
video_url: null
source_id: "bostonglobe"
source_name: "The Boston Globe"
source_priority: 2335
source_url: "https://www.bostonglobe.com"
source_icon: "https://n.bytvi.com/bostonglobe.jpg"
sentiment: "neutral"
sentiment_stats: {
negative: 7.78
neutral: 90.84
positive: 1.38
}
ai_tag: [
0: "politics"
]
ai_region: null
ai_org: [
0: "supreme court"
1: "constitution"
]
ai_summary: "President Trump has requested the Supreme Court to reinterpret the 14th Amendment, which was added ..."
duplicate: true
}
24: {
article_id: "24da444287f12b97cb0692039842d436"
link: "https://www.channelnewsasia.com/world/powell-says-fed-can-wait-and-see-how-war-affects-inflation-60..."
title: "Powell says Fed can 'wait and see' how war affects inflation"
description: "The Fed can “wait and see how that turns out” before acting on inflation from the Iran war, said Fe..."
content: "CAMBRIDGE, Massachusetts: Federal Reserve Chair Jerome Powell on Monday (Mar 30) said the US centra..."
keywords: [
0: "jerome powell"
1: "federal reserve"
2: "us-israel war on iran"
]
creator: [
0: "cna"
]
language: "english"
country: [
0: "indonesia"
1: "israel"
2: "philippines"
3: "taiwan"
4: "mongolia"
5: "afghanistan"
6: "nepal"
7: "vietnam"
8: "north korea"
9: "sri lanka"
10: "singapore"
11: "japan"
12: "turkey"
13: "bhutan"
14: "cambodia"
15: "myanmar"
16: "china"
17: "hong kong"
18: "bahrain"
19: "south korea"
20: "thailand"
21: "bangladesh"
22: "pakistan"
23: "kuwait"
24: "india"
25: "maldives"
26: "malaysia"
]
category: [
0: "politics"
1: "top"
]
datatype: "news"
pubDate: "2026-03-30 20:59:55"
pubDateTZ: "UTC"
fetched_at: "2026-03-30 21:31:56"
image_url: "https://dam.mediacorp.sg/image/upload/s--qynWbHwF--/c_fill,g_auto,h_338,w_600/fl_relative,g_south_e..."
video_url: null
source_id: "channelnewsasia"
source_name: "Channel Newsasia"
source_priority: 4763
source_url: "https://www.channelnewsasia.com"
source_icon: "https://n.bytvi.com/channelnewsasia.jpg"
sentiment: "neutral"
sentiment_stats: {
negative: 3.13
neutral: 96.55
positive: 0.32
}
ai_tag: [
0: "conflicts & war"
]
ai_region: [
0: "iran,asia"
]
ai_org: [
0: "federal reserve"
]
ai_summary: "Fed Chairman Powell comments on inflation, interest rates, and the impact of tariffs and war on the..."
duplicate: true
}
25: {
article_id: "bed785178d86dcb7ba3c8c41751a8eca"
link: "http://www.businesswire.com/news/home/20260330828951/en/DiaMedica-Therapeutics-Reports-Full-Year-20..."
title: "DiaMedica Therapeutics Reports Full Year 2025 Financial Results and Provides Business Highlights"
description: "MINNEAPOLIS--(BUSINESS WIRE)--DiaMedica Therapeutics Inc. (Nasdaq: DMAC), a clinical-stage biopharm..."
content: "DiaMedica Therapeutics Reports Full Year 2025 Financial Results and Provides Business Highlights Di..."
keywords: null
creator: [
0: "scott kellen"
]
language: "english"
country: [
0: "australia"
1: "canada"
2: "united kingdom"
3: "france"
4: "japan"
5: "germany"
6: "united states of america"
7: "china"
]
category: [
0: "health"
]
datatype: "news"
pubDate: "2026-03-30 20:45:00"
pubDateTZ: "UTC"
fetched_at: "2026-03-30 21:02:09"
image_url: "https://mms.businesswire.com/media/20260330828951/en/2761009/22/DiaMedica-Logo-white-background.jpg"
video_url: null
source_id: "businesswire"
source_name: "Businesswire"
source_priority: 1006
source_url: "https://www.businesswire.com"
source_icon: "https://n.bytvi.com/businesswire.png"
sentiment: "positive"
sentiment_stats: {
negative: 0.06
neutral: 3.67
positive: 96.27
}
ai_tag: [
0: "pharma and healthcare"
1: "corporate news"
]
ai_region: null
ai_org: [
0: "diamedica therapeutics inc"
1: "dmac"
]
ai_summary: "DiaMedica Inc. announced progress in clinical programs for preeclampsia, fetal growth restriction, ..."
duplicate: false
}
26: {
article_id: "fd7f593188344deaac556b1ec5418ac6"
link: "https://www.benzinga.com/pressreleases/26/03/g51553576/lulus-reports-fourth-quarter-and-fiscal-year..."
title: "Lulus Reports Fourth Quarter and Fiscal Year 2025 Results"
description: "CHICO, Calif., March 30, 2026 (GLOBE NEWSWIRE) -- Lulu's Fashion Lounge Holdings, Inc. ("Lulus" or ..."
content: "CHICO, Calif., March 30, 2026 (GLOBE NEWSWIRE) -- Lulu's Fashion Lounge Holdings, Inc. ("Lulus" or ..."
keywords: [
0: ""pageisbzpro: bz""
1: ""cms: drupal""
2: ""category: earnings""
3: ""category: press releases""
4: ""symbol: lvlu""
]
creator: [
0: "globe newswire"
]
language: "english"
country: [
0: "united states of america"
]
category: [
0: "business"
]
datatype: "news"
pubDate: "2026-03-30 20:44:09"
pubDateTZ: "UTC"
fetched_at: "2026-03-30 21:02:46"
image_url: "https://cdn.benzinga.com/files/imagecache/bz2_opengraph_meta_image_400x300/sites/all/themes/bz2/ima..."
video_url: null
source_id: "benzinga"
source_name: "Benzinga"
source_priority: 2050
source_url: "https://www.benzinga.com"
source_icon: "https://n.bytvi.com/benzinga.png"
sentiment: "neutral"
sentiment_stats: {
negative: 3.32
neutral: 86.36
positive: 10.32
}
ai_tag: [
0: "fashion and lifestyle"
]
ai_region: [
0: "calif."
]
ai_org: [
0: "lulu fashion lounge holdings, inc"
1: "lvlu"
2: "lulus"
]
ai_summary: "Target's fourth-quarter 2025 financial results show a 11% increase in gross profit to $27.9 million..."
duplicate: true
}
27: {
article_id: "0d62785b1ad0cade1ea37a5843fd7859"
link: "https://www.globenewswire.com/news-release/2026/03/30/3265049/0/en/Lulus-Reports-Fourth-Quarter-and..."
title: "Lulus Reports Fourth Quarter and Fiscal Year 2025 Results"
description: "Gross profit increased 11% in Q4’25 vs Q4’24 Gross profit increased 11% in Q4’25 vs Q4’24"
content: "CHICO, Calif., March 30, 2026 (GLOBE NEWSWIRE) -- Lulu’s Fashion Lounge Holdings, Inc. (“Lulus” or ..."
keywords: [
0: "inc."
1: "lulu's fashion lounge holdings"
]
creator: [
0: "inc."
1: "lulu's fashion lounge holdings"
]
language: "english"
country: [
0: "united states of america"
]
category: [
0: "business"
]
datatype: "news"
pubDate: "2026-03-30 20:44:00"
pubDateTZ: "UTC"
fetched_at: "2026-03-30 21:03:03"
image_url: null
video_url: null
source_id: "globenewswire"
source_name: "Globe Newswire"
source_priority: 7268
source_url: "https://www.globenewswire.com"
source_icon: "https://n.bytvi.com/globenewswire.jpg"
sentiment: "positive"
sentiment_stats: {
negative: 0.04
neutral: 2.93
positive: 97.03
}
ai_tag: [
0: "financial markets"
]
ai_region: [
0: "calif."
]
ai_org: null
ai_summary: "The company reported a 11% increase in gross profit and a 640 basis point increase in gross margin,..."
duplicate: false
}
28: {
article_id: "c877580718207d14b4f6673c96c62496"
link: "https://www.globenewswire.com/fr/news-release/2026/03/30/3265049/0/en/Lulus-Reports-Fourth-Quarter-..."
title: "Lulus Reports Fourth Quarter and Fiscal Year 2025 Results"
description: "Gross profit increased 11% in Q4’25 vs Q4’24 Gross profit increased 11% in Q4’25 vs Q4’24"
content: "CHICO, Calif., March 30, 2026 (GLOBE NEWSWIRE) -- Lulu’s Fashion Lounge Holdings, Inc. (“Lulus” or ..."
keywords: [
0: "lulu's fashion lounge holdings"
1: "inc."
]
creator: [
0: "lulu's fashion lounge holdings"
1: "inc."
]
language: "english"
country: [
0: "france"
]
category: [
0: "business"
]
datatype: "news"
pubDate: "2026-03-30 20:44:00"
pubDateTZ: "UTC"
fetched_at: "2026-03-30 21:01:51"
image_url: null
video_url: null
source_id: "globenewswire_fr"
source_name: "Globenewswire_fr"
source_priority: 2022
source_url: "https://www.globenewswire.com"
source_icon: "https://n.bytvi.com/globenewswire_fr.jpg"
sentiment: "positive"
sentiment_stats: {
negative: 0.04
neutral: 2.93
positive: 97.03
}
ai_tag: [
0: "financial markets"
]
ai_region: [
0: "calif."
]
ai_org: null
ai_summary: "The company reported a 11% increase in gross profit and a 640 basis point increase in gross margin,..."
duplicate: true
}
29: {
article_id: "f197e66701eda796793fe4697fbf754f"
link: "https://investinglive.com/news/investinglive-americas-fx-news-wrap-30-mar-geopolitics-talks-lift-th..."
title: "investingLive Americas FX news wrap 30 Mar: Geopolitics talks lift then rattle markets"
description: "Fed's Williams speaking: Tariffs and Iran war will push headline inflation higher Gold traders are ..."
content: "Fed's Williams speaking: Tariffs and Iran war will push headline inflation higher Gold traders are ..."
keywords: null
creator: [
0: "greg michalowski"
]
language: "english"
country: [
0: "united states of america"
]
category: [
0: "business"
1: "top"
]
datatype: "news"
pubDate: "2026-03-30 20:32:19"
pubDateTZ: "UTC"
fetched_at: "2026-03-30 21:02:00"
image_url: "https://images.investinglive.com/images/wrap_id_e2847f50-bd63-483e-9a75-24694344f571_size975.jpg"
video_url: null
source_id: "forexlive"
source_name: "Forexlive"
source_priority: 9087
source_url: "https://www.forexlive.com"
source_icon: "https://n.bytvi.com/forexlive.png"
sentiment: "neutral"
sentiment_stats: {
negative: 1.97
neutral: 94.96
positive: 3.07
}
ai_tag: [
0: "financial markets"
]
ai_region: [
0: "iran,asia"
]
ai_org: [
0: "americas fx"
]
ai_summary: "U.S. President Trump warned Iran of potential escalation if a deal is not reached soon, threatening..."
duplicate: false
}
30: {
article_id: "39d5377fe9e47900b05ac1af487432bc"
link: "https://www.adn.com/opinions/letters/2026/03/30/letter-dont-sit-this-election-out/"
title: "Letter: Don’t sit this election out"
description: null
content: "Please do not forget to vote. We voted by absentee ballot. I appreciate and trust the way we run el..."
keywords: null
creator: [
0: "jim bailey"
]
language: "english"
country: [
0: "united states of america"
]
category: [
0: "politics"
1: "top"
]
datatype: "news"
pubDate: "2026-03-30 20:29:00"
pubDateTZ: "UTC"
fetched_at: "2026-03-30 20:32:22"
image_url: "https://www.adn.com/resizer/OiZgIZu-nzKkVJMicD6TAuF39cs=/cloudfront-us-east-1.images.arcpublishing...."
video_url: null
source_id: "adn"
source_name: "Adn"
source_priority: 9366
source_url: "https://www.adn.com"
source_icon: "https://n.bytvi.com/adn.png"
sentiment: "neutral"
sentiment_stats: {
negative: 0.81
neutral: 72
positive: 27.19
}
ai_tag: [
0: "elections"
]
ai_region: [
0: "anchorage,alaska,united states of america,north america"
1: "alaska,united states of america,north america"
]
ai_org: null
ai_summary: "The article discusses the importance of accurate reporting, the role of journalists, and the challe..."
duplicate: false
}
31: {
article_id: "8f218900d32149215efb25f13ac0a58b"
link: "https://www.usnews.com/news/world/articles/2026-03-30/sanctioned-russian-flagged-oil-tanker-closes-..."
title: "Sanctioned Russian-Flagged Oil Tanker Closes in on Cuban Port of Matanzas"
description: "By Dave Sherwood and Marianna ParragaHAVANA/HOUSTON, March 30 (Reuters) - A Russian-flagged oil tan..."
content: "By Dave Sherwood and Marianna ParragaHAVANA/HOUSTON, March 30 (Reuters) - A Russian-flagged oil tan..."
keywords: [
0: "collections: world"
1: "united states"
2: "reuters"
3: "chile"
4: "south america"
5: "world news"
6: "cuba"
]
creator: [
0: "reuters"
]
language: "english"
country: [
0: "united states of america"
]
category: [
0: "world"
]
datatype: "news"
pubDate: "2026-03-30 20:27:40"
pubDateTZ: "UTC"
fetched_at: "2026-03-30 21:32:51"
image_url: null
video_url: null
source_id: "usnews"
source_name: "Usnews"
source_priority: 80
source_url: "https://www.usnews.com"
source_icon: "https://n.bytvi.com/usnews.png"
sentiment: "neutral"
sentiment_stats: {
negative: 18.57
neutral: 80.94
positive: 0.49
}
ai_tag: [
0: "accidents"
]
ai_region: [
0: "houston,missouri,united states of america,north america"
1: "cuban port of matanzas"
2: "houston,pennsylvania,united states of america,north america"
3: "houston,alaska,united states of america,north america"
4: "houston,texas,united states of america,north america"
5: "houston,mississippi,united states of america,north america"
6: "dave sherwood"
7: "marianna parragahavana"
]
ai_org: null
ai_summary: "The U.S. has cut off Venezuelan oil exports to Cuba, threatening tariffs on any other country sendi..."
duplicate: true
}
32: {
article_id: "7f05c431317656eebebd288377f20d98"
link: "https://nypost.com/2026/03/30/business/feds-powell-says-no-need-to-hike-interest-rates-now-official..."
title: "Fed’s Powell says no need to hike interest rates now — officials should look past higher energy pri..."
description: "Federal Reserve Chair Jerome Powell said during a Harvard University event Monday that policymakers..."
content: "Federal Reserve Chair Jerome Powell said Monday that policymakers should look past rising energy pr..."
keywords: [
0: "interest rates"
1: "jerome powell"
2: "federal reserve"
3: "nypost"
]
creator: [
0: "taylor herzlich"
]
language: "english"
country: [
0: "united states of america"
]
category: [
0: "business"
1: "top"
]
datatype: "news"
pubDate: "2026-03-30 20:18:59"
pubDateTZ: "UTC"
fetched_at: "2026-03-30 20:31:45"
image_url: "https://nypost.com/wp-content%2Fuploads%2Fsites%2F2%2F2026%2F03%2F2026-cambridge-massachusetts-one-..."
video_url: null
source_id: "nypost"
source_name: "New York Post"
source_priority: 643
source_url: "https://nypost.com"
source_icon: "https://n.bytvi.com/nypost.png"
sentiment: "positive"
sentiment_stats: {
negative: 0.06
neutral: 36.89
positive: 63.05
}
ai_tag: [
0: "energy"
]
ai_region: null
ai_org: [
0: "harvard university"
1: "federal reserve"
]
ai_summary: null
duplicate: true
}
33: {
article_id: "b374e444a8bea461975adcf4a8d3edd5"
link: "https://www.thestreet.com/video/a-market-pullback-is-coming-heres-where-smart-moneys-moving"
title: "A market pullback is coming— Here’s where smart money’s moving"
description: "Ron Insana, CEO, Insana Information Partners lays out the biggest market risks and how smart money ..."
content: "Transcript: Caroline Woods Joining me now to kick off the week is Ron Insana, CEO of Insana Informa..."
keywords: null
creator: null
language: "english"
country: [
0: "united states of america"
]
category: [
0: "business"
]
datatype: "multimedia"
pubDate: "2026-03-30 20:16:53"
pubDateTZ: "UTC"
fetched_at: "2026-03-30 20:31:58"
image_url: "https://www.thestreet.com/.image/c_fit%2Ch_800%2Cw_1200/NDA6MDAwMDAwMDAyODQ1Mzkz/new-york-new-york-..."
video_url: null
source_id: "thestreet"
source_name: "Thestreet"
source_priority: 3528
source_url: "https://www.thestreet.com"
source_icon: "https://n.bytvi.com/thestreet.png"
sentiment: "neutral"
sentiment_stats: {
negative: 0.22
neutral: 98.54
positive: 1.24
}
ai_tag: [
0: "startups & entrepreneurship"
]
ai_region: null
ai_org: [
0: "caroli"
1: "insana information partners"
]
ai_summary: "The article discusses the potential global economic impact of the ongoing war, including possible s..."
duplicate: false
}
34: {
article_id: "693a5a53c5fa7ff6b69eee255740bf8d"
link: "https://www.globenewswire.com/news-release/2026/03/30/3265017/0/en/Image-Sensing-Systems-Inc-Expand..."
title: "Image Sensing Systems, Inc. Expands Agreement with Econolite Control Products, Inc, Strengthens Par..."
description: "MINNEAPOLIS, March 30, 2026 (GLOBE NEWSWIRE) -- Image Sensing Systems, Inc. (“ISNS”), a wholly owne..."
content: "MINNEAPOLIS, March 30, 2026 (GLOBE NEWSWIRE) -- Image Sensing Systems, Inc. (“ISNS”), a wholly owne..."
keywords: [
0: "autoscope technologies corporation"
]
creator: [
0: "autoscope technologies corporation"
]
language: "english"
country: [
0: "united states of america"
]
category: [
0: "business"
]
datatype: "news"
pubDate: "2026-03-30 20:10:00"
pubDateTZ: "UTC"
fetched_at: "2026-03-30 20:31:49"
image_url: null
video_url: null
source_id: "globenewswire"
source_name: "Globe Newswire"
source_priority: 7268
source_url: "https://www.globenewswire.com"
source_icon: "https://n.bytvi.com/globenewswire.jpg"
sentiment: "positive"
sentiment_stats: {
negative: 0.02
neutral: 0.24
positive: 99.74
}
ai_tag: null
ai_region: null
ai_org: [
0: "econolite control products, inc"
1: "image sensing systems, inc"
2: "strengthens partnership minneapolis"
]
ai_summary: null
duplicate: true
}
35: {
article_id: "ec1c30b8a1d692762140b54d8c54d339"
link: "https://www.globenewswire.com/fr/news-release/2026/03/30/3265017/0/en/Image-Sensing-Systems-Inc-Exp..."
title: "Image Sensing Systems, Inc. Expands Agreement with Econolite Control Products, Inc, Strengthens Par..."
description: "MINNEAPOLIS, March 30, 2026 (GLOBE NEWSWIRE) -- Image Sensing Systems, Inc. (“ISNS”), a wholly owne..."
content: "MINNEAPOLIS, March 30, 2026 (GLOBE NEWSWIRE) -- Image Sensing Systems, Inc. (“ISNS”), a wholly owne..."
keywords: [
0: "autoscope technologies corporation"
]
creator: [
0: "autoscope technologies corporation"
]
language: "english"
country: [
0: "france"
]
category: [
0: "top"
]
datatype: "news"
pubDate: "2026-03-30 20:10:00"
pubDateTZ: "UTC"
fetched_at: "2026-03-30 20:35:01"
image_url: null
video_url: null
source_id: "globenewswire_fr"
source_name: "Globenewswire_fr"
source_priority: 2022
source_url: "https://www.globenewswire.com"
source_icon: "https://n.bytvi.com/globenewswire_fr.jpg"
sentiment: "positive"
sentiment_stats: {
negative: 0.02
neutral: 0.24
positive: 99.74
}
ai_tag: null
ai_region: null
ai_org: [
0: "econolite control products, inc"
1: "strengthens partnership minneapolis"
2: "image sensing systems, inc"
]
ai_summary: "Autoscope Technologies Corporation, based in Minneapolis, Minnesota, is a global company focused on..."
duplicate: false
}
36: {
article_id: "99e6f81ff8db8d2d03f9ff2c44d4df23"
link: "https://www.rawstory.com/trump-economy-2676639593/"
title: "Trump just earned an economic title he'll never brag about"
description: "Friends, When he ran for president again in 2024, Trump made three promises to the American public:..."
content: "Friends, When he ran for president again in 2024, Trump made three promises to the American public:..."
keywords: null
creator: [
0: "robert reich"
]
language: "english"
country: [
0: "united states of america"
]
category: [
0: "business"
1: "top"
]
datatype: "news"
pubDate: "2026-03-30 20:08:28"
pubDateTZ: "UTC"
fetched_at: "2026-03-30 21:49:59"
image_url: "https://www.rawstory.com/media-library/u-s-president-donald-trump-walks-as-he-heads-to-marine-one-t..."
video_url: null
source_id: "rawstory"
source_name: "Raw Story"
source_priority: 3224
source_url: "https://www.rawstory.com"
source_icon: "https://n.bytvi.com/rawstory.png"
sentiment: "positive"
sentiment_stats: {
negative: 5.81
neutral: 13.89
positive: 80.3
}
ai_tag: [
0: "economy"
]
ai_region: null
ai_org: null
ai_summary: "The article criticizes President Trump for his economic policies, claiming he caused job losses, ta..."
duplicate: false
}
37: {
article_id: "ffddd2b23b83a726d626f44ef0970ee5"
link: "https://www.forbes.com/sites/alisondurkee/2026/03/30/major-businesses-still-increasing-prices-becau..."
title: "Major Businesses Still Increasing Prices Because Of Trump’s Tariffs, Survey Finds"
description: "More than half of businesses said they plan to increase prices by at least 15% over the next six mo..."
content: "Topline Companies are increasingly passing the cost of President Donald Trump’s tariffs on to consu..."
keywords: [
0: "tariffs"
1: "tariff price increases"
2: "tariff impact on consumers"
3: "kpmg"
4: "companies respond to tariffs"
5: "tariff refunds"
6: "donald trump"
7: "supreme court"
8: "companies raising prices tariffs"
9: "higher prices"
]
creator: [
0: "alison durkee"
]
language: "english"
country: [
0: "united states of america"
]
category: [
0: "politics"
1: "crime"
2: "business"
]
datatype: "news"
pubDate: "2026-03-30 20:08:08"
pubDateTZ: "UTC"
fetched_at: "2026-03-30 20:31:52"
image_url: "https://imageio.forbes.com/specials-images/imageserve/69ab00bec105b60fd8db2c5f/0x0.jpg"
video_url: null
source_id: "forbes"
source_name: "Forbes"
source_priority: 154
source_url: "https://www.forbes.com"
source_icon: "https://n.bytvi.com/forbes.png"
sentiment: "negative"
sentiment_stats: {
negative: 85.17
neutral: 14.7
positive: 0.13
}
ai_tag: [
0: "economy"
]
ai_region: null
ai_org: null
ai_summary: null
duplicate: false
}
38: {
article_id: "dd96a03d9797c7091fd356f89e38068b"
link: "https://www.benzinga.com/pressreleases/26/03/g51552591/beeline-reports-127-revenue-growth-and-impro..."
title: "Beeline Reports 127% Revenue Growth and Improved Loan Economics"
description: "Revenue growth expected to accelerate in 2026 Management to host conference call today at 5 p.m. ET..."
content: "Revenue growth expected to accelerate in 2026 Management to host conference call today at 5 p.m. ET..."
keywords: [
0: ""pageisbzpro: bz""
1: ""cms: drupal""
2: ""category: earnings""
3: ""category: press releases""
4: ""symbol: blne""
]
creator: [
0: "globe newswire"
]
language: "english"
country: [
0: "united states of america"
]
category: [
0: "business"
]
datatype: "news"
pubDate: "2026-03-30 20:05:00"
pubDateTZ: "UTC"
fetched_at: "2026-03-30 20:33:18"
image_url: "https://cdn.benzinga.com/files/imagecache/bz2_opengraph_meta_image_400x300/sites/all/themes/bz2/ima..."
video_url: null
source_id: "benzinga"
source_name: "Benzinga"
source_priority: 2050
source_url: "https://www.benzinga.com"
source_icon: "https://n.bytvi.com/benzinga.png"
sentiment: "positive"
sentiment_stats: {
negative: 0.02
neutral: 0.76
positive: 99.22
}
ai_tag: [
0: "banking and finance"
]
ai_region: null
ai_org: null
ai_summary: "Beeline, a company focused on digital mortgage origination, AI-driven financial infrastructure, and..."
duplicate: true
}
39: {
article_id: "88340223a625b3189779fd17fae26e51"
link: "https://www.globenewswire.com/fr/news-release/2026/03/30/3265005/0/en/Beeline-Reports-127-Revenue-G..."
title: "Beeline Reports 127% Revenue Growth and Improved Loan Economics"
description: "Revenue growth expected to accelerate in 2026"
content: "Revenue growth expected to accelerate in 2026 Management to host conference call today at 5 p.m. ET..."
keywords: [
0: "#beeline"
1: "#blne"
2: "beeline holdings"
3: "nasdaq: blne"
4: "beelineequity"
5: "inc."
6: "beeline holdings inc."
]
creator: [
0: "beeline holdings inc."
]
language: "english"
country: [
0: "france"
]
category: [
0: "business"
]
datatype: "news"
pubDate: "2026-03-30 20:05:00"
pubDateTZ: "UTC"
fetched_at: "2026-03-30 20:06:42"
image_url: null
video_url: null
source_id: "globenewswire_fr"
source_name: "Globenewswire_fr"
source_priority: 2022
source_url: "https://www.globenewswire.com"
source_icon: "https://n.bytvi.com/globenewswire_fr.jpg"
sentiment: "positive"
sentiment_stats: {
negative: 0.06
neutral: 2.56
positive: 97.38
}
ai_tag: [
0: "banking and finance"
1: "financial markets"
]
ai_region: null
ai_org: null
ai_summary: "Beeline, a company that transitioned to public status in 2025, has strengthened its balance sheet b..."
duplicate: false
}
40: {
article_id: "6a0e6843f2a2381ac46c771515647e88"
link: "https://www.benzinga.com/pressreleases/26/03/g51552335/sangamo-therapeutics-reports-recent-business..."
title: "Sangamo Therapeutics Reports Recent Business Highlights And Fourth Quarter And Full Year 2025 Finan..."
description: "Announced in June, positive topline results from registrational STAAR study in Fabry disease, inclu..."
content: "Announced in June, positive topline results from registrational STAAR study in Fabry disease, inclu..."
keywords: [
0: ""category: press releases""
1: ""category: general""
2: ""category: earnings""
3: ""symbol: sgmo""
4: ""cms: drupal""
5: ""pageisbzpro: bz""
6: ""category: biotech""
]
creator: [
0: "globe newswire"
]
language: "english"
country: [
0: "united states of america"
]
category: [
0: "business"
]
datatype: "news"
pubDate: "2026-03-30 20:01:00"
pubDateTZ: "UTC"
fetched_at: "2026-03-30 20:04:48"
image_url: "https://cdn.benzinga.com/files/imagecache/bz2_opengraph_meta_image_400x300/sites/all/themes/bz2/ima..."
video_url: null
source_id: "benzinga"
source_name: "Benzinga"
source_priority: 2050
source_url: "https://www.benzinga.com"
source_icon: "https://n.bytvi.com/benzinga.png"
sentiment: "positive"
sentiment_stats: {
negative: 0.01
neutral: 0.16
positive: 99.83
}
ai_tag: [
0: "corporate news"
1: "financial markets"
]
ai_region: [
0: "fabry"
]
ai_org: [
0: "sangamo therapeutics"
]
ai_summary: null
duplicate: true
}
41: {
article_id: "9df2431ca7d76dae68e22a324e5c0f37"
link: "https://www.globenewswire.com/fr/news-release/2026/03/30/3264991/33816/en/Sangamo-Therapeutics-Repo..."
title: "Sangamo Therapeutics Reports Recent Business Highlights And Fourth Quarter And Full Year 2025 Finan..."
description: "Sangamo Therapeutics reports recent business highlights and fourth quarter and full year 2025 finan..."
content: "Announced in June, positive topline results from registrational STAAR study in Fabry disease, inclu..."
keywords: [
0: "biotechnology"
1: "sangamo therapeutics"
2: "neurology"
3: "inc."
4: "earnings"
5: "sangamo"
6: "fabry"
]
creator: [
0: "sangamo therapeutics"
1: "inc."
]
language: "english"
country: [
0: "france"
]
category: [
0: "business"
]
datatype: "news"
pubDate: "2026-03-30 20:01:00"
pubDateTZ: "UTC"
fetched_at: "2026-03-30 20:04:25"
image_url: null
video_url: null
source_id: "globenewswire_fr"
source_name: "Globenewswire_fr"
source_priority: 2022
source_url: "https://www.globenewswire.com"
source_icon: "https://n.bytvi.com/globenewswire_fr.jpg"
sentiment: "positive"
sentiment_stats: {
negative: 0.05
neutral: 48.87
positive: 51.08
}
ai_tag: [
0: "corporate news"
]
ai_region: null
ai_org: [
0: "sangamo therapeutics"
]
ai_summary: "Sangamo Therapeutics, Inc. announced significant pipeline progress in 2025, including advancements ..."
duplicate: false
}
42: {
article_id: "42fe9e4153eeb6bf41de1b400fa74123"
link: "https://www.thestreet.com/automotive/gm-makes-drastic-decision-pickup-lovers-will-enjoy"
title: "GM makes drastic decision pickup lovers will enjoy"
description: "Rising gas prices won't stop GM from making this move."
content: "Truck lovers showed a lot of resilience in 2025, buying up pickups despite tariffs, supply chain is..."
keywords: null
creator: null
language: "english"
country: [
0: "united states of america"
]
category: [
0: "business"
]
datatype: "news"
pubDate: "2026-03-30 20:00:00"
pubDateTZ: "UTC"
fetched_at: "2026-03-30 20:31:58"
image_url: "https://www.thestreet.com/.image/c_fit%2Ch_800%2Cw_1200/NDA6MDAwMDAwMDAyOTI2NTc3/auto_assembly_line..."
video_url: null
source_id: "thestreet"
source_name: "Thestreet"
source_priority: 3528
source_url: "https://www.thestreet.com"
source_icon: "https://n.bytvi.com/thestreet.png"
sentiment: "positive"
sentiment_stats: {
negative: 0.09
neutral: 0.28
positive: 99.63
}
ai_tag: [
0: "automotive"
]
ai_region: null
ai_org: [
0: "gm"
]
ai_summary: null
duplicate: false
}
43: {
article_id: "7727d61bdd5dd1e594aa9e5eb601fc45"
link: "https://www.benzinga.com/pressreleases/26/03/g51550885/pins-deadline-alert-faruqi-faruqi-llp-remind..."
title: "PINS DEADLINE ALERT: Faruqi & Faruqi, LLP Reminds Pinterest (PINS) Investors of Securities Class Ac..."
description: "Faruqi & Faruqi, LLP Securities Litigation Partner James (Josh) Wilson Encourages Investors Who Suf..."
content: "Faruqi & Faruqi, LLP Securities Litigation Partner James (Josh) Wilson Encourages Investors Who Suf..."
keywords: [
0: ""pageisbzpro: bz""
1: ""cms: drupal""
2: ""category: legal""
3: ""category: press releases""
4: ""category: news""
5: ""symbol: pins""
]
creator: [
0: "globe newswire"
]
language: "english"
country: [
0: "united states of america"
]
category: [
0: "business"
1: "top"
]
datatype: "news"
pubDate: "2026-03-30 19:19:19"
pubDateTZ: "UTC"
fetched_at: "2026-03-30 19:32:14"
image_url: "https://cdn.benzinga.com/files/imagecache/bz2_opengraph_meta_image_400x300/sites/all/themes/bz2/ima..."
video_url: null
source_id: "benzinga"
source_name: "Benzinga"
source_priority: 2050
source_url: "https://www.benzinga.com"
source_icon: "https://n.bytvi.com/benzinga.png"
sentiment: "neutral"
sentiment_stats: {
negative: 9.48
neutral: 88.21
positive: 2.31
}
ai_tag: [
0: "financial markets"
]
ai_region: null
ai_org: [
0: "llp securities litigation partner james"
1: "faruqi & faruqi, llp reminds pinterest"
]
ai_summary: "A legal complaint alleges that Pinterest violated federal securities laws by making false statement..."
duplicate: false
}
44: {
article_id: "0c8ae7fcd60fdb0cb038431a368ce11b"
link: "https://www.globenewswire.com/fr/news-release/2026/03/30/3264931/683/en/PINS-DEADLINE-ALERT-Faruqi-..."
title: "PINS DEADLINE ALERT: Faruqi & Faruqi, LLP Reminds Pinterest (PINS) Investors of Securities Class Ac..."
description: "Faruqi & Faruqi, LLP Securities Litigation Partner James (Josh) Wilson Encourages Investors Who Suf..."
content: "Faruqi & Faruqi, LLP Securities Litigation Partner James (Josh) Wilson Encourages Investors Who Suf..."
keywords: [
0: "faruqi & faruqi llp"
1: "pinterest"
2: "class action lawsuit"
3: "nyse"
4: "pins"
5: "faruqi law"
6: "class action"
7: "faruqi & faruqi"
]
creator: [
0: "faruqi & faruqi llp"
]
language: "english"
country: [
0: "france"
]
category: [
0: "business"
]
datatype: "news"
pubDate: "2026-03-30 19:19:00"
pubDateTZ: "UTC"
fetched_at: "2026-03-30 19:33:17"
image_url: null
video_url: null
source_id: "globenewswire_fr"
source_name: "Globenewswire_fr"
source_priority: 2022
source_url: "https://www.globenewswire.com"
source_icon: "https://n.bytvi.com/globenewswire_fr.jpg"
sentiment: "neutral"
sentiment_stats: {
negative: 9.48
neutral: 88.21
positive: 2.31
}
ai_tag: [
0: "financial markets"
]
ai_region: null
ai_org: [
0: "llp securities litigation partner james"
1: "faruqi & faruqi, llp reminds pinterest"
]
ai_summary: "A class action lawsuit alleges that Pinterest violated federal securities laws by making false or m..."
duplicate: true
}
45: {
article_id: "8da434874774f8fa9723f56c0b1fef65"
link: "https://au.investing.com/news/economy-news/powell-says-fed-can-wait-and-see-how-war-affects-inflati..."
title: "Powell says Fed can ’wait and see’ how war affects inflation"
description: "Powell says Fed can ’wait and see’ how war affects inflation"
content: "Wall Street mixed as tentative rebound from earlier in the session peters out By Dan Burns CAMBRIDG..."
keywords: null
creator: [
0: "investing.com"
]
language: "english"
country: [
0: "australia"
]
category: [
0: "business"
]
datatype: "news"
pubDate: "2026-03-30 18:38:27"
pubDateTZ: "UTC"
fetched_at: "2026-03-30 19:03:20"
image_url: "https://i-invdn-com.investing.com/trkd-images/LYNXMPEM2T0HO_L.jpg"
video_url: null
source_id: "investing_au"
source_name: "Investing Australia"
source_priority: 1205
source_url: "https://au.investing.com"
source_icon: "https://n.bytvi.com/investing_au.jpg"
sentiment: "neutral"
sentiment_stats: {
negative: 8.06
neutral: 90.79
positive: 1.15
}
ai_tag: [
0: "financial markets"
1: "economy"
]
ai_region: [
0: "wall street"
]
ai_org: [
0: "fed"
]
ai_summary: "Federal Reserve Chairman Powell discusses inflation, interest rates, and the potential impact of ta..."
duplicate: true
}
46: {
article_id: "9bbf797da309f06b2221eac560f9217c"
link: "https://www.abc.net.au/news/2026-03-31/iran-war-economic-pressure-builds-on-global-stock-markets/10..."
title: "Insiders profit as pressure points build on global economy"
description: "Global stock markets, which for the past month have been remarkably restrained as the Middle East c..."
content: "Winners are thin on the ground right now. In a case of rather unfortunate timing, US President Dona..."
keywords: [
0: "strait of hormuz"
1: "energy crisis"
2: "middle east"
3: "fuel excise"
4: "economic indicators"
5: "iran war"
6: "black swan event"
7: "donald trump"
8: "brent crude"
]
creator: [
0: "ian verrender"
]
language: "english"
country: [
0: "australia"
]
category: [
0: "business"
1: "top"
]
datatype: "news"
pubDate: "2026-03-30 18:36:13"
pubDateTZ: "UTC"
fetched_at: "2026-03-30 19:02:10"
image_url: "https://live-production.wcms.abc-cdn.net.au/d6f8010f90113d432cdd7274854a2b72?impolicy=wcms_crop_res..."
video_url: null
source_id: "abc_net"
source_name: "Abc"
source_priority: 3795
source_url: "https://www.abc.net.au"
source_icon: "https://n.bytvi.com/abc_net.png"
sentiment: "negative"
sentiment_stats: {
negative: 66.34
neutral: 32.47
positive: 1.19
}
ai_tag: [
0: "financial markets"
1: "economy"
]
ai_region: [
0: "middle east"
]
ai_org: null
ai_summary: "The article discusses the impact of the Iran crisis on global markets, with a focus on the decline ..."
duplicate: false
}
47: {
article_id: "992b78c56a3966ce737da326d0faf256"
link: "https://timesofindia.indiatimes.com/world/us/five-alarm-fire-megyn-kelly-shocked-at-trumps-lowest-a..."
title: "'Five alarm fire': Megyn Kelly shocked at Trump's lowest approval rating; 'We need to get out of Ir..."
description: "'Five alarm fire': Megyn Kelly shocked at Trump's lowest approval rating; 'We need to get out of Ir..."
content: "Conservative commentator Megyn Kelly who has been strongly condemning President Donald Trump's war ..."
keywords: [
0: "trump approval rating"
1: "trump approval rating umass"
2: "trump approval rating after iran"
3: "trump approval rating today"
4: "trump approval rating amherst"
5: "us iran war"
]
creator: [
0: "toi world desk"
]
language: "english"
country: [
0: "india"
]
category: [
0: "politics"
1: "top"
]
datatype: "news"
pubDate: "2026-03-30 18:23:26"
pubDateTZ: "UTC"
fetched_at: "2026-03-30 18:31:56"
image_url: "https://static.toiimg.com/thumb/resizemode-4,width-1280,height-720,msid-129909172/129909172.jpg"
video_url: null
source_id: "toi"
source_name: "The Times Of India"
source_priority: 2178
source_url: "https://timesofindia.indiatimes.com"
source_icon: "https://n.bytvi.com/toi.png"
sentiment: "negative"
sentiment_stats: {
negative: 96.06
neutral: 3.79
positive: 0.15
}
ai_tag: [
0: "politics"
]
ai_region: [
0: "iran,asia"
]
ai_org: [
0: "trump"
]
ai_summary: "A poll indicates a majority of Americans disapprove of President Trump's handling of the economy, p..."
duplicate: false
}
48: {
article_id: "4cec40db9fd4cf09a466df6e392fc2b9"
link: "https://dailycaller.com/2026/03/30/supreme-court-soon-to-consider-who-gets-to-be-an-american-citize..."
title: "Supreme Court Soon To Consider Who Gets To Be An American Citizen"
description: "'Selling citizenships to our Country'"
content: "The Supreme Court will hear a case Wednesday that could reshape what it means to be an American cit..."
keywords: [
0: "birthright-citizenship"
1: "supreme-court"
2: "trump-administration"
]
creator: [
0: "katelynn richardson"
]
language: "english"
country: [
0: "united states of america"
]
category: [
0: "politics"
1: "top"
]
datatype: "news"
pubDate: "2026-03-30 18:19:07"
pubDateTZ: "UTC"
fetched_at: "2026-03-30 18:31:43"
image_url: "https://images.dailycaller.com/image/width=1280,height=549,fit=cover,format=webp,f=auto/https%3A%2F..."
video_url: null
source_id: "dailycaller"
source_name: "Dailycaller"
source_priority: 8605
source_url: "https://dailycaller.com"
source_icon: "https://n.bytvi.com/dailycaller.png"
sentiment: "neutral"
sentiment_stats: {
negative: 3.14
neutral: 94.85
positive: 2.01
}
ai_tag: [
0: "politics"
]
ai_region: null
ai_org: [
0: "supreme court"
]
ai_summary: "The text appears to be a collection of legal and historical references to citizenship, immigration,..."
duplicate: false
}
49: {
article_id: "70b3c2e59ea81b0a7d146ab435f1f47d"
link: "https://www.bostonherald.com/2026/03/30/federal-reserve-powell-harvard/"
title: "Powell says Fed is monitoring energy price spikes, but that it’s limited in what it can do"
description: "Powell spoke to Harvard students, acknowledging young graduates were entering a challenging job mar..."
content: "By MICHAEL CASEY CAMBRIDGE, Mass. (AP) — Federal Reserve Chair Jerome Powell said Monday that it is..."
keywords: [
0: "education"
1: "network"
2: "iran"
3: "business"
4: "donald trump"
5: "nation"
]
creator: [
0: "associated press"
]
language: "english"
country: [
0: "united states of america"
]
category: [
0: "business"
]
datatype: "news"
pubDate: "2026-03-30 18:17:57"
pubDateTZ: "UTC"
fetched_at: "2026-03-30 18:32:14"
image_url: "https://www.bostonherald.com/wp-content/uploads/2026/03/Jerome_Powell_Harvard_663_6-1-1.jpg?w=1400p..."
video_url: null
source_id: "bostonherald"
source_name: "Boston Herald"
source_priority: 9319
source_url: "https://www.bostonherald.com"
source_icon: "https://n.bytvi.com/bostonherald.jpg"
sentiment: "neutral"
sentiment_stats: {
negative: 5.41
neutral: 94.41
positive: 0.18
}
ai_tag: [
0: "economy"
]
ai_region: [
0: "mi"
]
ai_org: [
0: "fed"
]
ai_summary: "Federal Reserve Chair Jerome Powell addresses students at Harvard University, discussing economic c..."
duplicate: true
}
]
nextPage: "1774894677564903979"
}
2.News for domain BBC

https://newsdata.io/api/1/latest?apikey=pub_97dd70200c904bdebbc400249e37ee6f&domain=bbc

3. News for Category Science

https://newsdata.io/api/1/latest?apikey=pub_97dd70200c904bdebbc400249e37ee6f&category=science

To dive deeper with practical examples visit - Get Latest News using NewsData.io "News" Endpoint: In Detail
