import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import Avatar from '../../assets/Avatar.svg';
import { validateSignupForm } from '../../utils/validators';
import SocialLoginButtons from '../../components/SocialLoginButtons';

function PasswordStrengthMeter({ password }) {
  const getPasswordStrength = (password) => {
    let score = 0;
    if (!password) return score;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strength = getPasswordStrength(password);
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
  const strengthColors = ['#e53e3e', '#dd6b20', '#d69e2e', '#38a169', '#2f855a'];

  return (
    <div className="mt-1">
      <div className="h-2 rounded bg-gray-200">
        <div
          className="h-2 rounded"
          style={{ width: `${(strength / 4) * 100}%`, backgroundColor: strengthColors[strength] }}
        />
      </div>
      <p className="text-sm mt-1" style={{ color: strengthColors[strength] }}>
        {strengthLabels[strength]}
      </p>
    </div>
  );
}

function SignupPage() {
  const navigate = useNavigate();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
    // Auto-focus username input
    const usernameInput = document.getElementById('username');
    if (usernameInput) {
      usernameInput.focus();
    }
  }, []);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleButtonClick = () => {
    navigate('/LoginPage');
  };

  const toggleShowPassword = () => {
    setShowPassword(prev => !prev);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(prev => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess('');

    if (!termsAccepted) {
      setErrors({ terms: ['You must accept the terms and conditions.'] });
      return;
    }

    setIsSubmitting(true);

    // Validate form
    const validationErrors = validateSignupForm({ username, email, password, confirmPassword });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      await authService.register({ name: username, email, password });
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/LoginPage');
      }, 2000);
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else if (err.response?.data?.message) {
        setErrors({ general: [err.response.data.message] });
      } else {
        setErrors({ general: ['Registration failed. Please try again.'] });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLoginSuccess = (provider, response) => {
    console.log(provider + ' login success:', response);
    // TODO: Implement backend login with social token here
  };

  const handleSocialLoginFailure = (provider, response) => {
    console.error(provider + ' login failure:', response);
    // TODO: Show error to user
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
            {errors.general && <p className="text-red-500 mb-4 text-center">{errors.general[0]}</p>}
            {success && <p className="text-green-500 mb-4 text-center">{success}</p>}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="username" className="block text-gray-700 font-semibold mb-1">Username</label>
                <input
                  type="text"
                  className={`form-input w-full border rounded-md p-3 ${
                    errors.username ? 'border-red-500' : 'border-gray-300'
                  }`}
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                {errors.username && (
                  <div className="mt-1">
                    {errors.username.map((error, index) => (
                      <p key={index} className="text-red-500 text-sm">{error}</p>
                    ))}
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 font-semibold mb-1">Email address</label>
                <input
                  type="email"
                  className={`form-input w-full border rounded-md p-3 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {errors.email && (
                  <div className="mt-1">
                    {errors.email.map((error, index) => (
                      <p key={index} className="text-red-500 text-sm">{error}</p>
                    ))}
                  </div>
                )}
              </div>
              <div className="mb-4 relative">
                <label htmlFor="password" className="block text-gray-700 font-semibold mb-1">Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`form-input w-full border rounded-md p-3 ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-600 hover:text-gray-900 focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
                <PasswordStrengthMeter password={password} />
                {errors.password && (
                  <div className="mt-1">
                    {errors.password.map((error, index) => (
                      <p key={index} className="text-red-500 text-sm">{error}</p>
                    ))}
                  </div>
                )}
              </div>
              <div className="mb-4 relative">
                <label htmlFor="confirmPassword" className="block text-gray-700 font-semibold mb-1">Confirm Password</label>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className={`form-input w-full border rounded-md p-3 ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={toggleShowConfirmPassword}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-600 hover:text-gray-900 focus:outline-none"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
                {errors.confirmPassword && (
                  <div className="mt-1">
                    {errors.confirmPassword.map((error, index) => (
                      <p key={index} className="text-red-500 text-sm">{error}</p>
                    ))}
                  </div>
                )}
              </div>
              <div className="mb-4 flex items-center">
                <input
                  id="terms"
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={() => setTermsAccepted(!termsAccepted)}
                  className="h-4 w-4 text-yellow-500 focus:ring-yellow-400 border-gray-300 rounded"
                />
                <label htmlFor="terms" className="ml-2 block text-gray-900 text-sm">
                  I accept the <a href="/terms" className="text-yellow-500 underline">terms and conditions</a>
                </label>
              </div>
              {errors.terms && (
                <div className="mb-4">
                  <p className="text-red-500 text-sm">{errors.terms[0]}</p>
                </div>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`bg-yellow-500 text-white font-semibold py-3 rounded-md w-full transition duration-300 text-base ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-600'
                }`}
              >
                {isSubmitting ? 'Creating Account...' : 'Sign Up'}
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
            <p className="mt-6 text-center text-sm text-gray-600">
              Or continue with
            </p>
            <SocialLoginButtons
              onLoginSuccess={handleSocialLoginSuccess}
              onLoginFailure={handleSocialLoginFailure}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
