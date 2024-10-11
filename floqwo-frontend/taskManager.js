const apiUrl = 'https://floqwo-796cad1ba057.herokuapp.com/api/tasks'; // Your backend API
let currentFilter = 'all';  // Default filter is 'all'

// Check if token is valid on page load
function checkToken() {
  const token = localStorage.getItem('token');
  const expiration = localStorage.getItem('tokenExpiration');

  if (!token || Date.now() > expiration) {
    // Redirect to login page if no valid token
    window.location.href = 'login.html';
  }
}

// Call this function to check the token on page load
checkToken();

// Function to set the filter
function setFilter(filter) {
  currentFilter = filter;
  fetchTasks();  // Re-fetch tasks when the filter changes
}

// Function to render tasks into the DOM
function renderTasks(tasks) {
  const taskList = document.getElementById('task-list');
  taskList.innerHTML = ''; // Clear the task list

  // Loop through each task and display them based on the current filter
  tasks.forEach(task => {
    if (currentFilter === 'all' || task.status === currentFilter) {
      const taskItem = document.createElement('li');
      taskItem.innerHTML = `
        <span><strong>${task.title}</strong>: ${task.description} [${task.status}]</span>
      `;

      // If the task is pending, add a "Mark as Complete" button
      if (task.status === 'pending') {
        const completeButton = document.createElement('button');
        completeButton.innerText = 'Mark as Complete';
        completeButton.onclick = () => completeTask(task._id);
        taskItem.appendChild(completeButton);
      }

      // Add a delete button for all tasks
      const deleteButton = document.createElement('button');
      deleteButton.innerText = 'Delete';
      deleteButton.onclick = () => deleteTask(task._id);
      taskItem.appendChild(deleteButton);

      // If the task is completed, apply the completed style
      if (task.status === 'completed') {
        taskItem.classList.add('completed');  // Add a CSS class to completed tasks
      }

      // Append the task to the task list
      taskList.appendChild(taskItem);
    }
  });
}

// Function to make a secure API request for tasks
async function fetchTasks() {
  const token = localStorage.getItem('token');

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }

    const tasks = await response.json();
    renderTasks(tasks);  // Render the tasks into the DOM
  } catch (error) {
    document.getElementById('error-message').innerText = 'Error fetching tasks. Please try again later.';
    document.getElementById('error-message').style.display = 'block';
    console.error('Error fetching tasks:', error);
  }
}

// Function to add a new task
async function addTask(event) {
  event.preventDefault();

  const token = localStorage.getItem('token');
  const title = document.getElementById('task-title').value;
  const description = document.getElementById('task-description').value;

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ title, description })
  });

  if (response.ok) {
    fetchTasks();  // Refresh the task list after adding
    document.getElementById('task-form').reset();  // Clear form
  } else {
    alert('Failed to add task');
  }
}

// Function to delete a task
async function deleteTask(taskId) {
  const token = localStorage.getItem('token');

  const response = await fetch(`${apiUrl}/${taskId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (response.ok) {
    fetchTasks();  // Refresh the task list after deletion
  } else {
    alert('Failed to delete task');
  }
}

// Function to mark a task as complete
async function completeTask(taskId) {
  const token = localStorage.getItem('token');

  const response = await fetch(`${apiUrl}/${taskId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ status: 'completed' })  // Update the task status to "completed"
  });

  if (response.ok) {
    fetchTasks();  // Refresh the task list after marking as complete
  } else {
    alert('Failed to mark task as complete');
  }
}

// Event listener for form submission
document.getElementById('task-form').addEventListener('submit', addTask);

// Fetch tasks when the page loads
fetchTasks();