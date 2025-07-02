import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import listingService from '../../../services/listingService';
import PGListingsPlaceholder from "../../../assets/Room1.svg";

function StudentSavedListings() {
    const navigate = useNavigate();

    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchListings = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await listingService.getAllPGListings();
                if (Array.isArray(data)) {
                    setListings(data);
                } else if (data && Array.isArray(data.listings)) {
                    setListings(data.listings);
                } else {
                    setListings([]);
                    setError('Unexpected data format received from server');
                }
            } catch (err) {
                setError('Failed to fetch listings');
            } finally {
                setLoading(false);
            }
        };
        fetchListings();
    }, []);

    const handleExploreClick = (id) => {
        navigate(`/RoomDetail/${id}`);
    };

    const handleRemoveClick = (id) => {
        console.log(`Remove listing with id: ${id}`);
        // Implement remove logic if needed
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
                    This Are Your <span className='text-yellow-500'>Saved</span> Rooms!
                </h1>
            </div>
            <h2 className="text-3xl text-gray-600 font-bold mt-5 mb-8">My Favourites</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 rounded-lg gap-6 px-4 md:px-20 py-12">
                {listings.map((listing) => (
                    <div className="rounded-lg bg-stone-100 shadow-md overflow-hidden" key={listing._id}>
                        <img 
                            src={listing.propertyImages && listing.propertyImages.length > 0 ? listing.propertyImages[0] : PGListingsPlaceholder} 
                            className="w-full h-52 object-cover" 
                            alt="listing" 
                        />
                        <div className="p-4 text-center">
                            <p className="text-lg font-bold">
                                <div>{listing.houseNumber}, {listing.colony}, {listing.city}</div>
                                <div>
                                    &#8377;{listing.rentAmount}/month 
                                    <span className="text-gray-500"> +18% GST</span>
                                </div>
                            </p>
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
                ))}
            </div>
        </div>
    );
}

export default StudentSavedListings;
