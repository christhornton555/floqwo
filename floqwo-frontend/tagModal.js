// Open and Close Modals for Adding and Editing Tags
const addTagModal = document.getElementById('tagModal');
const openAddTagModalBtn = document.getElementById('openTagModal'); // Button to open the Add Tag modal
const closeAddTagModalBtn = document.getElementById('closeTagModal');

const editTagModal = document.getElementById('editTagModal');
const openEditTagModalBtn = document.getElementById('openEditTagModal'); // Button to open the Edit Tag modal
const closeEditTagModalBtn = document.getElementById('closeEditTagModal');

let editingTagId = null;  // Keep track of which tag is being edited

// Function to open the Add Tag modal
openAddTagModalBtn.onclick = function () {
  editingTagId = null;  // Reset editing mode
  document.getElementById('tag-name').value = '';  // Clear previous values
  document.getElementById('tag-color').value = '#ffffff';  // Reset to default color
  addTagModal.style.display = 'block';
}

// Function to close the Add Tag modal
closeAddTagModalBtn.onclick = function () {
  addTagModal.style.display = 'none';
}

// Function to open the Edit Tag modal
openEditTagModalBtn.onclick = function () {
  editingTagId = null;  // Reset editing mode
  document.getElementById('edit-tag-name').value = '';  // Clear previous values
  document.getElementById('edit-tag-color').value = '#ffffff';  // Reset to default color
  document.getElementById('original-tag-name').value = '';  // Clear the original tag name
  loadTagOptions(); // Load the tags into the dropdown
  editTagModal.style.display = 'block';
}

// Function to close the Edit Tag modal
closeEditTagModalBtn.onclick = function () {
  editTagModal.style.display = 'none';
}

// Close modals when clicking outside of the modal content
window.onclick = function (event) {
  if (event.target === addTagModal) {
    addTagModal.style.display = 'none';
  } else if (event.target === editTagModal) {
    editTagModal.style.display = 'none';
  }
}

// Function to handle adding a new tag
async function addTag(event) {
  event.preventDefault();

  const tagName = document.getElementById('tag-name').value;
  const tagColor = document.getElementById('tag-color').value;

  const tagData = {
    name: tagName,
    color: tagColor
  };

  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${apiUrl}/tags`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(tagData)
    });

    if (response.ok) {
      alert('Tag added successfully!');
      document.getElementById('tag-form').reset();  // Reset the form
      loadTags();  // Reload the tags in the task form
      renderFilterTagButtons();  // Reload the filter tag buttons
      addTagModal.style.display = 'none';  // Close the modal
    } else {
      alert('Failed to add tag');
    }
  } catch (error) {
    console.error('Error adding tag:', error);
    alert('Error adding tag');
  }
}

// Function to load available tags into the dropdown for editing
async function loadTagOptions() {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${apiUrl}/tags`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch tags');
    }

    const tags = await response.json();
    const tagSelect = document.getElementById('tag-select');
    tagSelect.innerHTML = '<option value="">-- Select a tag --</option>';  // Reset dropdown

    tags.forEach(tag => {
      const option = document.createElement('option');
      option.value = tag._id;
      option.textContent = tag.name;
      tagSelect.appendChild(option);
    });

    // Add event listener to update the input fields when a tag is selected
    tagSelect.addEventListener('change', () => {
      const selectedTagId = tagSelect.value;
      const selectedTag = tags.find(tag => tag._id === selectedTagId);

      if (selectedTag) {
        document.getElementById('edit-tag-name').value = selectedTag.name;
        document.getElementById('edit-tag-color').value = selectedTag.color;
        document.getElementById('original-tag-name').value = selectedTag.name; // Store original name
        editingTagId = selectedTagId;  // Set the editing tag ID
      }
    });
  } catch (error) {
    console.error('Error loading tags:', error);
    alert('Error loading tags');
  }
}

// Function to handle editing a tag
async function editTag(event) {
  event.preventDefault();

  const tagName = document.getElementById('edit-tag-name').value;
  const tagColor = document.getElementById('edit-tag-color').value;
  const originalTagName = document.getElementById('original-tag-name').value; // Original name

  const tagData = {
    name: tagName,
    color: tagColor
  };

  try {
    const token = localStorage.getItem('token');

    let response;
    if (editingTagId) {
      // Edit the existing tag
      response = await fetch(`${apiUrl}/tags/${editingTagId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(tagData)
      });

      if (response.ok) {
        // Check if the tag name has changed
        if (originalTagName !== tagName) {
          // If the name has changed, update all tasks with the new tag name
          await updateTasksWithNewTagName(originalTagName, tagName);
        }

        alert('Tag updated successfully!');
        loadTags();  // Reload the tags in the task form
        renderFilterTagButtons();  // Reload the filter tag buttons
        renderTasks();  // Reload tasks to reflect updated tag info
        editTagModal.style.display = 'none';  // Close the modal
      } else {
        alert('Failed to update tag');
      }
    } else {
      alert('Error: No tag selected for editing.');
    }
  } catch (error) {
    console.error('Error updating tag:', error);
    alert('Error updating tag');
  }
}

// Function to update all tasks with the new tag name
async function updateTasksWithNewTagName(oldTagName, newTagName) {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${apiUrl}/tasks/updateTagName`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ oldTagName, newTagName })
    });

    if (!response.ok) {
      throw new Error('Failed to update tasks with new tag name');
    }

    console.log(`Tasks updated with new tag name: ${newTagName}`);
  } catch (error) {
    console.error('Error updating tasks with new tag name:', error);
    alert('Error updating tasks');
  }
}

// Event listeners for form submissions
document.getElementById('tag-form').addEventListener('submit', addTag);
document.getElementById('edit-tag-form').addEventListener('submit', editTag);
