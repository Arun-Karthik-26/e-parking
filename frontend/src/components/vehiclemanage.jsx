import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState([]);
  const [newVehicle, setNewVehicle] = useState({ vehicleNumber: '', vehicleType: '', model: '', color: '' });
  const [vehicleToUpdate, setVehicleToUpdate] = useState(null); // State for the vehicle being updated
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId'); // Ensure this is set during login

  // If no userId, redirect to login
  if (!userId) {
    navigate('/');
  }

  // Fetch Vehicles of the user
  const fetchVehicles = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/get-vehicle/${userId}`);
      setVehicles(response.data);
    } catch (err) {
      console.error('Error fetching vehicles', err);
    }
  };

  // Add a new vehicle
  const handleAddVehicle = async () => {
    try {
      const response = await axios.post('http://localhost:5000/add-vehicle', { ...newVehicle, userId });
      setVehicles([...vehicles, { ...newVehicle, id: response.data.vehicleId }]); // Add the new vehicle to the list
      setNewVehicle({ vehicleNumber: '', vehicleType: '', model: '', color: '' }); // Clear form
    } catch (err) {
      console.error('Error adding vehicle', err);
    }
  };

  // Delete a vehicle
  const handleDeleteVehicle = async (vehicleId) => {
    try {
      await axios.delete(`http://localhost:5000/delete-vehicle/${vehicleId}`);
      setVehicles(vehicles.filter(vehicle => vehicle.id !== vehicleId));
    } catch (err) {
      console.error('Error deleting vehicle', err);
    }
  };

  // Update vehicle information
  const handleUpdateVehicle = async (vehicleId, updatedVehicle) => {
    try {
      const response = await axios.put(`http://localhost:5000/update-vehicle/${vehicleId}`, { ...updatedVehicle, userId });
      setVehicles(vehicles.map(vehicle => (vehicle.id === vehicleId ? { ...vehicle, ...updatedVehicle } : vehicle)));
      setVehicleToUpdate(null); // Clear the form after successful update
    } catch (err) {
      console.error('Error updating vehicle', err);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h3 className="text-2xl font-semibold mb-6 text-center">Manage Your Vehicles</h3>

      {/* Add New Vehicle Section */}
      <div className="mb-6">
        <h4 className="text-xl font-medium mb-2">Add New Vehicle</h4>
        <div className="space-y-4">
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-md"
            value={newVehicle.vehicleNumber}
            onChange={(e) => setNewVehicle({ ...newVehicle, vehicleNumber: e.target.value })}
            placeholder="Vehicle Number"
          />
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-md"
            value={newVehicle.vehicleType}
            onChange={(e) => setNewVehicle({ ...newVehicle, vehicleType: e.target.value })}
            placeholder="Vehicle Type"
          />
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-md"
            value={newVehicle.model}
            onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
            placeholder="Model"
          />
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-md"
            value={newVehicle.color}
            onChange={(e) => setNewVehicle({ ...newVehicle, color: e.target.value })}
            placeholder="Color"
          />
          <button
            onClick={handleAddVehicle}
            className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-700"
          >
            Add Vehicle
          </button>
        </div>
      </div>

      {/* List of Vehicles */}
      <div>
        <h4 className="text-xl font-medium mb-2">Your Vehicles</h4>
        <ul className="space-y-4">
          {vehicles.map(vehicle => (
            <li key={vehicle.id} className="flex items-center justify-between p-4 bg-gray-100 rounded-md shadow-md">
              <div>
                <p className="text-lg font-medium">{vehicle.vehicle_number}</p>
                <p className="text-sm text-gray-600">{vehicle.vehicle_type} - {vehicle.model} ({vehicle.color})</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setVehicleToUpdate(vehicle)} // Set the vehicle for updating
                  className="bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-700"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDeleteVehicle(vehicle.id)}
                  className="bg-red-500 text-white p-2 rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Update Vehicle Form */}
      {vehicleToUpdate && (
        <div className="mt-6 p-4 border border-gray-300 rounded-md">
          <h4 className="text-xl font-medium mb-2">Update Vehicle</h4>
          <div className="space-y-4">
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-md"
              value={vehicleToUpdate.vehicle_number}
              onChange={(e) => setVehicleToUpdate({ ...vehicleToUpdate, vehicle_number: e.target.value })}
              placeholder="Vehicle Number"
            />
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-md"
              value={vehicleToUpdate.vehicle_type}
              onChange={(e) => setVehicleToUpdate({ ...vehicleToUpdate, vehicle_type: e.target.value })}
              placeholder="Vehicle Type"
            />
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-md"
              value={vehicleToUpdate.model}
              onChange={(e) => setVehicleToUpdate({ ...vehicleToUpdate, model: e.target.value })}
              placeholder="Model"
            />
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-md"
              value={vehicleToUpdate.color}
              onChange={(e) => setVehicleToUpdate({ ...vehicleToUpdate, color: e.target.value })}
              placeholder="Color"
            />
            <button
              onClick={() => handleUpdateVehicle(vehicleToUpdate.id, vehicleToUpdate)}
              className="w-full bg-green-500 text-white p-3 rounded-md hover:bg-green-700"
            >
              Update Vehicle
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleManagement;
