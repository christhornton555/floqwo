// API functions

const apiUrl = 'https://floqwo-796cad1ba057.herokuapp.com/api'; // Backend API

// Function to make a secure API request for tasks
async function fetchTasks() {
  const token = localStorage.getItem('token');

  try {
    const response = await fetch(`${apiUrl}/tasks`, {
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
    renderTasks(tasks);  // Call render function from taskRender.js
  } catch (error) {
    document.getElementById('error-message').innerText = 'Error fetching tasks. Please try again later.';
    document.getElementById('error-message').style.display = 'block';
    console.error('Error fetching tasks:', error);
  }
}

// Function to update a task
async function updateTask(taskId) {
  const token = localStorage.getItem('token');
  const title = document.getElementById('edit-task-title').value;
  const description = document.getElementById('edit-task-description').value;
  const dueDateInput = document.getElementById('edit-task-due-date').value;
  const tags = getSelectedEditTags();  // Get selected tags from the edit form

  const taskData = {
    title,
    description,
    tags
  };

  if (dueDateInput) {
    const adjustedDueDate = applyTimezoneOffsetToUTC(dueDateInput);  // Apply timezone offset
    taskData.dueDate = adjustedDueDate;  // Store the adjusted date
  } else {
    taskData.dueDate = null;  // Remove due date if none is provided
  }

  const response = await fetch(`${apiUrl}/tasks/${taskId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(taskData)
  });

  if (response.ok) {
    fetchTasks();  // Refresh the task list after updating
    closeModal();  // Close the modal
  } else {
    alert('Failed to update task');
  }
}

// Function to delete a task
async function deleteTask(taskId) {
  const token = localStorage.getItem('token');

  const response = await fetch(`${apiUrl}/tasks/${taskId}`, {
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

  const response = await fetch(`${apiUrl}/tasks/${taskId}`, {
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

// Function to add a new task
// async function addTask(event) {
//   event.preventDefault();

//   const token = localStorage.getItem('token');
//   const title = document.getElementById('task-title').value;
//   const description = document.getElementById('task-description').value;
//   const dueDateInput = document.getElementById('task-due-date').value;
//   const tags = getSelectedTags(); // Get selected tags

//   const taskData = {
//     title,
//     description,
//     tags
//   };

//   if (dueDateInput) {
//     const adjustedDueDate = applyTimezoneOffsetToUTC(dueDateInput);  // Apply timezone offset
//     taskData.dueDate = adjustedDueDate;  // Store the adjusted date
//   }

//   const response = await fetch(apiUrl, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${token}`
//     },
//     body: JSON.stringify(taskData)
//   });

//   if (response.ok) {
//     fetchTasks();  // Refresh the task list after adding
//     document.getElementById('task-form').reset();  // Clear form
//   } else {
//     alert('Failed to add task');
//   }
// }

async function addTask(event) {
  event.preventDefault();

  const token = localStorage.getItem('token');
  const title = document.getElementById('task-title').value;
  const description = document.getElementById('task-description').value;
  const dueDateInput = document.getElementById('task-due-date').value;
  const tags = getSelectedTags();  // Collect selected tags

  const taskData = {
    title,
    description,
    tags
  };

  // Handle due date if provided
  if (dueDateInput) {
    const adjustedDueDate = applyTimezoneOffsetToUTC(dueDateInput);
    taskData.dueDate = adjustedDueDate;
  }

  const response = await fetch('/api/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(taskData)
  });

  if (response.ok) {
    fetchTasks();  // Refresh task list
    document.getElementById('task-form').reset();  // Clear the form
  } else {
    alert('Failed to add task');
  }
}
