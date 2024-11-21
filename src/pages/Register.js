import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext'; // Import the custom hook

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const { setIsLoggedIn, setTeacherId } = useUser();
  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();

    // Register the user
    const response = await fetch(`${process.env.REACT_APP_API_URL}/Main/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, title }),
    });

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

        // Redirect to home page after successful login
        navigate('/');
      } else {
        setError('Login failed');
      }
    } else {
      setError('Registration failed');
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
        {error && <p>{error}</p>}
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
