// Render tasks on the page

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

// Function to render tasks into the DOM
function renderTasks(tasks) {
  const taskList = document.getElementById('task-list');
  taskList.innerHTML = ''; // Clear the task list

  const sortedTasks = sortTasks(tasks); // sortTasks from taskUtils.js

  sortedTasks.forEach(task => {
    if (currentFilter === 'all' || task.status === currentFilter) {
      const taskItem = document.createElement('li');

      const createdAt = formatDate(task.createdAt); // formatDate from taskUtils.js
      let completedAt = '';
      let dueDate = '';
      let tags = '';

      if (task.tags) {
        tags = renderTags(task.tags);  // renderTags from taskRender.js
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
        completeButton.innerText = 'Complete';
        completeButton.classList.add('complete-btn');
        completeButton.onclick = () => completeTask(task._id);
        buttonContainer.appendChild(completeButton);
      }

      const deleteButton = document.createElement('button');
      deleteButton.innerText = 'Delete';
      deleteButton.classList.add('delete-btn');
      deleteButton.onclick = () => deleteTask(task._id);
      buttonContainer.appendChild(deleteButton);

      const editButton = document.createElement('button');
      editButton.innerText = 'Edit';
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
