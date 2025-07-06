import React, { useState, useEffect } from 'react';
import listingService from '../services/listingService';

const TestComponent = () => {
  const [flatListings, setFlatListings] = useState([]);
  const [pgListings, setPgListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testAPIs = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Testing API endpoints...');
      
      // Test flat listings
      console.log('Testing flat listings...');
      const flatData = await listingService.getAllFlatListings();
      console.log('Flat listings result:', flatData);
      setFlatListings(Array.isArray(flatData) ? flatData : (flatData.listings || []));
      
      // Test PG listings
      console.log('Testing PG listings...');
      const pgData = await listingService.getAllPGListings();
      console.log('PG listings result:', pgData);
      setPgListings(Array.isArray(pgData) ? pgData : (pgData.listings || []));
      
    } catch (error) {
      console.error('API test error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testAPIs();
  }, []);

  if (loading) {
    return <div className="p-4">Testing APIs...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">API Test Results</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Flat Listings ({flatListings.length})</h3>
        {flatListings.length > 0 ? (
          <div className="space-y-2">
            {flatListings.slice(0, 3).map((listing, index) => (
              <div key={index} className="p-2 bg-gray-100 rounded">
                <p><strong>ID:</strong> {listing._id}</p>
                <p><strong>Address:</strong> {listing.houseNumber}, {listing.colony}, {listing.city}</p>
                <p><strong>Rent:</strong> ₹{listing.rentAmount}</p>
              </div>
            ))}
            {flatListings.length > 3 && <p>... and {flatListings.length - 3} more</p>}
          </div>
        ) : (
          <p className="text-gray-500">No flat listings found</p>
        )}
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">PG Listings ({pgListings.length})</h3>
        {pgListings.length > 0 ? (
          <div className="space-y-2">
            {pgListings.slice(0, 3).map((listing, index) => (
              <div key={index} className="p-2 bg-gray-100 rounded">
                <p><strong>ID:</strong> {listing._id}</p>
                <p><strong>Address:</strong> {listing.houseNumber}, {listing.colony}, {listing.city}</p>
                <p><strong>Rent:</strong> ₹{listing.rentAmount}</p>
              </div>
            ))}
            {pgListings.length > 3 && <p>... and {pgListings.length - 3} more</p>}
          </div>
        ) : (
          <p className="text-gray-500">No PG listings found</p>
        )}
      </div>
      
      <button 
        onClick={testAPIs}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Test APIs Again
      </button>
    </div>
  );
};

export default TestComponent; 