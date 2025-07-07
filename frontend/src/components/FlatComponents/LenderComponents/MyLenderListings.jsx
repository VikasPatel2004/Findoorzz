import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import listingService from '../../../services/listingService';

function MyListings() {
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);
    const [lenderListings, setLenderListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Navigate to the Lender Form route
    const handleNewClick = () => {
        navigate('/lenderform'); // Navigate to the Lender Form route
    };

    // Navigate to the Lender Dashboard
    const handleDashboardClick = () => {
        navigate('/LenderDashboard'); // Route for the new Lender Dashboard
    };

    // Navigate to the Renter route
    const handleButtonClick = (listing) => {
        navigate(`/FlatDetail/${listing._id}`); // Navigate to FlatDetail with listing ID param
    };

    useEffect(() => {
    async function fetchListings() {
        try {
            setLoading(true);
            const listings = await listingService.getMyCreatedFlatListings();
            setLenderListings(Array.isArray(listings) ? listings : []);
        } catch (err) {
            setError('Failed to fetch listings');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }
    if (token) {
        fetchListings();
    } else {
        setLoading(false);
    }
    }, [token]);

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
                <div className="flex gap-3 mt-4 md:mt-0">
                    <button 
                        type="button" 
                        className="btn px-5 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300" 
                        onClick={handleDashboardClick}
                    >
                        Dashboard
                    </button>
                    <button 
                        type="button" 
                        className="btn px-5 py-2 bg-red-400 text-white rounded-md hover:bg-red-500 transition duration-300" 
                        onClick={handleNewClick}
                    >
                        Add Your Flat +
                    </button>
                </div>
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
                                <div className="flex flex-wrap gap-2 justify-center mb-1">
                                    <span className="inline-block bg-amber-100 font-semibold px-3 py-1 rounded-full border border-gray-200">
                                        Wi-Fi: {listing.wifi ? 'Available' : 'Not Available'}
                                    </span>
                                    <span className="inline-block bg-amber-100 font-semibold px-3 py-1 rounded-full border border-gray-200">
                                        Independent: {listing.independent ? 'Yes' : 'No'}
                                    </span>
                                </div>
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
