import React from 'react';

export default function PGcard() {
  return (
    <section className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-12 text-center">
        PG Section - Findoorz
      </h1>
      <div className="max-w-5xl w-full grid gap-8 md:grid-cols-2">
        {/* Landlord Card */}
        <div className="bg-gradient-to-r from-purple-700 to-indigo-600 rounded-lg shadow-lg p-10 text-white flex flex-col items-center">
          <div className="mb-6">
            {/* Icon placeholder */}
            <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18M10 18h4"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4">Landlord</h2>
          <p className="mb-6 text-center">
            Upload your PG room images and facilities. Manage your listings and connect with students easily.
          </p>
          <button className="px-6 py-3 bg-white text-indigo-700 font-semibold rounded-md hover:bg-indigo-100 transition">
            Go to Landlord Section
          </button>
        </div>

        {/* Student Card */}
        <div className="bg-gradient-to-r from-green-500 to-teal-400 rounded-lg shadow-lg p-10 text-white flex flex-col items-center">
          <div className="mb-6">
            {/* Icon placeholder */}
            <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="7" r="4" strokeLinejoin="round" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A4.005 4.005 0 0112 15a4.005 4.005 0 016.879 2.804"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4">Student</h2>
          <p className="mb-6 text-center">
            Search PG rooms by location, price and facilities. Connect directly with landlords.
          </p>
          <button className="px-6 py-3 bg-white text-teal-700 font-semibold rounded-md hover:bg-teal-100 transition">
            Go to Student Section
          </button>
        </div>
      </div>
    </section>
  );
}

