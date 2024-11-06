import { updateDateTime } from './dateTime.js';
import { updateTaskSummary } from './taskSummary.js';
import { updateSunriseSunset } from './sunriseSunset.js';
import { updateWeatherForecast } from './weather.js';
import { setInfoBarHeight } from './utils.js';

function initInfoBar() {
  updateDateTime();
  updateTaskSummary();
  updateSunriseSunset();
  updateWeatherForecast();

  // Update time every second
  setInterval(updateDateTime, 1000);

  // Fetch task summary when tasks are fetched
  document.addEventListener('tasksUpdated', updateTaskSummary);
}

// Initialize on page load and adjust on resize
document.addEventListener('DOMContentLoaded', () => {
  setInfoBarHeight();
  initInfoBar();
  window.addEventListener('resize', setInfoBarHeight); // Adjust on window resize
});
