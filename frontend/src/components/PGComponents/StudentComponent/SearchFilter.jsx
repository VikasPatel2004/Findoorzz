import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchFilter = () => {
    const navigate = useNavigate();
    const [city, setCity] = useState('');
    const [locality, setLocality] = useState('');
    const [priceRange, setPriceRange] = useState([5000]); // Only end range
    const [roomType, setRoomType] = useState('');

    const handleCityChange = (e) => {
        setCity(e.target.value);
        setLocality(''); // Reset locality when city changes
    };

    const handleLocalityChange = (e) => {
        setLocality(e.target.value);
    };

    // Navigate to the Saved Listings route
    const handleSavedListingsClick = () => {
        navigate('/SavedListings'); // Navigate to the Saved Listings route
    };

    const localities = {
        Gwalior: ['Goleka Mandir', 'Indramani', 'Bank Colony'],
        Indore: ['Vijay Nagar', 'Rajendra Nagar', 'Others'],
        Bhopal: ['Bhopal City', 'Habibganj', 'Others'],
    };

    return (
        <div className="container mx-auto pt-4 max-w-8xl">
            <div className="flex flex-col md:flex-row justify-between items-center px-4 md:px-20">
                <h1 className='text-left font-semibold py-6 text-2xl md:text-3xl'>
                    "Your <span className='text-yellow-500'>Home</span> Away From <span className='text-yellow-500'>Home </span>!"
                </h1>
                <button 
                    type="button" 
                    className="btn px-5 py-2 mt-4 md:mt-0 bg-blue-400 text-white rounded-md hover:bg-blue-500 transition duration-300" 
                    onClick={handleSavedListingsClick}
                >
                    Saved Listings
                </button>
            </div>
           <div className="search max-w-8xl p-8 "> 
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {/* City Filter */}
                <div className=" p-2 rounded-md text-center">
                    <label className="block mb-1">City</label>
                    <select value={city} onChange={handleCityChange} className="border rounded-md p-1 w-full">
                        <option value="">Select City</option>
                        <option value="Gwalior">Gwalior</option>
                        <option value="Indore">Indore</option>
                        <option value="Bhopal">Bhopal</option>
                    </select>
                </div>

                {/* Locality Filter */}
                <div className=" p-2 rounded-md text-center">
                    <label className="block mb-1">Locality</label>
                    <select value={locality} onChange={handleLocalityChange} className="border rounded-md p-1 w-full" disabled={!city}>
                        <option value="">Select Locality</option>
                        {city && localities[city].map((loc, index) => (
                            <option key={index} value={loc}>{loc}</option>
                        ))}
                    </select>
                </div>

                {/* Price Range Filter */}
                <div className=" p-2 rounded-md text-center">
                    <label className="block mb-1">Price Range</label>
                    <input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([Number(e.target.value)])} // Only end range
                        className="border rounded-md p-1 w-full"
                        placeholder="Max Price"
                    />
                </div>

                {/* Room Type Filter */}
                <div className=" p-2 rounded-md text-center">
                    <label className="block mb-1">Room Type</label>
                    <select value={roomType} onChange={(e) => setRoomType(e.target.value)} className="border rounded-md p-1 w-full">
                        <option value="">Select Room Type</option>
                        <option value="Single Room">Single Room</option>
                        <option value="Shared Room">Shared Room</option>
                        <option value="PG">PG</option>
                    </select>
                </div>

                {/* Amenities Filter */}
                <div className="col-span-1 sm:col-span-2 md:col-span-4 bg-amber-50 p-2 rounded-md text-center">
                    <h3 className="text-lg font-semibold mb-2">Amenities</h3>
                    <div className="flex justify-center flex-wrap">
                        <label className="flex items-center mr-4">
                            <input type="checkbox" className="mr-2" /> Wi-Fi
                        </label>
                        <label className="flex items-center mr-4">
                            <input type="checkbox" className="mr-2" /> AC
                        </label>
                        <label className="flex items-center mr-4">
                            <input type="checkbox" className="mr-2" /> Food Included
                        </label>
                    </div>
                </div>
            </div>
            <div className="flex justify-center mt-4">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300">
                    Search
                </button>
            </div>
            </div>
        </div>
    );
};

export default SearchFilter;
