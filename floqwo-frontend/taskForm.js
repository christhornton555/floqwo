// Handle adding & editing tasks

// Function to get selected tags from the add task form
function getSelectedTags() {
  const tags = [];
  if (document.getElementById('tag-work').checked) tags.push('work');
  if (document.getElementById('tag-fast-stream').checked) tags.push('fast stream');
  if (document.getElementById('tag-priority').checked) tags.push('priority');
  if (document.getElementById('tag-dev').checked) tags.push('dev');
  return tags;
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
