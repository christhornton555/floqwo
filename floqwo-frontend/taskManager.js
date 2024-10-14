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

// Function to sort tasks based on priority, due date first, and creation date second
function sortTasks(tasks) {
  return tasks.sort((a, b) => {
    // Check if both tasks have the "priority" tag
    const aHasPriority = a.tags && a.tags.includes('priority');
    const bHasPriority = b.tags && b.tags.includes('priority');

    // If one task has the "priority" tag, it should come first
    if (aHasPriority && !bHasPriority) {
      return -1;
    }
    if (!aHasPriority && bHasPriority) {
      return 1;
    }

    // If both or neither have the "priority" tag, sort by due date (earliest first)
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate) - new Date(b.dueDate);
    }

    // If only one task has a due date, that one comes first
    if (a.dueDate && !b.dueDate) {
      return -1;
    }
    if (!a.dueDate && b.dueDate) {
      return 1;
    }

    // If neither task has a due date, sort by creation date (earliest first)
    return new Date(a.createdAt) - new Date(b.createdAt);
  });
}

// Function to get the selected tags
function getSelectedTags() {
  const tags = [];
  if (document.getElementById('tag-work').checked) {
    tags.push('work');
  }
  if (document.getElementById('tag-fast-stream').checked) {
    tags.push('fast stream');
  }
  if (document.getElementById('tag-priority').checked) {
    tags.push('priority');
  }
  if (document.getElementById('tag-dev').checked) {
    tags.push('dev');
  }
  return tags;
}

// Function to apply tag styles - TODO - this should probably be defined in styles.css instead
function getTagColor(tag) {
  switch(tag) {
    case 'work':
      return '#2196F3'; // Blue
    case 'fast stream':
      return '#912b88'; // Fast Stream purple
    case 'priority':
      return '#FF5722'; // Orange
    case 'dev':
      return '#4CAF50'; // Green
    default:
      return '#000'; // Default black for unhandled tags
  }
}

// Function to render tags
function renderTags(tags) {
  if (!tags || tags.length === 0) return '';
  return tags.map(tag => `<span class="tag" style="background-color: ${getTagColor(tag)};">${tag}</span>`).join(' ');
}

// Function to add a new task
async function addTask(event) {
  event.preventDefault();

  const token = localStorage.getItem('token');
  const title = document.getElementById('task-title').value;
  const description = document.getElementById('task-description').value;
  const dueDateInput = document.getElementById('task-due-date').value;
  const tags = getSelectedTags(); // Get selected tags

  const taskData = {
    title,
    description,
    tags
  };

  // If a due date is provided, adjust it by applying the timezone offset to UTC
  if (dueDateInput) {
    const adjustedDueDate = applyTimezoneOffsetToUTC(dueDateInput);  // Apply timezone offset
    taskData.dueDate = adjustedDueDate;  // Store the adjusted date
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

// Function to render tasks into the DOM
function renderTasks(tasks) {
  const taskList = document.getElementById('task-list');
  taskList.innerHTML = ''; // Clear the task list

  // Sort tasks first
  const sortedTasks = sortTasks(tasks);

  sortedTasks.forEach(task => {
    if (currentFilter === 'all' || task.status === currentFilter) {
      const taskItem = document.createElement('li');

      // Format the creation date
      const createdAt = formatDate(task.createdAt);
      let completedAt = '';
      let dueDate = '';
      let tags = '';

      // Check if the task has tags and render them
      if (task.tags) {
        tags = renderTags(task.tags);  // Render tags if present
      }

      // Check if the task has a due date
      if (task.dueDate) {
        dueDate = `<div class="due-date">Due: ${formatDate(task.dueDate)}</div>`;

        // Apply shading based on time passed percentage or priority
        const timePassedPercentage = calculateTimePassedPercentage(task.createdAt, task.dueDate);
        if (timePassedPercentage >= 90) {
          taskItem.style.backgroundColor = '#630000'; // 90% of the time passed
        } else if (timePassedPercentage >= 80) {
          taskItem.style.backgroundColor = '#260000'; // 80% of the time passed
        }
      }
      
      // Check if the task has a priority
      if (task.tags) {
        console.log(task.tags);
        if (task.tags.includes('priority')) {
          taskItem.style.backgroundColor = '#630000';
        }
      }

      // Check if the task is completed and format the completed date
      if (task.status === 'completed' && task.completedAt) {
        completedAt = `<div class="completed-date">Completed: ${formatDate(task.completedAt)}</div>`;
        // Remove any background color for completed tasks
        taskItem.style.backgroundColor = ''; 
      }

      // Create task content with date, title, description, and optionally the completed date, due date, and tags
      taskItem.innerHTML = `
        <div class="task-content">
          <div class="tags">${tags}</div>
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

// Function to apply timezone offset and adjust the UTC time to local time
function applyTimezoneOffsetToUTC(inputDateTime) {
  const utcDateTime = new Date(inputDateTime); // Convert input to UTC
  const timezoneOffset = utcDateTime.getTimezoneOffset() * 60000; // Get offset in milliseconds

  // Apply the timezone offset to convert UTC to local time
  const localDateTime = new Date(utcDateTime.getTime() + timezoneOffset); // Add the offset to UTC

  // Format the adjusted local date/time as an ISO string (without converting back to UTC)
  const year = localDateTime.getFullYear();
  const month = String(localDateTime.getMonth() + 1).padStart(2, '0');
  const day = String(localDateTime.getDate()).padStart(2, '0');
  const hours = String(localDateTime.getHours()).padStart(2, '0');
  const minutes = String(localDateTime.getMinutes()).padStart(2, '0');
  const seconds = String(localDateTime.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
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
