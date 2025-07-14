import React, { useEffect, useState } from 'react';
import reviewImage from '../../assets/Review.svg'; // Placeholder for review image

const ReviewSlider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const images = [
        { src: reviewImage },
        { src: reviewImage },
        { src: reviewImage },
        { src: reviewImage },
        { src: reviewImage },
        { src: reviewImage },
    ];

    // Check screen size on mount and resize
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => {
                const maxIndex = isMobile ? images.length - 1 : images.length - 3;
                return prevIndex === maxIndex ? 0 : prevIndex + 1;
            });
        }, 2000); // Change image every 2 seconds

        return () => clearInterval(interval);
    }, [images.length, isMobile]);

    return (
        <div className="overflow-hidden relative text-center py-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
                Reviews
            </h1>
            <h1 className="text-1xl pb-6">
                " Just Some Motivation For Our Hardwork "
            </h1>
            <div
                className="flex transition-transform duration-700"
                style={{
                    transform: isMobile 
                        ? `translateX(-${currentIndex * 100}%)` 
                        : `translateX(-${(currentIndex * 100) / 3}%)`,
                }}
            >
                {images.map((image, index) => (
                    <div key={index} className="flex-shrink-0 w-full md:w-1/3 p-1">
                        <div className="bg-white rounded-lg"> {/* Removed shadow */}
                            <img
                                className="w-full h-80 rounded-lg object-cover" // Increased height
                                src={image.src}
                                alt={`Review ${index + 1}`}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReviewSlider;
