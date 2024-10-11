// Function to handle login
async function handleLogin(event) {
    event.preventDefault(); // Prevent form submission
  
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    try {
      const response = await fetch('https://floqwo-796cad1ba057.herokuapp.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
  
      if (!response.ok) {
        throw new Error('Login failed');
      }
  
      const data = await response.json();
      const token = data.token;
  
      // Store the token in localStorage with an expiration of 14 days
      const expiration = Date.now() + 14 * 24 * 60 * 60 * 1000; // 14 days from now
      localStorage.setItem('token', token);
      localStorage.setItem('tokenExpiration', expiration);
  
      // Redirect to task manager after successful login
      window.location.href = 'index.html';
    } catch (error) {
      document.getElementById('error-message').style.display = 'block';
      console.error('Login error:', error);
    }
  }
  
  // Attach the login handler to the form
  document.getElementById('login-form').addEventListener('submit', handleLogin);
  