// Core task-handling module

import { fetchTasks, deleteTask, addTask, updateTask } from './api.js';
import { renderTasks } from './taskRender.js';
import { handleAddTask, handleEditTask, getSelectedTags } from './taskForm.js';
import { showEditModal, closeModal } from './taskModal.js';

let token = localStorage.getItem('token');

// Fetch and render tasks on page load
document.addEventListener('DOMContentLoaded', () => {
  fetchTasks(token).then(tasks => renderTasks(tasks));
});

// Set up form listeners
document.getElementById('task-form').addEventListener('submit', (event) => handleAddTask(event, token));
