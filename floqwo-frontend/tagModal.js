// Open and Close Modal
const tagModal = document.getElementById('tagModal');
const openTagModalBtn = document.getElementById('openTagModal');
const closeTagModalBtn = document.getElementById('closeTagModal');
let editingTagId = null;  // Keep track of which tag is being edited

// Function to open the modal for adding a new tag
openTagModalBtn.onclick = function() {
  editingTagId = null;  // Reset editing mode
  document.getElementById('tag-name').value = '';  // Clear previous values
  document.getElementById('tag-color').value = '#ffffff';  // Reset to default color
  tagModal.style.display = 'block';
}

// Function to open the modal for editing a tag
function openEditTagModal(tag) {
  editingTagId = tag._id;  // Set the tag ID for editing
  document.getElementById('tag-name').value = tag.name;
  document.getElementById('tag-color').value = tag.color;
  tagModal.style.display = 'block';
}

// Function to close the modal
closeTagModalBtn.onclick = function() {
  tagModal.style.display = 'none';
}

// Close modal when clicking outside of the modal content
window.onclick = function(event) {
  if (event.target === tagModal) {
    tagModal.style.display = 'none';
  }
}

// Function to handle adding or editing a tag
async function addOrEditTag(event) {
  event.preventDefault();
  
  const tagName = document.getElementById('tag-name').value;
  const tagColor = document.getElementById('tag-color').value;
  
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
      // Create a new tag
      response = await fetch(`${apiUrl}/tags`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(tagData)
      });
    }

    if (response.ok) {
      alert('Tag saved successfully!');
      document.getElementById('tag-form').reset();  // Reset the form
      loadTags();  // Reload the tags in the task form (this will update tag checkboxes)
      renderFilterTagButtons();  // Reload the filter tag buttons
      tagModal.style.display = 'none';  // Close the modal
    } else {
      alert('Failed to save tag');
    }
  } catch (error) {
    console.error('Error saving tag:', error);
    alert('Error saving tag');
  }
}

// Event listener for tag form submission
document.getElementById('tag-form').addEventListener('submit', addOrEditTag);
