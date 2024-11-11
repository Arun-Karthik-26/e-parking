import React, { useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import img from "../assets/landing.jpg";
import axios from "axios";
import { useNavigate } from 'react-router-dom'; // Import useNavigate
 // Make sure the path to your image is correct

const Landingpage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    terms: false,
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    terms: "",
  });
  const [isFormVisible, setIsFormVisible] = useState(false); // Control the visibility of the form
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate(); // Define navigate here
  // Track if it's login or signup

  // Handle changes in the form fields
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Form submission and validation
  const handleSubmit = async (e) => {
    e.preventDefault();
    let valid = true;
    let newErrors = { name: "", email: "", password: "", terms: "" };

    if (!form.email.trim()) {
      newErrors.email = "Enter Your Email";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Email Format is Incorrect";
      valid = false;
    }
    if (!form.password.trim()) {
      newErrors.password = "Enter Your Password";
      valid = false;
    } else if (form.password.length < 6) {
      newErrors.password = "Minimum Length should be 6";
      valid = false;
    }
    if (!isLogin && !form.name.trim()) {
      newErrors.name = "Enter Your Name";
      valid = false;
    }
    if (!isLogin && !form.terms) {
      newErrors.terms = "You Must Agree to the Terms and Conditions";
      valid = false;
    }

    setErrors(newErrors);

    if (valid) {
      const endpoint = isLogin ? "http://localhost:5000/login" : "http://localhost:5000/register"; // Use the appropriate endpoint for login or registration
      const requestData = {
        email: form.email,
        password: form.password,
        ...(isLogin ? {} : { name: form.name }), // Add name and terms only if it's registration
      };

      try {
        const response = await axios.post(endpoint, requestData);

        if (response.status === 200) {
          alert(isLogin ? "Successfully Logged In!" : "Successfully Registered!!!");
  
          const role = response.data.role; // Ensure this matches the backend response
          const id = response.data.id;
          localStorage.setItem('userId', id);  // Store userId in localStorage
          if (role === "User") {
            navigate('/user');
          } else if (role === "Officer") {
            navigate('/officer');
          }
        }
      } 
       
      catch (error) {
        console.error("Error:", error);
        alert("An error occurred while submitting the form. Please try again.");
      }
    } else {
      alert("Form validation failed. Please check the input fields.");
    }
  };

  // Toggle the visibility of the form
  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  // Toggle between login and signup forms
  const toggleFormType = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div>
      {/* Form (Login/SignUp) */}
      <form
        onSubmit={handleSubmit}
        className={`fixed min-h-screen m-auto pt-[10%] bg-gray-50 bg-opacity-50 transition-all duration-500 ${
          isFormVisible ? "right-0" : "right-[-100%]"
        }`}
      >
        <div className="flex w-[50%] m-auto shadow-inherit">
          <div className="bg-[#3786be] text-white w-[50%] p-6 rounded-s-lg">
            <h1 className="text-white text-3xl font-bold py-5">INFORMATION</h1>
            <p className="text-[15px]">
              Welcome! Please provide your details in the form. Your information will help us personalize your experience and keep you updated on the latest features and offerings.
            </p>
            <button
              type="button"
              className="px-6 py-2 rounded-md bg-white text-black mt-3 hover:scale-105 transition font-semibold"
              onClick={toggleFormType}
            >
              {isLogin ? "Create an account" : "Have an account"}
            </button>
          </div>

          <div className="bg-white w-[50%] p-6 rounded-e-lg relative">
            <IoCloseSharp
              className="absolute right-0 mr-5 cursor-pointer"
              onClick={toggleFormVisibility}
            />
            <h1 className="text-black text-3xl font-bold py-5">
              {isLogin ? "LOGIN" : "REGISTER FORM"}
            </h1>

            {!isLogin && (
              <>
                <p className="font-medium">Name</p>
                <input
                  type="text"
                  id="Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="border border-black w-full px-4 p-1 mb-2"
                />
                <span id="mes" className="text-xs text-red-700 mb-6">
                  {errors.name}
                </span>
              </>
            )}

            <p className="font-medium">Your Email</p>
            <input
              type="email"
              id="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="border border-black w-full px-4 mb-2 p-1"
            />
            <span id="mai" className="text-xs text-red-700 mb-6">
              {errors.email}
            </span>

            <p className="font-medium">Password</p>
            <input
              type="password"
              id="Password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="border border-black w-full px-4 mb-2 p-1"
            />
            <span id="pas" className="text-xs text-red-700 mb-6">
              {errors.password}
            </span>

            {!isLogin && (
              <>
                <div className="flex justify-start gap-2 mb-2">
                  <input
                    type="checkbox"
                    className="cursor-pointer"
                    id="che"
                    name="terms"
                    checked={form.terms}
                    onChange={handleChange}
                  />
                  <p className="font-medium">
                    I agree to the{" "}
                    <span className="underline text-blue-500 cursor-pointer">
                      Terms and Conditions
                    </span>
                  </p>
                </div>
                <span id="ter" className="text-xs text-red-700 mb-6">
                  {errors.terms}
                </span>
              </>
            )}

            <button
              type="submit"
              className="px-6 py-2 rounded-md bg-[#3786be] text-white hover:scale-105 transition font-semibold"
              id="btn"
            >
              {isLogin ? "Log In" : "Register"}
            </button>
          </div>
        </div>
      </form>

      {/* Navigation Bar */}
      <div className="flex bg-white justify-between items-center sticky top-0 z-10 px-28 mt-5 shadow-lg pb-5">
        <div>
          <h1 className="text-4xl font-bold">Parkify</h1>
        </div>
        <div className="flex items-center gap-10">
          <ul className="flex gap-8 items-center">
            <li>
              <a
                href="#"
                className="text-xl font-semibold hover:text-red-600 transition duration-300"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-xl font-semibold hover:text-red-600 transition duration-300"
              >
                About
              </a>
            </li>
          </ul>
          <div className="flex gap-3">
            <button
              className="bg-red-600 text-white font-bold px-3 transition duration-300 py-2 rounded-lg hover:bg-red-500"
              onClick={() => {
                setIsLogin(true); 
                toggleFormVisibility(); // Open form and show login
              }}
            >
              LogIn
            </button>
            <button
              className="bg-gray-600 text-white font-bold px-3 transition duration-300 py-2 rounded-lg hover:bg-gray-500"
              onClick={() => {
                setIsLogin(false); 
                toggleFormVisibility(); // Open form and show signup
              }}
            >
              SignUp
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-28 py-16 flex items-center w-full gap-5">
        <div className="w-[50%]">
          <h1 className="text-4xl font-bold mb-10">
            <span className="text-6xl font-bold text-red-700">Welcome to Parkify</span> – Your Digital Solution for Parking Challans!
          </h1>
          <p className="text-xl font-semibold mb-10">
            Manage, search, and pay your parking challans with ease. Say goodbye to paperwork!
          </p>
          <div className="flex gap-5">
          <button onClick={() => {
                setIsLogin(true); 
                toggleFormVisibility(); // Open form and show login
              }} className="bg-red-600 text-white font-bold px-5 transition duration-300 py-3 rounded-lg hover:bg-red-500">
              Search Challan
            </button>
            <button onClick={() => {
                setIsLogin(true); 
                toggleFormVisibility(); // Open form and show login
              }} className="bg-gray-600 text-white font-bold px-5 transition duration-300 py-3 rounded-lg hover:bg-gray-500">
              Pay Now
            </button>
          </div>
        </div>
        <div className="w-[50%]">
          <img
            src={img}
            alt="Landing"
            className="w-full h-[80vh] object-cover rounded-lg"
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

export default Landingpage;
