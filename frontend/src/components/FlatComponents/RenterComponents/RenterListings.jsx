import React from 'react';
import { useNavigate } from 'react-router-dom';
import PGListings from "../../../assets/Room1.svg"; // Image for the listings

function RenterListings() {
    const navigate = useNavigate();

    // Navigate to the Renter details route
    const handleButtonClick = () => {
        navigate('/RenterDetails'); // Navigate to the Renter details route
    };

    return (
        <div className="container mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Available Flats</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 rounded-lg gap-6 px-4 md:px-20 py-4">
                {Array(6).fill().map((_, index) => ( // Limit to 6 cards
                    <div className="rounded-lg bg-stone-100 shadow-md overflow-hidden" key={index}>
                        <img 
                            src={PGListings} 
                            className="w-full h-52 object-cover" // Increased height
                            alt="listing" 
                        />
                        <div className="p-4 text-center">
                            <p className="text-lg font-bold">
                                <div><b>PG Address {index + 1}</b></div>
                                <div>
                                    &#8377;2000/night 
                                    <span className="text-gray-500"> +18% GST</span>
                                </div>
                            </p>
                            <button 
                                type="button" 
                                className="btn btn-warning px-5 py-2 mt-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition duration-300" 
                                onClick={handleButtonClick}
                            >
                                View Details
                            </button> 
                        </div> 
                    </div>
                ))}
            </div>
        </div>
    );
}

export default RenterListings;
