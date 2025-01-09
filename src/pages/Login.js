import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext'; // Import the custom hook

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setIsLoggedIn, setTeacherId, setToken, setExpirationDate } = useUser();
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      // Send login request
      const response = await fetch(`${process.env.REACT_APP_API_URL}/Main/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Update context and localStorage with token and expiration date
        setIsLoggedIn(true);
        setTeacherId(data.teacherId);
        setToken(data.token);

        // Parse and set expiration date in the correct format
        const expirationDate = new Date(data.expiration.split('/').reverse().join('-')).toISOString();
        setExpirationDate(expirationDate);

        // Redirect to home page after successful login
        navigate('/');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="login-register-wrapper">
      <form onSubmit={handleLogin} className="login-register-form">
        <h2>Login</h2>
        <div className="form-element">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
          />
        </div>
        <div className="form-element">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
