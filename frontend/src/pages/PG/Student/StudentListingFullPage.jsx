import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import StudentListingDetail from '../../../components/PGComponents/StudentComponent/StudentListingDetails';
import ReviewsSection from '../../../components/PGComponents/ReviewAndRating';
import listingService from '../../../services/listingService';

function StudentListingDetailPage() {
    const { id } = useParams();
    const [listingData, setListingData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchListing() {
            try {
                setLoading(true);
                console.log('Fetching PG listing with ID:', id);
                const data = await listingService.getListingById(id);
                console.log('PG listing data received:', data);
                setListingData(data);
            } catch (err) {
                console.error('Error fetching PG listing:', err);
                setError('Failed to fetch listing data: ' + (err.response?.data?.message || err.message));
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
        return <div className="text-center py-10">No listing data found.</div>;
    }

    return (
        <>
            <StudentListingDetail listing={listingData} />
            {/* Add the ReviewsSection at the bottom */}
            <ReviewsSection listingId={id} />
        </>
    );
}

export default StudentListingDetailPage;
