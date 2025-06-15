import React from 'react';

export default function PgHowItWorks() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
        How PG Renting Works
      </h2>
      <div className="grid gap-10 md:grid-cols-3">
        {/* Step 1 */}
        <div className="bg-gray-50 p-8 rounded-lg shadow hover:shadow-lg transition-shadow text-center">
          <div className="mb-6 flex justify-center">
            {/* Icon */}
            <svg
              className="h-16 w-16 text-indigo-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 10h18M3 14h18M10 18h4"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-4">Landlord Lists PG</h3>
          <p className="text-gray-700">
            Landlords register and upload images and details of their PG rooms with facilities.
          </p>
        </div>

        {/* Step 2 */}
        <div className="bg-gray-50 p-8 rounded-lg shadow hover:shadow-lg transition-shadow text-center">
          <div className="mb-6 flex justify-center">
            {/* Icon */}
            <svg
              className="h-16 w-16 text-green-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle cx="12" cy="7" r="4" strokeLinejoin="round" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.121 17.804A4.005 4.005 0 0112 15a4.005 4.005 0 016.879 2.804"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-4">Student Searches PG</h3>
          <p className="text-gray-700">
            Students browse listings based on location, price, and facilities for free.
          </p>
        </div>

        {/* Step 3 */}
        <div className="bg-gray-50 p-8 rounded-lg shadow hover:shadow-lg transition-shadow text-center">
          <div className="mb-6 flex justify-center">
            {/* Icon */}
            <svg
              className="h-16 w-16 text-purple-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 17l6-6M15 17l-6-6"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-4">Connect &amp; Book</h3>
          <p className="text-gray-700">
            Students contact landlords directly to finalize bookings, initially without charges.
          </p>
        </div>
      </div>
    </section>
  );
}
