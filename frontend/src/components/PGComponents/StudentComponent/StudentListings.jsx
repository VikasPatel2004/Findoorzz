import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import listingService from '../../../services/listingService';
import PGListingsPlaceholder from "../../../assets/Room1.svg";

function StudentListings({ filters, searchTrigger }) {
    const navigate = useNavigate();

    const [listings, setListings] = useState([]);
    const [filteredListings, setFilteredListings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [savedListingIds, setSavedListingIds] = useState(new Set());

    // Fetch listings on mount and when searchTrigger changes
    useEffect(() => {
        const fetchListings = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem('token');
                const data = await listingService.getAllPGListings(token);
                console.log('Fetched listings:', data);
                if (Array.isArray(data)) {
                    setListings(data);
                } else if (data && Array.isArray(data.listings)) {
                    setListings(data.listings);
                } else {
                    setListings([]);
                    setError('Unexpected data format received from server');
                }

                // Fetch saved listings to mark saved state
                if (token) {
                    const savedListings = await listingService.getSavedListings(token);
                    const savedIds = new Set(savedListings.map(listing => listing._id));
                    setSavedListingIds(savedIds);
                }
            } catch (error) {
                if (error.response && error.response.data) {
                    console.error('Error fetching listings:', error.response.data);
                    setError(`Failed to fetch listings: ${error.response.data.message || 'Unknown error'}`);
                } else {
                    console.error('Error fetching listings:', error);
                    setError('Failed to fetch listings');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchListings();
    }, [searchTrigger]);

    // Filter listings client-side based on filters
    useEffect(() => {
        const applyFilters = () => {
            // Check if all filters are empty/default
            const noFiltersApplied =
                !filters.city &&
                !filters.colony &&
                (!filters.rentAmount || filters.rentAmount.length === 0 || filters.rentAmount[0] === 0) &&
                !filters.numberOfRooms &&
                (!filters.amenities || (!filters.amenities.wifi && !filters.amenities.ac));

            if (noFiltersApplied) {
                setFilteredListings(listings);
                return;
            }

            let filtered = listings;

            // Filter by city with normalization
            if (filters.city) {
                const cityFilter = filters.city.trim().toLowerCase();
                filtered = filtered.filter(listing => listing.city && listing.city.trim().toLowerCase() === cityFilter);
            }

            // Filter by colony only if city matches, with robust normalization
            if (filters.colony) {
                const normalizeString = (str) => str.normalize('NFKD').replace(/\s+/g, '').toLowerCase();
                const colonyFilter = normalizeString(filters.colony);
                filtered = filtered.filter(listing => {
                    if (!listing.colony) return false;
                    const listingColony = normalizeString(listing.colony);
                    console.log(`Comparing listing colony "${listingColony}" with filter "${colonyFilter}"`);
                    return listingColony === colonyFilter;
                });
            }

            // Filter by rentAmount (number)
            if (filters.rentAmount && filters.rentAmount.length > 0) {
                const maxPrice = filters.rentAmount[0];
                filtered = filtered.filter(listing => listing.rentAmount <= maxPrice);
            }

            // Filter by numberOfRooms
            if (filters.numberOfRooms) {
                if (filters.numberOfRooms === '1') {
                    filtered = filtered.filter(listing => listing.numberOfRooms === 1);
                } else if (filters.numberOfRooms === '2') {
                    filtered = filtered.filter(listing => listing.numberOfRooms === 2);
                } else if (filters.numberOfRooms === '3') {
                    filtered = filtered.filter(listing => listing.numberOfRooms === 3);
                } else if (filters.numberOfRooms === '4+') {
                    filtered = filtered.filter(listing => listing.numberOfRooms >= 4);
                }
            }

            // Filter by amenities
            if (filters.amenities) {
                if (filters.amenities.wifi) {
                    filtered = filtered.filter(listing => listing.wifi === true);
                }
                if (filters.amenities.ac) {
                    filtered = filtered.filter(listing => listing.airConditioning === true);
                }
            }

            setFilteredListings(filtered);

            // Debug logs
            console.log('Filters applied:', filters);
            console.log('Filtered listings count:', filtered.length);
        };

        applyFilters();
    }, [filters, listings]);

    const handleExploreClick = (id) => {
        navigate(`/RoomDetail/${id}`);
    };

    const handleSaveToggle = async (listingId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please login to save listings.');
            return;
        }
        try {
            if (savedListingIds.has(listingId)) {
                await listingService.unsaveListing(listingId, token);
                setSavedListingIds(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(listingId);
                    return newSet;
                });
            } else {
                await listingService.saveListing(listingId, token);
                setSavedListingIds(prev => new Set(prev).add(listingId));
            }
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

    if (filteredListings.length === 0) {
        return <div className="text-center py-10">No listings found matching your criteria.</div>;
    }

    return (
        <div className="container mx-auto text-center ">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 rounded-lg gap-6 px-4 md:px-20 py-4">
                {filteredListings.map((listing) => (
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

export default StudentListings;
