// Utility functions used by other modules

// Function to calculate the percentage of time passed between creation and due date
function calculateTimePassedPercentage(createdAt, dueDate) {
  const createdTime = new Date(createdAt).getTime();
  const dueTime = new Date(dueDate).getTime();
  const nowTime = Date.now();

  return ((nowTime - createdTime) / (dueTime - createdTime)) * 100;
}

// Function to format the date into "Day DD/MM/YYYY, HH.MM"
function formatDate(dateString) {
  const date = new Date(dateString);
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayCode = dayNames[date.getDay()];
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${dayCode} ${day}/${month}/${year}, ${hours}.${minutes}`;
}

// Function to sort tasks based on priority, due date first, and creation date second
function sortTasks(tasks) {
  return tasks.sort((a, b) => {
    const aHasPriority = a.tags && a.tags.includes('priority');
    const bHasPriority = b.tags && b.tags.includes('priority');

    if (aHasPriority && !bHasPriority) return -1;
    if (!aHasPriority && bHasPriority) return 1;

    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate) - new Date(b.dueDate);
    }

    if (a.dueDate && !b.dueDate) return -1;
    if (!a.dueDate && b.dueDate) return 1;

    return new Date(a.createdAt) - new Date(b.createdAt);
  });
}

// Function to apply timezone offset and adjust the UTC time to local time
function applyTimezoneOffsetToUTC(inputDateTime) {
  const utcDateTime = new Date(inputDateTime);
  const timezoneOffset = utcDateTime.getTimezoneOffset() * 60000;
  const localDateTime = new Date(utcDateTime.getTime() + timezoneOffset);

  return `${localDateTime.getFullYear()}-${String(localDateTime.getMonth() + 1).padStart(2, '0')}-${String(localDateTime.getDate()).padStart(2, '0')}T${String(localDateTime.getHours()).padStart(2, '0')}:${String(localDateTime.getMinutes()).padStart(2, '0')}:${String(localDateTime.getSeconds()).padStart(2, '0')}`;
}
