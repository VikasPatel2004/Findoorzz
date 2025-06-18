import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import lenderImage from "../../assets/lender.svg"; // Replace with your actual image path
import renterImage from "../../assets/Renter.svg"; // Replace with your actual image path
import brokerImage from "../../assets/broker.svg"; // Replace with your actual image path

export default function FlatCard() {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Stop observing once visible
        }
      },
      { threshold: 0.1 } // Trigger when 10% of the section is visible
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  // Handle click for lender button
  const handleLenderClick = () => {
    navigate('/lender'); // Replace with the actual path to the lender page
  };

  // Handle click for renter button
  const handleRenterClick = () => {
    navigate('/renter'); // Replace with the actual path to the renter page
  };

  // Handle click for broker button
  const handleBrokerClick = () => {
    navigate('/broker'); // Replace with the actual path to the broker page
  };

  return (
    <section className="bg-white flex flex-col items-center justify-center pt-12">
      <h1 className="text-3xl sm:text-4xl md:text-3xl font-bold leading-tight pb-12 text-center">
        " Experience The <span className="text-yellow-400">Easy</span> Way To <span className="text-yellow-400">Rent </span>
        And <span className="text-yellow-400">Lend</span> Flats With Findoorz! "
      </h1>
      <div
        ref={cardRef}
        className="max-w-7xl w-full grid gap-10 md:grid-cols-3"
      >
        {/* Lender Card */}
        <div
          className={`bg-sky-50 rounded-2xl shadow-lg p-6 text-amber-900 flex flex-col items-center w-full md:w-96 transition-transform duration-1000 ${isVisible ? 'transform translate-x-0 opacity-100' : 'transform -translate-x-full opacity-0'}`}
        >
          <div className="mb-1">
            <img
              src={lenderImage}
              alt="Lender"
              className="mx-auto h-70 w-70 object-cover rounded-full"
            />
          </div>
          <h3 className="text-stone-500 font-extrabold mb-4 text-3xl">Lender</h3>
          <button 
            className="px-8 py-3 bg-amber-200 text-black font-semibold rounded-md hover:bg-amber-100 transition" 
            onClick={handleLenderClick} // Add onClick handler
          >
            Explore
          </button>
        </div>

        {/* Renter Card */}
        <div
          className={`bg-sky-50 rounded-2xl shadow-lg p-6 text-amber-900 flex flex-col items-center w-full md:w-96 transition-transform duration-1000 ${isVisible ? 'transform translate-y-0 opacity-100' : 'transform translate-y-10 opacity-0'}`}
        >
          <div className="mb-1">
            <img
              src={renterImage}
              alt="Renter"
              className="mx-auto h-70 w-70 object-cover rounded-full"
            />
          </div>
          <h3 className="text-stone-500 font-extrabold mb-4 text-3xl">Renter</h3>
          <button 
            className="px-8 py-3 bg-amber-200 text-black font-semibold rounded-md hover:bg-lime-100 transition" 
            onClick={handleRenterClick} // Add onClick handler
          >
            Explore
          </button>
        </div>

        {/* Broker Card */}
        <div
          className={`bg-sky-50 rounded-2xl shadow-lg p-6 text-amber-900 flex flex-col items-center w-full md:w-96 transition-transform duration-1000 ${isVisible ? 'transform translate-x-0 opacity-100' : 'transform translate-x-full opacity-0'}`}
        >
          <div className="mb-1">
            <img
              src={brokerImage}
              alt="Broker"
              className="mx-auto h-70 w-70 object-cover rounded-full"
            />
          </div>
          <h3 className="text-stone-500 font-extrabold mb-4 text-3xl">Broker</h3>
          <button 
            className="px-8 py-3 bg-amber-200 text-black font-semibold rounded-md hover:bg-lime-100 transition" 
            onClick={handleBrokerClick} // Add onClick handler
          >
            Explore
          </button>
        </div>
      </div>
    </section>
  );
}
