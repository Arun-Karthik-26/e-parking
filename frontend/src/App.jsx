import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserDashboard from './components/UserDashboard';
import Landingpage from './components/Landingpage';
import OfficerDashboard from './components/OfficerDashboard';
import VehicleManagement from './components/vehiclemanage';
import ChallanManagement from './components/challanmanagement';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/user" element={<UserDashboard />} />
        <Route path="/officer" element={<OfficerDashboard />} />  {/* Add a route for /user */}
        <Route path="/add-vehicles" element={<VehicleManagement />} />
        <Route path="/view-challan" element={<ChallanManagement />} />

      </Routes>
    </Router>
  );
};

export default App;
