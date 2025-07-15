import React, { useState } from 'react';
import RenterSearchFilter from '../../../components/FlatComponents/RenterComponents/SearchFilter';
import RenterListings from '../../../components/FlatComponents/RenterComponents/RenterListings';
import RenterHelpSection from '../../../components/FlatComponents/RenterComponents/Help';
import { useScrollToTop } from '../../../hooks/useScrollToTop';

function RenterPage() {
    useScrollToTop();
    const [filters, setFilters] = useState({
        city: '',
        colony: '',
        rent: [],
        numberOfRooms: '',
        amenities: {
            wifi: false,
            ac: false,
        },
    });

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    return (
        <>
            <RenterSearchFilter filters={filters} onFilterChange={handleFilterChange} />
            <RenterListings filters={filters} />
            <RenterHelpSection />
        </>
    );
}

export default RenterPage;
