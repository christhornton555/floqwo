// Handle adding & editing tasks

// Function to get selected tags from the add task form
function getSelectedTags() {
  const tagContainer = document.getElementById('tag-container');
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
  const tags = [];
  if (document.getElementById('edit-tag-work').checked) tags.push('work');
  if (document.getElementById('edit-tag-priority').checked) tags.push('priority');
  if (document.getElementById('edit-tag-dev').checked) tags.push('dev');
  if (document.getElementById('edit-tag-fast-stream').checked) tags.push('fast stream');
  return tags;
}

// Function to load available tags into a dropdown or checkboxes
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
    const tagContainer = document.getElementById('tag-container');  // Assuming a tag selection container

    tagContainer.innerHTML = '';  // Clear any existing tag options

    tags.forEach(tag => {
      // Create a checkbox for each tag
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = tag.name;
      checkbox.id = `tag-${tag.name}`;

      const label = document.createElement('label');
      label.htmlFor = `tag-${tag.name}`;
      label.textContent = tag.name;

      // Set the background color of the label to the color stored in the database
      label.style.backgroundColor = tag.color;

      tagContainer.appendChild(checkbox);
      tagContainer.appendChild(label);
      tagContainer.appendChild(document.createElement('br'));  // Line break
    });
  } catch (error) {
    console.error('Error loading tags:', error);
    alert('Error loading tags');
  }
}

// Call the loadTags function when the page loads
document.addEventListener('DOMContentLoaded', loadTags);
