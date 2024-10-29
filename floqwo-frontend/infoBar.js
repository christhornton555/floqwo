// Initialize info bar
function initInfoBar() {
  updateDateTime();
  updateTaskSummary();
  updateSunriseSunset();
  updateWeatherForecast();

  // Update time every minute
  setInterval(updateDateTime, 60000);

  // Fetch task summary when tasks are fetched
  document.addEventListener('tasksUpdated', updateTaskSummary);
}

// Update date and time in the format "HH:MM Day DD/MM/YYYY"
function updateDateTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const day = dayNames[now.getDay()];
  const date = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();

  document.getElementById('current-date-time').textContent = `${hours}:${minutes} ${day} ${date}/${month}/${year}`;
}

// Update task summary in the format "completed today/total due by today"
async function updateTaskSummary() {
  try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/tasks`, {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
          }
      });

      if (!response.ok) throw new Error('Failed to fetch tasks');

      const tasks = await response.json();
      const today = new Date().toISOString().slice(0, 10);

      const relevantTasks = tasks.filter(task => {
          const isDueByToday = task.dueDate && task.dueDate.slice(0, 10) <= today;
          const isOpen = task.status !== 'completed';
          const isCompletedToday = task.status === 'completed' && task.completedAt && task.completedAt.slice(0, 10) === today;
          return isDueByToday && (isOpen || isCompletedToday);
      });

      const completedCount = relevantTasks.filter(task => task.status === 'completed').length;
      const totalCount = relevantTasks.length;

      document.getElementById('task-summary').textContent = `${completedCount}/${totalCount}`;
  } catch (error) {
      console.error('Error updating task summary:', error);
  }
}

// Function to determine default weather icon based on time of day
function getDefaultIcon() {
  const now = new Date();
  const sunriseTime = new Date(document.getElementById('sunrise-time').textContent);
  const sunsetTime = new Date(document.getElementById('sunset-time').textContent);
  return now >= sunriseTime && now < sunsetTime ? 'broken-cloud-day.svg' : 'broken-cloud-night.svg';
}

// Update sunrise and sunset times using Tomorrow.io API
async function updateSunriseSunset() {
  const token = localStorage.getItem('token');
  const response = await fetch(`${apiUrl}/weather-key`, {
      headers: { Authorization: `Bearer ${token}` }
  });

  if (!response.ok) {
      console.error('Failed to fetch the API key');
      return;
  }

  const { key: apiKey } = await response.json();
  const formatTime = date =>
      `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

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
          position => {
              const { latitude, longitude } = position.coords;
              fetchSunriseSunset(latitude, longitude);
          },
          error => {
              console.error('Error with Geolocation:', error.message);
          }
      );
  } else {
      console.error('Geolocation not supported by this browser.');
  }
}

// Update weather forecast using Tomorrow.io API
async function updateWeatherForecast() {
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
      const url = `https://api.tomorrow.io/v4/timelines?location=${latitude},${longitude}&fields=weatherCode&timesteps=1h&units=metric&apikey=${apiKey}`;
      const response = await fetch(url);

      if (!response.ok) throw new Error('Failed to fetch weather forecast');

      const data = await response.json();
      const currentWeather = data.data.timelines[0].intervals[0].values.weatherCode;
      const twoHourForecast = data.data.timelines[0].intervals[2]?.values.weatherCode || null;
      const sixHourForecast = data.data.timelines[0].intervals[6]?.values.weatherCode || null;

      const weatherIcons = {
        1000: 'clear-day.svg', // Clear, Sunny
        1001: 'cloud.svg', // Cloudy
        10001: 'clear-night.svg', //
        1100: 'clear-day.svg', // Mostly Clear
        11001: 'clear-night.svg', //
        1101: 'broken-cloud-day.svg', // Partly Cloudy
        1102: 'broken-cloud-day.svg', // Mostly Cloudy
        1103: 'broken-cloud-day.svg', // Partly Cloudy and Mostly Clear
        2000: 'fog.svg', // Fog
        2100: 'fog.svg', // Light Fog
        2101: 'fog.svg', // Mostly Clear and Light Fog
        2102: 'fog.svg', // Partly Cloudy and Light Fog
        2103: 'fog.svg', // Mostly Cloudy and Light Fog
        2106: 'fog.svg', // Mostly Clear and Fog
        2107: 'fog.svg', // Partly Cloudy and Fog
        2108: 'fog.svg', // Mostly Cloudy and Fog
        4000: 'rain.svg', // Drizzle
        4001: 'rain.svg', // Rain
        4200: 'rain.svg', // Light Rain
        4201: 'rain.svg', // Heavy Rain
        4202: 'rain.svg', // Partly Cloudy and Heavy Rain
        4203: 'rain.svg', // Mostly Clear and Drizzle
        4204: 'rain.svg', // Partly Cloudy and Drizzle
        4205: 'rain.svg', // Mostly Cloudy and Drizzle
        // "4213": "Mostly Clear and Light Rain",
        // "4214": "Partly Cloudy and Light Rain",
        // "4215": "Mostly Cloudy and Light Rain",
        // "4209": "Mostly Clear and Rain",
        // "4208": "Partly Cloudy and Rain",
        // "4210": "Mostly Cloudy and Rain",
        // "4211": "Mostly Clear and Heavy Rain",
        // "4212": "Mostly Cloudy and Heavy Rain",
        5000: 'snow.svg', // Snow
        // "5115": "Mostly Clear and Flurries",
        // "5116": "Partly Cloudy and Flurries",
        // "5117": "Mostly Cloudy and Flurries",
        // "5001": "Flurries",
        // "5100": "Light Snow",
        // "5102": "Mostly Clear and Light Snow",
        // "5103": "Partly Cloudy and Light Snow",
        // "5104": "Mostly Cloudy and Light Snow",
        // "5122": "Drizzle and Light Snow",
        // "5105": "Mostly Clear and Snow",
        // "5106": "Partly Cloudy and Snow",
        // "5107": "Mostly Cloudy and Snow",
        // "5101": "Heavy Snow",
        // "5119": "Mostly Clear and Heavy Snow",
        // "5120": "Partly Cloudy and Heavy Snow",
        // "5121": "Mostly Cloudy and Heavy Snow",
        // "5110": "Drizzle and Snow",
        // "5108": "Rain and Snow",
        // "5114": "Snow and Freezing Rain",
        // "5112": "Snow and Ice Pellets",
        6000: 'ice.svg', // Freezing Drizzle
        // "6003": "Mostly Clear and Freezing drizzle",
        // "6002": "Partly Cloudy and Freezing drizzle",
        // "6004": "Mostly Cloudy and Freezing drizzle",
        // "6204": "Drizzle and Freezing Drizzle",
        // "6206": "Light Rain and Freezing Drizzle",
        // "6205": "Mostly Clear and Light Freezing Rain",
        // "6203": "Partly Cloudy and Light Freezing Rain",
        // "6209": "Mostly Cloudy and Light Freezing Rain",
        // "6200": "Light Freezing Rain",
        // "6213": "Mostly Clear and Freezing Rain",
        // "6214": "Partly Cloudy and Freezing Rain",
        // "6215": "Mostly Cloudy and Freezing Rain",
        // "6001": "Freezing Rain",
        // "6212": "Drizzle and Freezing Rain",
        // "6220": "Light Rain and Freezing Rain",
        // "6222": "Rain and Freezing Rain",
        // "6207": "Mostly Clear and Heavy Freezing Rain",
        // "6202": "Partly Cloudy and Heavy Freezing Rain",
        // "6208": "Mostly Cloudy and Heavy Freezing Rain",
        // "6201": "Heavy Freezing Rain",
        7000: 'snow.svg', // Ice Pellets
        // "7110": "Mostly Clear and Light Ice Pellets",
        // "7111": "Partly Cloudy and Light Ice Pellets",
        // "7112": "Mostly Cloudy and Light Ice Pellets",
        // "7102": "Light Ice Pellets",
        // "7108": "Mostly Clear and Ice Pellets",
        // "7107": "Partly Cloudy and Ice Pellets",
        // "7109": "Mostly Cloudy and Ice Pellets",
        // "7105": "Drizzle and Ice Pellets",
        // "7106": "Freezing Rain and Ice Pellets",
        // "7115": "Light Rain and Ice Pellets",
        // "7117": "Rain and Ice Pellets",
        // "7103": "Freezing Rain and Heavy Ice Pellets",
        // "7113": "Mostly Clear and Heavy Ice Pellets",
        // "7114": "Partly Cloudy and Heavy Ice Pellets",
        // "7116": "Mostly Cloudy and Heavy Ice Pellets",
        // "7101": "Heavy Ice Pellets",
        8000: 'thunderstorm.svg' // Thunderstorm
        // "8001": "Mostly Clear and Thunderstorm",
        // "8003": "Partly Cloudy and Thunderstorm",
        // "8002": "Mostly Cloudy and Thunderstorm",
      };

      const formatWeatherIcon = code => {
        console.log(code);
        const icon = weatherIcons[code] || getDefaultIcon();
        return `<img src="svg/${icon}" width="20" alt="Weather icon">`;
      };

      document.getElementById('weather-forecast').innerHTML = `${formatWeatherIcon(currentWeather)} | ${formatWeatherIcon(twoHourForecast)} | ${formatWeatherIcon(sixHourForecast)}`;
    } catch (error) {
      console.error('Error fetching weather forecast:', error);
      // Display default icons if weather data is not available
      document.getElementById('weather-forecast').innerHTML = `<img src="svg/${getDefaultIcon()}" width="20" alt="Default weather icon"> | <img src="svg/${getDefaultIcon()}" width="20" alt="Default weather icon"> | <img src="svg/${getDefaultIcon()}" width="20" alt="Default weather icon">`;
    }
  };

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        fetchForecast(latitude, longitude);
      },
      error => {
        console.error('Error with Geolocation:', error.message);
      }
    );
  } else {
    console.error('Geolocation not supported by this browser.');
  }
}

// Initialize the info bar on page load
document.addEventListener('DOMContentLoaded', initInfoBar);
