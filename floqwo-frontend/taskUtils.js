// Utility functions used by other modules

// Function to calculate the percentage of time passed between creation and due date
function calculateTimePassedPercentage(createdAt, dueDate) {
    const createdTime = new Date(createdAt).getTime();
    const dueTime = new Date(dueDate).getTime();
    const nowTime = Date.now();
  
    const totalTime = dueTime - createdTime;
    const timePassed = nowTime - createdTime;
  
    return (timePassed / totalTime) * 100;
  }
  
  // Function to format the date into "DD/MM/YYYY, HH.MM"
  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year}, ${hours}.${minutes}`;
  }
  
  export { calculateTimePassedPercentage, formatDate };
  