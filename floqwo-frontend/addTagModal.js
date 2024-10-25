// Open and Close Add Tag Modal
const addTagModal = document.getElementById('tagModal');
const openAddTagModalBtn = document.getElementById('openTagModal'); // Button to open the Add Tag modal
const closeAddTagModalBtn = document.getElementById('closeTagModal');

// Function to open the modal for adding a new tag
openAddTagModalBtn.onclick = function () {
  document.getElementById('tag-name').value = '';  // Clear previous values
  document.getElementById('tag-color').value = '#ffffff';  // Reset to default color
  addTagModal.style.display = 'block';
}

// Function to close the Add Tag modal
closeAddTagModalBtn.onclick = function () {
  addTagModal.style.display = 'none';
}

// Close Add Tag modal when clicking outside of the modal content
window.onclick = function (event) {
  if (event.target === addTagModal) {
    addTagModal.style.display = 'none';
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

// Event listener for tag form submission
document.getElementById('tag-form').addEventListener('submit', addTag);
