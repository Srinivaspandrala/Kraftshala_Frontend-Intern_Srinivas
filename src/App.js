import React, { Component } from 'react';
import './App.css';

const API_KEY = '080874c7874d6d1a8b45b882be0a9022';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      weather: null,
      isDarkMode: false,
      loading: false,
      error: ''
    };
  }

  componentDidMount() {
    this.getCurrentLocation();
  }

  getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => this.fetchWeather(coords.latitude, coords.longitude),
        () => this.setState({ error: 'Unable to retrieve location.' })
      );
    } else {
      this.setState({ error: 'Geolocation is not supported by this browser.' });
    }
  };

  fetchWeather = async (lat, lon) => {
    this.setState({ loading: true, error: '' });
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch weather data.');
      const data = await response.json();
      this.setState({ weather: data, loading: false });
    } catch (error) {
      this.setState({ error: error.message, loading: false });
    }
  };

  fetchWeatherByCity = async (e) => {
    e.preventDefault();
    const city = e.target.elements.city.value.trim();
    if (!city) return;

    this.setState({ loading: true, error: '' });

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('City not found.');
      const data = await response.json();
      this.setState({ weather: data, loading: false });
    } catch (error) {
      this.setState({ error: error.message, loading: false });
    }

    e.target.reset();
  };

  toggleTheme = () => {
    this.setState(
      prevState => ({ isDarkMode: !prevState.isDarkMode }),
      () => document.body.classList.toggle('dark-mode', this.state.isDarkMode)
    );
  };

  render() {
    const { weather, isDarkMode, loading, error } = this.state;

    return (
      <div className={`App ${isDarkMode ? 'dark-mode' : ''}`}>
        <header className="App-header">
          <div className="header-content">
            <img
              src="https://i.pinimg.com/originals/77/0b/80/770b805d5c99c7931366c2e84e88f251.png"
              alt="weather-app"
              className="logo"
            />
            <h1>Weather App</h1>
          </div>
        </header>

        <main>
          <form onSubmit={this.fetchWeatherByCity}>
            <input type="text" name="city" placeholder="Enter city name" required />
            <button type="submit">Search</button>
          </form>

          <button className="toggle-btn" onClick={this.toggleTheme}>
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>

          {loading && <p className="loading">Loading weather data...</p>}
          {error && <p className="error">{error}</p>}

          {weather && (
            <div className="weather-info">
              <h2 className="city-heading-style">
                <img
                  src="https://img.icons8.com/?size=100&id=0rhd6SF82e8Y&format=png&color=000000"
                  alt="location"
                />
                {weather.name}
              </h2>
              <div className="air-combination-style">
                <p>
                  <img src="https://img.icons8.com/?size=100&id=52585&format=png&color=000000" alt="temperature" />
                  {weather.main.temp}°C
                </p>
                <p>
                  <img src="https://img.icons8.com/?size=100&id=48189&format=png&color=000000" alt="time" />
                  {new Date(weather.dt * 1000).toLocaleString()}
                </p>
                <p>
                  <img src="https://img.icons8.com/?size=100&id=21754&format=png&color=000000" alt="description" />
                  {weather.weather[0].description}
                </p>
                <p>
                  <img src="https://img.icons8.com/?size=100&id=32604&format=png&color=000000" alt="humidity" />
                  {weather.main.humidity}%
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }
}

export default App;
