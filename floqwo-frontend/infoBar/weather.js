import { getDefaultIcon } from './utils.js';
import { apiUrl } from '../api.js'; // Now apiUrl can be used throughout this file without errors

export async function updateWeatherForecast() {
  const token = localStorage.getItem('token');
  const response = await fetch(`${apiUrl}/weather-key`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!response.ok) {
    console.error('Failed to fetch the API key');
    return;
  }

  const { key: apiKey } = await response.json();
  const fetchForecast = async (latitude, longitude) => {
    try {
      const url = `https://api.tomorrow.io/v4/timelines?location=${latitude},${longitude}&fields=weatherCode,temperature&timesteps=1h&units=metric&apikey=${apiKey}`;
      const response = await fetch(url);

      if (!response.ok) throw new Error('Failed to fetch weather forecast');

      const data = await response.json();
      const currentWeather = data.data.timelines[0].intervals[0].values.weatherCode;
      const currentTemperature = data.data.timelines[0].intervals[0].values.temperature;
      const twoHourForecast = data.data.timelines[0].intervals[2]?.values.weatherCode || null;
      const sixHourForecast = data.data.timelines[0].intervals[6]?.values.weatherCode || null;

      const weatherIcons = { /*...icon mappings...*/ };
      const formatWeatherIcon = code => `<img src="svg/${weatherIcons[code] || getDefaultIcon()}" width="20" alt="Weather icon">`;

      document.getElementById('weather-forecast').innerHTML = `${formatWeatherIcon(currentWeather)} <span class="temperature">${Math.round(currentTemperature)}°C</span> ${formatWeatherIcon(twoHourForecast)} ${formatWeatherIcon(sixHourForecast)}`;
    } catch (error) {
      console.error('Error fetching weather forecast:', error);
      document.getElementById('weather-forecast').innerHTML = `<img src="svg/${getDefaultIcon()}" width="20" alt="Default weather icon">`;
    }
  };

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => fetchForecast(position.coords.latitude, position.coords.longitude),
      error => console.error('Error with Geolocation:', error.message)
    );
  } else {
    console.error('Geolocation not supported by this browser.');
  }
}
