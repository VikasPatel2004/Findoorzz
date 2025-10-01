import React, { useState, useEffect, useContext } from 'react';
import { SavedListingsContext } from '../../../context/SavedListingsContext';
import { AuthContext } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import listingService from '../../../services/listingService';
import MiniImageGallery from '../../MiniImageGallery';

export default function RenterListings({ filters }) {
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);
    const { refreshSavedListings } = useContext(SavedListingsContext);

    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [savedListingIds, setSavedListingIds] = useState(new Set());

    useEffect(() => {
        const fetchListings = async () => {
            setLoading(true);
            try {
                // Build filterParams object from filters
                let filterParams = {};
                if (filters) {
                    if (filters.city && filters.city.trim()) filterParams.city = filters.city.trim();
                    if (filters.colony && filters.colony.trim()) filterParams.colony = filters.colony.trim();
                    if (filters.rent && filters.rent.length > 0 && filters.rent[0] > 0) {
                        filterParams.maxPrice = filters.rent[0];
                    }
                    if (filters.bhk && filters.bhk.trim()) filterParams.bhk = filters.bhk.trim();
                    if (filters.amenities) {
                        if (filters.amenities.wifi === true) filterParams.wifi = true;
                        if (filters.amenities.ac === true) filterParams.airConditioning = true;
                    }
                }
                // Fetch all listings
                let data;
                if (Object.keys(filterParams).length > 0) {
                    data = await listingService.getFlatListings(filterParams);
                } else {
                    data = await listingService.getAllFlatListings();
                }
                let fetchedListings = Array.isArray(data) ? data : [];

                // Fetch user's own listings if logged in
                let myListings = [];
                if (token) {
                    try {
                        myListings = await listingService.getMyCreatedFlatListings(token);
                    } catch {
                        myListings = [];
                    }
                }

                // Mark ownership and merge, avoiding duplicates
                const myIds = new Set(myListings.map(l => l._id));
                let mergedListings = [
                    ...myListings.map(l => ({ ...l, isOwnedByUser: true })),
                    ...fetchedListings.filter(l => !myIds.has(l._id)).map(l => ({ ...l, isOwnedByUser: false })),
                ];

                // Filter mergedListings by city and colony if filters are set
                if (filters) {
                    const normalize = str => (str || '').toLowerCase().replace(/\s+/g, '');
                    if (filters.city && filters.city.trim()) {
                        const cityNorm = normalize(filters.city);
                        mergedListings = mergedListings.filter(l => normalize(l.city) === cityNorm);
                    }
                    if (filters.colony && filters.colony.trim()) {
                        const colonyNorm = normalize(filters.colony);
                        mergedListings = mergedListings.filter(l => normalize(l.colony) === colonyNorm);
                    }
                    if (filters.rent && filters.rent.length > 0 && filters.rent[0] > 0) {
                        mergedListings = mergedListings.filter(l => l.rentAmount <= filters.rent[0]);
                    }
                    // No client-side numberOfRooms filtering; using backend bhk filter
                }

                // Fetch saved listings only if user is authenticated
                let savedListings = [];
                if (token) {
                    try {
                        savedListings = await listingService.getSavedFlatListings();
                    } catch {
                        savedListings = [];
                    }
                }
                const savedIdsSet = new Set(savedListings.map(listing => listing._id));
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
    }, [filters, refreshSavedListings, token]);

    const handleExploreClick = (id) => {
        navigate(`/FlatDetail/${id}`);
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
            alert('Failed to update saved listing. Please try again.');
        }
    };

    if (loading) {
        return <div className="text-center py-10">Loading listings...</div>;
    }

    // Filter out listings that are both booked and owned by the current user
    const filteredListings = listings.filter(
        (listing) => !(listing.booked && listing.isOwnedByUser)
    );

    if (filteredListings.length === 0) {
        return <div className="text-center py-10">No listings found matching your criteria.</div>;
    }

    return (
        <div className="container mx-auto text-center ">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 rounded-lg gap-6 px-4 md:px-20 py-4">
                {filteredListings.map((listing) => (
                    <div className="rounded-lg bg-stone-100 shadow-md overflow-hidden relative" key={listing._id}>
                        {/* Mini Image Gallery */}
                        <MiniImageGallery 
                            images={listing.propertyImages} 
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
                             <p className="mb-1">BHK: {listing.bhk || 'N/A'}</p>
                             <p className="mb-1">Furnishing: {listing.furnishingStatus}</p>
                             <div className="flex flex-wrap gap-2 justify-center mb-1">
                                 <span className="inline-block bg-amber-100 font-semibold px-3 py-1 rounded-full border border-gray-200">
                                     Wi-Fi: {listing.wifi ? 'Available' : 'Not Available'}
                                 </span>
                                 <span className="inline-block bg-amber-100 font-semibold px-3 py-1 rounded-full border border-gray-200">
                                     Independent: {listing.independent ? 'Yes' : 'No'}
                                 </span>
                             </div>
                             {/* Show 'Booked' badge if listing is booked and not owned by the user, else show Explore button */}
                             {listing.booked && !listing.isOwnedByUser ? (
                                 <span className="inline-block bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-full mt-2">Booked</span>
                             ) : (
                                 <button 
                                     type="button" 
                                     className="btn btn-warning px-5 py-2 mt-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition duration-300" 
                                     onClick={() => handleExploreClick(listing._id)}
                                 >
                                     Explore
                                 </button>
                             )}
                        </div> 
                    </div>
                ))}
            </div>
        </div>
    );
}

