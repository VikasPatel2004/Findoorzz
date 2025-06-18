import React from 'react';

const StudentListingDetail = ({ listing }) => {
    // const isOwner = currUser  && currUser ._id === listing.owner._id;

    // const handleDelete = (e) => {
    //     e.preventDefault();
    //     // Add your delete logic here, e.g., making an API call to delete the listing
    // };

    return (
        <div className="container mx-auto flex flex-col justify-center items-center py-4 my-4">
            <div className="w-3/4 text-start mb-4">
                <h3 className="text-2xl">
                    This is <span className="text-yellow-500">your</span> selected <span className="text-yellow-500">Flat</span>!!
                </h3>
            </div>
            <div className="bg-white p-4 m-2 shadow-lg rounded-2xl w-full max-w-2xl">
                <img src='media/images/cartoon.jpg' className="rounded-t-2xl w-full h-64 object-cover" alt="listing_image" />
                
                <div className="p-4">
                    <h6 className="font-bold text-lg mb-2">Landlord Information</h6>
                    <div className="p-3 mb-3 border border-gray-300 rounded-lg bg-gray-100">
                        <p><strong>Name:</strong> {listing.landlordName}</p>
                        <p><strong>Contact Number:</strong> {listing.contactNumber}</p>
                    </div>

                    <h6 className="font-bold text-lg mb-2">Address Details</h6>
                    <div className="p-3 mb-3 border border-gray-300 rounded-lg bg-gray-100">
                        <p><strong>House Number:</strong> {listing.houseNumber}</p>
                        <p><strong>Colony:</strong> {listing.colony}</p>
                        <p><strong>City:</strong> {listing.city}</p>
                    </div>

                    <h6 className="font-bold text-lg mb-2">Property Details</h6>
                    <div className="p-3 mb-3 border border-gray-300 rounded-lg bg-gray-100">
                        <p><strong>Number of Rooms:</strong> {listing.numberOfRooms}</p>
                        <p><strong>Furnishing Status:</strong> {listing.furnishingStatus}</p>
                    </div>

                    <h6 className="font-bold text-lg mb-2">Amenities</h6>
                    <div className="p-3 mb-3 border border-gray-300 rounded-lg bg-gray-100">
                        <ul>
                            {listing.wifi && <li>Wi-Fi</li>}
                            {listing.airConditioning && <li>Air Conditioning</li>}
                        </ul>
                    </div>

                    <h6 className="font-bold text-lg mb-2">Rent</h6>
                    <div className="p-3 mb-3 border border-gray-300 rounded-lg bg-gray-100">
                        <p>&#8377;{listing.rentAmount}/night</p>
                    </div>

                    <h6 className="font-bold text-lg mb-2">Restrictions</h6>
                    <div className="p-3 mb-3 border border-gray-300 rounded-lg bg-gray-100">
                        <p>{listing.independent ? "Independent" : "Some Restrictions"}</p>
                    </div>

                    <h6 className="font-bold text-lg mb-2">Description</h6>
                    <div className="p-3 mb-3 border border-gray-300 rounded-lg bg-gray-100">
                        <p>{listing.description}</p>
                    </div>

                    <h6 className="font-bold text-lg mb-2">Images</h6>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                        {listing.propertyImages && Array.from(listing.propertyImages).map((image, index) => (
                            <img key={index} src={URL.createObjectURL(image)} alt={`Room Image ${index + 1}`} className="w-full h-32 object-cover rounded-md" />
                        ))}
                    </div>

                    <div className="flex justify-center pt-3">
                        <button type="button" className="bg-yellow-500 text-white font-semibold px-5 py-2 rounded-md hover:bg-yellow-600 transition duration-300">Submit</button>
                    </div>

                    {/* {isOwner && ( */}
                    {/* <div className="flex justify-between mt-4">
                        <a href={`/listings/${listing._id}/edit`} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300">Edit</a>
                        <form method="POST" action={`/listings/${listing._id}?_method=DELETE`} style={{ display: 'inline' }} onSubmit={handleDelete}>
                            <button type="submit" className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300">Delete</button>
                        </form>
                    </div> */}
                    {/* )} */}
                </div>
            </div>
        </div>
    );
};

export default StudentListingDetail;
