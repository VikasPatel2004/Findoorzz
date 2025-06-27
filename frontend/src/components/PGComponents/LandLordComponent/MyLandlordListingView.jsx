import React from 'react';
import { useNavigate } from 'react-router-dom';

function MyLandlordListingView() {
    const navigate = useNavigate();

    // Placeholder landlord listings data
    const landlordListings = [
        {
            id: 1,
            address: '123 Main St, City',
            rentAmount: 15000,
            furnishingStatus: 'Furnished',
            wifi: true,
            airConditioning: true,
            imageUrl: '/assets/landlord.mp4', // Replace with actual image or video URL
        },
        {
            id: 2,
            address: '456 Oak Ave, City',
            rentAmount: 12000,
            furnishingStatus: 'Semi-Furnished',
            wifi: false,
            airConditioning: true,
            imageUrl: '/assets/landlord.mp4',
        },
        // Add more listings as needed
    ];

    const handleExploreClick = (id) => {
        navigate(`/pg/landlord/listing/${id}`);
    };

    return (
        <div className="container mx-auto text-center pt-10">
            <h2 className="text-3xl text-gray-600 font-bold mt-5 mb-8">My Landlord Listings</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 rounded-lg gap-6 px-4 md:px-20 py-12">
                {landlordListings.map((listing) => (
                    <div className="rounded-lg bg-stone-100 shadow-md overflow-hidden" key={listing.id}>
                        <img
                            src={listing.imageUrl}
                            className="w-full h-52 object-cover"
                            alt="listing"
                        />
                        <div className="p-4 text-center">
                            <p className="text-lg font-bold mb-2">{listing.address}</p>
                            <p className="mb-1">Rent: &#8377;{listing.rentAmount}/month</p>
                            <p className="mb-1">Furnishing: {listing.furnishingStatus}</p>
                            <p className="mb-1">Wi-Fi: {listing.wifi ? 'Available' : 'Not Available'}</p>
                            <p className="mb-1">Air Conditioning: {listing.airConditioning ? 'Available' : 'Not Available'}</p>
                            <button
                                type="button"
                                className="btn btn-warning px-5 py-2 mt-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition duration-300"
                                onClick={() => handleExploreClick(listing.id)}
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

export default MyLandlordListingView;
