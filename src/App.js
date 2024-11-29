import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext'; // Import the context provider
import Navbar from './components/Navbar';
import Teacher from './pages/Teacher';
import Classroom from './pages/Classroom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <UserProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/teacher/:name/:title/:id" element={<Teacher />} />
          <Route path="/classroom/:number/:id" element={<Classroom />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;

