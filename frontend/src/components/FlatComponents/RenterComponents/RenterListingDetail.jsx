import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import listingService from '../../../services/listingService';
import bookingService from '../../../services/bookingService';
import cashfreeService from '../../../services/cashfreeService';

import ImageGallery from '../../ImageGallery';

const RenterListingDetail = ({ listing }) => {
    const { user, token } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isBooking, setIsBooking] = useState(false);
    const [hasBooked, setHasBooked] = useState(false);

    // Check if current user is the owner of this listing
    const isOwner = user && listing.owner === user._id;

    const handleEdit = () => {
        navigate(`/edit-flat-listing/${listing._id}`);
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
            try {
                setIsDeleting(true);
                await listingService.deleteListing(listing._id);
                alert('Listing deleted successfully');
                navigate('/lender'); // Redirect to lender page after deletion
            } catch (error) {
                console.error('Error deleting listing:', error);
                alert('Failed to delete listing. Please try again.');
            } finally {
                setIsDeleting(false);
            }
        }
    };

    const handleBookNow = async () => {
        if (!user || !token) {
            alert('Please login to book this flat');
            navigate('/LoginPage');
            return;
        }

        try {
            setIsBooking(true);

            console.log('Token being sent:', token); // Debug log
            console.log('User data:', user); // Debug log
            console.log('User object structure:', {
                id: user.id,
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone
            });
            // More detailed logging for debugging
            console.log('User ID type:', typeof user._id);
            console.log('User ID value:', user._id);
            console.log('User ID (id property) type:', typeof user.id);
            console.log('User ID (id property) value:', user.id);

            // Create booking first
            const bookingData = {
                listingType: 'FlatListing',
                listingId: listing._id,
                bookingStartDate: new Date().toISOString(),
                bookingEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
            };

            console.log('Booking data being sent:', bookingData); // Debug log

            const booking = await bookingService.createBooking(bookingData, token);

            // Process payment with Cashfree - Only 2% booking fee
            const bookingFee = Math.round(listing.rentAmount * 0.02); // 2% of rent amount
            const amount = bookingFee; // Amount in rupees
            const description = `Booking fee (2%) for ${listing.landlordName} - ${listing.houseNumber}`;

            // Check if user has a phone number before proceeding with payment
            if (!user.phone) {
                setIsBooking(false);
                const goToProfile = window.confirm('A phone number is required for payment processing. Would you like to update your profile now?');
                if (goToProfile) {
                    navigate('/profile/edit');
                }
                return;
            }

            await cashfreeService.processPayment(
                booking._id,
                amount,
                description,
                {
                    id: user.id || user._id,
                    name: user.name || '',
                    email: user.email || '',
                    phone: user.phone
                },
                token,
                () => {
                    setHasBooked(true);
                    alert(`Booking successful! Booking fee of ₹${bookingFee} has been charged.`);
                },
                (error) => {
                    alert(error.message || 'Payment failed. Please try again.');
                }
            );

            

        } catch (error) {
            console.error('Booking error:', error);
            const errorMessage = error.response?.data?.message || 'Failed to process booking. Please try again.';
            alert(errorMessage);
        } finally {
            setIsBooking(false);
        }
    };

    // Ensure propertyImages is always an array
    const propertyImages = Array.isArray(listing.propertyImages) ? listing.propertyImages : [];

    // Check if user has already booked this listing
    useEffect(() => {
        const checkBookingStatus = async () => {
            if (user && token && !isOwner) {
                try {
                    const bookings = await bookingService.getUserBookings(token);
                    const hasBookedThisListing = bookings.some(booking => 
                        booking.listingId === listing._id && 
                        booking.listingType === 'FlatListing' && 
                        booking.status !== 'cancelled'
                    );
                    setHasBooked(hasBookedThisListing);
                } catch (error) {
                    console.error('Error checking booking status:', error);
                }
            }
        };
        
        checkBookingStatus();
    }, [user, token, listing._id, isOwner]);

    return (
        <div className="container mx-auto flex flex-col justify-center items-center py-4 my-4 px-4">
            <div className="w-full md:w-3/4 text-center mb-4">
                <h3 className="text-2xl md:text-3xl pb-2">
                    This is <span className="text-yellow-500">your</span> selected <span className="text-yellow-500">Flat</span>!!
                </h3>
            </div>
            <div className="bg-white p-4 md:p-6 m-2 shadow-lg rounded-2xl w-full max-w-3xl">
                {/* Image Gallery */}
                <ImageGallery 
                    images={propertyImages} 
                    alt="Flat Images"
                />
                
                <div className="p-2 md:p-4">
                    <div className="bg-gray-50 border border-amber-100 rounded-lg p-4 md:p-8 mb-3">
                        <p className='mb-2' ><strong>Landlord Name:</strong> {listing.landlordName}</p>
                        <p className='mb-2'><strong>House Number:</strong> {listing.houseNumber}</p>
                        <p className='mb-2'><strong>Colony:</strong> {listing.colony}</p>
                        <p className='mb-2'><strong>City:</strong> {listing.city}</p>
                        <p className='mb-2'><strong>Rooms:</strong> {listing.numberOfRooms}</p>
                        <p className='mb-3'><strong>Furnishing:</strong> {listing.furnishingStatus}</p>
                        <div className="flex flex-wrap mb-3">
                            {listing.wifi && <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full mr-2">Wi-Fi</span>}
                            {listing.airConditioning && <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full mr-2">Air Conditioning</span>}
                        </div>
                        <p className='mb-2'><strong>Rent:</strong> &#8377;{listing.rentAmount}/month</p>
                        <p className='mb-2'><strong>Restrictions:</strong> {listing.independent ? "Independent" : "Some Restrictions"}</p>
                        <p className='mb-2'><strong>Description:</strong> {listing.description}</p>
                    </div>

                    {/* Owner Actions - Only show if user is the owner */}
                    {isOwner && (
                        <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 mb-4 pt-3">
                            <button 
                                type="button" 
                                className="bg-blue-400 text-white font-semibold px-5 py-2 rounded-md hover:bg-blue-600 transition duration-300"
                                onClick={handleEdit}
                                disabled={isEditing}
                            >
                                {isEditing ? 'Editing...' : 'Edit Listing'}
                            </button>
                            <button 
                                type="button" 
                                className="bg-red-400 text-white font-semibold px-5 py-2 rounded-md hover:bg-red-600 transition duration-300"
                                onClick={handleDelete}
                                disabled={isDeleting}
                            >
                                {isDeleting ? 'Deleting...' : 'Delete Listing'}
                            </button>
                        </div>
                    )}

                    {/* Book Button - Show for non-owners or when not editing */}
                    {!isOwner && (
                        <div className="flex flex-col items-center pt-3">
                            <button 
                                type="button" 
                                className={`font-semibold px-5 py-2 rounded-md transition duration-300 ${
                                    hasBooked 
                                        ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                                        : isBooking 
                                            ? 'bg-gray-400 text-white cursor-not-allowed'
                                            : 'bg-yellow-400 text-white hover:bg-yellow-500'
                                }`}
                                onClick={handleBookNow}
                                disabled={isBooking || hasBooked}
                            >
                                {hasBooked ? 'Booked ✓' : isBooking ? 'Processing...' : 'Book It !!'}
                            </button>
                            {!hasBooked && (
                                <p className="text-sm text-gray-600 mt-2">
                                    Booking Fee: ₹{Math.round(listing.rentAmount * 0.02)} (2% of rent)
                                </p>
                            )}
                            {hasBooked && (
                                <p className="text-sm text-green-600 mt-2">
                                    ✓ Successfully booked
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RenterListingDetail;
