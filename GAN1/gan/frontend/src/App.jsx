import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Generate from './pages/Generate';
import UserImages from './pages/UserImages';
import Profile from './pages/Profile';

// Function to check if user is logged in
const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// Private Route Component
const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route 
          path="/" 
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/About" 
          element={
            <PrivateRoute>
              <About />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/contact" 
          element={
            <PrivateRoute>
              <Contact />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/Generate" 
          element={
            <PrivateRoute>
              <Generate />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/userimages" 
          element={
            <PrivateRoute>
              <UserImages />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer/>
    </div>
  );
};

export default App;
