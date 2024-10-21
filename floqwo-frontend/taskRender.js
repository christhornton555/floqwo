// Render tasks on the page

// Function to get tag color from the database
function getTagColorFromDatabase(tagName, availableTags) {
  const tag = availableTags.find(t => t.name === tagName);
  return tag ? tag.color : '#000';  // Default black if no color is found
}

// Function to render tags with colors from the database
function renderTags(tags, availableTags) {
  if (!tags || tags.length === 0) return '';
  
  // Use the color fetched from the database for each tag
  return tags.map(tag => {
    const tagColor = getTagColorFromDatabase(tag, availableTags);
    return `<span class="tag" style="background-color: ${tagColor};">${tag}</span>`;
  }).join(' ');
}

// Function to render tasks into the DOM
async function renderTasks(tasks) {
  const taskList = document.getElementById('task-list');
  taskList.innerHTML = ''; // Clear the task list

  // Fetch available tags with colors from the database
  const token = localStorage.getItem('token');
  const availableTagsResponse = await fetch(`${apiUrl}/tags`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!availableTagsResponse.ok) {
    console.error('Failed to fetch available tags.');
    return;
  }

  const availableTags = await availableTagsResponse.json();  // Load available tags

  const sortedTasks = sortTasks(tasks); // sortTasks from taskUtils.js

  sortedTasks.forEach(task => {
    if (currentFilter === 'all' || task.status === currentFilter) {
      const taskItem = document.createElement('li');

      const createdAt = formatDate(task.createdAt); // formatDate from taskUtils.js
      let completedAt = '';
      let dueDate = '';
      let tags = '';

      // Render tags with their colors from the database
      if (task.tags) {
        tags = renderTags(task.tags, availableTags);  // Pass availableTags to renderTags
      }

      if (task.dueDate) {
        dueDate = `<div class="due-date">Due: ${formatDate(task.dueDate)}</div>`;
        const timePassedPercentage = calculateTimePassedPercentage(task.createdAt, task.dueDate); // from taskUtils.js
        if (timePassedPercentage >= 90) {
          taskItem.style.backgroundColor = '#630000'; 
        } else if (timePassedPercentage >= 80) {
          taskItem.style.backgroundColor = '#260000'; 
        }
      }

      if (task.tags && task.tags.includes('priority')) {
        taskItem.style.backgroundColor = '#630000';
      }

      if (task.status === 'completed' && task.completedAt) {
        completedAt = `<div class="completed-date">Completed: ${formatDate(task.completedAt)}</div>`;
        taskItem.style.backgroundColor = ''; 
      }

      taskItem.innerHTML = `
        <div class="task-content">
          <div class="tags">${tags}</div>
          <div class="task-date">${createdAt}</div>
          <div class="task-info">
            <strong>${task.title}</strong>: ${task.description}
          </div>
          ${dueDate}
          ${completedAt}
        </div>
      `;

      const buttonContainer = document.createElement('div');
      buttonContainer.classList.add('task-buttons');

      if (task.status === 'pending') {
        const completeButton = document.createElement('button');
        completeButton.innerHTML = '<span class="material-icons">check</span>';  // Material icon for "check"
        completeButton.classList.add('complete-btn');
        completeButton.onclick = () => completeTask(task._id);
        buttonContainer.appendChild(completeButton);
      }

      const deleteButton = document.createElement('button');
      deleteButton.innerHTML = '<span class="material-icons">delete</span>';  // Material icon for "delete"
      deleteButton.classList.add('delete-btn');
      deleteButton.onclick = () => deleteTask(task._id);
      buttonContainer.appendChild(deleteButton);

      const editButton = document.createElement('button');
      editButton.innerHTML = '<span class="material-icons">edit</span>';  // Material icon for "edit"
      editButton.classList.add('edit-btn');
      editButton.onclick = () => editTask(task);
      buttonContainer.appendChild(editButton);

      taskItem.appendChild(buttonContainer);

      if (task.status === 'completed') {
        taskItem.classList.add('completed');
      }

      taskList.appendChild(taskItem);
    }
  });
}
