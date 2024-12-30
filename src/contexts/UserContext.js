import React, { createContext, useState, useEffect, useContext } from 'react';

// Create a context with default values
const UserContext = createContext({
  isLoggedIn: false,
  teacherId: null,
  setIsLoggedIn: () => {},
  setTeacherId: () => {},
});

// Create a provider component
export const UserProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
  const [teacherId, setTeacherId] = useState(localStorage.getItem('teacherId'));

  // Sync state with localStorage
  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn);
    localStorage.setItem('teacherId', teacherId);
  }, [isLoggedIn, teacherId]);

  return (
    <UserContext.Provider value={{ isLoggedIn, teacherId, setIsLoggedIn, setTeacherId }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
