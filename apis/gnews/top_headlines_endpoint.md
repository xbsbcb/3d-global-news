Top Headlines Endpoint
This endpoint allows you to search for current trending articles, the articles that are selected to be returned by this endpoint are based on the Google News ranking. There are 9 categories available, the default category is "general".

HTTP Request
GET https://gnews.io/api/v4/top-headlines?category=general&apikey=API_KEY

Query Parameters
Parameter Name	Default Value	Description
category	general	This parameter allows you to change the category for the request. The available categories are : general, world, nation, business, technology, entertainment, sports, science and health.
lang	Any	This parameter allows you to specify the language of the news articles returned by the API. You have to set as value the 2 letters code of the language you want to filter.
See the list of supported languages.
country	Any	This setting allows you to filter articles by country. Most articles will come from sources originating in that country, and the others will be relevant to that country. You have to set as value the 2 letters code of the country you want to filter.
See the list of supported countries.
max	10	This parameter allows you to specify the number of news articles returned by the API. The minimum value of this parameter is 1 and the maximum value is 100. The value you can set depends on your subscription.
See the pricing for more information.
nullable	None	This parameter allows you to specify the attributes that you allow to return null values. The attributes that can be set are description, content and image. It is possible to combine several attributes by separating them with a comma.
For example: description,content
from	None	This parameter allows you to filter the articles that have a publication date greater than or equal to the specified value. The date must comply with ISO 8601 format.
For example: 2025-07-18T21:32:58.500Z
to	None	This parameter allows you to filter the articles that have a publication date smaller than or equal to the specified value. The date must comply with ISO 8601 format.
For example: 2025-07-18T21:32:58.500Z
q	None	This parameter allows you to specify your search keywords to find the news articles you are looking for. The keywords will be used to return the most relevant articles. It is possible to use logical operators with keywords, see the section on query syntax. Maximum 200 characters.
page	1	This parameter allows you to control the pagination of the results returned by the API. The paging behavior is closely related to the value of the max parameter. The first page is page 1, then you have to increment by 1 to go to the next page. Let's say that the value of the max parameter is 10, then the first page will contain the first 10 articles returned by the API (articles 1 to 10), page 2 will return the next 10 articles (articles 11 to 20), etc.
For performance reasons, it is not possible to paginate more than 1000 articles.
truncate	None	This parameter allows you to truncate the content attribute. To truncate the content attribute, the parameter must be set to content, as follows:
truncate=content
For users on the free plan, the content attribute is automatically truncated.
If you need to access the full content, you can upgrade your plan here: https://gnews.io/change-plan
