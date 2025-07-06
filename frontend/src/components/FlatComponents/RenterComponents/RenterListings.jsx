import React, { useState, useEffect, useContext } from 'react';
import { SavedListingsContext } from '../../../context/SavedListingsContext';
import { AuthContext } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import listingService from '../../../services/listingService';
import PGListingsPlaceholder from "../../../assets/Room1.svg";
import MiniImageGallery from '../../MiniImageGallery';

export default function RenterListings({ filters }) {
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);
    const { refreshSavedListings } = useContext(SavedListingsContext);

    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [savedListingIds, setSavedListingIds] = useState(new Set());
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchListings = async () => {
            setLoading(true);
            setError(null);
            try {
                // Build query params from filters
                let query = '';
                if (filters) {
                    const params = new URLSearchParams();
                    if (filters.city && filters.city.trim()) params.append('city', filters.city.trim());
                    if (filters.colony && filters.colony.trim()) params.append('colony', filters.colony.trim());
                    if (filters.priceRange && filters.priceRange.length > 0 && filters.priceRange[0] > 0) {
                        params.append('maxRent', filters.priceRange[0]);
                    }
                    if (filters.numberOfRooms && filters.numberOfRooms.trim()) params.append('numberOfRooms', filters.numberOfRooms);
                    if (filters.amenities) {
                        if (filters.amenities.wifi === true) params.append('wifi', 'true');
                        if (filters.amenities.ac === true) params.append('airConditioning', 'true');
                    }
                    query = params.toString() ? '?' + params.toString() : '';
                }

                // Fetch all listings
                let data;
                if (query) {
                    data = await listingService.getFlatListings(null, query);
                } else {
                    data = await listingService.getAllFlatListings();
                }
                let fetchedListings = Array.isArray(data) ? data : [];

                // Fetch user's own listings if logged in
                let myListings = [];
                if (token) {
                    try {
                        myListings = await listingService.getMyCreatedFlatListings(token);
                    } catch (err) {
                        myListings = [];
                    }
                }

                // Mark ownership and merge, avoiding duplicates
                const myIds = new Set(myListings.map(l => l._id));
                const mergedListings = [
                    ...myListings.map(l => ({ ...l, isOwnedByUser: true })),
                    ...fetchedListings.filter(l => !myIds.has(l._id)).map(l => ({ ...l, isOwnedByUser: false })),
                ];

                // Fetch saved listings only if user is authenticated
                let savedListings = [];
                if (token) {
                    try {
                        savedListings = await listingService.getSavedFlatListings(token);
                    } catch (error) {
                        savedListings = [];
                    }
                }
                const savedIdsSet = new Set(savedListings.map(listing => listing._id));
                setListings(mergedListings);
                setSavedListingIds(savedIdsSet);
            } catch (error) {
                setError('Failed to fetch listings');
                setListings([]);
                setSavedListingIds(new Set());
            } finally {
                setLoading(false);
            }
        };
        fetchListings();
    }, [filters, refreshSavedListings, token]);

    const handleExploreClick = (id) => {
        navigate(`/FlatDetail/${id}`);
    };

    const handleEditClick = (id) => {
        navigate(`/LenderForm?edit=${id}`);
    };

    const handleSaveToggle = async (listingId, isOwnedByUser) => {
        if (!token) {
            alert('Please login to save listings.');
            return;
        }
        if (isOwnedByUser) {
            alert('You cannot save your own listing.');
            return;
        }
        try {
            if (savedListingIds.has(listingId)) {
                await listingService.unsaveFlatListing(listingId, token);
                setSavedListingIds(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(listingId);
                    return newSet;
                });
                setListings(prev => prev.filter(listing => listing._id !== listingId));
            } else {
                try {
                    await listingService.saveFlatListing(listingId, token);
                    setSavedListingIds(prev => new Set(prev).add(listingId));
                } catch (error) {
                    if (error.response && error.response.status === 400 && error.response.data.message === 'Listing already saved') {
                        // Ignore this error as listing is already saved
                    } else {
                        alert('Failed to update saved listing. Please try again.');
                    }
                }
            }
        } catch (error) {
            alert('Failed to update saved listing. Please try again.');
        }
    };

    if (loading) {
        return <div className="text-center py-10">Loading listings...</div>;
    }

    if (error) {
        return <div className="text-center py-10 text-red-500">{error}</div>;
    }

    if (listings.length === 0) {
        return <div className="text-center py-10">No listings found matching your criteria.</div>;
    }

    return (
        <div className="container mx-auto text-center ">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 rounded-lg gap-6 px-4 md:px-20 py-4">
                {listings.map((listing) => (
                    <div className="rounded-lg bg-stone-100 shadow-md overflow-hidden relative" key={listing._id}>
                        {/* Mini Image Gallery */}
                        <MiniImageGallery 
                            images={listing.propertyImages} 
                            defaultImage={PGListingsPlaceholder}
                            alt="Flat Images"
                            maxImages={4}
                        />
                        
                        {/* Only show save button for listings not owned by the user */}
                        {!listing.isOwnedByUser && (
                            <button
                                type="button"
                                onClick={() => handleSaveToggle(listing._id, listing.isOwnedByUser)}
                                className="absolute top-2 right-2 p-2 rounded-full bg-white bg-opacity-75 hover:bg-opacity-100 transition z-10"
                                aria-label={savedListingIds.has(listing._id) ? 'Unsave listing' : 'Save listing'}
                                disabled={savedListingIds.has(listing._id)}
                                title={savedListingIds.has(listing._id) ? 'Listing already saved' : 'Save listing'}
                            >
                                {savedListingIds.has(listing._id) ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="currentColor" viewBox="0 0 24 24" stroke="none">
                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 19.364l6.364-6.364 6.364 6.364M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                    </svg>
                                )}
                            </button>
                        )}
                        <div className="p-4 text-center">
                            {/* Ownership badge */}
                            {listing.isOwnedByUser && (
                                <div className="mb-2">
                                    <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                                        Your Listing
                                    </span>
                                </div>
                            )}
                            <p className="text-lg font-bold mb-2">
                                {listing.houseNumber}, {listing.colony}, {listing.city}
                            </p>
                            <p className="mb-1">Rent: &#8377;{listing.rentAmount}/month</p>
                            <p className="mb-1">Furnishing: {listing.furnishingStatus}</p>
                            <p className="mb-1">Wi-Fi: {listing.wifi ? 'Available' : 'Not Available'}</p>
                            <p className="mb-1">Independent: {listing.independent ? 'Yes' : 'No'}</p>
                            
                            {/* Different actions based on ownership */}
                            <div className="flex gap-2 mt-2">
                                <button 
                                    type="button" 
                                    className="flex-1 bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition duration-300" 
                                    onClick={() => handleExploreClick(listing._id)}
                                >
                                    {listing.isOwnedByUser ? 'View' : 'Explore'}
                                </button>
                                
                                {listing.isOwnedByUser && (
                                    <button 
                                        type="button" 
                                        className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300" 
                                        onClick={() => handleEditClick(listing._id)}
                                    >
                                        Edit
                                    </button>
                                )}
                            </div>
                        </div> 
                    </div>
                ))}
            </div>
        </div>
    );
}

