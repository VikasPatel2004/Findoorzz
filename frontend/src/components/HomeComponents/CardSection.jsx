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
        <>
            {/* First Image Card Section */}
            <div className="flex flex-col justify-center items-center p-4 mt-12" id="card1-section">
                <motion.div 
                    ref={card1Ref}
                    className="relative w-full md:w-[90vw] transition-transform transform hover:scale-105 rounded-lg overflow-hidden m-2"
                    initial={{ opacity: 0, x: -100 }}
                    animate={isCard1Visible ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <img 
                        src={PGcard} 
                        alt="PG Accommodation" 
                        className="w-full h-full object-cover" // Changed to object-cover
                    />
                    <div className="absolute top-1/2 left-[60%] transform -translate-x-1/2 -translate-y-1/2 text-center bg-opacity-50 p-4 rounded">
                        <h1 className="text-sm md:text-3xl font-bold leading-tight">
                            "Find Your <span className="text-yellow-400">PG</span> Fast And <span className="text-yellow-400">Fuse</span> Free!"
                        </h1>
                        <button 
                            className="mt-2 md:mt-4 bg-yellow-400 text-white font-semibold py-1 px-2 md:py-1 md:px-4 rounded hover:bg-yellow-500 transition duration-300 text-xs md:text-lg"
                            onClick={handlePGButtonClick} // Add onClick handler
                        >
                            Explore
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Second Image Card Section */}
            <div className="flex flex-col justify-center items-center p-2 mb-8" id="card2-section">
                <motion.div 
                    ref={card2Ref}
                    className="relative w-full md:w-[90vw] transition-transform transform hover:scale-105 rounded-lg overflow-hidden m-2"
                    initial={{ opacity: 0, x: 100 }}
                    animate={isCard2Visible ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <img 
                        src={Flatcard} 
                        alt="Flat Accommodation" 
                        className="w-full h-full object-cover" // Changed to object-cover
                    />
                    <div className="absolute top-1/2 left-[60%] transform -translate-x-1/2 -translate-y-1/2 text-center bg-opacity-50 p-4 rounded">
                        <h1 className="text-sm md:text-3xl font-bold leading-tight">
                            "Find Flat, <span className="text-yellow-400">Roomates</span>, Family <span className="text-yellow-400">Make</span> Memories!"
                        </h1>
                        <button 
                            className="mt-2 md:mt-4 bg-yellow-400 text-white font-semibold py-1 px-2 md:py-1 md:px-4 rounded hover:bg-yellow-500 transition duration-300 text-xs md:text-lg"
                            onClick={handleFlatButtonClick} // Add onClick handler
                        >
                            Explore
                        </button>
                    </div>
                </motion.div>
            </div>
        </>
    );
};

export default CardSection;
