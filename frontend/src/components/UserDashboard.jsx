import React from "react";
import { Link } from "react-router-dom";
import Img from "../assets/car.jpeg";

const UserDashboard = () => {
  return (
    <div>
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
            <button className="bg-red-600 text-white font-bold px-3 transition duration-300 py-2 rounded-lg hover:bg-red-500">
              LogOut
            </button>
          </div>
        </div>
      </div>

      <div className="px-28 py-16 flex items-center w-full mt-5 mb-10 gap-5">
        <div className="w-[50%]">
          <h1 className="text-4xl font-bold mb-10">
            <span className="text-6xl font-bold text-blue-700">
              Welcome, [User’s Name]!
            </span>
          </h1>
          <p className="text-xl font-semibold mb-10">
            Easily manage your parking records and stay updated with your recent
            transactions. We’re here to make your experience smooth and
            paper-free!
          </p>
          <div className="flex gap-5">
            <Link
              to="/view-challan"
            >
              <button className="bg-blue-600 text-white font-bold px-5 transition duration-300 py-3 rounded-lg hover:bg-blue-500">
                View Challans
              </button>
            </Link>
            <Link to="/add-vehicles">
            <button className="bg-green-600 text-white font-bold px-5 transition duration-300 py-3 rounded-lg hover:bg-green-500">
              Add Vehicles
            </button></Link>
          </div>
        </div>
        <div>
          <img
            src={Img}
            alt="User Dashboard"
            className="w-[600px] mx-auto rounded-xl shadow-md"
          />
        </div>
      </div>

      <footer class="bg-gray-100 text-gray-700 py-2">
        <div class="container mx-auto flex flex-col md:flex-row justify-between items-center md:space-y-0">
          <div class="text-center md:text-left">
            <h4 class="text-xl font-bold text-red-600">Parkify</h4>
            <p>Your Digital Solution for Parking Challans</p>
          </div>

          <div>
            <ul class="flex space-x-4">
              <li>
                <a href="#" class="hover:text-red-600">
                  Home
                </a>
              </li>
              <li>
                <a href="#" class="hover:text-red-600">
                  About
                </a>
              </li>
              <li>
                <a href="#" class="hover:text-red-600">
                  Support
                </a>
              </li>
            </ul>
          </div>

          <div class="text-center md:text-right">
            <p>
              Contact Us:{" "}
              <a href="mailto:support@parkify.com" class="hover:text-red-600">
                support@parkify.com
              </a>
            </p>
            <p>Phone: +91 8248855937</p>
            <div class="flex justify-center md:justify-end space-x-4 mt-2">
              <a href="#" class="hover:text-red-600">
                Facebook
              </a>
              <a href="#" class="hover:text-red-600">
                Twitter
              </a>
              <a href="#" class="hover:text-red-600">
                Instagram
              </a>
            </div>
          </div>
        </div>

        <div class="text-center mt-1 text-sm border-t-2 text-gray-500">
          &copy; 2024 Parkify. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};

export default UserDashboard;
