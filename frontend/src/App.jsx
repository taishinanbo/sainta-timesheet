import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

import Headerbar from './components/Headerbar';
import Login from './pages/Login';
import Register from './pages/RegisterEmployee';

import './assets/css/Toast.css'; // Importing Toast styles
import './assets/css/LoadingModal.css'; // Importing LoadingModal styles
import './assets/css/All.css'; // Importing global styles


function App() {
  return (
    <>
      <Headerbar />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Add other routes here */}
          
          {/* Catch-all route for 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;