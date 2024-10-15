// API functions

const apiUrl = 'https://floqwo-796cad1ba057.herokuapp.com/api/tasks'; // Your backend API

// Fetch tasks
async function fetchTasks(token) {
  const response = await fetch(apiUrl, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.ok ? response.json() : Promise.reject('Error fetching tasks');
}

// Add a new task
async function addTask(token, taskData) {
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(taskData)
  });
  return response.ok ? response.json() : Promise.reject('Error adding task');
}

// Update task
async function updateTask(token, taskId, taskData) {
  const response = await fetch(`${apiUrl}/${taskId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(taskData)
  });
  return response.ok ? response.json() : Promise.reject('Error updating task');
}

// Delete task
async function deleteTask(token, taskId) {
  const response = await fetch(`${apiUrl}/${taskId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.ok ? response.json() : Promise.reject('Error deleting task');
}

export { fetchTasks, addTask, updateTask, deleteTask };
