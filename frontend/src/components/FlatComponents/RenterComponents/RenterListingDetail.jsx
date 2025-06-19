import React from 'react';
import roomimage from '../../../assets/Room1.svg'; // Ensure this path is correct for your project structure   

const RenterListingDetail = ({ listing }) => {
    return (
        <div className="container mx-auto flex flex-col justify-center items-center py-4 my-4">
            <div className="w-3/4 text-center mb-4">
                <h3 className="text-3xl pb-2">
                    This is <span className="text-yellow-500">your</span> selected <span className="text-yellow-500">Flat</span>!!
                </h3>
            </div>
            <div className="bg-white p-6 m-2 shadow-lg rounded-2xl w-full max-w-3xl">
                <img src={roomimage} className="rounded-t-2xl w-full h-64 object-cover" alt="listing_image" />
                
                <div className="p-4">
                    <div className="bg-gray-50 border border-amber-100 rounded-lg p-8 mb-3">
                        <p className='mb-2' ><strong>Landlord Name:</strong> {listing.landlordName}</p>
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

                    {/* Images Box
                    <h6 className="text-lg mb-2 font-semibold">Images</h6>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                        {listing.propertyImages && Array.from(listing.propertyImages).map((image, index) => (
                            <img key={index} src={URL.createObjectURL(image)} alt={`Room Image ${index + 1}`} className="w-full h-32 object-cover rounded-md" />
                        ))}
                    </div> */}

                    <div className="flex justify-center pt-3">
                        <button type="button" className="bg-yellow-400 text-white font-semibold px-5 py-2 rounded-md hover:bg-yellow-500 transition duration-300">Book It !!</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RenterListingDetail;
