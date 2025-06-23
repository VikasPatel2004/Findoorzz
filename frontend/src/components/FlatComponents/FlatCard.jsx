import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import lenderImage from "../../assets/lender.svg";
import renterImage from "../../assets/Renter.svg";
import brokerImage from "../../assets/broker.svg";

export default function FlatCard() {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
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

  const handleLenderClick = () => {
    navigate('/lender');
  };

  const handleRenterClick = () => {
    navigate('/renter');
  };

  const handleBrokerClick = () => {
    navigate('/BrokerRegistration');
  };

  return (
    <section className="bg-gradient-to-r  flex flex-col items-center justify-center pt-12">
      <h1 className="text-3xl sm:text-4xl md:text-3xl font-bold leading-tight pb-12 text-center ">
       " Experience The <span className="text-yellow-500">Easy</span> Way To <span className="text-yellow-500">Rent</span> And <span className="text-yellow-500">Lend</span> Flats With Findoorz! "
      </h1>
      <div
        ref={cardRef}
        className="max-w-7xl w-full grid gap-12 md:grid-cols-3"
      >
        {/* Lender Card */}
        <div
          className={`bg-sky-50 rounded-3xl shadow-2xl p-8 text-amber-900 flex flex-col items-center w-full md:w-96 transition-transform duration-700 hover:scale-105 hover:shadow-2xl cursor-pointer ${isVisible ? 'transform translate-x-0 opacity-100' : 'transform -translate-x-full opacity-0'}`}
          onClick={handleLenderClick}
        >
          <div className="mb-4">
            <img
              src={lenderImage}
              alt="Lender"
              className="mx-auto h-72 w-72 object-cover rounded-full border-4  border-gray-50  shadow-lg"
            />
          </div>
          <h3 className="text-yellow-700 font-extrabold mb-6 text-4xl drop-shadow-md">Lender</h3>
          <button 
            className="px-10 py-4 bg-yellow-300 text-black font-bold rounded-full hover:bg-yellow-500 transition shadow-md hover:shadow-lg"
            onClick={handleLenderClick}
          >
            Explore
          </button>
        </div>

        {/* Renter Card */}
        <div
          className={`bg-sky-50 rounded-3xl shadow-2xl p-8 text-amber-900 flex flex-col items-center w-full md:w-96 transition-transform duration-700 hover:scale-105 hover:shadow-2xl cursor-pointer ${isVisible ? 'transform translate-y-0 opacity-100' : 'transform translate-y-10 opacity-0'}`}
          onClick={handleRenterClick}
        >
          <div className="mb-4">
            <img
              src={renterImage}
              alt="Renter"
              className="mx-auto h-72 w-72 object-cover rounded-full border-4  border-gray-50 shadow-lg"
            />
          </div>
          <h3 className="text-yellow-700 font-extrabold mb-6 text-4xl drop-shadow-md">Renter</h3>
          <button 
            className="px-10 py-4 bg-yellow-300 text-black font-bold rounded-full hover:bg-yellow-500 transition shadow-md hover:shadow-lg"
            onClick={handleRenterClick}
          >
            Explore
          </button>
        </div>

        {/* Broker Card */}
        <div
          className={`bg-sky-50 rounded-3xl shadow-2xl p-8 text-amber-900 flex flex-col items-center w-full md:w-96 transition-transform duration-700 hover:scale-105 hover:shadow-2xl cursor-pointer ${isVisible ? 'transform translate-x-0 opacity-100' : 'transform translate-x-full opacity-0'}`}
          onClick={handleBrokerClick}
        >
          <div className="mb-4">
            <img
              src={brokerImage}
              alt="Broker"
              className="mx-auto h-72 w-72 object-cover rounded-full border-4 border-gray-50 shadow-lg"
            />
          </div>
          <h3 className="text-yellow-700 font-extrabold mb-6 text-4xl drop-shadow-md">Broker</h3>
          <button 
            className="px-10 py-4 bg-yellow-300 text-black font-bold rounded-full hover:bg-yellow-500 transition shadow-md hover:shadow-lg"
            onClick={handleBrokerClick}
          >
            Explore
          </button>
        </div>
      </div>
    </section>
  );
}
