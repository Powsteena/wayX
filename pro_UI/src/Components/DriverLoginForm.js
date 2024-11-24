import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; 

function DriverLoginForm() {
  const [formData, setFormData] = useState({
      email: '',
      password: ''
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const validateForm = () => {
      const newErrors = {};
      if (!formData.email.trim()) {
          newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = 'Email is invalid';
      }
      if (!formData.password) {
          newErrors.password = 'Password is required';
      }
      return newErrors;
  };

  const handleChange = (e) => {
      setFormData({
          ...formData,
          [e.target.name]: e.target.value,
      });
      // Clear errors when user starts typing
      if (errors[e.target.name]) {
          setErrors(prev => ({ ...prev, [e.target.name]: '' }));
      }
      setServerError('');
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      setServerError('');
      setSuccessMessage('');

      const validationErrors = validateForm();
      if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
          return;
      }

      try {
          const response = await axios.post('http://localhost:5000/api/driver/login', formData);
          const { success, token, hasPaid } = response.data;

          if (!success || !token) {
              throw new Error('Login failed');
          }

          // Store token and decode it
          localStorage.setItem('token', token);
          const decodedToken = jwtDecode(token);
          const { id: driverId, role } = decodedToken.driver;

          // Store additional info
          localStorage.setItem('role', role);
          localStorage.setItem('driverId', driverId);

          setSuccessMessage('Login successful!');

          // Navigate based on payment status
          if (hasPaid) {
              navigate(`/driver-dashboard/${driverId}`);
          } else {
              navigate(`/payment/${driverId}/${token}`);
          }

      } catch (error) {
          console.error('Login Error:', error);
          setSuccessMessage('');
          
          if (error.response) {
              // Server responded with an error
              const errorMessage = error.response.data.msg || 'An error occurred';
              setServerError(errorMessage);
              
              if (error.response.status === 403) {
                  setServerError(error.response.data.msg || 'Account not approved');
              }
          } else if (error.request) {
              // Request made but no response
              setServerError('Network error - please try again');
          } else {
              // Error setting up request
              setServerError('An error occurred - please try again');
          }
      }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 overflow-hidden relative">
      {/* Diagonal Yellow Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-600 transform rotate-45 translate-x-1/2 -translate-y-1/2 opacity-20"></div>

      <div className="w-full max-w-md z-10 relative">
        <div className="bg-black border-2 border-yellow-600 rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8 relative">
            {/* Pulsing Yellow Accent Dot */}
            <div className="absolute top-4 right-4 w-4 h-4 bg-yellow-600 rounded-full animate-pulse"></div>
            
            <h2 className="text-3xl font-bold text-center text-yellow-600 mb-8 uppercase tracking-wider">
              Driver Login
            </h2>

            {serverError && (
              <div className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-4 text-center">
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black text-yellow-600 border-2 border-yellow-600 rounded-xl 
                             focus:outline-none focus:ring-2 focus:ring-yellow-600 
                             placeholder-yellow-700 transition duration-300"
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div className="relative">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black text-yellow-600 border-2 border-yellow-600 rounded-xl 
                             focus:outline-none focus:ring-2 focus:ring-yellow-600 
                             placeholder-yellow-700 transition duration-300"
                />
                {errors.password && (
                  <p className="text-red-400 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              <button 
                type="submit" 
                className="w-full bg-yellow-600 text-black py-3 rounded-xl 
                           hover:bg-yellow-400 transition duration-300 
                           transform hover:scale-105 font-bold uppercase tracking-wider 
                           shadow-lg hover:shadow-yellow-600/50"
              >
                Login as Driver
              </button>

              <p className="text-center text-yellow-600 mt-4">
                Don't have an account? {' '}
                <Link 
                  to="/driver-register" 
                  className="text-yellow-300 hover:text-yellow-200 
                             underline transition duration-300"
                >
                  Register
                </Link>
              </p>
            </form>

            {successMessage && (
              <div className="bg-green-500 text-white text-center p-4 rounded-lg mt-6">
                {successMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DriverLoginForm;
