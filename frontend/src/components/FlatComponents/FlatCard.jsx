import React from 'react';
import lenderImage from '../../assets/lender.svg'; // Replace with your actual image path
import renterImage from '../../assets/Renter.svg'; // Replace with your actual image path
import brokerImage from '../../assets/broker.svg'; // Replace with your actual image path

export default function FlatCard() {
  return (
    <section className="bg-white flex flex-col items-center justify-center pt-12">
      <h1 className="text-3xl sm:text-4xl md:text-3xl font-bold leading-tight py-6 text-center">
        Experience the <span className="text-yellow-400">easy</span> way to rent and lend flats with Findoorz!
      </h1>
      <div className="max-w-7xl w-full grid gap-10 md:grid-cols-3"> {/* Increased gap between cards */}
        {/* Lender Card */}
        <div className="bg-sky-50 rounded-2xl shadow-lg p-6 text-amber-900 flex flex-col items-center w-full md:w-96"> {/* Increased width */}
          <div className="mb-4">
            {/* Image placeholder for Lender */}
            <img src={lenderImage} alt="Lender" className="mx-auto h-70 w-70 object-cover rounded-full" /> {/* Increased image height and added border radius */}
          </div>
          <button className="px-8 py-3 bg-amber-200 text-black font-semibold rounded-md hover:bg-amber-100 transition">
         Lender          </button>
        </div>

        {/* Renter Card */}
        <div className="bg-sky-50 rounded-2xl shadow-lg p-6 text-amber-900 flex flex-col items-center w-full md:w-96"> {/* Increased width */}
          <div className="mb-4">
            {/* Image placeholder for Renter */}
            <img src={renterImage} alt="Renter" className="mx-auto h-32 w-32 object-cover rounded-full" /> {/* Increased image height and added border radius */}
          </div>
          <h2 className="text-xl font-bold mb-2">Renter</h2>
          <p className="mb-4 text-center">
            Search flats with filters and book your ideal flat. Track bookings and communicate with brokers easily.
          </p>
          <button className="px-6 py-2 bg-lime-50 text-amber-900 font-semibold rounded-md hover:bg-lime-100 transition">
            Go to Renter Section
          </button>
        </div>

        {/* Broker Card */}
        <div className="bg-sky-50 rounded-2xl shadow-lg p-6 text-amber-900 flex flex-col items-center w-full md:w-96"> {/* Increased width */}
          <div className="mb-4">
            {/* Image placeholder for Broker */}
            <img src={brokerImage} alt="Broker" className="mx-auto h-32 w-32 object-cover rounded-full" /> {/* Increased image height and added border radius */}
          </div>
          <h2 className="text-xl font-bold mb-2">Broker</h2>
          <p className="mb-4 text-center">
            Manage assigned viewings and bookings. Coordinate between renters and lenders to close deals efficiently.
          </p>
          <button className="px-6 py-2 bg-lime-50 text-amber-900 font-semibold rounded-md hover:bg-lime-100 transition">
            Go to Broker Section
          </button>
        </div>
      </div>
    </section>
  );
}
