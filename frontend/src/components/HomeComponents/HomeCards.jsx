// Slider.js
import React, { useState, useEffect } from 'react';
import RoomCard from "../../components/Cards/RoomCard";

const listings = [
  { title: "Arcadia", location: "Sapna Sangeeta 452001, Indore (M.P.)", price: 8500, originalPrice: 11500, discount: "26%" },
  { title: "Stellar", location: "Vallabh Nagar, Indore- 452001", price: 4500, originalPrice: 6000, discount: "25%" },
  { title: "Bliss Heritage", location: "16, Dhenhu Market Rd, Opposite SGSITS College, Nehru P...", price: 6500, originalPrice: 7500, discount: "13%" },
  { title: "Grand Vista", location: "Khandwa Rd, Indore", price: 7000, originalPrice: 8000, discount: "12%" },
  { title: "Royal Residency", location: "New Palasia, Indore", price: 9000, originalPrice: 9500, discount: "5%" },
  { title: "Pleasant Stay", location: "Biyabani, Indore", price: 6500, originalPrice: 7000, discount: "7%" },
];

const HomeCards = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % Math.ceil(listings.length / 2));
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex overflow-hidden">
      <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${index * (100 / 3)}%)` }}>
        {listings.map((listing, idx) => (
          <div className="flex-shrink-0 w-1/3 p-2" key={idx}>
            <RoomCard {...listing} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeCards;
