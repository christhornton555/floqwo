// Handle the modal for editing tasks

function showEditModal(task) {
    const modal = document.getElementById('editTaskModal');
    modal.style.display = 'block';
  
    document.getElementById('edit-task-title').value = task.title;
    document.getElementById('edit-task-description').value = task.description;
    document.getElementById('edit-task-due-date').value = task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : '';
  }
  
  function closeModal() {
    const modal = document.getElementById('editTaskModal');
    modal.style.display = 'none';
  }
  
  export { showEditModal, closeModal };
  