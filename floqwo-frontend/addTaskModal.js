// Open and Close Add Task Modal
const addTaskModal = document.getElementById('addTaskModal');
const openAddTaskModalBtn = document.getElementById('openAddTaskModal');
const closeAddTaskModalBtn = document.getElementById('closeAddTaskModal');
const notification = document.getElementById('notification');

openAddTaskModalBtn.onclick = function () {
  document.getElementById('add-task-title').value = '';
  document.getElementById('add-task-description').value = '';
  document.getElementById('add-task-due-date').value = '';
  loadTags('add-tag-container');
  addTaskModal.style.display = 'block';
};

closeAddTaskModalBtn.onclick = function () {
  addTaskModal.style.display = 'none';
};

// Close modal when clicking outside content
window.onclick = function (event) {
  if (event.target === addTaskModal) {
    addTaskModal.style.display = 'none';
  }
};

// Function to show notification message
function showNotification(message) {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.style.opacity = '1'; // Fade in
  notification.style.display = 'block';

  // Fade out the notification after 1500 milliseconds
  setTimeout(() => {
    notification.style.opacity = '0'; // Fade out
    setTimeout(() => notification.style.display = 'none', 500); // Wait for fade-out transition to complete
  }, 1500);
}

// Function to handle adding a task on submit
document.getElementById('add-task-form').addEventListener('submit', async function (event) {
  event.preventDefault();
  const title = document.getElementById('add-task-title').value;
  const description = document.getElementById('add-task-description').value;
  const dueDate = document.getElementById('add-task-due-date').value;

  const tags = getSelectedTags('add-tag-container');
  const taskData = { title, description, dueDate, tags };

  // Assuming `apiUrl` and token retrieval are set
  const token = localStorage.getItem('token');
  const response = await fetch(`${apiUrl}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(taskData)
  });

  if (response.ok) {
    showNotification('Task added successfully');
    renderTasks();
    addTaskModal.style.display = 'none';
  } else {
    showNotification('Failed to add task');
  }
});

// Function to get selected tags
function getSelectedTags(containerId) {
  const selectedTags = [];
  document
    .getElementById(containerId)
    .querySelectorAll('.tag.selected')
    .forEach(tag => selectedTags.push(tag.dataset.tag));
  return selectedTags;
}

// Function to load tags into specified container
async function loadTags(containerId, selectedTags = []) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${apiUrl}/tags`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (response.ok) {
    const tags = await response.json();
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    tags.forEach(tag => {
      const tagButton = document.createElement('span');
      tagButton.classList.add('tag');
      tagButton.textContent = tag.name;
      tagButton.style.backgroundColor = tag.color;
      tagButton.dataset.tag = tag.name;

      if (selectedTags.includes(tag.name)) {
        tagButton.classList.add('selected');
      }

      tagButton.onclick = function () {
        tagButton.classList.toggle('selected');
      };

      container.appendChild(tagButton);
    });
  }
}
