import React from 'react';

export default function FlatHowItWorks() {
  return (
    <section className="bg-yellow-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold text-amber-700 mb-6">
          How Findoorz Flat Section Works
        </h2>
        <p className="text-lg text-amber-900 max-w-3xl mx-auto mb-12">
          Seamlessly connect lenders, renters, and brokers in a simple 4-step process designed for ease and trust.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 max-w-5xl mx-auto">
          {/* Step 1 */}
          <div className="bg-amber-100 rounded-xl p-8 shadow-lg flex flex-col items-center transform transition-transform hover:scale-105">
            <div className="flex items-center justify-center h-16 w-16 mb-4 rounded-full bg-yellow-400 text-amber-900 font-bold text-xl">
              1
            </div>
            <h3 className="font-semibold text-amber-800 text-xl mb-2">List the Flat</h3>
            <p className="text-amber-700">
              Lenders add their flat listings with images and detailed amenities.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-amber-100 rounded-xl p-8 shadow-lg flex flex-col items-center transform transition-transform hover:scale-105">
            <div className="flex items-center justify-center h-16 w-16 mb-4 rounded-full bg-yellow-400 text-amber-900 font-bold text-xl">
              2
            </div>
            <h3 className="font-semibold text-amber-800 text-xl mb-2">Search & Book</h3>
            <p className="text-amber-700">
              Renters browse available flats, apply filters, and book their preferred flat.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-amber-100 rounded-xl p-8 shadow-lg flex flex-col items-center transform transition-transform hover:scale-105">
            <div className="flex items-center justify-center h-16 w-16 mb-4 rounded-full bg-yellow-400 text-amber-900 font-bold text-xl">
              3
            </div>
            <h3 className="font-semibold text-amber-800 text-xl mb-2">Broker Assigned</h3>
            <p className="text-amber-700">
              A trusted broker is assigned to coordinate viewings and facilitate communication.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-amber-100 rounded-xl p-8 shadow-lg flex flex-col items-center transform transition-transform hover:scale-105">
            <div className="flex items-center justify-center h-16 w-16 mb-4 rounded-full bg-yellow-400 text-amber-900 font-bold text-xl">
              4
            </div>
            <h3 className="font-semibold text-amber-800 text-xl mb-2">Secure Payment</h3>
            <p className="text-amber-700">
              Payments are processed securely and split transparently between lender, broker, and Findoorz.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

