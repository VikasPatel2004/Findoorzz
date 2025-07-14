import React from 'react';
import { FaPhoneAlt, FaEnvelope, FaQuestionCircle } from 'react-icons/fa'; // Importing icons
import RenterHelpImage from '../../../assets/RenterHelp.jpg'; // Import the image

export default function RenterHelpSection() {
  return (
    <section className="px-4 sm:px-4 md:px-20 max-w-7xl mx-auto rounded-2xl my-4 text-center py-10 bg-white">
      <div className="w-full flex flex-col items-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-700 mb-8 text-center w-full">
          Help & Support
        </h2>
        <div className="w-full flex flex-col md:flex-row items-stretch gap-6">
          {/* Image */}
          <div className="flex justify-center items-center w-full md:w-1/2">
            <div className="w-full max-w-sm sm:max-w-sm md:max-w-md aspect-[16/9] min-h-[300px] md:min-h-[400px]">
              <img
                src={RenterHelpImage}
                alt="Renter Help"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          </div>
          {/* Text content */}
          <div className="w-full md:w-1/2 p-4 sm:p-8 flex flex-col justify-center items-center">
            <p className="text-gray-700 mb-4 text-base sm:text-lg leading-relaxed text-left w-full">
              At Findoorz, we strive to make your search for the perfect room easy and stress-free. Here’s how we can assist you:
            </p>
            <ul className="list-disc list-inside text-left text-gray-700 mb-6 space-y-2 w-full">
              <li>
                <FaQuestionCircle className="inline-block text-blue-500 mr-2" />
                <strong>Room Listings:</strong> Browse and filter through a variety of available rooms and PGs.
              </li>
              <li>
                <FaQuestionCircle className="inline-block text-blue-500 mr-2" />
                <strong>Support Team:</strong> Get help with inquiries and booking processes.
              </li>
              <li>
                <FaQuestionCircle className="inline-block text-blue-500 mr-2" />
                <strong>Connect with Landlords:</strong> Easily reach out to landlords for more information.
              </li>
            </ul>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mt-2 w-full justify-center">
              <button className="flex items-center justify-center px-5 py-2 bg-blue-400 text-white rounded-md hover:bg-blue-600 transition duration-300 w-full sm:w-auto">
                <FaPhoneAlt className="mr-2" /> Call Support
              </button>
              <button className="flex items-center justify-center px-5 py-2 bg-green-400 text-white rounded-md hover:bg-green-600 transition duration-300 w-full sm:w-auto mt-2 sm:mt-0">
                <FaEnvelope className="mr-2" /> Email Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
