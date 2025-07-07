import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import Avatar from '../../assets/Avatar.svg';

function SignupPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleButtonClick = () => {
    navigate('/LoginPage');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      await authService.register({ name: username, email, password });
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/LoginPage');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col-reverse md:flex-row-reverse items-center justify-center gap-8 w-full max-w-4xl">
        {/* Avatar Box */}
        <div className="flex items-center justify-center p-0 md:p-0 w-full max-w-xs md:max-w-sm">
          <img src={Avatar} alt="FinDoorz Avatar" className="w-[35rem] h-[35rem] object-contain" />
        </div>
        {/* Form Box */}
        <div className="flex items-center justify-center bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-12 w-full max-w-md">
          <div className="w-full">
            <h2 className="text-center text-yellow-500 text-2xl font-bold mb-4 mt-4 md:mt-0">Signup</h2>
            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
            {success && <p className="text-green-500 mb-4 text-center">{success}</p>}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="username" className="block text-gray-700 font-semibold mb-1">Username</label>
                <input
                  type="text"
                  className="form-input w-full border border-gray-300 rounded-md p-3"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 font-semibold mb-1">Email address</label>
                <input
                  type="email"
                  className="form-input w-full border border-gray-300 rounded-md p-3"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block text-gray-700 font-semibold mb-1">Password</label>
                <input
                  type="password"
                  className="form-input w-full border border-gray-300 rounded-md p-3"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="confirmPassword" className="block text-gray-700 font-semibold mb-1">Confirm Password</label>
                <input
                  type="password"
                  className="form-input w-full border border-gray-300 rounded-md p-3"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-yellow-500 text-white font-semibold py-3 rounded-md w-full hover:bg-yellow-600 transition duration-300 text-base"
              >
                Sign Up
              </button>
            </form>
            <p className="text-center mt-3 text-gray-600">
              Already have an account?{' '}
              <button
                type="button"
                className="text-yellow-500 font-semibold"
                onClick={handleButtonClick}
              >
                Login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
