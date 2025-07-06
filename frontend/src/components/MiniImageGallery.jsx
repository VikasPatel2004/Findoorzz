import React, { useState } from 'react';

const MiniImageGallery = ({ images, defaultImage, alt = "Property Images", maxImages = 4 }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Combine default image with property images
  const allImages = defaultImage ? [defaultImage, ...(images || [])] : (images || []);
  
  if (!allImages || allImages.length === 0) {
    return (
      <div className="w-full h-52 bg-gray-200 flex items-center justify-center">
        <span className="text-gray-500 text-sm">No images</span>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === allImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? allImages.length - 1 : prevIndex - 1
    );
  };

  // Show multiple images in a grid if there are more than 1 image
  if (allImages.length > 1) {
    const displayImages = allImages.slice(0, maxImages);
    const remainingCount = allImages.length - maxImages;

    return (
      <div className="relative w-full h-52">
        {/* Main grid of images */}
        <div className="grid grid-cols-2 gap-1 h-full">
          {displayImages.map((image, index) => (
            <div key={index} className="relative overflow-hidden">
              <img
                src={image}
                alt={`${alt} ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {/* Overlay for last image if there are more images */}
              {index === maxImages - 1 && remainingCount > 0 && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="text-white text-lg font-bold">+{remainingCount}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Navigation arrows for multiple images */}
        {allImages.length > maxImages && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-1 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-75 transition-all duration-200"
              aria-label="Previous image"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextImage}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-75 transition-all duration-200"
              aria-label="Next image"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Image counter */}
        <div className="absolute bottom-1 right-1 bg-black bg-opacity-50 text-white px-1 py-0.5 rounded text-xs">
          {currentImageIndex + 1} / {allImages.length}
        </div>
      </div>
    );
  }

  // Single image display
  return (
    <div className="w-full h-52">
      <img
        src={allImages[0]}
        alt={alt}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default MiniImageGallery; 