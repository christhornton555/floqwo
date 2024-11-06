import { apiUrl } from '../api.js'; // Now apiUrl can be used throughout this file without errors

export async function updateSunriseSunset() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${apiUrl}/weather-key`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  
    if (!response.ok) {
      console.error('Failed to fetch the API key');
      return;
    }
  
    const { key: apiKey } = await response.json();
    const formatTime = date => `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  
    const fetchSunriseSunset = async (latitude, longitude) => {
      try {
        const url = `https://api.tomorrow.io/v4/timelines?location=${latitude},${longitude}&fields=sunriseTime,sunsetTime&timesteps=1d&units=metric&apikey=${apiKey}`;
        const response = await fetch(url);
  
        if (!response.ok) throw new Error('Failed to fetch weather data');
  
        const data = await response.json();
        const sunriseTime = new Date(data.data.timelines[0].intervals[0].values.sunriseTime);
        const sunsetTime = new Date(data.data.timelines[0].intervals[0].values.sunsetTime);
  
        document.getElementById('sunrise-time').textContent = formatTime(sunriseTime);
        document.getElementById('sunset-time').textContent = formatTime(sunsetTime);
      } catch (error) {
        console.error('Error fetching sunrise/sunset times:', error);
      }
    };
  
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => fetchSunriseSunset(position.coords.latitude, position.coords.longitude),
        error => console.error('Error with Geolocation:', error.message)
      );
    } else {
      console.error('Geolocation not supported by this browser.');
    }
  }
  