import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import listingService from '../../../services/listingService';
import roomimage from '../../../assets/Room1.svg';
import ImageGallery from '../../ImageGallery';

const StudentListingDetail = ({ listing }) => {
    const { user, token } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Check if current user is the owner of this listing
    const isOwner = user && listing.owner === user._id;

    const handleEdit = () => {
        navigate(`/edit-pg-listing/${listing._id}`);
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
            try {
                setIsDeleting(true);
                await listingService.deleteListing('pg', listing._id, token);
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

    return (
        <div className="container mx-auto flex flex-col justify-center items-center py-4 my-4">
            <div className="w-3/4 text-center mb-4">
                <h3 className="text-3xl pb-2">
                    This is <span className="text-yellow-500">your</span> selected <span className="text-yellow-500">Room</span>!!
                </h3>
            </div>
            <div className="bg-white p-6 m-2 shadow-lg rounded-2xl w-full max-w-3xl">
                {/* Image Gallery */}
                <ImageGallery 
                    images={listing.propertyImages} 
                    defaultImage={roomimage}
                    alt="Room Images"
                />
                
                <div className="p-4">
                    <div className="bg-gray-50 border border-amber-100 rounded-lg p-8 mb-3">
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
                        <div className="flex justify-center gap-4 mb-4 pt-3">
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
                        <div className="flex justify-center pt-3">
                            <button type="button" className="bg-yellow-400 text-white font-semibold px-5 py-2 rounded-md hover:bg-yellow-500 transition duration-300">Book It !!</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentListingDetail;
