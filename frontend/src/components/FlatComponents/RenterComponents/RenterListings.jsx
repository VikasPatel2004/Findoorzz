import React, { useState, useEffect, useContext } from 'react';
import { SavedListingsContext } from '../../../context/SavedListingsContext';
import { useNavigate } from 'react-router-dom';
import listingService from '../../../services/listingService';
import PGListingsPlaceholder from "../../../assets/Room1.svg";

export default function RenterListings({ filters }) {
    const navigate = useNavigate();
    const { refreshSavedListings } = useContext(SavedListingsContext);

    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [savedListingIds, setSavedListingIds] = useState(new Set());

    // Fetch listings and saved listings on mount and when filters change
    useEffect(() => {
        const fetchListings = async () => {
            setLoading(true);
            try {
                let token = localStorage.getItem('token');
                if (!token) {
                    console.warn('No token found in localStorage');
                    token = null;
                }
                // Build query params from filters
                let query = '';
                if (filters) {
                    const params = new URLSearchParams();
                    if (filters.city) params.append('city', filters.city.trim());
                    if (filters.locality) params.append('colony', filters.locality.trim());
                    if (filters.priceRange && filters.priceRange.length > 0) params.append('maxRent', filters.priceRange[0]);
                    if (filters.roomType) params.append('roomType', filters.roomType.trim());
                    // If no filters applied, do not append query params to fetch all listings
                    if (params.toString() === '') {
                        query = '';
                    } else {
                        query = '?' + params.toString();
                    }
                }
                // Fetch all listings matching filters
                const data = await listingService.getFlatListings(token, query);
                console.log('Fetched listings:', data);
                let fetchedListings = [];
                if (data && Array.isArray(data.listings)) {
                    fetchedListings = data.listings;
                } else if (Array.isArray(data)) {
                    fetchedListings = data;
                }

                // Fetch saved listings
                let savedListings = [];
                if (token) {
                    savedListings = await listingService.getSavedFlatListings(token);
                } else {
                    console.warn('Skipping fetchSavedFlatListings due to missing token');
                }

                // Merge saved listings with fetched listings, ensuring no duplicates
                const savedIdsSet = new Set(savedListings.map(listing => listing._id));
                console.log('Saved listing IDs:', savedIdsSet);
                console.log('Fetched listings before filtering:', fetchedListings);
                // Filter fetched listings to match filters more loosely (case insensitive, trimmed, includes)
                const filteredFetchedListings = fetchedListings.filter(listing => {
                    if (filters.city && !listing.city.toLowerCase().includes(filters.city.trim().toLowerCase())) {
                        return false;
                    }
                    if (filters.colony && !listing.colony.toLowerCase().includes(filters.colony.trim().toLowerCase())) {
                        return false;
                    }
                    if (filters.numberOfRooms && listing.numberOfRooms.toString() !== filters.numberOfRooms) {
                        return false;
                    }
                    if (filters.wifi !== undefined && listing.wifi !== filters.wifi) {
                        return false;
                    }
                    if (filters.ac !== undefined && listing.ac !== filters.ac) {
                        return false;
                    }
                    if (filters.rentAmount && listing.rentAmount > filters.rentAmount) {
                        return false;
                    }
                    return true;
                });
                console.log('Filtered listings:', filteredFetchedListings);

                // Filter out null or invalid saved listings before merging
                const validSavedListings = savedListings.filter(listing => listing && listing._id);

                const mergedListings = [
                    ...filteredFetchedListings.filter(listing => !savedIdsSet.has(listing._id)),
                    ...validSavedListings
                ];

                setListings(mergedListings);
                setSavedListingIds(savedIdsSet);
            } catch {
                setListings([]);
                setSavedListingIds(new Set());
            } finally {
                setLoading(false);
            }
        };
        fetchListings();
    }, [filters, refreshSavedListings]);

    const handleExploreClick = (id) => {
        navigate(`/FlatDetail/${id}`);
    };

    const handleSaveToggle = async (listingId) => {
        const token = localStorage.getItem('token');
        console.log('Saving listing with token:', token); // Debug log
        if (!token) {
            alert('Please login to save listings.');
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
                    // Optionally refetch or add the saved listing to listings
                } catch (error) {
                    if (error.response && error.response.status === 400 && error.response.data.message === 'Listing already saved') {
                        // Ignore this error as listing is already saved
                        console.warn('Listing already saved, ignoring error.');
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

    if (listings.length === 0) {
        return <div className="text-center py-10">No listings found matching your criteria.</div>;
    }

    return (
        <div className="container mx-auto text-center ">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 rounded-lg gap-6 px-4 md:px-20 py-4">
                {listings.map((listing) => (
                    <div className="rounded-lg bg-stone-100 shadow-md overflow-hidden relative" key={listing._id}>
                        <img 
                            src={listing.propertyImages && listing.propertyImages.length > 0 ? listing.propertyImages[0] : PGListingsPlaceholder} 
                            className="w-full h-52 object-cover" 
                            alt="listing" 
                        />
                        <button
                            type="button"
                            onClick={() => handleSaveToggle(listing._id)}
                            className="absolute top-2 right-2 p-2 rounded-full bg-white bg-opacity-75 hover:bg-opacity-100 transition"
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

