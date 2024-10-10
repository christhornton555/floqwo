const apiUrl = 'http://localhost:3000/api/tasks'; // Your backend API

console.log(apiUrl)

// Function to fetch and display tasks
async function fetchTasks() {
    console.log("Fetching tasks now")
    const response = await fetch(apiUrl);
    const tasks = await response.json();
    const taskList = document.getElementById('task-list');

    // Clear existing tasks
    taskList.innerHTML = '';

    // Loop through tasks and display them
    tasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.innerHTML = `
            <span>${task.title}: ${task.description} [${task.status}]</span>
            <button onclick="deleteTask('${task._id}')">Delete</button>
        `;
        taskList.appendChild(taskItem);
    });
    console.log("Tasks fetched")
}

// Function to add a new task
async function addTask(event) {
    event.preventDefault();

    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-description').value;

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description })
    });

    if (response.ok) {
        fetchTasks();  // Refresh the task list after adding
        document.getElementById('task-form').reset();  // Clear form
    } else {
        alert('Failed to add task');
    }
}

// Function to delete a task
async function deleteTask(taskId) {
    const response = await fetch(`${apiUrl}/${taskId}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        fetchTasks();  // Refresh the task list after deletion
    } else {
        alert('Failed to delete task');
    }
}

// Event listener for form submission
document.getElementById('task-form').addEventListener('submit', addTask);

// Fetch tasks when the page loads
fetchTasks();
