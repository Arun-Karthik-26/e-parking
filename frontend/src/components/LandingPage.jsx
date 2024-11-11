// src/components/LandingPage.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleUserLogin = () => {
    navigate('/login-user'); // Redirect to user login page
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-6">Welcome to the Parking Challan System</h1>
      <p className="mb-10 text-lg text-gray-700">Please choose an option to login:</p>

      <div className="flex gap-6">
        <button
          onClick={handleUserLogin}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          User Login
        </button>
        <button
          onClick={handleOfficerLogin}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Officer Login
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
