import React from 'react';
import { useNavigate } from 'react-router-dom';
import PGListings from "../../../assets/Room1.svg";

function RenterSavedListings() {
    const navigate = useNavigate();
    

    // Navigate to the Renter route
    const handleButtonClick = () => {
        navigate('/RoomDetail'); // Navigate to the Renter route
    };

    // Handle remove listing
    const handleRemoveClick = (index) => {
        console.log(`Remove listing at index: ${index}`);
        // Logic to remove the listing goes here
    };

    return (
        <div className="container mx-auto text-center pt-10">
            <div className="flex flex-col md:flex-row justify-between items-center px-4 md:px-20">
                <h1 className='text-left py-2 text-2xl md:text-3xl'>
                    "This Are Your <span className='text-yellow-500'>Saved </span>, Flats!"
                </h1>
            </div>
            <h2 className="text-3xl text-gray-600 font-bold mt-5 mb-8">"My Favourites"</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 rounded-lg gap-6 px-4 md:px-20 py-12">
                {Array(6).fill().map((_, index) => ( // Limit to 6 cards
                    <div className="rounded-lg bg-stone-100 shadow-md overflow-hidden" key={index}>
                        <img 
                            src={PGListings} 
                            className="w-full h-52 object-cover" // Increased height
                            alt="listing" 
                        />
                        <div className="p-4 text-center">
                            <p className="text-lg font-bold">
                                <div><b>My Address</b></div>
                                <div>
                                    &#8377;2000/night 
                                    <span className="text-gray-500"> +18% GST</span>
                                </div>
                            </p>
                            <div className="flex justify-center mt-2">
                                <button 
                                    type="button" 
                                    className="btn btn-warning px-5 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition duration-300 mr-2" 
                                    onClick={handleButtonClick}
                                >
                                    Explore
                                </button>
                                <button 
                                    type="button" 
                                    className="btn btn-danger px-5 py-2 bg-red-400 text-white rounded-md hover:bg-red-600 transition duration-300" 
                                    onClick={() => handleRemoveClick(index)}
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

export default RenterSavedListings;
