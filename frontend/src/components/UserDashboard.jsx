import React from 'react';
import VehicleManagement from './vehiclemanage';
import ChallanManagement from './challanmanagement';


const UserDashboard = () => {
  return (
    <div>
      <h1>Welcome to Your Dashboard</h1>
      <VehicleManagement />
      <ChallanManagement />
    </div>
  );
};

export default UserDashboard;
