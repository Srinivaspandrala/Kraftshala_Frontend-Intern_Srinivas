import React, { Component } from 'react';
import './App.css';

const API_KEY = '080874c7874d6d1a8b45b882be0a9022';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      weather: null,
    isDarkMode: false,
    };
  }

  componentDidMount() {
    this.getCurrentLocation();
  }

  getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this.handleLocationSuccess,
        this.handleLocationError
      );
    } else {
      this.setState({ error: 'Geolocation is not supported by this browser.' });
    }
  };

  handleLocationSuccess = (position) => {
    const { latitude, longitude } = position.coords;
    this.fetchWeatherByCoords(latitude, longitude);
  };

  handleLocationError = () => {
    this.setState({ error: 'Unable to retrieve location.' });
  };

  fetchWeatherByCoords = async (latitude, longitude) => {
    this.setState({ loading: true });
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch weather data for current location.');
      }
      const data = await response.json();
      this.setState({ weather: data, error: '', loading: false });
    } catch (err) {
      this.setState({ error: err.message || 'Failed to fetch weather data. Please try again.', loading: false });
    }
  };

  handleSearch = async (e) => {
    e.preventDefault();
    const city = e.target.elements.city.value;
    this.setState({ loading: true });

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('City not found or other API error');
      }
      const data = await response.json();
      this.setState({ weather: data, error: '', loading: false });
    } catch (err) {
      this.setState({ error: err.message || 'Failed to fetch weather data. Please try again.', loading: false });
    }

    e.target.reset();
  };

  toggleTheme = () => {
    this.setState(prevState => ({
      isDarkMode: !prevState.isDarkMode
    }), () => {
      document.body.classList.toggle('dark-mode', this.state.isDarkMode);
    });
  };

  render() {
    const { weather, isDarkMode } = this.state;

    return (
      <div className={`App ${isDarkMode ? 'dark-mode' : ''}`}>
        <header className="App-header">
          <div className="header-content">
            <img src='https://i.pinimg.com/originals/77/0b/80/770b805d5c99c7931366c2e84e88f251.png' alt='weather-app' className="logo" />
            <h1>Weather App</h1>
          </div>
        </header>

        <main>
          <form onSubmit={this.handleSearch}>
            <input type="text" name="city" placeholder="Enter city name" required />
            <button type="submit">Search</button>
          </form>
          <button onClick={this.toggleTheme}>
            {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          </button>

          

          {weather && (
            <div className="weather-info">
              <h2 className='city-heading-style'>{weather.name}</h2>
              <div className='air-combination-style'>
                <p>Temperature: {weather.main.temp}°C</p>
                <p>Date & Time: {new Date(weather.dt * 1000).toLocaleString()}</p>
                <p>Weather: {weather.weather[0].description}</p>
                <p>Humidity: {weather.main.humidity}%</p>
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }
}

export default App;
