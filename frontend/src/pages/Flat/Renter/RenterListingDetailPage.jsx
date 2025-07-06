import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import listingService from '../../../services/listingService';
import RenterListingDetail from '../../../components/FlatComponents/RenterComponents/RenterListingDetail';
import FlatReviewsSection from '../../../components/FlatComponents/FlatReviewsAndRatings';

function RenterListingDetailPage() {
    const { id } = useParams();
    const [listingData, setListingData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchListing() {
            try {
                setLoading(true);
                const data = await listingService.getListingById(id);
                setListingData(data);
            } catch (err) {
                setError('Failed to fetch listing');
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        if (id) {
            fetchListing();
        }
    }, [id]);

    if (loading) {
        return <div className="text-center py-10">Loading listing details...</div>;
    }

    if (error) {
        return <div className="text-center py-10 text-red-500">{error}</div>;
    }

    if (!listingData) {
        return <div className="text-center py-10">Listing not found.</div>;
    }

    return (
        <>
            <RenterListingDetail listing={listingData} />
            <FlatReviewsSection listingId={id} />
        </>
    );
}

export default RenterListingDetailPage;