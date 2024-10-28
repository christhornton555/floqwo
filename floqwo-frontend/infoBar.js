// Initialize info bar
function initInfoBar() {
    updateDateTime();
    updateTaskSummary();
  
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
      const today = new Date().toISOString().slice(0, 10); // Today's date in YYYY-MM-DD format
  
      // Filter tasks to include only those due by today and still open, or completed today
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
  
  // Initialize the info bar on page load
  document.addEventListener('DOMContentLoaded', initInfoBar);
  