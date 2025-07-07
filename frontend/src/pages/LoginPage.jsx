import React, { useState, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useFormSubmit } from '../hooks/useFormSubmit';
import Avatar from '../assets/Avatar.svg';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const { loading, error: submitError, submitForm } = useFormSubmit();
  const [error, setError] = useState('');

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error on input change
  }, []);

  const handleLogin = useCallback(async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      return;
    }

    await submitForm(
      () => login(formData.email, formData.password),
      (result) => {
        if (result.success) {
          navigate('/');
        } else if (result.message) {
          setError(result.message);
        }
      }
    );
  }, [formData, login, navigate, submitForm]);

  const handleSignupClick = useCallback(() => {
    navigate('/Signup');
  }, [navigate]);

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
            <h2 className="mb-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in 
            </h2>
            <form className="space-y-6" onSubmit={handleLogin}>
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="appearance-none rounded-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 sm:text-base"
                    placeholder="Email address"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="appearance-none rounded-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 sm:text-base"
                    placeholder="Password"
                  />
                </div>
              </div>
              {(error || submitError) && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        {error || submitError}
                      </h3>
                    </div>
                  </div>
                </div>
              )}
              <div>
                <button
                  type="submit"
                  disabled={loading || !formData.email || !formData.password}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-semibold rounded-md text-black bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                      Signing in...
                    </div>
                  ) : (
                    'Sign in'
                  )}
                </button>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  New user?{' '}
                  <button
                    type="button"
                    onClick={handleSignupClick}
                    className="font-medium text-yellow-600 hover:text-yellow-500 transition-colors duration-200"
                  >
                    Sign up here
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
