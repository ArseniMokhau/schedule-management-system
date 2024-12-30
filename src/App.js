import './App.css';
import React, { lazy, useEffect } from 'react'; // { Suspense, lazy, useEffect } 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import Navbar from './components/Navbar';
// import Spinner from './components/Spinner';

// Lazy-load pages
const Home = lazy(() => import('./pages/Home'));
const Register = lazy(() => import('./pages/Register'));
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Teacher = lazy(() => import('./pages/Teacher'));
const Classroom = lazy(() => import('./pages/Classroom'));

// Preload frequently accessed components
function usePreloadRoutes() {
  useEffect(() => {
    import('./pages/Dashboard');
    import('./pages/Home');
  }, []);
}

function App() {
  // Call the preloading function
  usePreloadRoutes();

  return (
    <UserProvider>
      <Router>
        <Navbar />
        {/* Wrap routes in Suspense for fallback UI
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
        */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/teacher/:name/:title/:id" element={<Teacher />} />
            <Route path="/classroom/:campus/:number/:id" element={<Classroom />} />
          </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
