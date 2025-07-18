import React, { useEffect, useState } from 'react';
import reviewImage1 from '../../assets/Review1.svg'; // Placeholder for review image
import reviewImage2 from '../../assets/Review2.svg'; // Placeholder for review image
import reviewImage3 from '../../assets/Review3.svg'; // Placeholder for review image
import reviewImage4 from '../../assets/Review4.svg'; // Placeholder for review image
import reviewImage5 from '../../assets/Review5.svg'; // Placeholder for review image
import reviewImage6 from '../../assets/Reveiw6.svg'; // Placeholder for review image
import reviewImage7 from '../../assets/Review7.svg'; // Placeholder for review image
import reviewImage8 from '../../assets/Review8.svg'; // Placeholder for review image
import reviewImage9 from '../../assets/Review9.svg'; // Placeholder for review image
import reviewImage10 from '../../assets/Review10.svg'; // Placeholder for review image

const ReviewSlider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const images = [
        { src: reviewImage1 },
        { src: reviewImage2 },
        { src: reviewImage3 },
        { src: reviewImage4 },
        { src: reviewImage5 },
        { src: reviewImage6 },
        { src: reviewImage7 },
        { src: reviewImage8 },
        { src: reviewImage9 },
        { src: reviewImage10 },
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
