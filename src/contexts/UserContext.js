import React, { createContext, useState, useEffect, useContext } from 'react';

// Create a context with default values
const UserContext = createContext({
  isLoggedIn: false,
  teacherId: null,
  token: null,
  setIsLoggedIn: () => {},
  setTeacherId: () => {},
  setToken: () => {},
  logout: () => {},
});

// Create a provider component
export const UserProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
  const [teacherId, setTeacherId] = useState(localStorage.getItem('teacherId'));
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [expirationDate, setExpirationDate] = useState(localStorage.getItem('expirationDate'));

  // Sync state with localStorage
  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn);
    localStorage.setItem('teacherId', teacherId);
    localStorage.setItem('token', token);
    localStorage.setItem('expirationDate', expirationDate);
  }, [isLoggedIn, teacherId, token, expirationDate]);

  // Log out if the expiration date has passed
  useEffect(() => {
    const checkExpiration = () => {
      if (expirationDate && new Date() > new Date(expirationDate)) {
        logout();
      }
    };

    checkExpiration();
    const interval = setInterval(checkExpiration, 10000 * 60); // Check every minute
    return () => clearInterval(interval);
  }, [expirationDate]);

  const logout = () => {
    setIsLoggedIn(false);
    setTeacherId(null);
    setToken(null);
    setExpirationDate(null);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('teacherId');
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
  };

  return (
    <UserContext.Provider
      value={{
        isLoggedIn,
        teacherId,
        token,
        setIsLoggedIn,
        setTeacherId,
        setToken,
        setExpirationDate,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
