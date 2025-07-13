import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import listingService from '../../../services/listingService';
import MiniImageGallery from '../../MiniImageGallery';

function StudentListings({ filters, searchTrigger }) {
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);

    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [savedListingIds, setSavedListingIds] = useState(new Set());

    // Fetch listings on mount and when searchTrigger changes
    useEffect(() => {
        const fetchListings = async () => {
            setLoading(true);
            setError(null);
            try {
                console.log('=== StudentListings: Starting fetch ===');
                console.log('Filters:', filters);
                console.log('Search trigger:', searchTrigger);
                console.log('Token:', token);
                
                // Build query params from filters
                let query = '';
                if (filters) {
                    const params = new URLSearchParams();
                    if (filters.city && filters.city.trim()) params.append('city', filters.city.trim());
                    if (filters.colony && filters.colony.trim()) params.append('colony', filters.colony.trim());
                    if (filters.rent && filters.rent.length > 0 && filters.rent[0] > 0) {
                        params.append('maxRent', String(filters.rent[0]));
                    }
                    if (filters.numberOfRooms && filters.numberOfRooms.trim()) params.append('numberOfRooms', String(filters.numberOfRooms));
                    if (filters.amenities) {
                        // Only add wifi filter if it's explicitly checked (true)
                        if (filters.amenities.wifi === true) params.append('wifi', 'true');
                        // Only add airConditioning filter if it's explicitly checked (true)
                        if (filters.amenities.ac === true) params.append('airConditioning', 'true');
                    }
                    query = params.toString() ? '?' + params.toString() : '';
                }
                console.log('Colony filter value:', filters.colony);
                console.log('Query string:', query);
                
                console.log('Fetching PG listings with query:', query);
                
                // Use student-specific API if authenticated, otherwise use public API
                let data;
                if (token) {
                    if (query) {
                        console.log('Using student filtered endpoint');
                        data = await listingService.getFilteredStudentPGListings(query, token);
                    } else {
                        console.log('Using student list-all endpoint');
                        data = await listingService.getStudentPGListings(token);
                    }
                } else {
                    if (query) {
                        console.log('Using public filtered endpoint');
                        data = await listingService.getFilteredPGListings(query);
                    } else {
                        console.log('Using public list-all endpoint');
                        data = await listingService.getAllPGListings();
                    }
                }
                
                console.log('Fetched PG listings:', data);
                
                let fetchedListings = [];
                if (Array.isArray(data)) {
                    fetchedListings = data;
                    console.log('Data is already an array:', fetchedListings.length);
                } else {
                    console.error('Unexpected data format:', data);
                    setListings([]);
                    setError('Unexpected data format received from server');
                    return;
                }
                
                console.log('Processed listings:', fetchedListings);
                setListings(fetchedListings);

                // Fetch saved listings to mark saved state (only if authenticated)
                if (token) {
                    try {
                        console.log('Fetching saved PG listings...');
                        const savedListings = await listingService.getSavedPGListings();
                        console.log('Saved PG listings:', savedListings);
                        const savedIds = new Set(savedListings.map(listing => listing._id));
                        setSavedListingIds(savedIds);
                    } catch (error) {
                        console.warn('Failed to fetch saved PG listings:', error);
                        setSavedListingIds(new Set());
                    }
                } else {
                    setSavedListingIds(new Set());
                }
            } catch (e) {
                setError('Failed to fetch listings');
                setListings([]);
                setSavedListingIds(new Set());
            } finally {
                setLoading(false);
            }
        };
        
        // Always fetch listings, regardless of token status
        fetchListings();
    }, [searchTrigger, filters, token]);

    const handleExploreClick = (id) => {
        navigate(`/RoomDetail/${id}`);
    };

    const handleEditClick = (id) => {
        navigate(`/LandlordForm?edit=${id}`);
    };

    const handleSaveToggle = async (listingId) => {
        if (!token) {
            alert('Please login to save listings.');
            return;
        }
        
        // Find the listing to check if it's owned by the user
        const listing = listings.find(l => l._id === listingId);
        if (listing && listing.isOwnedByUser) {
            alert('You cannot save your own listings.');
            return;
        }
        
        try {
            await listingService.toggleSavedListing(listingId);
            
            // Toggle the saved state locally
            setSavedListingIds(prev => {
                const newSet = new Set(prev);
                if (newSet.has(listingId)) {
                    newSet.delete(listingId);
                } else {
                    newSet.add(listingId);
                }
                return newSet;
            });
        } catch (error) {
            console.error('Error toggling save listing:', error);
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
                            alt="Room Images"
                            maxImages={4}
                        />
                        {/* Only show save button for listings not owned by the user */}
                        {!listing.isOwnedByUser && (
                            <button
                                type="button"
                                onClick={() => handleSaveToggle(listing._id)}
                                className="absolute top-2 right-2 p-2 rounded-full bg-white bg-opacity-75 hover:bg-opacity-100 transition z-10"
                                aria-label={savedListingIds.has(listing._id) ? 'Unsave listing' : 'Save listing'}
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
                                onClick={() => handleExploreClick(listing._id)}
                            >
                                Explore
                            </button> 
                        </div> 
                    </div>
                ))}
            </div>
        </div>
    );
}

export default StudentListings;
