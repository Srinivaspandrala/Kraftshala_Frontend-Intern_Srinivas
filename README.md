Introduction
The Weather App is user-friendly application that allows users to check the current weather of the location or any other city worldwide. The app fetches real-time weather data from the OpenWeatherMap API and displays it  with support for both light and dark modes.

Features
Current Location Weather: Automatically fetches and displays the weather for the user's current location.
Search Functionality: Allows users to search for the weather in any city.
Responsive Design: Optimized for both desktop,tablet and mobile devices with different background images.
Dark Mode: Toggle between light and dark themes.
Real-Time Data: Displays real-time weather information including temperature, humidity and Date & Time
Error Handling: Gracefully handles errors such as invalid city names or API errors.
Detailed Weather Information: Provides additional weather details like  Humidity, and weather description.

Technologies 
-React
-CSS
-OpenWeatherMap API

installation:
-cd weather-app
Install dependencies:
-npm install
Run the application:
-npm start

api:https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric
