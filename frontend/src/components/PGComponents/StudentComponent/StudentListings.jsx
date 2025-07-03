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
                    <div className="rounded-lg bg-stone-100 shadow-md overflow-hidden" key={listing._id}>
                        <img 
                            src={listing.propertyImages && listing.propertyImages.length > 0 ? listing.propertyImages[0] : PGListingsPlaceholder} 
                            className="w-full h-52 object-cover" 
                            alt="listing" 
                        />
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
