import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChallanManagement = () => {
  const [challans, setChallans] = useState([]);

  const fetchChallans = async () => {
    try {
      const response = await axios.get('http://localhost:5000/challans/1'); // Replace with logged-in user ID
      setChallans(response.data);
    } catch (err) {
      console.error('Error fetching challans', err);
    }
  };

  const handlePayChallan = async (challanId) => {
    try {
      await axios.post(`http://localhost:5000/pay-challan/${challanId}`);
      setChallans(challans.map(challan => challan.id === challanId ? { ...challan, status: 'paid' } : challan));
    } catch (err) {
      console.error('Error paying challan', err);
    }
  };

  const handleAppealChallan = async (challanId) => {
    try {
      await axios.post(`http://localhost:5000/appeal-challan/${challanId}`);
      setChallans(challans.map(challan => challan.id === challanId ? { ...challan, appeal_status: 'pending' } : challan));
    } catch (err) {
      console.error('Error appealing challan', err);
    }
  };

  useEffect(() => {
    fetchChallans();
  }, []);

  return (
    <div>
      <h3>Your Challans</h3>
      <table>
        <thead>
          <tr>
            <th>Challan Number</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {challans.map(challan => (
            <tr key={challan.id}>
              <td>{challan.challan_number}</td>
              <td>{challan.amount}</td>
              <td>{challan.status}</td>
              <td>
                {challan.status === 'unpaid' ? (
                  <button onClick={() => handlePayChallan(challan.id)}>Pay</button>
                ) : (
                  <button disabled>Paid</button>
                )}
                {challan.appeal_status === 'pending' ? (
                  <button disabled>Appeal Pending</button>
                ) : (
                  <button onClick={() => handleAppealChallan(challan.id)}>Appeal</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ChallanManagement;