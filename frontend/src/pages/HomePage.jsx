import React from 'react';
import PGcard from "../assets/PG.svg"; // Path to your PG image

function HomePage() {
    return ( 
        <div>
            {/* Background Section */}
            <div className="flex flex-col justify-center items-center p-6 md:p-12 bg-cover bg-center text-white shadow-lg h-64 md:h-[91vh]"
                 style={{ 
                     backgroundImage: "linear-gradient(to right, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.3)), url('https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
                     backgroundSize: 'cover',
                     backgroundPosition: 'center',
                 }}>
                <div className="flex flex-col md:flex-row w-full max-w-6xl">
                    <div className="md:w-1/2 flex flex-col justify-center items-center p-4 text-center">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
                            Discover a <span className="text-yellow-400">Place</span> You'll <span className="text-yellow-400">Love</span> to Call Home
                        </h1>
                        <h4 className="mt-2 text-base sm:text-lg md:text-xl font-light">
                            Opening doors to new opportunities and safe space.
                        </h4>
                    </div>
                    <div className="md:w-1/2 flex justify-center items-center">
                        {/* Optional: You can add an image or additional content here */}
                    </div>
                </div>
            </div>

            {/* Image Card Section */}
            <div className="flex flex-col justify-center items-center p-6 bg-gray-100">
                <div className="relative w-full md:w-[90vw] transition-transform transform hover:scale-105 shadow-lg rounded-lg overflow-hidden m-2">
                    <img 
                        src={PGcard} 
                        alt="PG Accommodation" 
                        className="w-full h-auto object-contain" // Set to contain to avoid cutting the image
                    />
                    {/* Quote Overlay */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/4 -translate-y-1/2 text-center bg-opacity-50 p-4 rounded">
                        <h1 className="text-lg md:text-3xl font-bold leading-tight">
                            "Find Your <span className="text-yellow-400">PG</span> Fast And <span className="text-yellow-400">Fuse</span> Free!"
                        </h1>
                        {/* Button Below the Quote */}
                        <button className="mt-2 md:mt-4 bg-yellow-400 text-white font-semibold py-2 px-4 rounded hover:bg-yellow-500 transition duration-300">
                            Learn More
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
