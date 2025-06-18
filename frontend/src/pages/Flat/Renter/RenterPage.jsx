import React from 'react';
import RenterSearchFilter from '../../../components/FlatComponents/RenterComponents/SearchFilter';
import RenterListings from '../../../components/FlatComponents/RenterComponents/RenterListings';
import RenterHelpSection from '../../../components/FlatComponents/RenterComponents/Help';

function RenterPage() {
    return ( 
        <>
        <RenterSearchFilter/>
        <RenterListings/>
        <RenterHelpSection/>
        </>
     );
}

export default RenterPage;