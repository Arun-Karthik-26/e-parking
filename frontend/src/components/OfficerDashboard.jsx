import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';


const OfficerDashboard = () => {
  const [challans, setChallans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [violations, setViolations] = useState([]); // State to store fetched violations
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  // State for form visibility
  const [newChallan, setNewChallan] = useState({
    vehicleNumber: "",
    vehicleType: "",
    issueDate: "",
    amount: "",
    issueType: "", // New field for issue type
  }); // State for new challan data

  const fetchViolations = async () => {
    try {
      const response = await axios.get("http://localhost:5000/violations");
      setViolations(response.data);
    } catch (error) {
      console.error("Error fetching violations:", error);
    }
  };

  const fetchChallans = async () => {
    try {
      const officerId = localStorage.getItem("userId");
      if (!officerId) {
        console.error("Officer ID not found in localStorage");
        return;
      }
      const response = await axios.get(`http://localhost:5000/challans?officerId=${officerId}`);
      setChallans(response.data);
      console.log(challans);
    } catch (error) {
      console.error("Error fetching challans:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchChallans(), fetchViolations()]);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleLogOut = () => {
    // Clear any necessary data (e.g., user authentication details)
    localStorage.clear(); // or remove specific items if needed

    // Navigate to the root route
    navigate('/');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Update amount when issueType changes
    if (name === 'issueType') {
      const selectedViolation = violations.find((violation) => violation.description === value);
      
      if (selectedViolation) {
        setNewChallan({
          ...newChallan,
          issueType: value,
          amount: selectedViolation.amount, // Set the corresponding amount
        });
      } else {
        // If no violation found, reset amount to empty or default value
        setNewChallan({
          ...newChallan,
          issueType: value,
          amount: '', // Or set to 0 if you want to default to 0
        });
      }
    } else {
      setNewChallan({
        ...newChallan,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send the new challan data to backend
    const officerId = localStorage.getItem("userId");

  // Add officerId to the newChallan object
  const challanData = {
    ...newChallan,
    officerId, // Include the officerId
  };
  console.log(challanData);
  // Send the new challan data to the backend
  axios
    .post("http://localhost:5000/add-challans", challanData)
    .then((response) => {
      alert("Challan issued successfully");
      setChallans([...challans, response.data]); // Add new challan to the list
      setShowForm(false); // Close the form after successful submission
    })
    .catch((error) => {
      alert("Failed to issue challan");
      console.error(error);
    });
  };

  return (
    <div className="bg-gray-50">
      {/* Header */}
      <header className="bg-white px-28 flex justify-between items-center py-5 shadow-lg mb-8">
        <h1 className="text-4xl font-bold">Officer Dashboard</h1>
        <button onClick={handleLogOut}
        className="bg-red-600 text-white font-bold px-3 transition duration-300 py-2 rounded-lg hover:bg-red-500">
          LogOut
        </button>
      </header>

      {/* Dashboard Stats */}
      <section className="flex gap-6 mb-6 px-28">
        <div className="bg-white p-4 rounded-md shadow-md flex-1 text-center">
          <div className="text-lg font-semibold">Total Challans</div>
          <div className="text-2xl">{challans.length}</div>
        </div>
        <div className="bg-white p-4 rounded-md shadow-md flex-1 text-center">
          <div className="text-lg font-semibold">Paid</div>
          <div className="text-2xl">
            {challans.filter((c) => c.status === "Paid").length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-md shadow-md flex-1 text-center">
          <div className="text-lg font-semibold">Not Paid</div>
          <div className="text-2xl">
            {challans.filter((c) => c.status === "Unpaid").length}
          </div>
        </div>
      </section>

      {/* Issue Challan Button */}
      <button
        className="bg-red-600 text-white py-2 px-6 ml-28 rounded-lg mb-6 hover:bg-red-500 transition duration-300"
        onClick={() => setShowForm(true)} // Show form when button is clicked
      >
        Issue New Challan
      </button>

 {/* New Challan Form Modal */}
 {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-md w-96">
            <h2 className="text-2xl font-semibold mb-4">Issue New Challan</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Vehicle Number
                </label>
                <input
                  type="text"
                  name="vehicleNumber"
                  value={newChallan.vehicleNumber}
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Vehicle Type
                </label>
                <input
                  type="text"
                  name="vehicleType"
                  value={newChallan.vehicleType}
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Issue Date
                </label>
                <input
                  type="date"
                  name="issueDate"
                  value={newChallan.issueDate}
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Issue Type
                </label>
                <select
                  name="issueType"
                  value={newChallan.issueType}
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select Issue Type</option>
                  {violations.map((violation) => (
                    <option key={violation.id} value={violation.description}>
                      {violation.description}
                    </option>
                  ))}
                </select>
              </div>
              <input
  type="number"
  name="amount"
  value={newChallan.amount} // Bind to state
  onChange={handleInputChange}
  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
  readOnly
  required
/>


              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-700 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                >
                  Issue Challan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Challans Table */}
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden mt-8">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-6 text-left">Challan ID</th>
            <th className="py-3 px-6 text-left">Vehicle Number</th>
            <th className="py-3 px-6 text-left">Issue Date</th>
            <th className="py-3 px-6 text-left">Status</th>
            <th className="py-3 px-6 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="5" className="text-center py-4">
                Loading...
              </td>
            </tr>
          ) : (
            challans.map((challan) => (
              <tr key={challan.id} className="border-t">
                <td className="py-3 px-6">{challan.challanId}</td>
                <td className="py-3 px-6">{challan.vehicleNumber}</td>
                <td className="py-3 px-6">{challan.issueDate}</td>
                <td className="py-3 px-6">{challan.status}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>


      {/* Footer */}
      <footer className="mt-8 text-center">
        <p>About | Contact | Privacy Policy</p>
      </footer>
    </div>
  );
};

export default OfficerDashboard;