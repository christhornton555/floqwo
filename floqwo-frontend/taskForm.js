// Handle adding & editing tasks

// Function to get selected tags from the add task form
function getSelectedTags() {
  const selectedTags = [];
  const tagButtons = document.querySelectorAll('#add-tag-container .tag');

  tagButtons.forEach(tagButton => {
    if (tagButton.classList.contains('selected')) {
      selectedTags.push(tagButton.dataset.tag);  // Use the dataset to retrieve the tag name
    }
  });

  return selectedTags;
}

// Function to get selected tags from the edit form
function getSelectedEditTags() {
  const selectedTags = [];
  const tagButtons = document.querySelectorAll('#edit-tag-container .tag');

  tagButtons.forEach(tagButton => {
    if (tagButton.classList.contains('selected')) {
      selectedTags.push(tagButton.dataset.tag);  // Use the dataset to retrieve the tag name
    }
  });

  return selectedTags;
}

// Function to load available tags into both Add and Edit forms as buttons
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
      // Create a button-like tag for each tag in Add Task form
      const addTagButton = createTagButton(tag);
      addTagContainer.appendChild(addTagButton);

      // Create a button-like tag for each tag in Edit Task form
      const editTagButton = createTagButton(tag);
      editTagContainer.appendChild(editTagButton);
    });
  } catch (error) {
    console.error('Error loading tags:', error);
    alert('Error loading tags');
  }
}

// Function to create a button-like tag element
function createTagButton(tag) {
  const tagButton = document.createElement('span');
  tagButton.classList.add('tag');
  tagButton.textContent = tag.name;
  tagButton.style.backgroundColor = tag.color;
  tagButton.dataset.tag = tag.name;  // Store the tag name in a dataset attribute

  // Add click event to toggle the selected state
  tagButton.addEventListener('click', () => {
    tagButton.classList.toggle('selected');  // Toggle the "selected" class
  });

  return tagButton;
}

// Utility function to determine text color based on background color for better readability
// TODO - Move this to the other util functions script
function getContrastYIQ(hexcolor) {
  hexcolor = hexcolor.replace("#", "");
  const r = parseInt(hexcolor.substr(0, 2), 16);
  const g = parseInt(hexcolor.substr(2, 2), 16);
  const b = parseInt(hexcolor.substr(4, 2), 16);
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
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
      const tagButton = document.querySelector(`#edit-tag-container .tag[data-tag="${tag}"]`);
      if (tagButton) {
        tagButton.classList.add('selected');  // Mark the tag as selected if it belongs to the task
      }
    });
  });

  // Attach the event listener to handle form submission
  document.getElementById('edit-task-form').onsubmit = (event) => {
    event.preventDefault();
    updateTask(task._id);  // Update the task
  };
}
