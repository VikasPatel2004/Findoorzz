import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

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
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-black" style={{ width: '30rem' }}>
        <h2 className="text-center text-yellow-500 text-2xl font-bold mb-4">Signup</h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {success && <p className="text-green-500 mb-4 text-center">{success}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 font-semibold mb-1">Username</label>
            <input
              type="text"
              className="form-input w-full border border-gray-300 rounded-md p-2"
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
              className="form-input w-full border border-gray-300 rounded-md p-2"
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
              className="form-input w-full border border-gray-300 rounded-md p-2"
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
              className="form-input w-full border border-gray-300 rounded-md p-2"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-yellow-500 text-white font-semibold py-2 rounded-md w-full hover:bg-yellow-600 transition duration-300"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center mt-3 text-gray-600">
          Already have an account?{' '}
          <a
            href="#"
            className="text-yellow-500 font-semibold"
            onClick={handleButtonClick}
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;
