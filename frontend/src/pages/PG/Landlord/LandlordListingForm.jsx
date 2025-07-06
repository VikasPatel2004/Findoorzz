import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import listingService from '../../../services/listingService';

function LandlordListingForm() {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    landlordName: '',
    contactNumber: '',
    houseNumber: '',
    colony: '',
    city: '',
    numberOfRooms: '',
    furnishingStatus: '',
    wifi: false,
    airConditioning: false,
    rentAmount: '',
    independent: false,
    description: ''
  });
  const [images, setImages] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate file sizes (5MB limit per image)
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`Image "${file.name}" is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum size is 5MB.`);
        return false;
      }
      return true;
    });
    
    setImages(validFiles);
    
    if (validFiles.length !== files.length) {
      console.log(`Filtered out ${files.length - validFiles.length} oversized images`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create FormData for multipart/form-data submission
      const formDataToSend = new FormData();
      
      // Add all form fields
      Object.keys(formData).forEach(key => {
        if (formData[key] !== '') {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      // Add type
      formDataToSend.append('type', 'PG');
      
      // Add images
      images.forEach((image, index) => {
        formDataToSend.append('propertyImages', image);
      });

      console.log('Submitting listing with', images.length, 'images...');
      
      // Create listing with FormData
      await listingService.createListing(formDataToSend);
      alert('Listing created successfully');
      navigate('/landlord');
    } catch (error) {
      console.error('Error creating listing:', error);
      if (error.code === 'ECONNABORTED') {
        alert('Request timed out. The listing might still be created. Please check your listings.');
      } else {
        alert('Failed to create listing: ' + (error.response?.data?.message || error.message));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex justify-center items-center min-h-screen my-6 ">
      <div className="w-full max-w-4xl p-8 bg-gray-50 px-12 rounded-lg shadow-md">
        <h3 className="text-center my-8 font-bold text-3xl">
          Tell <span className="text-yellow-500">Us About</span> Your Room !!
        </h3>

        <form onSubmit={handleSubmit}>
          {/* Landlord Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-4 mb-6 bg-white p-6 px-12 rounded-lg">
            <div className="flex items-center">
              <h2 className="text-2xl">Landlord Information:</h2>
            </div>
            <div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="landlordName" className="block text-sm font-medium text-gray-700">Name:</label>
                  <input
                    id="landlordName"
                    name="landlordName"
                    type="text"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring focus:ring-gray-500"
                    required
                    value={formData.landlordName}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">Contact Number:</label>
                  <input
                    id="contactNumber"
                    name="contactNumber"
                    type="tel"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring focus:ring-gray-500"
                    required
                    value={formData.contactNumber}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Address Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-white p-6 px-12 rounded-md">
            <div className="flex items-center">
              <h2 className="text-2xl">Address Details:</h2>
            </div>
            <div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="houseNumber" className="block text-sm font-medium text-gray-700">House Number:</label>
                  <input
                    id="houseNumber"
                    name="houseNumber"
                    type="text"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring focus:ring-gray-500"
                    required
                    value={formData.houseNumber}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="colony" className="block text-sm font-medium text-gray-700">Colony:</label>
                  <input
                    id="colony"
                    name="colony"
                    type="text"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring focus:ring-gray-500"
                    required
                    value={formData.colony}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">City:</label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring focus:ring-gray-500"
                    required
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-white p-6 px-12 rounded-md">
            <div className="flex items-center">
              <h2 className="text-2xl">Property Details:</h2>
            </div>
            <div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="numberOfRooms" className="block text-sm font-medium text-gray-700">Number of Rooms:</label>
                  <input
                    id="numberOfRooms"
                    name="numberOfRooms"
                    type="number"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring focus:ring-gray-500"
                    required
                    value={formData.numberOfRooms}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="furnishingStatus" className="block text-sm font-medium text-gray-700">Furnishing Status:</label>
                  <select
                    id="furnishingStatus"
                    name="furnishingStatus"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring focus:ring-gray-500"
                    required
                    value={formData.furnishingStatus}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="Furnished">Furnished</option>
                    <option value="Semi-Furnished">Semi-Furnished</option>
                    <option value="Unfurnished">Unfurnished</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 px-12 bg-white p-6 rounded-md">
            <div className="flex items-center">
              <h2 className="text-2xl">Amenities:</h2>
            </div>
            <div>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-gray-500"
                    name="wifi"
                    checked={formData.wifi}
                    onChange={handleChange}
                  />
                  <label className="ml-2 text-gray-700">Wi-Fi</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-gray-500"
                    name="airConditioning"
                    checked={formData.airConditioning}
                    onChange={handleChange}
                  />
                  <label className="ml-2 text-gray-700">Air Conditioning</label>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-12 mb-6 bg-white p-6 rounded-md">
            <div className="flex items-center">
              <h2 className="text-2xl">Rent:</h2>
            </div>
            <div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="rentAmount" className="block text-sm font-medium text-gray-700">Rent Amount:</label>
                  <input
                    name="rentAmount"
                    type="number"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring focus:ring-gray-500"
                    required
                    value={formData.rentAmount}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Independent or Not */}
          <div className="grid grid-cols-1 md:grid-cols-2 px-12 gap-4 mb-6 bg-white p-6 rounded-md">
            <div className="flex items-center">
              <h2 className="text-2xl">Independent:</h2>
            </div>
            <div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-gray-500"
                  name="independent"
                  checked={formData.independent}
                  onChange={handleChange}
                />
                <label className="ml-2 text-gray-700">Independent Room</label>
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-12 mb-6 bg-white p-6 rounded-md">
            <div className="flex items-center">
              <h2 className="text-2xl">Property Images:</h2>
            </div>
            <div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="images" className="block text-sm font-medium text-gray-700">Upload Images (Multiple):</label>
                  <input
                    id="images"
                    name="images"
                    type="file"
                    multiple
                    accept="image/*"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring focus:ring-gray-500"
                    onChange={handleImageChange}
                  />
                  <p className="text-sm text-gray-500 mt-1">You can select multiple images</p>
                  {images.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-green-600">Selected {images.length} image(s)</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-12 mb-6 bg-white p-6 rounded-md">
            <div className="flex items-center">
              <h2 className="text-2xl">Description:</h2>
            </div>
            <div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description:</label>
                  <textarea
                    id="description"
                    name="description"
                    rows="3"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring focus:ring-gray-500"
                    required
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your room..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col items-center">
            {loading && (
              <div className="mb-4 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
                <p className="mt-2 text-sm text-gray-600">
                  {images.length > 0 
                    ? `Processing ${images.length} image(s) and creating listing...` 
                    : 'Creating listing...'
                  }
                </p>
                <p className="text-xs text-gray-500 mt-1">This may take a few moments for large images</p>
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="bg-yellow-500 text-white px-8 py-3 rounded-md hover:bg-yellow-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Listing...' : 'Create Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LandlordListingForm;