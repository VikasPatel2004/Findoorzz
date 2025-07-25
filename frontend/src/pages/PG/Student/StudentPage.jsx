import React, { useState } from 'react';
import StudentListings from '../../../components/PGComponents/StudentComponent/StudentListings';
import SearchFilter from '../../../components/PGComponents/StudentComponent/SearchFilter';
import StudentHelpSection from '../../../components/PGComponents/StudentComponent/Help';
import { useScrollToTop } from '../../../hooks/useScrollToTop';

function StudentPage() {
    useScrollToTop();
    // Lifted filter state here
    const [filters, setFilters] = useState({
        city: '',
        colony: '',
        rentAmount: [],
        numberOfRooms: '',
        amenities: {
            wifi: false,
            ac: false,
        },
    });

    const [searchTrigger, setSearchTrigger] = useState(0); // To trigger search on button click

    // Handlers to update filters
    const handleFilterChange = (field, value) => {
        setFilters((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleAmenitiesChange = (amenity, value) => {
        setFilters((prev) => ({
            ...prev,
            amenities: {
                ...prev.amenities,
                [amenity]: value,
            },
        }));
    };

    // Called on Search button click in SearchFilter
    const handleSearch = () => {
        setSearchTrigger((prev) => prev + 1);
    };

    return (
        <>
            <SearchFilter
                city={filters.city}
                colony={filters.colony}
                rentAmount={filters.rentAmount}
                numberOfRooms={filters.numberOfRooms}
                amenities={filters.amenities}
                onFilterChange={handleFilterChange}
                onAmenitiesChange={handleAmenitiesChange}
                onSearch={handleSearch}
            />
            <StudentListings filters={filters} searchTrigger={searchTrigger} />
            <StudentHelpSection />
        </>
    );
}

export default StudentPage;
