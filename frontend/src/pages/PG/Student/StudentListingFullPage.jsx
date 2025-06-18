import React from 'react';
import StudentListingDetail from '../../../components/PGComponents/StudentComponent/StudentListingDetails';

function StudentListingDetailPage() {
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
          <StudentListingDetail listing={listingData} />
        </>
    );
}

export default StudentListingDetailPage;
