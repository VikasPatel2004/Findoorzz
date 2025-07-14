import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import listingService from '../../services/listingService';
import { useNavigate } from 'react-router-dom';
import ProfileAvatar from '../../components/ProfileAvatar';

const UserProfile = () => {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [myFlatListings, setMyFlatListings] = useState([]);
  const [myPGListings, setMyPGListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    const fetchMyListings = async () => {
      try {
        setLoading(true);
        const [flatListings, pgListings] = await Promise.all([
          listingService.getMyCreatedFlatListings(token),
          listingService.getMyCreatedPGListings(token)
        ]);
        setMyFlatListings(flatListings);
        setMyPGListings(pgListings);
      } catch (error) {
        console.error('Error fetching my listings:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchMyListings();
    }
  }, [token]);

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  const handleViewListing = (type, id) => {
    if (type === 'flat') {
      navigate(`/FlatDetail/${id}`);
    } else {
      navigate(`/RoomDetail/${id}`);
    }
  };

  const handleEditListing = (type, id) => {
    if (type === 'flat') {
      navigate(`/LenderForm?edit=${id}`);
    } else {
      navigate(`/LandlordForm?edit=${id}`);
    }
  };

  const handleDeleteListing = async (type, id) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        await listingService.deleteListing(type, id, token);
        // Refresh listings
        const [flatListings, pgListings] = await Promise.all([
          listingService.getMyCreatedFlatListings(token),
          listingService.getMyCreatedPGListings(token)
        ]);
        setMyFlatListings(flatListings);
        setMyPGListings(pgListings);
      } catch (error) {
        console.error('Error deleting listing:', error);
        alert('Failed to delete listing');
      }
    }
  };

  const ListingCard = ({ listing, type }) => (
    <div className="bg-white rounded-xl border border-gray-100 p-6 mb-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold ">
            {listing.houseNumber}, {listing.colony}
          </h3>
          <p className="text-gray-500">{listing.city}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-amber-600">₹{listing.rentAmount}</p>
          <p className="text-sm text-gray-500">{listing.furnishingStatus}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <span className="font-medium text-cyan-700">Rooms:</span> {listing.numberOfRooms}
        </div>
        <div>
          <span className="font-medium text-cyan-700">Contact:</span> {listing.contactNumber}
        </div>
        <div>
          <span className="font-medium text-cyan-700">WiFi:</span> {listing.wifi ? 'Yes' : 'No'}
        </div>
        <div>
          <span className="font-medium text-cyan-700">AC:</span> {listing.airConditioning ? 'Yes' : 'No'}
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => handleViewListing(type, listing._id)}
          className="flex-1 bg-yellow-50 py-2 px-4 rounded-lg border border-amber-100 hover:bg-yellow-50 hover:text-yellow-600 transition-colors"
        >
          View
        </button>
        <button
          onClick={() => handleEditListing(type, listing._id)}
          className="flex-1 bg-yellow-50  py-2 px-4 rounded-lg border border-amber-100 hover:bg-amber-50 hover:text-amber-600 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => handleDeleteListing(type, listing._id)}
          className="flex-1 bg-red-200  py-2 px-4 rounded-lg border border-red-100 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-xl border border-amber-100 shadow p-6 mb-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <ProfileAvatar user={user} size="xl" />
              <div>
                <h1 className="text-3xl font-bold">My Profile</h1>
                <p className="text-gray-500 mt-2">Manage your account and listings</p>
              </div>
            </div>
            <button
              onClick={handleEditProfile}
              className="bg-cyan-50 px-6 py-2 rounded-lg border border-amber-100 hover:bg-yellow-50 hover:text-yellow-600 transition-colors"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-amber-100 shadow mb-8">
          <div className="border-b border-amber-100">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'profile'
                    ? 'border-amber-400 text-amber-600 bg-yellow-50'
                    : 'border-transparent text-gray-500 hover:text-amber-500 hover:bg-cyan-50'
                }`}
              >
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab('flat-listings')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'flat-listings'
                    ? 'border-amber-400 text-amber-600 bg-yellow-50'
                    : 'border-transparent text-gray-500 hover:text-amber-500 hover:bg-cyan-50'
                }`}
              >
                My Flat Listings ({myFlatListings.length})
              </button>
              <button
                onClick={() => setActiveTab('pg-listings')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'pg-listings'
                    ? 'border-amber-400 text-amber-600 bg-yellow-50'
                    : 'border-transparent text-gray-500 hover:text-amber-500 hover:bg-cyan-50'
                }`}
              >
                My PG Listings ({myPGListings.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Profile Information Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-amber-700 mb-2">
                      Full Name
                    </label>
                    <p className="text-gray-900 bg-yellow-50 p-3 rounded-md border border-amber-100">
                      {user?.name || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-amber-700 mb-2">
                      Email Address
                    </label>
                    <p className="text-gray-900 bg-yellow-50 p-3 rounded-md border border-amber-100">
                      {user?.email || 'Not provided'}
                    </p>
                  </div>
                </div>
                <div className="bg-cyan-50 border border-cyan-100 rounded-md p-4">
                  <h3 className="text-lg font-medium text-cyan-800 mb-2">Account Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-cyan-700">Flat Listings:</span>
                      <span className="ml-2 text-cyan-600">{myFlatListings.length}</span>
                    </div>
                    <div>
                      <span className="font-medium text-cyan-700">PG Listings:</span>
                      <span className="ml-2 text-cyan-600">{myPGListings.length}</span>
                    </div>
                    <div>
                      <span className="font-medium text-cyan-700">Total Listings:</span>
                      <span className="ml-2 text-cyan-600">{myFlatListings.length + myPGListings.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Flat Listings Tab */}
            {activeTab === 'flat-listings' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold ">My Flat Listings</h2>
                  <button
                    onClick={() => navigate('/LenderForm')}
                    className="bg-amber-50 px-4 py-2 rounded-lg border border-amber-100 hover:bg-yellow-50 hover:text-yellow-600 transition-colors"
                  >
                    Add New Flat Listing
                  </button>
                </div>
                {myFlatListings.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-300 text-6xl mb-4">🏠</div>
                    <h3 className="text-xl font-medium text-gray-500 mb-2">No Flat Listings Yet</h3>
                    <p className="text-gray-400 mb-6">You haven't created any flat listings yet.</p>
                    <button
                      onClick={() => navigate('/LenderForm')}
                      className="bg-yellow-50 text-amber-600 px-6 py-2 rounded-lg border border-amber-100 hover:bg-cyan-50 hover:text-cyan-600 transition-colors"
                    >
                      Create Your First Listing
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {myFlatListings.map((listing) => (
                      <ListingCard key={listing._id} listing={listing} type="flat" />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* PG Listings Tab */}
            {activeTab === 'pg-listings' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold ">My PG Listings</h2>
                  <button
                    onClick={() => navigate('/LandlordForm')}
                    className="bg-cyan-50 text-amber-600 px-4 py-2 rounded-lg border border-amber-100 hover:bg-yellow-50 hover:text-yellow-600 transition-colors"
                  >
                    Add New PG Listing
                  </button>
                </div>
                {myPGListings.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-300 text-6xl mb-4">🏘️</div>
                    <h3 className="text-xl font-medium text-gray-500 mb-2">No PG Listings Yet</h3>
                    <p className="text-gray-400 mb-6">You haven't created any PG listings yet.</p>
                    <button
                      onClick={() => navigate('/LandlordForm')}
                      className="bg-yellow-50 text-amber-600 px-6 py-2 rounded-lg border border-amber-100 hover:bg-cyan-50 hover:text-cyan-600 transition-colors"
                    >
                      Create Your First Listing
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {myPGListings.map((listing) => (
                      <ListingCard key={listing._id} listing={listing} type="pg" />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
