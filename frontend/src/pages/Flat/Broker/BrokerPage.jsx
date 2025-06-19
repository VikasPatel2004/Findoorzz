import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Inline SVG Icons
const CameraIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const IdentificationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
  </svg>
);

const DocumentTextIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.4 5.4A1 1 0 0118 5v14a2 2 0 01-2 2z" />
  </svg>
);

export default function BrokerRegistrationPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    aadharNumber: '',
    experience: '',
    languages: [],
    areas: [],
    photo: null,
    idProof: null,
    upiId: '', // Added UPI ID field
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here you would typically upload files and submit form data to your backend
    console.log('Form submitted:', formData);
    navigate('/BrokerDashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-12">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md px-16 py-6">
        <h1 className="text-3xl font-bold text-center my-6">
          <span className="text-amber-400">Broker</span> Registration
        </h1> 
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold border-b pb-2 text-center">Personal Information</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                  required
                />
              </div>
            </div>
          </div>
          
          {/* UPI ID Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold border-b pb-2 text-center">Payment Information</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">UPI ID</label>
              <input
                type="text"
                name="upiId"
                value={formData.upiId}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                required
              />
            </div>
          </div>
          
          {/* ID Proofs Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold border-b pb-2 text-center">Identity Verification</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Photo Upload */}
              <div className="flex flex-col items-center">
                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
                <div className="relative w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300">
                  {formData.photo ? (
                    <img src={URL.createObjectURL(formData.photo)} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <CameraIcon />
                  )}
                </div>
                <input
                  type="file"
                  name="photo"
                  onChange={handleChange}
                  accept="image/*"
                  className="mt-2 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100"
                  required
                />
              </div>
              
              {/* ID Proof Upload */}
              <div className="flex flex-col items-center">
                <label className="block text-sm font-medium text-gray-700 mb-2">ID Proof (Aadhar)</label>
                <div className="relative w-32 h-32 bg-gray-200 flex items-center justify-center border-2 border-dashed border-gray-300">
                  {formData.idProof ? (
                    <DocumentTextIcon />
                  ) : (
                    <IdentificationIcon />
                  )}
                </div>
                <input
                  type="file"
                  name="idProof"
                  onChange={handleChange}
                  accept="image/*,.pdf"
                  className="mt-2 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Aadhar Number</label>
                <input
                  type="text"
                  name="aadharNumber"
                  value={formData.aadharNumber}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full md:w-auto px-6 py-3 bg-yellow-500 text-white font-medium rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
