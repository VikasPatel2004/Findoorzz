import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import listingService from '../../../services/listingService';

function StudentSavedListings() {
    const navigate = useNavigate();

    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchSavedListings = async () => {
        setLoading(true);
        setError(null);
        try {
            console.log('Fetching saved PG listings...');
            const data = await listingService.getSavedPGListings();
            console.log('Received PG data:', data);
            
            if (Array.isArray(data)) {
                console.log('PG data is array, length:', data.length);
                setListings(data);
            } else if (data && Array.isArray(data.listings)) {
                console.log('PG data has listings array, length:', data.listings.length);
                setListings(data.listings);
            } else {
                console.log('Unexpected PG data format:', data);
                setListings([]);
                setError('Unexpected data format received from server');
            }
        } catch (err) {
            console.error('Error fetching saved PG listings:', err);
            setError('Failed to fetch saved listings');
            setListings([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSavedListings();
    }, []);

    const handleExploreClick = (id) => {
        navigate(`/RoomDetail/${id}`);
    };

    const handleRemoveClick = async (id) => {
        try {
            await listingService.toggleSavedListing(id);
            setListings(prev => prev.filter(listing => listing._id !== id));
        } catch (error) {
            console.error('Error removing saved listing:', error);
            alert('Failed to remove saved listing. Please try again.');
        }
    };

    if (loading) {
        return <div className="text-center py-10">Loading listings...</div>;
    }

    if (error) {
        return <div className="text-center py-10 text-red-500">{error}</div>;
    }

    if (listings.length === 0) {
        return <div className="text-center py-10">No saved listings found.</div>;
    }

    return (
        <div className="container mx-auto text-center pt-10">
            <div className="flex flex-col md:flex-row justify-between items-center px-4 md:px-20">
                <h1 className='text-left py-2 text-2xl md:text-3xl'>
                    These Are Your <span className='text-yellow-500'>Saved</span> Rooms!
                </h1>
            </div>
            <h2 className="text-3xl text-gray-600 font-bold mt-5 mb-8">My Favourites</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 rounded-lg gap-6 px-4 md:px-20 py-12">
                {listings.map((listing) => {
                    console.log('Rendering listing:', listing);
                    return (
                        <div className="rounded-lg bg-stone-100 shadow-md overflow-hidden" key={listing._id}>
                            {listing.propertyImages && listing.propertyImages.length > 0 ? (
                                <img 
                                    src={listing.propertyImages[0]} 
                                    className="w-full h-52 object-cover" 
                                    alt="listing" 
                                />
                            ) : (
                                <div className="w-full h-52 bg-gray-200 flex items-center justify-center">
                                    <span className="text-gray-500">No image available</span>
                                </div>
                            )}
                            <div className="p-4 text-center">
                                <p className="text-lg font-bold">
                                    <div>{listing.houseNumber || 'Unknown'}, {listing.colony || 'Unknown'}, {listing.city || 'Unknown'}</div>
                                    <div>
                                        &#8377;{listing.rentAmount || 'Unknown'}/month 
                                        <span className="text-gray-500"> +18% GST</span>
                                    </div>
                                </p>
                                <p className="mb-1">Furnishing: {listing.furnishingStatus}</p>
                                <div className="flex flex-wrap gap-2 justify-center mb-1">
                                    <span className="inline-block bg-amber-100 font-semibold px-3 py-1 rounded-full border border-gray-200">
                                        Wi-Fi: {listing.wifi ? 'Available' : 'Not Available'}
                                    </span>
                                    <span className="inline-block bg-amber-100 font-semibold px-3 py-1 rounded-full border border-gray-200">
                                        Independent: {listing.independent ? 'Yes' : 'No'}
                                    </span>
                                </div>
                                <div className="flex justify-center mt-2">
                                    <button 
                                        type="button" 
                                        className="btn btn-warning px-5 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition duration-300 mr-2" 
                                        onClick={() => handleExploreClick(listing._id)}
                                    >
                                        Explore
                                    </button>
                                    <button 
                                        type="button" 
                                        className="btn btn-danger px-5 py-2 bg-red-400 text-white rounded-md hover:bg-red-600 transition duration-300" 
                                        onClick={() => handleRemoveClick(listing._id)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div> 
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default StudentSavedListings;
