import React from 'react';
import RenterListingDetail from '../../../components/FlatComponents/RenterComponents/RenterListingDetail';

function RenterListingDetailPage() {
    const listingData = {
        landlordName: 'John Doe',
        contactNumber: '123-456-7890',
        houseNumber: 'C/253',
        colony: 'Chhatra Chhaya Colony',
        city: 'Pithampur',
        numberOfRooms: '3',
        furnishingStatus: 'Furnished',
        wifi: true,
        airConditioning: true,
        rentAmount: '2000',
        independent: true,
        // propertyImages: [], // Add image files here
        description: 'A beautiful flat located in a quiet neighborhood with all amenities.',
    };

    return (
        <>
          <RenterListingDetail listing={listingData} />
        </>
    );
}

export default RenterListingDetailPage;
