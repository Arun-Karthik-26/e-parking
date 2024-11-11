// frontend/src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import UserDashboard from './components/UserDashboard';
import OfficerDashboard from './components/OfficerDashboard';
import LandingPage from './components/LandingPage';

function App() {
  

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/user" element={<UserDashboard />} />
        <Route path="/officer" element={<OfficerDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
