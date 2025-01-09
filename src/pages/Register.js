import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const { setIsLoggedIn, setTeacherId, setToken, setExpirationDate } = useUser();
  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();

    try {
      // Register the user
      const response = await fetch(`${process.env.REACT_APP_API_URL}/Main/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, title }),
      });

      const data = await response.json();

      if (response.ok) {
        // On successful registration, automatically log in
        const loginResponse = await fetch(`${process.env.REACT_APP_API_URL}/Main/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });

        const loginData = await loginResponse.json();

        if (loginResponse.ok) {
          // Update context and localStorage
          setIsLoggedIn(true);
          setTeacherId(loginData.teacherId);
          setToken(loginData.token);

          // Parse and set expiration date
          const expirationDate = new Date(loginData.expiration.split('/').reverse().join('-')).toISOString();
          setExpirationDate(expirationDate);

          // Redirect to home page after successful login
          navigate('/');
        } else {
          setError(loginData.message || 'Login failed');
        }
      } else {
        // Display server-provided error message
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="login-register-wrapper">
      <form onSubmit={handleRegister} className="login-register-form">
        <h2>Register</h2>
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
        <div className="form-element">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
