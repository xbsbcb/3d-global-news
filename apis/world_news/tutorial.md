Using the API
For this tutorial, we will be using the worldnewsapi Python SDK. Refer to our SDK Page if you are interested to try the API in another language.

Installing the SDK
To install the SDK, execute the following commands:

pip install worldnewsapi


We have installed the worldnewsapi SDK for Python and required dependencies!

Making your First Request
Now that the SDK has been successfully installed, let’s test it out to see if we can successfully fetch some news.

Let's use the search_news function to search for news which contain the word "football" in the UK.

Step 1. Import the SDK
import worldnewsapi
from worldnewsapi.rest import ApiException
The imports are as follows:

worldnewsapi: The SDK itself
worldnewsapi.rest.ApiException: API Exception Object for exception handling
Step 2. Initialize Configuration
Initialize the API configuration and set the API key with:

newsapi_configuration = worldnewsapi.Configuration(api_key={'apiKey': <YOUR_API_KEY>})
Replace <YOUR_API_KEY> with the API key you obtained above.

Step 3. Instantiate an object of NewsAPI & start search
try:
    newsapi_instance = worldnewsapi.NewsApi(worldnewsapi.ApiClient(newsapi_configuration))

    response = newsapi_instance.search_news(
            text='football',
            source_country='gb',
            language='en',
            earliest_publish_date='2024-07-01',
            latest_publish_date='2024-07-17',
            categories='sports',
            sort="publish-time",
            sort_direction="desc",
            min_sentiment=-0.8,
            max_sentiment=0.8,
            offset=0,
            number=10)

except ApiException as e:
    print("Exception when calling NewsApi->search_news: %s\n" % e)
Basically, we will be searching for news which contain the word football in the UK(source_country:'gb') in English language. The news will have its sentiment between -0.8 and 0.8. It will be published between 2022-04-22 and 2024-05-05. There will be a total of 10 fetched such news articles.

You can set text to an empty string to limit the filtering to the other parameters.

Refer to the parameters of search_news for more details.

Step 4. Process response
Now we can process the response and output the retrieved data:

for article in all_results:
    print("\nTitle: " + str(article.title))
    print("Authors: " + str(article.authors))
    print("URL: " + str(article.url))
    print("Sentiment: " + str(article.sentiment))
    print("Text: " + str(article.text[:80]) + "...") # print first 80 characters of the text
Step 5. Add paging (optional)
The API will respond with a maximum of 100 articles. If you want to retrieve more, you'll need to add paging to your query.

Your code could look like this:

max_results = 250   # replace with your maximum
offset = 0
all_results = []

while len(all_results) < max_results:

    request_count = min(100, max_results - len(all_results)) # request 100 or the remaining number of articles

    response = newsapi_instance.search_news(
        text='football',
        source_country='gb',
        language='en',
        earliest_publish_date='2024-07-01',
        latest_publish_date='2024-07-17',
        categories='sports',
        sort="publish-time",
        sort_direction="desc",
        min_sentiment=-0.8,
        max_sentiment=0.8,
        offset=offset,
        number=request_count)

    print("Retrieved " + str(len(response.news)) + " articles. Offset: " + str(offset) + "/" + str(max_results) +
    ". Total available: " + str(response.available) + ".")

    if len(response.news) == 0:
        break

    all_results.extend(response.news)
    offset += 100
Full Code
The full code is as follows:

import worldnewsapi

# Initial SDK configuration
newsapi_configuration = worldnewsapi.Configuration(api_key={'apiKey': '<YOUR API KEY>'})

try:
	newsapi_instance = worldnewsapi.NewsApi(worldnewsapi.ApiClient(newsapi_configuration))

	max_results = 250   # replace with your maximum
	offset = 0
	all_results = []

	while len(all_results) < max_results:

		request_count = min(100, max_results - len(all_results)) # request 100 or the remaining number of articles

		response = newsapi_instance.search_news(
			text='football',
			source_country='gb',
			language='en',
			earliest_publish_date='2024-07-01',
			latest_publish_date='2024-07-17',
			categories='sports',
			sort="publish-time",
			sort_direction="desc",
			min_sentiment=-0.8,
			max_sentiment=0.8,
			offset=offset,
			number=request_count)

		print("Retrieved " + str(len(response.news)) + " articles. Offset: " + str(offset) + "/" + str(max_results) +
			  ". Total available: " + str(response.available) + ".")

		if len(response.news) == 0:
			break

		all_results.extend(response.news)
		offset += 100

except worldnewsapi.ApiException as e:
	print("Exception when calling NewsApi->search_news: %s\n" % e)


for article in all_results:
    print("\nTitle: " + str(article.title))
    print("Authors: " + str(article.authors))
    print("URL: " + str(article.url))
    print("Sentiment: " + str(article.sentiment))
    print("Text: " + str(article.text[:80]) + "...") # print first 80 characters of the text
To get the top news for a given day, country, and language, you can run this script

try:
	response = newsapi_instance.top_news(
			source_country='us',
			language='en',
			var_date='2024-06-01',
			headlines_only=False)

except worldnewsapi.ApiException as e:
	print("Exception when calling NewsApi->search_news: %s\n" % e)

for news in response.top_news:
	print ("\n\nNext Cluster ##########################################\n")

	for article in news.news:
		print("Title: " + str(article.title))
		print ("URL: " + str(article.url))
		print("Text: " + str(article.text[:80]) + "...") # print first 80 characters of the text
    
And that's it! You can explore more functionalities such as extracting news links, extracting news from a page and others from Github.

Happy coding.
