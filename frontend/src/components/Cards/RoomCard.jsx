import React from 'react';

const RoomCard = ({ title, location, price, originalPrice, discount }) => {
  return (
    <div className="p-4 shadow-lg rounded-lg h-[400px] flex flex-col justify-center text-center">
      <div className="relative overflow-hidden rounded-t-lg">
        <img 
          src="https://i.pinimg.com/736x/25/d1/df/25d1df068cf5ecf8c7efe993268c1538.jpg" 
          alt={title} 
          className="w-full h-52 object-cover"
        />
        <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">{discount}</span>
      </div>
      <h2 className="text-lg font-semibold mt-2">{title}</h2>
      <p className="text-sm text-gray-500">{location}</p>
      <p className="text-xl font-bold mt-2">{`₹${price}/Bed`}</p>
      <p className="text-sm text-gray-400 line-through">{`₹${originalPrice}`}</p>
      <div className="mt-auto">
        {/* No button element, keeping the card minimal */}
      </div>
    </div>
  );
};

export default RoomCard;
