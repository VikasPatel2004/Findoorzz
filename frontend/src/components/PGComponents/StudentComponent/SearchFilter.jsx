import React from 'react';
import { useNavigate } from 'react-router-dom';

const SearchFilter = ({
    city,
    colony,
    rentAmount,
    numberOfRooms,
    amenities,
    onFilterChange,
    onAmenitiesChange,
    onSearch,
}) => {
    const navigate = useNavigate();

    const handleCityChange = (e) => {
        onFilterChange('city', e.target.value);
        onFilterChange('colony', ''); // Reset colony when city changes
    };

    const handleColonyChange = (e) => {
        onFilterChange('colony', e.target.value);
    };

    const handleRentAmountChange = (e) => {
        onFilterChange('rentAmount', [Number(e.target.value)]);
    };

    const handleNumberOfRoomsChange = (e) => {
        onFilterChange('numberOfRooms', e.target.value);
    };

    const handleAmenityChange = (e) => {
        const { name, checked } = e.target;
        onAmenitiesChange(name, checked);
    };

    // Navigate to the Saved Listings route
    const handleSavedListingsClick = () => {
        navigate('/StudentSavedRooms');
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
                    <select value={city || ''} onChange={handleCityChange} className="border rounded-md p-1 w-full">
                        <option value="">Select City</option>
                        <option value="Gwalior">Gwalior</option>
                        <option value="Indore">Indore</option>
                        <option value="Bhopal">Bhopal</option>
                    </select>
                </div>

                {/* Colony Filter */}
                <div className=" p-2 rounded-md text-center">
                    <label className="block mb-1">Colony</label>
                    <select value={colony || ''} onChange={handleColonyChange} className="border rounded-md p-1 w-full" disabled={!city}>
                        <option value="">Select Colony</option>
                        {city && localities[city] && localities[city].map((col, index) => (
                            <option key={index} value={col}>{col}</option>
                        ))}
                    </select>
                </div>

                {/* Rent Filter */}
                <div className=" p-2 rounded-md text-center">
                    <label className="block mb-1">Rent</label>
                    <input
                        type="number"
                        value={rentAmount && rentAmount.length > 0 ? rentAmount[0] : ''}
                        onChange={handleRentAmountChange}
                        className="border rounded-md p-1 w-full"
                        placeholder="Max Rent"
                    />
                </div>

                {/* Room Type Filter */}
                <div className=" p-2 rounded-md text-center">
                <label className="block mb-1">Number of Rooms</label>
                <select value={numberOfRooms || ''} onChange={handleNumberOfRoomsChange} className="border rounded-md p-1 w-full">
                    <option value="">Select Number of Rooms</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4+">4+</option>
                </select>
                </div>

                {/* Amenities Filter */}
                <div className="col-span-1 sm:col-span-2 md:col-span-4 bg-amber-50 p-2 rounded-md text-center">
                    <h3 className="text-lg font-semibold mb-2">Amenities</h3>
                    <div className="flex justify-center flex-wrap">
                        <label className="flex items-center mr-4">
                            <input
                                type="checkbox"
                                className="mr-2"
                                name="wifi"
                                checked={amenities && amenities.wifi ? true : false}
                                onChange={handleAmenityChange}
                            /> Wi-Fi
                        </label>
                        <label className="flex items-center mr-4">
                            <input
                                type="checkbox"
                                className="mr-2"
                                name="ac"
                                checked={amenities && amenities.ac ? true : false}
                                onChange={handleAmenityChange}
                            /> AC
                        </label>
                    </div>
                </div>
            </div>
            <div className="flex justify-center mt-4">
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
                    onClick={onSearch}
                >
                    Search
                </button>
            </div>
            </div>
        </div>
    );
};

export default SearchFilter;