import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { parse } from 'date-fns';
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
  
      // Determine if response is JSON or plain text
      const contentType = response.headers.get("Content-Type");
      let data;
  
      if (contentType && contentType.includes("application/json")) {
        data = await response.json(); // Parse JSON response
      } else {
        data = await response.text(); // Parse plain text response
      }
  
      if (response.ok) {
        if (typeof data === "string" && data === "User registered successfully") {
          // Automatically log in after successful registration
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
          
            // Check if expiration exists and is valid
            if (loginData.expiration) {
              try {
                const expirationDate = parse(loginData.expiration, 'M/d/yyyy', new Date()).toISOString();
                setExpirationDate(expirationDate);
              } catch (parseError) {
                console.error('Date parsing error:', parseError.message);
                setError('Invalid expiration date received');
                return;
              }
            } else {
              setError('Expiration date is missing in the response');
              return;
            }
          
            // Redirect to home page after successful login
            navigate('/');
          } else {
            console.error('Server error:', loginData);
          
            if (loginData && loginData.message) {
              setError(loginData.message);
            } else {
              setError('An error occurred during login');
            }
          }          
        } else if (data.message) {
          setError(data.message);
        } else {
          setError('Unexpected response format');
        }
      } else {
        setError('An error occurred during registration');
      }
    } catch (err) {
      console.error('Registration Error:', err.message);
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
