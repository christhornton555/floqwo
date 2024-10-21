// Open and Close Modal
const tagModal = document.getElementById('tagModal');
const openTagModalBtn = document.getElementById('openTagModal');
const closeTagModalBtn = document.getElementById('closeTagModal');
const tagColorInput = document.getElementById('tag-color'); // Select the color input

// Function to open the modal
openTagModalBtn.onclick = function() {
  // Set a default color if none is set
  if (!tagColorInput.value) {
    tagColorInput.value = '#000000';  // Default to black if no color is set
  }
  
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
      loadTags();  // Reload the tags in the task form (this will update tag checkboxes)
      tagModal.style.display = 'none';  // Close the modal
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
