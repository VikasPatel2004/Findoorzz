import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import PGcard from "../../assets/PG.svg"; // Path to your PG image
import Flatcard from "../../assets/Flat.svg"; // Path to your Flat image

const CardSection = ({ isCard1Visible, isCard2Visible }) => {
    const navigate = useNavigate(); // Initialize useNavigate
    const card1Ref = useRef(null);
    const card2Ref = useRef(null);

    // Handler for PG button click
    const handlePGButtonClick = () => {
        navigate('/Pg'); // Navigate to PG listings
    };

    // Handler for Flat button click
    const handleFlatButtonClick = () => {
        navigate('/Flat'); // Navigate to Flat listings
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
            {/* First Card Section (PG) */}
            <div className="mb-16" id="card1-section">
                <motion.div
                    ref={card1Ref}
                    className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden max-w-7xl mx-auto transform hover:scale-[1.02] transition-transform duration-300"
                    initial={{ opacity: 0, y: 60 }}
                    animate={isCard1Visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div className="flex flex-col lg:flex-row min-h-[200px]">
                        {/* Image Side */}
                        <div className="w-full lg:w-1/2 flex justify-center items-center p-8 lg:p-12 bg-gradient-to-br from--100 via-blue-50 to-indigo-100 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-indigo-400/10"></div>
                            <img
                                src={PGcard}
                                alt="PG Accommodation"
                                className="w-full max-w-lg h-auto object-contain rounded-4xl relative z-10 drop-shadow-lg"
                            />
                        </div>
                        {/* Text Side */}
                        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center text-center p-8 lg:p-12 bg-white relative">
                            <div className="max-w-md">
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-8 text-gray-800">
                                   " Find Your <span className="text-yellow-500 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">PG</span> Fast And <span className="text-yellow-500 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Fuse</span> Free! "
                                </h1>
                                <button
                                    className="bg-gradient-to-r bg-amber-100 font-bold py-4 px-10 rounded-full hover:from-yellow-200 hover:to-yellow-200 transition-all duration-300 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                    onClick={handlePGButtonClick}
                                >
                                    Explore Now
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Second Card Section (Flat) */}
            <div className="mb-16" id="card2-section">
                <motion.div
                    ref={card2Ref}
                    className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden max-w-7xl mx-auto transform hover:scale-[1.02] transition-transform duration-300"
                    initial={{ opacity: 0, y: 60 }}
                    animate={isCard2Visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div className="flex flex-col lg:flex-row min-h-[200px]">
                        {/* Image Side */}
                        <div className="w-full lg:w-1/2 flex justify-center items-center p-8 lg:p-12 bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-teal-400/10"></div>
                            <img
                                src={Flatcard}
                                alt="Flat Accommodation"
                                className="w-full max-w-lg h-auto object-contain rounded-4xl relative z-10 drop-shadow-lg"
                            />
                        </div>
                        {/* Text Side */}
                        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center text-center p-8 lg:p-12 bg-white relative">
                            <div className="max-w-md">
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-8 text-gray-800">
                                   " Find Flat, <span className="text-yellow-500 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Roomates</span>, Family <span className="text-yellow-500 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Make</span> Memories! "
                                </h1>
                               
                                <button
 className="bg-gradient-to-r bg-amber-100 font-bold py-4 px-10 rounded-full hover:from-yellow-200 hover:to-yellow-200 transition-all duration-300 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                    onClick={handleFlatButtonClick}
                                >
                                    Explore Now
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default CardSection;
