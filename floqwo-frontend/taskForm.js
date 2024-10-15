// Handle adding & editing tasks

import { addTask, updateTask } from './api.js';
import { applyTimezoneOffsetToUTC } from './taskUtils.js';

// Get the tags input on the form
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

// Add task form handler
async function handleAddTask(event, token) {
  event.preventDefault();

  const title = document.getElementById('task-title').value;
  const description = document.getElementById('task-description').value;
  const dueDateInput = document.getElementById('task-due-date').value;
  const tags = getSelectedTags();

  const taskData = { title, description, tags };
  if (dueDateInput) {
    taskData.dueDate = applyTimezoneOffsetToUTC(dueDateInput);
  }

  await addTask(token, taskData);
}

// Edit task form handler
async function handleEditTask(event, taskId, token) {
  event.preventDefault();

  const title = document.getElementById('edit-task-title').value;
  const description = document.getElementById('edit-task-description').value;
  const dueDateInput = document.getElementById('edit-task-due-date').value;
  const tags = getSelectedEditTags();

  const taskData = { title, description, tags };
  if (dueDateInput) {
    taskData.dueDate = applyTimezoneOffsetToUTC(dueDateInput);
  }

  await updateTask(token, taskId, taskData);
}

export { handleAddTask, handleEditTask, getSelectedTags };
