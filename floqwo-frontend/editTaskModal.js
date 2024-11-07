// Handle the modal for editing tasks

function editTask(task) {
  const modal = document.getElementById('editTaskModal');
  modal.style.display = 'block';

  document.getElementById('edit-task-title').value = task.title;
  document.getElementById('edit-task-description').value = task.description;

  if (task.dueDate) {
    document.getElementById('edit-task-due-date').value = new Date(task.dueDate).toISOString().slice(0, 16);
  } else {
    document.getElementById('edit-task-due-date').value = '';
  }

  // Load available tags and mark the selected ones
  loadTags().then(() => {
    task.tags.forEach(tag => {
      const checkbox = document.getElementById(`tag-${tag}`);
      if (checkbox) {
        checkbox.checked = true;  // Mark the tag as selected if it belongs to the task
      }
    });
  });

  document.getElementById('edit-task-form').onsubmit = (event) => {
    event.preventDefault();
    updateTask(task._id);  // Update the task
  };
}


// Function to close the modal
function closeModal() {
  const modal = document.getElementById('editTaskModal');
  modal.style.display = 'none';
}
