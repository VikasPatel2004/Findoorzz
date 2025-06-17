import React from 'react';
import StudentListings from '../../../components/PGComponents/StudentComponent/StudentListings';
import SearchFilter from '../../../components/PGComponents/StudentComponent/SearchFilter';
import StudentHelpSection from '../../../components/PGComponents/StudentComponent/Help';


function StudentPage() {
    return ( 
        <>
        <SearchFilter/>
        <StudentListings/>
        <StudentHelpSection/>
        </>
     );
}

export default StudentPage;