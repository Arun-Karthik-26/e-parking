import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/Landingpage';
import OfficerDashboard from './components/OfficerDashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/officer" element={<OfficerDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
