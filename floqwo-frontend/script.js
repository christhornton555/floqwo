const apiUrl = 'http://localhost:3000/api/tasks'; // Your backend API
let currentFilter = 'all';  // Default filter is 'all'

// Function to set the filter
function setFilter(filter) {
  currentFilter = filter;
  fetchTasks();  // Re-fetch tasks when the filter changes
}

// Function to fetch and display tasks
async function fetchTasks() {
  const response = await fetch(apiUrl);
  const tasks = await response.json();
  const taskList = document.getElementById('task-list');

  // Clear existing tasks
  taskList.innerHTML = '';

  // Loop through tasks and display them based on the current filter
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
  
      taskList.appendChild(taskItem);
    }
  });
  
}

// Function to add a new task
async function addTask(event) {
  event.preventDefault();

  const title = document.getElementById('task-title').value;
  const description = document.getElementById('task-description').value;

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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
  const response = await fetch(`${apiUrl}/${taskId}`, {
    method: 'DELETE'
  });

  if (response.ok) {
    fetchTasks();  // Refresh the task list after deletion
  } else {
    alert('Failed to delete task');
  }
}

// Function to mark a task as complete
async function completeTask(taskId) {
  const response = await fetch(`${apiUrl}/${taskId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
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
