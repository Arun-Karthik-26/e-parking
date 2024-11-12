import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";


const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState([]);
  const [newVehicle, setNewVehicle] = useState({
    vehicleNumber: "",
    vehicleType: "",
    model: "",
    color: "",
  });
  const [vehicleToUpdate, setVehicleToUpdate] = useState(null); // State for the vehicle being updated
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId"); // Ensure this is set during login

  // If no userId, redirect to login
  if (!userId) {
    navigate("/");
  }

  // Fetch Vehicles of the user
  const fetchVehicles = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/get-vehicle/${userId}`
      );
      setVehicles(response.data);
    } catch (err) {
      console.error("Error fetching vehicles", err);
    }
  };

  // Add a new vehicle
  const handleAddVehicle = async () => {
    try {
      const response = await axios.post("http://localhost:5000/add-vehicle", {
        ...newVehicle,
        userId,
      });
      setVehicles([
        ...vehicles,
        { ...newVehicle, id: response.data.vehicleId },
      ]); // Add the new vehicle to the list
      setNewVehicle({
        vehicleNumber: "",
        vehicleType: "",
        model: "",
        color: "",
      }); // Clear form
    } catch (err) {
      console.error("Error adding vehicle", err);
    }
  };

  // Delete a vehicle
  const handleDeleteVehicle = async (vehicleId) => {
    try {
      await axios.delete(`http://localhost:5000/delete-vehicle/${vehicleId}`);
      setVehicles(vehicles.filter((vehicle) => vehicle.id !== vehicleId));
    } catch (err) {
      console.error("Error deleting vehicle", err);
    }
  };

  // Update vehicle information
  const handleUpdateVehicle = async (vehicleId, updatedVehicle) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/update-vehicle/${vehicleId}`,
        { ...updatedVehicle, userId }
      );
      setVehicles(
        vehicles.map((vehicle) =>
          vehicle.id === vehicleId ? { ...vehicle, ...updatedVehicle } : vehicle
        )
      );
      setVehicleToUpdate(null); // Clear the form after successful update
    } catch (err) {
      console.error("Error updating vehicle", err);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleLogOut = () => {
    // Clear any necessary data (e.g., user authentication details)
    localStorage.clear(); // or remove specific items if needed

    // Navigate to the root route
    navigate('/');
  };


  return (
    <div className=" mx-auto">
      <div className="flex bg-white justify-between items-center sticky top-0 z-10 px-28 mt-5 shadow-lg pb-5">
        <div>
          <h1 className="text-4xl font-bold">Parkify</h1>
        </div>
        <div className="flex items-center gap-10">
          <ul className="flex gap-8 items-center">
            <li>
              <Link
                to="/user"
                className="text-xl font-semibold hover:text-red-600 transition duration-300"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/add-vehicles"
                className="text-xl font-semibold hover:text-red-600 transition duration-300"
              >
                Add Vehicles
              </Link>
            </li>
            <li>
              <Link
                to="/view-challan"
                className="text-xl font-semibold hover:text-red-600 transition duration-300"
              >
                View Challan
              </Link>
            </li>
          </ul>
          <div className="flex gap-3">
            <button 
            onClick={handleLogOut}
            className="bg-red-600 text-white font-bold px-3 transition duration-300 py-2 rounded-lg hover:bg-red-500">
              LogOut
            </button>
          </div>
        </div>
      </div>
      <h3 className="text-3xl mt-10 font-bold mb-8 text-center text-gray-700">
        Manage Your Vehicles
      </h3>

      {/* Add New Vehicle Section */}
      <div className="mb-10 p-6 bg-white rounded-lg shadow-lg">
        <h4 className="text-2xl font-semibold mb-4 text-gray-800">
          Add New Vehicle
        </h4>
        <div className="space-y-4">
          <input
            type="text"
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={newVehicle.vehicleNumber}
            onChange={(e) =>
              setNewVehicle({ ...newVehicle, vehicleNumber: e.target.value })
            }
            placeholder="Vehicle Number"
          />
          <input
            type="text"
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={newVehicle.vehicleType}
            onChange={(e) =>
              setNewVehicle({ ...newVehicle, vehicleType: e.target.value })
            }
            placeholder="Vehicle Type"
          />
          <input
            type="text"
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={newVehicle.model}
            onChange={(e) =>
              setNewVehicle({ ...newVehicle, model: e.target.value })
            }
            placeholder="Model"
          />
          <input
            type="text"
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={newVehicle.color}
            onChange={(e) =>
              setNewVehicle({ ...newVehicle, color: e.target.value })
            }
            placeholder="Color"
          />
          <button
            onClick={handleAddVehicle}
            className="w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-500 transition duration-300"
          >
            Add Vehicle
          </button>
        </div>
      </div>

      {/* List of Vehicles */}
      <div className="mb-10 p-6 bg-white rounded-lg shadow-lg">
        <h4 className="text-2xl font-semibold mb-4 text-gray-800">
          Your Vehicles
        </h4>
        <ul className="space-y-4">
          {vehicles.map((vehicle) => (
            <li
              key={vehicle.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow"
            >
              <div>
                <p className="text-lg font-semibold text-gray-800">
                  {vehicle.vehicle_number}
                </p>
                <p className="text-sm text-gray-600">
                  {vehicle.vehicle_type} - {vehicle.model} ({vehicle.color})
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setVehicleToUpdate(vehicle)} // Set the vehicle for updating
                  className="bg-yellow-500 text-white font-bold px-4 py-2 rounded-lg hover:bg-yellow-600 transition duration-300"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDeleteVehicle(vehicle.id)}
                  className="bg-red-500 text-white font-bold px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
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
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <h4 className="text-2xl font-semibold mb-4 text-gray-800">
            Update Vehicle
          </h4>
          <div className="space-y-4">
            <input
              type="text"
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={vehicleToUpdate.vehicle_number}
              onChange={(e) =>
                setVehicleToUpdate({
                  ...vehicleToUpdate,
                  vehicle_number: e.target.value,
                })
              }
              placeholder="Vehicle Number"
            />
            <input
              type="text"
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={vehicleToUpdate.vehicle_type}
              onChange={(e) =>
                setVehicleToUpdate({
                  ...vehicleToUpdate,
                  vehicle_type: e.target.value,
                })
              }
              placeholder="Vehicle Type"
            />
            <input
              type="text"
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={vehicleToUpdate.model}
              onChange={(e) =>
                setVehicleToUpdate({
                  ...vehicleToUpdate,
                  model: e.target.value,
                })
              }
              placeholder="Model"
            />
            <input
              type="text"
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={vehicleToUpdate.color}
              onChange={(e) =>
                setVehicleToUpdate({
                  ...vehicleToUpdate,
                  color: e.target.value,
                })
              }
              placeholder="Color"
            />
            <button
              onClick={() =>
                handleUpdateVehicle(vehicleToUpdate.id, vehicleToUpdate)
              }
              className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-500 transition duration-300"
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
