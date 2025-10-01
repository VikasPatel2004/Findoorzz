import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import listingService from '../../../services/listingService';
import bookingService from '../../../services/bookingService';
import razorpayService from '../../../services/razorpayService';

import ImageGallery from '../../ImageGallery';

const StudentListingDetail = ({ listing }) => {
    const { user, token } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isBooking, setIsBooking] = useState(false);
    const [hasBooked, setHasBooked] = useState(false);

    // Check if current user is the owner of this listing
    const isOwner = user && (String(listing.owner) === String(user._id) || String(listing.owner) === String(user.id));
    // Check if user is admin
    const isAdmin = user && user.isAdmin;

    const handleEdit = () => {
        navigate(`/edit-pg-listing/${listing._id}`);
    };
    const [isActivating, setIsActivating] = useState(false);

    // Handler to activate listing (admin only)
    const handleActivateListing = async () => {
        if (!user || !token || !isAdmin) return;
        try {
            setIsActivating(true);
            await listingService.activateListing(listing._id, token);
            alert('Listing activated and now available to students.');
            window.location.reload();
        } catch (error) {
            console.error('Error activating listing:', error);
            alert('Failed to activate listing. Please try again.');
        } finally {
            setIsActivating(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
            try {
                setIsDeleting(true);
                await listingService.deleteListing(listing._id);
                alert('Listing deleted successfully');
                navigate('/landlord'); // Redirect to landlord page after deletion
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
            alert('Please login to book this room');
            navigate('/LoginPage');
            return;
        }

        let timeoutId;
        try {
            setIsBooking(true);
            timeoutId = setTimeout(() => {
                setIsBooking(false);
                alert('Booking process took too long. Please try again.');
            }, 60000); // fallback after 60s

            console.log('Starting booking process...');
            // Create booking first
            const bookingData = {
                listingType: 'PGListing',
                listingId: listing._id,
                bookingStartDate: new Date().toISOString(),
                bookingEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
            };

            // Log all booking data fields
            console.log('Booking data being sent:', JSON.stringify(bookingData, null, 2));
            console.log('User token:', token);
            const booking = await bookingService.createBooking(bookingData, token);
            console.log('Booking created:', booking);

            // Process payment with Razorpay - Only 2% booking fee
            let bookingFee = Math.round((listing.rentAmount || 0) * 0.02); // 2% of rent amount
            if (!bookingFee || bookingFee <= 0) {
                bookingFee = 10; // fallback to ₹10 if rentAmount is missing or zero
            }
            const amount = bookingFee * 100; // Amount in paise
            const description = `Booking fee (2%) for ${listing.landlordName} - ${listing.houseNumber}`;

            // Log all payment data fields
            console.log('Processing payment...');
            console.log('Payment data:', {
                bookingId: booking._id,
                amount,
                description,
                userDetails: {
                    id: user.id || user._id,
                    name: user.name || '',
                    email: user.email || '',
                    phone: user.phone
                },
                token
            });

            // Check if user has a phone number before proceeding with payment
            if (!user.phone) {
                clearTimeout(timeoutId);
                setIsBooking(false);
                const goToProfile = window.confirm('A phone number is required for payment processing. Would you like to update your profile now?');
                if (goToProfile) {
                    navigate('/profile/edit');
                }
                return;
            }

            await razorpayService.processPayment(
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
                () => { // onPaymentSuccess
                    clearTimeout(timeoutId);
                    setIsBooking(false);
                    setHasBooked(true);
                    alert(`Booking successful! Booking fee of ₹${bookingFee} has been charged.`);
                    // Redirect to the booked listing's detail page with all details shown
                    navigate(`/RoomDetail/${listing._id}`);
                },
                (error) => { // onPaymentFailure
                    clearTimeout(timeoutId);
                    setIsBooking(false);
                    alert(error.message || 'Payment failed. Please try again.');
                }
            );

        } catch (error) {
            console.error('Booking error:', error);
            const errorMessage = error.response?.data?.message || 'Failed to process booking. Please try again.';
            alert(errorMessage);
        } finally {
            clearTimeout(timeoutId);
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
                    const hasBookedThisListing = bookings.some(booking => {
                        const bookingListingId = booking.listingId && booking.listingId._id ? booking.listingId._id : booking.listingId;
                        return (
                            bookingListingId === listing._id &&
                            booking.listingType === 'PGListing' &&
                            booking.status !== 'cancelled' &&
                            booking.paymentStatus === 'completed'
                        );
                    });
                    setHasBooked(hasBookedThisListing);
                } catch (error) {
                    console.error('Error checking booking status:', error);
                }
            }
        };
        checkBookingStatus();
    }, [user, token, listing._id, isOwner]);

    useEffect(() => {
            // Removed reload to prevent infinite loop after payment
            // const params = new URLSearchParams(location.search);
            // if (params.get('justBooked') === 'true') {
            //   window.location.reload();
            // }
    }, [location.search]);

    return (
        <div className="container mx-auto flex flex-col justify-center items-center py-4 my-4 px-4">
            <div className="w-full md:w-3/4 text-center mb-4">
                <h3 className="text-2xl md:text-3xl pb-2">
                    This is <span className="text-yellow-500">your</span> selected <span className="text-yellow-500">Room</span>!!
                </h3>
            </div>
            <div className="bg-white p-4 md:p-6 m-2 shadow-lg rounded-2xl w-full max-w-3xl">
                {/* Image Gallery */}
                <ImageGallery 
                    images={propertyImages} 
                    alt="Room Images"
                />
                
                <div className="p-2 md:p-4">
                    <div className="bg-gray-50 border border-amber-100 rounded-lg p-4 md:p-8 mb-3">
                        {hasBooked && (
                          <div className="text-green-600 font-semibold mb-2">
                            Contact details unlocked!
                          </div>
                        )}
                        <p className='mb-2' ><strong>Landlord Name:</strong> {listing.landlordName}</p>
                        <p className='mb-2'><strong>House Number:</strong> {(hasBooked || isOwner) ? (listing.houseNumber) : (<span className="text-gray-400 italic"> Book to view </span>)}</p>
                        <p className='mb-2'><strong>Contact Number:</strong> {(hasBooked || isOwner) ? (listing.contactNumber) : (<span className="text-gray-400 italic"> Book to view </span>)}</p>
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
                                className="bg-blue-500 text-white font-semibold px-5 py-2 rounded-md hover:bg-blue-600 transition duration-300"
                                onClick={handleEdit}
                                disabled={isEditing}
                            >
                                {isEditing ? 'Editing...' : 'Edit Listing'}
                            </button>
                            <button 
                                type="button" 
                                className="bg-red-500 text-white font-semibold px-5 py-2 rounded-md hover:bg-red-600 transition duration-300"
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
                            {/* Admin Activate Button - Only show if admin and listing is booked (not available) */}
                            {(isAdmin && hasBooked) ? (
                                <button
                                    type="button"
                                    className="bg-green-500 text-white font-semibold px-5 py-2 rounded-md hover:bg-green-600 transition duration-300 mt-3"
                                    onClick={handleActivateListing}
                                    disabled={isActivating}
                                >
                                    {isActivating ? 'Activating...' : 'Activate Listing'}
                                </button>
                            ) : null}
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

export default StudentListingDetail;
