import React from 'react';
import roomimage from '../../../assets/Room1.svg'; // Ensure this path is correct for your project structure   

const StudentListingDetail = ({ listing }) => {
    return (
        <div className="container mx-auto flex flex-col justify-center items-center py-4 my-4">
            <div className="w-3/4 text-center mb-4">
                <h3 className="text-3xl pb-5">
                    This is <span className="text-yellow-500">your</span> selected <span className="text-yellow-500">Flat</span>!!
                </h3>
            </div>
            <div className="bg-white p-6 m-2 shadow-lg rounded-2xl w-full max-w-3xl">
                <img src={roomimage} className="rounded-t-2xl w-full h-64 object-cover" alt="listing_image" />
                
                <div className="p-4">
                    <h6 className="text-lg mb-2 text-cente font-semibold">Landlord Information</h6>
                    <div className="flex justify-around  p-3 mb-3 border border-amber-100 rounded-lg bg-gray-50">
                        <p><strong>Name:</strong> {listing.landlordName}</p>
                        <p><strong>Contact:</strong> {listing.contactNumber}</p>
                    </div>

                    <h6 className="text-lg mb-2 font-semibold">Address Details</h6>
                    <div className="flex justify-between p-3 mb-3 border border-amber-100 rounded-lg bg-gray-50">
                        {/* <p><strong>House Number:</strong> {listing.houseNumber}</p> */}
                        <p><strong>Colony:</strong> {listing.colony}</p>
                        <p><strong>City:</strong> {listing.city}</p>
                    </div>

                    <h6 className="text-lg mb-2 font-semibold">Property Details</h6>
                    <div className="flex justify-between p-3 mb-3 border border-amber-100 rounded-lg bg-gray-50">
                        <p><strong>Rooms:</strong> {listing.numberOfRooms}</p>
                        <p><strong>Furnishing:</strong> {listing.furnishingStatus}</p>
                    </div>

                    <h6 className="text-lg mb-2 font-semibold">Amenities</h6>
                    <div className="flex flex-wrap p-3 mb-3 border border-amber-100 rounded-lg bg-gray-50">
                        {listing.wifi && <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full mr-2">Wi-Fi</span>}
                        {listing.airConditioning && <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full mr-2">Air Conditioning</span>}
                    </div>

                    <h6 className="text-lg mb-2 font-semibold">Rent</h6>
                    <div className="flex justify-between p-3 mb-3 border border-amber-100 rounded-lg bg-gray-50">
                        <p><strong>Price:</strong> &#8377;{listing.rentAmount}/night</p>
                    </div>

                    <h6 className="text-lg mb-2 font-semibold">Restrictions</h6>
                    <div className="flex justify-between p-3 mb-3 border border-amber-100 rounded-lg bg-gray-50">
                        <p>{listing.independent ? "Independent" : "Some Restrictions"}</p>
                    </div>

                    <h6 className="text-lg mb-2 font-semibold">Description</h6>
                    <div className="p-3 mb-3 border border-amber-100 rounded-lg bg-gray-50">
                        <p>{listing.description}</p>
                    </div>

                    <h6 className="text-lg mb-2 font-semibold">Images</h6>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                        {listing.propertyImages && Array.from(listing.propertyImages).map((image, index) => (
                            <img key={index} src={URL.createObjectURL(image)} alt={`Room Image ${index + 1}`} className="w-full h-32 object-cover rounded-md" />
                        ))}
                    </div>

                    <div className="flex justify-center pt-3">
                        <button type="button" className="bg-yellow-400 text-white font-semibold px-5 py-2 rounded-md hover:bg-yellow-500 transition duration-300">Book It !!</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentListingDetail;
