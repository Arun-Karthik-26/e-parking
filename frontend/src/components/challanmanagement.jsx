import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ChallanManagement = () => {
  const [challans, setChallans] = useState([]);

  // Function to load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const fetchChallans = async () => {
    try {
      const response = await axios.get('http://localhost:5000/challans/1'); // Replace with logged-in user ID
      setChallans(response.data);
    } catch (err) {
      console.error('Error fetching challans', err);
    }
  };

  const handlePayment = async () => {
    const res = await loadRazorpayScript();
    const amount = 500;
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const options = {
      key: "rzp_test_4rdgre6savrrmw", // Razorpay test key
      amount: amount * 100, // Amount in paise
      currency: "INR",
      name: "Parkify",
      description: "Challan Payment",
      handler: async function (response) {
        alert(`Payment successful: ${response.razorpay_payment_id}`);
        
        // Call your backend to store payment details
        await storePaymentDetails(response.razorpay_payment_id, challanId);

        // Update challan status
        setChallans(challans.map(challan => challan.id === challanId ? { ...challan, status: 'paid' } : challan));
      },
      prefill: {
        name: localStorage.getItem("name") || "User",
        email: localStorage.getItem("email") || "user@example.com",
        contact: localStorage.getItem("mobile") || "9999999999",
      },
      notes: {
        address: "Parkify Office",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const handleAppealChallan = async (challanId) => {
    try {
      await axios.post(`http://localhost:5000/appeal-challan/${challanId}`);
      setChallans(challans.map(challan => challan.id === challanId ? { ...challan, appeal_status: 'pending' } : challan));
    } catch (err) {
      console.error('Error appealing challan', err);
    }
  };

  const storePaymentDetails = async (paymentId, challanId) => {
    try {
      // Store payment details in the backend for the specific challan
      await axios.post('http://localhost:5000/store-payment', {
        paymentId,
        challanId,
      });
    } catch (error) {
      console.error('Error storing payment details', error);
    }
  };

  useEffect(() => {
    fetchChallans();
  }, []);

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
                to="#"
                className="text-xl font-semibold hover:text-red-600 transition duration-300"
              >
                View Challan
              </Link>
            </li>
          </ul>
          <div className="flex gap-3">
            <button className="bg-red-600 text-white font-bold px-3 transition duration-300 py-2 rounded-lg hover:bg-red-500">
              LogOut
            </button>
          </div>
        </div>
      </div>
      <h3 className="text-3xl font-bold mb-8 text-center text-gray-700 mt-10">Your Challans</h3>
      
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="min-w-full bg-white rounded-lg border border-gray-200">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Challan Number</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Actions</th>
              <button
                        onClick={() => handlePayment()}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200 text-sm font-medium"
                      >
                        Pay
                      </button>
            </tr>
          </thead>
          <tbody>
            {challans.map(challan => (
              <tr key={challan.id} className="border-b border-gray-200">
                <td className="px-6 py-4 whitespace-nowrap text-gray-800 text-sm font-semibold">
                  {challan.challan_number}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-800 text-sm font-semibold">
                  ${challan.amount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-800 text-sm font-semibold">
                  {challan.status === 'unpaid' ? (
                    <span className="bg-red-100 text-red-600 py-1 px-3 rounded-full text-xs font-medium">
                      Unpaid
                    </span>
                  ) : (
                    <span className="bg-green-100 text-green-600 py-1 px-3 rounded-full text-xs font-medium">
                      Paid
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    {challan.status === 'unpaid' ? (
                      <button
                        onClick={() => handlePayment(challan.id, challan.amount)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200 text-sm font-medium"
                      >
                        Pay
                      </button>
                    ) : (
                      <button
                        disabled
                        className="bg-gray-300 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium"
                      >
                        Paid
                      </button>
                    )}
                    {challan.appeal_status === 'pending' ? (
                      <button
                        disabled
                        className="bg-yellow-300 text-yellow-700 px-4 py-2 rounded-lg text-sm font-medium"
                      >
                        Appeal Pending
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAppealChallan(challan.id)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition duration-200 text-sm font-medium"
                      >
                        Appeal
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ChallanManagement;
