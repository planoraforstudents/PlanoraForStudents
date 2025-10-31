import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig'; // Ensure this path is correct

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email; // Get email from registration page

  if (!email) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="p-8 bg-white rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="text-red-500">No email address provided. Please go back to registration.</p>
          <button
            onClick={() => navigate('/register')}
            className="w-full py-2 px-4 mt-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Go to Register
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await api.post('/users/verify-otp/', {
        email: email,
        otp: otp
      });

      setSuccessMessage(response.data.message);

      // Wait 2 seconds to show success, then navigate
      setTimeout(() => {
        // THIS IS THE FIX:
        navigate('/login', { state: { email: email } });
      }, 2000);

    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('OTP verification failed. Please try again.');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center">Verify Your Account</h2>
        <p className="text-center text-gray-400">
          An OTP has been sent to <strong>{email}</strong>. Please enter it below.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-300">
              OTP Code
            </label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 text-gray-900 bg-gray-300 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
          {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}

          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOTP;