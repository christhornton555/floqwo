// Render tasks on the page

import { formatDate, calculateTimePassedPercentage } from './taskUtils.js';

function renderTasks(tasks, token) {
  const taskList = document.getElementById('task-list');
  taskList.innerHTML = '';  // Clear previous tasks

  tasks.forEach(task => {
    const taskItem = document.createElement('li');
    taskItem.innerHTML = `
      <div class="task-content">
        <div class="tags">${renderTags(task.tags)}</div>
        <div class="task-date">${formatDate(task.createdAt)}</div>
        <div class="task-info">
          <strong>${task.title}</strong>: ${task.description}
        </div>
      </div>
    `;
    // Add task to DOM
    taskList.appendChild(taskItem);
  });
}

export { renderTasks };
