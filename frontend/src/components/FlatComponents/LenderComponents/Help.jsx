import React from 'react';
import { FaPhoneAlt, FaEnvelope, FaQuestionCircle } from 'react-icons/fa'; // Importing icons
import HelpVideo from "../../../assets/HelpSupport.mp4"; // Import the video

export default function LenderHelpSection() {
  return (
    <section className="bg-white px-4 md:px-20 max-w-8xl mx-auto rounded-lg mt-8 text-center  py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
        {/* Left: Video */}
        <div className="p-2 rounded-lg bg-white">
          <video
            className="w-120 h-80 object-cover"
            autoPlay
            loop
            muted
          >
            <source src={HelpVideo} type="video/mp4" />
          </video>
        </div>

        {/* Right: Text content */}
        <div className="p-4 py-12 rounded-lg bg-amber-50 shadow-md"> {/* Added shadow for depth */}
          <h2 className="text-2xl font-extrabold text-gray-900 mb-4">
            Help & Support
          </h2>
          <p className="text-gray-700 mb-3 text-lg leading-relaxed">
            At Findoorz, we make it simple and hassle-free for landlords to list their PG rooms and flats. Here’s how we can assist you:
          </p>
          <ul className="list-disc list-inside text-left text-gray-700 mb-4">
            <li className="mb-2">
              <FaQuestionCircle className="inline-block text-blue-500 mr-2" />
              <strong>Easy Listing:</strong> Upload images and update facilities effortlessly.
            </li>
            <li className="mb-2">
              <FaQuestionCircle className="inline-block text-blue-500 mr-2" />
              <strong>Support Team:</strong> Get assistance with pricing and connecting with tenants.
            </li>
            <li className="mb-2">
              <FaQuestionCircle className="inline-block text-blue-500 mr-2" />
              <strong>Reach Your Audience:</strong> Your listings will be seen by the right people.
            </li>
          </ul>
          <div className="flex space-x-4 mt-4 justify-center">
            <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300">
              <FaPhoneAlt className="mr-2" /> Call Support
            </button>
            <button className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300">
              <FaEnvelope className="mr-2" /> Email Us
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
