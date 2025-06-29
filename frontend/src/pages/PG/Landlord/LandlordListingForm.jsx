import React, { useState } from 'react';
import listingService from '../../../services/listingService';
import { useNavigate } from 'react-router-dom';

function LandlordListingForm() {
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
    propertyImages: [],
    description: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, files, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prevState => ({
        ...prevState,
        [name]: checked,
      }));
    } else if (type === 'file') {
      setFormData(prevState => ({
        ...prevState,
        [name]: files,
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const data = new FormData();

      // Append text fields with correct types
      data.append('landlordName', formData.landlordName);
      data.append('contactNumber', formData.contactNumber);
      data.append('houseNumber', formData.houseNumber);
      data.append('colony', formData.colony);
      data.append('city', formData.city);
      data.append('numberOfRooms', Number(formData.numberOfRooms));
      data.append('furnishingStatus', formData.furnishingStatus);
      data.append('wifi', formData.wifi ? 'true' : 'false');
      data.append('airConditioning', formData.airConditioning ? 'true' : 'false');
      data.append('rentAmount', Number(formData.rentAmount));
      data.append('independent', formData.independent ? 'true' : 'false');
      data.append('description', formData.description);

      // Append property images (multiple)
      if (formData.propertyImages && formData.propertyImages.length > 0) {
        for (let i = 0; i < formData.propertyImages.length; i++) {
          data.append('propertyImages', formData.propertyImages[i]);
        }
      }

      await listingService.createListing('pg', data, token);
      alert('Listing created successfully');
      navigate('/landlord');
    } catch (error) {
      console.error('Error creating listing:', error);
      alert('Failed to create listing');
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
                <label className="ml-2 text-gray-700">Is Independent Property?</label>
              </div>
            </div>
          </div>

          {/* Images and Media */}
          <div className="grid grid-cols-1 md:grid-cols-2 px-12 gap-4 mb-6 bg-white p-6 rounded-md">
            <div className="flex items-center">
              <h2 className="text-2xl">Room Images:</h2>
            </div>
            <div>
              <label htmlFor="propertyImages" className="block text-sm font-medium text-gray-700">Upload Images:</label>
              <input
                name="propertyImages"
                type="file"
                multiple
                className="mt-1 block w-full border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring focus:ring-gray-500"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 px-12 bg-white p-6 rounded-md">
            <div className="flex items-center">
              <h2 className="text-2xl">Description:</h2>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description:</label>
              <textarea
                name="description"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring focus:ring-gray-500"
                required
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>

          <div className="flex justify-center">
            <button className="bg-yellow-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-gray-600 transition duration-300" type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LandlordListingForm;