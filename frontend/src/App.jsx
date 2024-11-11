import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserDashboard from './components/UserDashboard';
import Landingpage from './components/LandingPage';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/user" element={<UserDashboard />} />
        <Route path="/officer" element={<Office />} />  {/* Add a route for /user */}
      </Routes>
    </Router>
  );
};

export default App;
