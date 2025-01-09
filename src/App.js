import './App.css';
import React, { lazy, useEffect, Suspense } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import Navbar from './components/Navbar';
import Spinner from './components/Spinner';

// Lazy-load pages
const Home = lazy(() => import('./pages/Home'));
const Register = lazy(() => import('./pages/Register'));
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Teacher = lazy(() => import('./pages/Teacher'));
const Classroom = lazy(() => import('./pages/Classroom'));

function usePreloadRoutes() {
  useEffect(() => {
    import('./pages/Dashboard');
    import('./pages/Home');
    import('./pages/Teacher');
    import('./pages/Classroom');
  }, []);
}

function App() {
  usePreloadRoutes();

  return (
    <UserProvider>
      <Router>
        <Navbar />
        <Suspense fallback={<Spinner />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/teacher/:name/:title/:id" element={<Teacher />} />
            <Route path="/classroom/:campus/:number/:id" element={<Classroom />} />
          </Routes>
        </Suspense>
      </Router>
    </UserProvider>
  );
}

export default App;
