// Handle adding & editing tasks

// Function to get selected tags from the add task form
function getSelectedTags() {
  const tagContainer = document.getElementById('add-tag-container');
  const selectedTags = [];
  const inputs = tagContainer.querySelectorAll('input[type="checkbox"]');

  inputs.forEach(input => {
    if (input.checked) {
      selectedTags.push(input.value);
    }
  });

  return selectedTags;
}

// Function to get selected tags from the edit form
function getSelectedEditTags() {
  const tagContainer = document.getElementById('edit-tag-container');
  const selectedTags = [];
  const inputs = tagContainer.querySelectorAll('input[type="checkbox"]');

  inputs.forEach(input => {
    if (input.checked) {
      selectedTags.push(input.value);
    }
  });

  return selectedTags;
}

// Function to load available tags into both Add and Edit forms
async function loadTags() {
  try {
    const token = localStorage.getItem('token');  // Get token from localStorage
    const response = await fetch(`${apiUrl}/tags`, {  // Use the correct tags endpoint
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,  // Send the token for authorization
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch tags');
    }

    const tags = await response.json();
    const addTagContainer = document.getElementById('add-tag-container');  // Add Task tag container
    const editTagContainer = document.getElementById('edit-tag-container'); // Edit Task tag container

    addTagContainer.innerHTML = '';  // Clear any existing tag options in Add Task
    editTagContainer.innerHTML = ''; // Clear any existing tag options in Edit Task

    tags.forEach(tag => {
      // Create a checkbox for each tag in Add Task form
      const addCheckbox = document.createElement('input');
      addCheckbox.type = 'checkbox';
      addCheckbox.value = tag.name;
      addCheckbox.id = `add-tag-${tag.name}`;

      const addLabel = document.createElement('label');
      addLabel.htmlFor = `add-tag-${tag.name}`;
      addLabel.textContent = tag.name;

      // Set the background color of the label to the color stored in the database
      addLabel.style.backgroundColor = tag.color;
      addLabel.style.color = getContrastYIQ(tag.color); // Optional: Set text color based on background

      // Append to Add Task form
      addTagContainer.appendChild(addCheckbox);
      addTagContainer.appendChild(addLabel);
      addTagContainer.appendChild(document.createElement('br'));  // Line break

      // Create a checkbox for each tag in Edit Task form
      const editCheckbox = document.createElement('input');
      editCheckbox.type = 'checkbox';
      editCheckbox.value = tag.name;
      editCheckbox.id = `edit-tag-${tag.name}`;

      const editLabel = document.createElement('label');
      editLabel.htmlFor = `edit-tag-${tag.name}`;
      editLabel.textContent = tag.name;

      // Set the background color of the label to the color stored in the database
      editLabel.style.backgroundColor = tag.color;
      editLabel.style.color = getContrastYIQ(tag.color); // Optional: Set text color based on background

      // Append to Edit Task form
      editTagContainer.appendChild(editCheckbox);
      editTagContainer.appendChild(editLabel);
      editTagContainer.appendChild(document.createElement('br'));  // Line break
    });
  } catch (error) {
    console.error('Error loading tags:', error);
    alert('Error loading tags');
  }
}

// Utility function to determine text color based on background color for better readability
// TODO - Move this to the other util functions script
function getContrastYIQ(hexcolor){
  hexcolor = hexcolor.replace("#", "");
  const r = parseInt(hexcolor.substr(0,2),16);
  const g = parseInt(hexcolor.substr(2,2),16);
  const b = parseInt(hexcolor.substr(4,2),16);
  const yiq = ((r*299)+(g*587)+(b*114))/1000;
  return (yiq >= 200) ? 'black' : 'white';
}

// Call the loadTags function when the page loads
document.addEventListener('DOMContentLoaded', loadTags);

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

  // Load available tags and mark the selected ones
  loadTags().then(() => {
    task.tags.forEach(tag => {
      const checkbox = document.getElementById(`edit-tag-${tag}`);
      if (checkbox) {
        checkbox.checked = true;  // Mark the tag as selected if it belongs to the task
      }
    });
  });

  // Attach the event listener to handle form submission
  document.getElementById('edit-task-form').onsubmit = (event) => {
    event.preventDefault();
    updateTask(task._id);  // Update the task
  };
}
