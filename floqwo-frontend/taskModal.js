// Handle the modal for editing tasks

// Function to open the edit modal and populate with task data
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

  document.getElementById('edit-tag-work').checked = task.tags.includes('work');
  document.getElementById('edit-tag-priority').checked = task.tags.includes('priority');
  document.getElementById('edit-tag-dev').checked = task.tags.includes('dev');
  document.getElementById('edit-tag-fast-stream').checked = task.tags.includes('fast stream');

  document.getElementById('edit-task-form').onsubmit = (event) => {
    event.preventDefault();
    updateTask(task._id); 
  };
}

// Function to close the modal
function closeModal() {
  const modal = document.getElementById('editTaskModal');
  modal.style.display = 'none';
}
