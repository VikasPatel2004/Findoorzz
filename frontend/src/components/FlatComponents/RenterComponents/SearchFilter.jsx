import React from 'react';
import { useNavigate } from 'react-router-dom';

const RenterSearchFilter = ({ filters, onFilterChange }) => {
    const navigate = useNavigate();

    const handleCityChange = (e) => {
        onFilterChange({
            ...filters,
            city: e.target.value,
            colony: '', // Reset colony when city changes
        });
    };

    const handleLocalityChange = (e) => {
        onFilterChange({
            ...filters,
            colony: e.target.value,
        });
    };

    const handlePriceRangeChange = (e) => {
        const value = e.target.value;
        onFilterChange({
            ...filters,
            rent: value === '' ? [] : [Number(value)],
        });
    };

    const handleBhkChange = (e) => {
        onFilterChange({
            ...filters,
            bhk: e.target.value,
        });
    };

    const handleAmenityChange = (amenity) => {
        onFilterChange({
            ...filters,
            amenities: {
                ...filters.amenities,
                [amenity]: !filters.amenities[amenity],
            },
        });
    };

    // Navigate to the Saved Listings route
    const handleSavedListingsClick = () => {
        navigate('/RenterSavedFlats'); // Navigate to the Saved Listings route
    };

    const localities = {
        Gwalior: ['Goleka Mandir', 'Indramani', 'Bank Colony'],
        Indore: ['Vijay Nagar', 'Rajendra Nagar', 'Others'],
        Bhopal: ['Bhopal City', 'Habibganj', 'Others'],
    };

    return (
        <div className="container mx-auto pt-4 max-w-8xl">
            <div className="flex flex-col md:flex-row justify-between items-center px-4 md:px-20">
               <h1 className="text-left font-semibold py-5 text-2xl">
  "Flat walls may be <span className="text-yellow-500">plain</span>, 
  but they're <span className="text-yellow-500">painted</span> with 
  <span className="text-yellow-500"> memories</span> of friends!"
</h1>

              <div className="button">
                <button
                    type="button"
                    className="btn px-5 py-2 mt-4 md:mt-0 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition duration-300 mr-4"
                    onClick={() => navigate('/RenterDashboard')}
                >
                    Dashboard
                </button>
                  <button 
                    type="button" 
                    className="btn px-5 py-2 mt-4 md:mt-0 bg-blue-400 text-white rounded-md hover:bg-blue-500 transition duration-300" 
                    onClick={handleSavedListingsClick}
                >
                    Saved Listings
                </button>
              </div>
            </div>
           <div className="search max-w-8xl p-8 "> 
            {/* Responsive filter controls: 2 rows x 2 columns on mobile, 4 columns on md+ */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-4">
                {/* City Filter */}
                <div className="p-2 rounded-md text-center">
                    <label className="block mb-1">City</label>
                    <select value={filters.city} onChange={handleCityChange} className="border rounded-md p-1 w-full">
                        <option value="">Select City</option>
                        <option value="Gwalior">Gwalior</option>
                        <option value="Indore">Indore</option>
                        <option value="Bhopal">Bhopal</option>
                    </select>
                </div>

                {/* Colony Filter */}
                <div className="p-2 rounded-md text-center">
                    <label className="block mb-1">Colony</label>
                    <select value={filters.colony} onChange={handleLocalityChange} className="border rounded-md p-1 w-full" disabled={!filters.city}>
                        <option value="">Select Colony</option>
                        {filters.city && localities[filters.city].map((col, index) => (
                            <option key={index} value={col}>{col}</option>
                        ))}
                    </select>
                </div>

                {/* Rent Filter */}
                <div className="p-2 rounded-md text-center">
                    <label className="block mb-1">Rent</label>
                    <input
                        type="number"
                        value={filters.rent && filters.rent.length > 0 ? filters.rent[0] : ''}
                        onChange={handlePriceRangeChange}
                        onWheel={e => e.target.blur()}
                        className="border rounded-md p-1 w-full"
                        placeholder="Max Rent"
                    />
                </div>

                {/* BHK Filter */}
                <div className="p-2 rounded-md text-center">
                    <label className="block mb-1">BHK</label>
                    <select value={filters.bhk || ''} onChange={handleBhkChange} className="border rounded-md p-1 w-full">
                        <option value="">Select BHK</option>
                        <option value="1BHK">1BHK</option>
                        <option value="2BHK">2BHK</option>
                        <option value="3BHK">3BHK</option>
                    </select>
                </div>
            </div>
            {/* Amenities and Search button remain below */}
            <div className="col-span-1 sm:col-span-2 md:col-span-4 bg-amber-50 p-2 rounded-md text-center">
                <h3 className="text-lg font-semibold mb-2">Amenities</h3>
                <div className="flex justify-center flex-wrap">
                    <label className="flex items-center mr-4">
                        <input type="checkbox" className="mr-2" checked={filters.amenities && filters.amenities.wifi ? true : false} onChange={() => handleAmenityChange('wifi')} /> Wi-Fi
                    </label>
                    <label className="flex items-center mr-4">
                        <input type="checkbox" className="mr-2" checked={filters.amenities && filters.amenities.ac ? true : false} onChange={() => handleAmenityChange('ac')} /> AC
                    </label>
                    {/* Removed Food Included amenity as per request */}
                </div>
            </div>
            <div className="flex justify-center mt-4">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300" onClick={() => onFilterChange(filters)}>
                    Search
                </button>
            </div>
            </div>
        </div>
    );
};

export default RenterSearchFilter;

