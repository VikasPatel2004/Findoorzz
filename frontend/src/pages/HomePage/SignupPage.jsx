import React from 'react';
import { useNavigate } from 'react-router-dom';

function SignupPage() {
    const navigate = useNavigate(); // Initialize useNavigate
     // Navigate to the Login route
  const handleButtonClick = () => {
    navigate('/LoginPage'); // Navigate to the Login page
  };
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-black" style={{ width: '30rem' }}>
                <h2 className="text-center text-yellow-500 text-2xl font-bold mb-4">Signup</h2>
                <form>
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-gray-700 font-semibold mb-1">Username</label>
                        <input type="text" className="form-input w-full border border-gray-300 rounded-md p-2" id="username" required />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 font-semibold mb-1">Email address</label>
                        <input type="email" className="form-input w-full border border-gray-300 rounded-md p-2" id="email" required />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-700 font-semibold mb-1">Password</label>
                        <input type="password" className="form-input w-full border border-gray-300 rounded-md p-2" id="password" required />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="confirmPassword" className="block text-gray-700 font-semibold mb-1">Confirm Password</label>
                        <input type="password" className="form-input w-full border border-gray-300 rounded-md p-2" id="confirmPassword" required />
                    </div>
                    <button type="submit" className="bg-yellow-500 text-white font-semibold py-2 rounded-md w-full hover:bg-yellow-600 transition duration-300">Sign Up</button>
                </form>
                <p className="text-center mt-3 text-gray-600">Already have an account? <a href="#" className="text-yellow-500 font-semibold " onClick={() => {
              handleButtonClick(); // Navigate to Signup on click
            }} >Login</a></p>
            </div>
        </div>
    );
}

export default SignupPage;
