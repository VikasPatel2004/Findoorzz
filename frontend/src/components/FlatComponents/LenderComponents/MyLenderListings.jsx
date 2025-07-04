import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import listingService from '../../../services/listingService';

function MyListings() {
    const navigate = useNavigate();
    const [lenderListings, setLenderListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Navigate to the Lender Form route
    const handleNewClick = () => {
        navigate('/lenderform'); // Navigate to the Lender Form route
    };

    // Navigate to the Renter route
    const handleButtonClick = (listing) => {
        navigate(`/FlatDetail/${listing._id}`); // Navigate to FlatDetail with listing ID param
    };

    useEffect(() => {
    async function fetchListings() {
        try {
            setLoading(true);
            // Get token from localStorage or context (adjust as per your auth implementation)
            const token = localStorage.getItem('token');
            const listings = await listingService.getFlatListings(token);
            setLenderListings(listings.listings || listings);
        } catch (err) {
            setError('Failed to fetch listings');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }
    fetchListings();
    }, []);

    if (loading) {
        return <div className="text-center py-10">Loading listings...</div>;
    }

    if (error) {
        return <div className="text-center py-10 text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto text-center pt-10">
            <div className="flex flex-col md:flex-row justify-between items-center px-4 md:px-20">
                <h1 className='text-left py-2 text-2xl md:text-3xl'>
                    List your <span className='text-yellow-500'>flat</span>, here!
                </h1>
                <button 
                    type="button" 
                    className="btn px-5 py-2 mt-4 md:mt-0 bg-red-400 text-white rounded-md hover:bg-red-500 transition duration-300" 
                    onClick={handleNewClick}
                >
                    Add Your Flat +
                </button>
            </div>
            <h2 className="text-3xl text-gray-600 font-bold mt-5 mb-8">My Listings</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 rounded-lg gap-6 px-4 md:px-20 py-12">
                {lenderListings.length === 0 ? (
                    <p>No listings found.</p>
                ) : (
                    lenderListings.map((listing) => (
                        <div className="rounded-lg bg-stone-100 shadow-md overflow-hidden" key={listing._id}>
                            {listing.propertyImages && listing.propertyImages.length > 0 ? (
                                <img 
                                    src={listing.propertyImages[0]} 
                                    className="w-full h-52 object-cover" 
                                    alt="listing" 
                                />
                            ) : (
                                <div className="w-full h-52 bg-gray-300 flex items-center justify-center text-gray-500">
                                    No Image
                                </div>
                            )}
                            <div className="p-4 text-center">
                                <p className="text-lg font-bold mb-2">
                                    {listing.houseNumber}, {listing.colony}, {listing.city}
                                </p>
                                <p className="mb-1">Rent: &#8377;{listing.rentAmount}/month</p>
                                <p className="mb-1">Furnishing: {listing.furnishingStatus}</p>
                                <p className="mb-1">Wi-Fi: {listing.wifi ? 'Available' : 'Not Available'}</p>
                                <p className="mb-1">Independent: {listing.independent ? 'Yes' : 'No'}</p>
                                <button 
                                    type="button" 
                                    className="btn btn-warning px-5 py-2 mt-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition duration-300" 
                                    onClick={() => handleButtonClick(listing)}
                                >
                                    Explore
                                </button> 
                            </div> 
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default MyListings;
