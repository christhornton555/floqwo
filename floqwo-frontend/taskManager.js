// Core task-handling module

// Ensure token is valid on page load
function checkToken() {
  const token = localStorage.getItem('token');
  const expiration = localStorage.getItem('tokenExpiration');

  if (!token || Date.now() > expiration) {
    window.location.href = 'login.html';
  }
}

// Call this function on page load
checkToken();

let currentFilter = 'pending';  // Make this globally accessible

// Set filter and fetch tasks based on filter
function setFilter(filter) {
  currentFilter = filter;
  fetchTasks(); 
}

// Fetch tasks when the page loads
fetchTasks();
