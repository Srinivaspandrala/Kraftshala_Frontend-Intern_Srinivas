import React, { Component } from 'react';
import {
  FaMapMarkerAlt,
  FaTemperatureHigh,
  FaRegClock,
  FaCloud,
  FaTint,
  FaSun,
  FaMoon
} from 'react-icons/fa';
import './App.css';

const API_KEY = '080874c7874d6d1a8b45b882be0a9022';
const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

class App extends Component {
  state = {
    weather: null,
    isDarkMode: false,
    loading: false,
    error: '',
    coords: null,   // { lat, lon } if using geolocation
    city: null      // string if using manual search
  };

  intervalId = null;

  componentDidMount() {
    this.getCurrentLocation();
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  /* ----------  Geolocation ---------- */

  getCurrentLocation = () => {
    if (!navigator.geolocation) {
      this.setState({ error: 'Geolocation is not supported.' });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude: lat, longitude: lon } }) => {
        this.setState({ coords: { lat, lon }, city: null }, () => {
          this.fetchWeather();
          this.startAutoRefresh();
        });
      },
      () => this.setState({ error: 'Unable to retrieve location.' })
    );
  };

  /* ----------  Fetch helpers ---------- */

  buildUrl = () => {
    const { coords, city } = this.state;
    if (coords) {
      const { lat, lon } = coords;
      return `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    }
    return `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
  };

  fetchWeather = async () => {
    this.setState({ loading: true, error: '' });
    try {
      const response = await fetch(this.buildUrl());
      if (!response.ok) throw new Error('Weather data unavailable.');
      const data = await response.json();
      this.setState({ weather: data, loading: false });
    } catch (err) {
      this.setState({ error: err.message, loading: false });
    }
  };

  /* ----------  Real-time refresh ---------- */

  startAutoRefresh = () => {
    clearInterval(this.intervalId);
    this.intervalId = setInterval(this.fetchWeather, REFRESH_INTERVAL);
  };

  /* ----------  Manual search ---------- */

  handleSearch = e => {
    e.preventDefault();
    const city = e.target.elements.city.value.trim();
    if (!city) return;
    this.setState({ city, coords: null }, () => {
      this.fetchWeather();
      this.startAutoRefresh();
    });
    e.target.reset();
  };

  /* ----------  Theme ---------- */

  toggleTheme = () =>
    this.setState(
      s => ({ isDarkMode: !s.isDarkMode }),
      () => document.body.classList.toggle('dark-mode', this.state.isDarkMode)
    );

  /* ----------  Render ---------- */

  render() {
    const { weather, isDarkMode, loading, error } = this.state;

    return (
      <div className={`App ${isDarkMode ? 'dark-mode' : ''}`}>
        <header className="App-header">
          <div className="header-content">
            <img
              className="logo"
              src="https://i.pinimg.com/originals/77/0b/80/770b805d5c99c7931366c2e84e88f251.png"
              alt="logo"
            />
            <h1>Weather App</h1>
          </div>
        </header>

        <main>
          <form onSubmit={this.handleSearch}>
            <input name="city" placeholder="Enter city name" required />
            <button type="submit">Search</button>
          </form>

          <button className="toggle-btn" onClick={this.toggleTheme}>
            {isDarkMode ? <FaSun /> : <FaMoon />} 
            {isDarkMode ? 'Light' : 'Dark'} Mode
          </button>

          {loading && <p className="loading">Loading...</p>}
          {error && <p className="error">{error}</p>}

          {weather && (
            <div className="weather-info">
              <h2 className="city-heading-style">
                <FaMapMarkerAlt /> {weather.name}
              </h2>

              <div className="air-combination-style">
                <p>
                  <FaTemperatureHigh /> {weather.main.temp}°C
                </p>
                <p>
                  <FaRegClock /> {new Date(weather.dt * 1000).toLocaleString()}
                </p>
                <p>
                  <FaCloud /> {weather.weather[0].description}
                </p>
                <p>
                  <FaTint /> {weather.main.humidity}%
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
