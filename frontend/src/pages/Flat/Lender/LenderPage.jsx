import React from 'react';
import MyLenderListings from '../../../components/FlatComponents/LenderComponents/MyLenderListings';
import LenderHelpSection from '../../../components/FlatComponents/LenderComponents/Help';
import LenderDashboardPage from './LenderDashboardPage';


function LenderPage() {
    return ( 
        <>
        <MyLenderListings/>
        <LenderHelpSection/>
        </>
     );
}

export default LenderPage;