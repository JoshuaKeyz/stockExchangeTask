# stockExchangeTask
This is a multithreaded NodeJS application which implements the REST API for a stock exchange app, where users can buy stocks online.
The Idea of the app is that, there are different countries, like USA, Russia France and India, different categories of stocks, like IT, FINANCE and Automobile, prices for the stocks and the overall budget of the selling companies. And each user goes to the API specifying the Country to buy stocks from, (e.g US, RU, IN, FR) and the category of stocks they want to buy (e.g automobile, finance, it) and the amount they are willing to pay for the stock. Then the API simply responds back to the users if the stocks are available depending on the criteria's specified by the users and the amount of bids left. 

So the client applications interact with this back end using a specified URL pattern of [server_addr]/?countrycode=[country_code]&category=[category]&basebid=[base_bid]

The REST API also implements logging of the requests pattern in the console and in the log file logs/logs.txt

# Running the REST API
To run this example, go to the folder and enter "node index.js"
