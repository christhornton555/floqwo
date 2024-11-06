import { apiUrl } from '../api.js'; // Now apiUrl can be used throughout this file without errors

export async function updateTaskSummary() {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/tasks`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) throw new Error('Failed to fetch tasks');
  
      const tasks = await response.json();
      const today = new Date().toISOString().slice(0, 10);
  
      const relevantTasks = tasks.filter(task => {
        const isDueByToday = task.dueDate && task.dueDate.slice(0, 10) <= today;
        const isOpen = task.status !== 'completed';
        const isCompletedToday = task.status === 'completed' && task.completedAt && task.completedAt.slice(0, 10) === today;
        return isDueByToday && (isOpen || isCompletedToday);
      });
  
      const completedCount = relevantTasks.filter(task => task.status === 'completed').length;
      const totalCount = relevantTasks.length;
  
      document.getElementById('task-summary').textContent = `${completedCount}/${totalCount}`;
    } catch (error) {
      console.error('Error updating task summary:', error);
    }
  }
  