const apiUrl = 'https://floqwo-796cad1ba057.herokuapp.com/api/tasks'; // Your backend API
let currentFilter = 'pending';  // Default filter is 'all'

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

// Function to calculate the percentage of time passed between creation and due date
function calculateTimePassedPercentage(createdAt, dueDate) {
  const createdTime = new Date(createdAt).getTime();
  const dueTime = new Date(dueDate).getTime();
  const nowTime = Date.now();

  // Calculate the total time available and the time that has passed
  const totalTime = dueTime - createdTime;
  const timePassed = nowTime - createdTime;

  // Return the percentage of time passed
  return (timePassed / totalTime) * 100;
}

// Function to format the date into "DD/MM/YYYY, HH.MM"
function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year}, ${hours}.${minutes}`;
}

// Function to render tasks into the DOM
function renderTasks(tasks) {
  const taskList = document.getElementById('task-list');
  taskList.innerHTML = ''; // Clear the task list

  tasks.forEach(task => {
    if (currentFilter === 'all' || task.status === currentFilter) {
      const taskItem = document.createElement('li');

      // Format the creation date
      const createdAt = formatDate(task.createdAt);
      let completedAt = '';
      let dueDate = '';

      // Check if the task has a due date
      if (task.dueDate) {
        dueDate = `<div class="due-date">Due: ${formatDate(task.dueDate)}</div>`;
        
        // Calculate the percentage of time passed
        const timePassedPercentage = calculateTimePassedPercentage(task.createdAt, task.dueDate);

        // Apply priority-based background colors based on the percentage of time passed
        if (timePassedPercentage >= 90) {
          taskItem.style.backgroundColor = '#630000'; // 90% of time passed
        } else if (timePassedPercentage >= 80) {
          taskItem.style.backgroundColor = '#260000'; // 80% of time passed
        }
      }

      // Check if the task is completed and format the completed date
      if (task.status === 'completed' && task.completedAt) {
        completedAt = `<div class="completed-date">Completed: ${formatDate(task.completedAt)}</div>`;
      }

      // Create task content with date, title, description, and optionally the completed date and due date
      taskItem.innerHTML = `
        <div class="task-content">
          <div class="task-date">${createdAt}</div>
          <div class="task-info">
            <strong>${task.title}</strong>: ${task.description}
          </div>
          ${dueDate} <!-- Only show if there's a due date -->
          ${completedAt} <!-- Only show if completed -->
        </div>
      `;

      // Create a container for the buttons
      const buttonContainer = document.createElement('div');
      buttonContainer.classList.add('task-buttons');

      // If the task is pending, add a "Complete" button
      if (task.status === 'pending') {
        const completeButton = document.createElement('button');
        completeButton.innerText = 'Complete';
        completeButton.classList.add('complete-btn');
        completeButton.onclick = () => completeTask(task._id);
        buttonContainer.appendChild(completeButton);
      }

      // Add a delete button for all tasks
      const deleteButton = document.createElement('button');
      deleteButton.innerText = 'Delete';
      deleteButton.classList.add('delete-btn');
      deleteButton.onclick = () => deleteTask(task._id);
      buttonContainer.appendChild(deleteButton);

      // Append the button container to the task item
      taskItem.appendChild(buttonContainer);

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
  const dueDate = document.getElementById('task-due-date').value;  // Get the optional due date

  const taskData = {
    title,
    description
  };

  if (dueDate) {
    taskData.dueDate = dueDate;  // Add due date to the task if provided
  }

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(taskData)
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
