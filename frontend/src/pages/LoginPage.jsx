import React, { useState, useContext, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Avatar from '../assets/Avatar.svg';
import { validateLoginForm } from '../utils/validators';
import SocialLoginButtons from '../components/SocialLoginButtons';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  useEffect(() => {
    window.scrollTo(0, 0);
    const emailInput = document.getElementById('email');
    if (emailInput) emailInput.focus();
  }, []);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  }, [errors]);

  const handleLogin = useCallback(async (e) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);
    const validationErrors = validateLoginForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }
    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        navigate('/');
      } else {
        const generalError = 'Invalid email or password.';
        if (typeof result.message === 'object' && result.message !== null) {
          const hasFieldErrors = Object.keys(result.message).length > 0;
          if (hasFieldErrors) {
            setErrors(result.message);
          } else {
            setErrors({ general: [generalError] });
          }
        } else {
          setErrors({ general: [generalError] });
        }
      }
    } catch (err) {
      const generalError = 'Invalid email or password.';
      if (err.response?.data?.errors) {
        const fieldErrors = err.response.data.errors;
        const hasFieldErrors = Object.keys(fieldErrors).length > 0;
        if (hasFieldErrors) {
          setErrors(fieldErrors);
        } else {
          setErrors({ general: [generalError] });
        }
      } else {
        setErrors({ general: [generalError] });
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, login, navigate]);

  const handleSignupClick = useCallback(() => {
    navigate('/Signup');
  }, [navigate]);

  const toggleShowPassword = () => setShowPassword(prev => !prev);

  const { setUser } = useContext(AuthContext);
  const handleGoogleLogin = async (provider, credentialResponse) => {
    try {
      const res = await fetch('https://findoorzz.onrender.com/api/auth/social-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        // Fetch user profile and set in context
        try {
          const profileRes = await fetch('https://findoorzz.onrender.com/api/auth/profile', {
            headers: { Authorization: `Bearer ${data.token}` }
          });
          const profile = await profileRes.json();
          setUser(profile);
        } catch (profileErr) {
          // If profile fetch fails, just continue
        }
        navigate('/');
      } else {
        setErrors({ general: [data.message || 'Google login failed'] });
      }
    } catch (err) {
      setErrors({ general: ['Google login failed'] });
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-white pt-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col-reverse md:flex-row-reverse items-center justify-center gap-8 w-full max-w-4xl">
        <div className="flex items-center justify-center p-0 md:p-0 w-full max-w-xs md:max-w-sm">
          <img src={Avatar} alt="FinDoorz Avatar" className="w-full h-auto max-w-md object-contain" />
        </div>
        <div className="flex items-center justify-center bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-12 w-full max-w-md">
          <div className="w-full">
            <h2 className="mb-6 text-center text-3xl font-extrabold text-black">
              Sign <span className='text-center text-3xl font-extrabold text-amber-400'>In</span>
            </h2>
            <SocialLoginButtons onLoginSuccess={handleGoogleLogin} />
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
                    className={`appearance-none rounded-none relative block w-full px-4 py-3 border placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 sm:text-base ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Email address"
                  />
                </div>
                <div className="relative">
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`appearance-none rounded-none relative block w-full px-4 py-3 border placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 sm:text-base ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    onClick={toggleShowPassword}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-600 hover:text-gray-900 focus:outline-none"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
              {(errors.email || errors.password) && (
                <div className="space-y-2">
                  {errors.email && (
                    <div className="rounded-md bg-red-50 p-3">
                      <p className="text-sm font-medium text-red-800">{errors.email[0]}</p>
                    </div>
                  )}
                  {errors.password && (
                    <div className="rounded-md bg-red-50 p-3">
                      <p className="text-sm font-medium text-red-800">{errors.password[0]}</p>
                    </div>
                  )}
                </div>
              )}
              {errors.general && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        {errors.general[0]}
                      </h3>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-yellow-500 focus:ring-yellow-400 border-gray-300 rounded"
                  />
                  <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <button
                    type="button"
                    onClick={() => navigate('/ForgotPassword')}
                    className="font-medium text-yellow-500 hover:text-yellow-600"
                  >
                    Forgot your password?
                  </button>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.email || !formData.password || Object.keys(errors).length > 0}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-semibold rounded-md text-black bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                      Signing in...
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </div>
            </form>
            <p className="text-center mt-6 text-gray-600">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={handleSignupClick}
                className="font-medium text-yellow-500 hover:text-yellow-600"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
