import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

function Navbar() {
  const { isLoggedIn, setIsLoggedIn} = useUser();

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <nav>
      <h1>SMS</h1>
      <ul>
        <li><Link to="/">Home</Link></li>

        {/* Conditionally render Register and Login links if not logged in */}
        {!isLoggedIn ? (
          <>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/login">Login</Link></li>
          </>
        ) : (
          <>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/" onClick={handleLogout}>Logout</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
