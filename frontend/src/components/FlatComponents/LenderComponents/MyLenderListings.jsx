import React from 'react';
import { useNavigate } from 'react-router-dom';
import PGListings from "../../../assets/Room1.svg";

function MyLenderListings() {
    const navigate = useNavigate();
    
    // Navigate to the Landlord route
    const handleNewClick = () => {
        navigate('/LenderForm'); // Navigate to the Landlord route
    };

    // Navigate to the Renter route
    const handleButtonClick = () => {
        navigate('/FlatDetails'); // Navigate to the Renter route
    };

    return (
        <div className="container mx-auto text-center pt-10">
            <div className="flex flex-col md:flex-row justify-between items-center px-4 md:px-20">
                <h1 className='text-left py-2 text-2xl md:text-3xl'>
                    "List your <span className='text-yellow-500'>Flat </span>, here!"
                </h1>
                <div className="flex space-x-4">
                  <button 
                      type="button" 
                      className="btn px-5 py-2 mt-4 md:mt-0 bg-red-400 text-white rounded-md hover:bg-red-500 transition duration-300" 
                      onClick={handleNewClick}
                  >
                      Add Your Room +
                  </button>
                  <button
                    type="button"
                    className="btn px-5 py-2 mt-4 md:mt-0 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition duration-300"
                    onClick={() => navigate('/dashboard')}
                  >
                    Dashboard
                  </button>
                </div>
            </div>
            <h2 className="text-3xl text-gray-600 font-bold mt-5 mb-8">"My Listings"</h2>
            <div className="grid grid-cols- sm:grid-cols-2 md:grid-cols-3 rounded-lg gap-6 px-4 md:px-20 py-12">
                {Array(6).fill().map((_, index) => ( // Limit to 6 cards
                    <div className="rounded-lg bg-stone-100 shadow-md overflow-hidden" key={index}>
                        <img 
                            src={PGListings} 
                            className="w-full h-52 object-cover" // Increased height
                            alt="listing" 
                        />
                        <div className="p-4 text-center">
                            <p className="text-lg font-bold">
                                <div><b>my address</b></div>
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
                                Explore
                            </button> 
                        </div> 
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MyLenderListings;
