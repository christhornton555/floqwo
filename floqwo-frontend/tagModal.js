// Open and Close Modal
const editTagModal = document.getElementById('editTagModal');
const openEditTagModalBtn = document.getElementById('openEditTagModal'); // New button for opening the edit modal
const closeEditTagModalBtn = document.getElementById('closeEditTagModal');
let editingTagId = null;  // Keep track of which tag is being edited

// Function to open the modal for editing a tag
openEditTagModalBtn.onclick = function() {
  editingTagId = null;  // Reset editing mode
  document.getElementById('edit-tag-name').value = '';  // Clear previous values
  document.getElementById('edit-tag-color').value = '#ffffff';  // Reset to default color
  loadTagOptions(); // Load the tags into the dropdown
  editTagModal.style.display = 'block';
}

// Function to close the modal
closeEditTagModalBtn.onclick = function() {
  editTagModal.style.display = 'none';
}

// Close modal when clicking outside of the modal content
window.onclick = function(event) {
  if (event.target === editTagModal) {
    editTagModal.style.display = 'none';
  }
}

// Function to load available tags into the dropdown
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
        editingTagId = selectedTagId;  // Set the editing tag ID
      }
    });
  } catch (error) {
    console.error('Error loading tags:', error);
    alert('Error loading tags');
  }
}

// Function to handle editing a tag
async function addOrEditTag(event) {
  event.preventDefault();
  
  const tagName = document.getElementById('edit-tag-name').value;
  const tagColor = document.getElementById('edit-tag-color').value;
  
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
    } else {
      // We shouldn't reach here since this is the edit modal
      alert('Error: No tag selected for editing.');
      return;
    }

    if (response.ok) {
      alert('Tag updated successfully!');
      loadTags();  // Reload the tags in the task form
      renderFilterTagButtons();  // Reload the filter tag buttons
      renderTasks();  // Reload tasks to reflect updated tag info
      editTagModal.style.display = 'none';  // Close the modal
    } else {
      alert('Failed to update tag');
    }
  } catch (error) {
    console.error('Error updating tag:', error);
    alert('Error updating tag');
  }
}

// Event listener for tag form submission
document.getElementById('edit-tag-form').addEventListener('submit', addOrEditTag);
