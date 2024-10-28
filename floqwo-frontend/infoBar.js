// Initialize info bar
function initInfoBar() {
    updateDateTime();
    updateTaskSummary();
    updateSunriseSunset();

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

        // Filter tasks due by today and still open or completed today
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

// Update sunrise and sunset times using Tomorrow.io API
async function updateSunriseSunset() {
    // Fetch the API key from the backend
    const token = localStorage.getItem('token');
    const response = await fetch(`${apiUrl}/weather-key`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
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

// Initialize the info bar on page load
document.addEventListener('DOMContentLoaded', initInfoBar);
