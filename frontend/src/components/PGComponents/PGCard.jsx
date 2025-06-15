import React, { useEffect, useRef, useState } from 'react';
// Replace the paths with your actual video file paths or URLs
import landlordVideo from '../../assets/landlord.mp4';
import studentVideo from '../../assets/Student.mp4';

export default function PGcard() {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Stop observing once visible
        }
      },
      { threshold: 0.1 } // Trigger when 10% of the card is visible
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

  return (
    <section className="flex flex-col items-center justify-center px-4 pt-12">
      <h1 className="text-3xl sm:text-4xl md:text-3xl font-bold leading-tight py-8 text-center">
        "Find your <span className="text-yellow-400">perfect</span> PG: where <span className="text-yellow-400">comfort</span> meets convenience!"
      </h1>
      <div ref={cardRef} className="max-w-5xl w-full grid gap-8 md:grid-cols-2">
        {/* Landlord Card */}
        <div
          className={`bg-gradient-to-r from-purple-700 to-indigo-600 rounded-lg shadow-lg p-10 text-white flex flex-col items-center transition-transform duration-700 ${isVisible ? 'transform translate-x-0 opacity-100' : 'transform -translate-x-full opacity-0'}`}
        >
          <div className="mb-6">
            {/* Video placeholder for Landlord */}
            <video
              className="mx-auto h-50 w-50 object-cover rounded-md"
              src={landlordVideo}
              autoPlay
              loop
              muted
              playsInline
              aria-label="Landlord video demonstration"
            />
          </div>
          <h2 className="text-2xl font-bold text-amber-300 mb-4 relative">
            <span className="absolute inset-0 text-yellow-400 -z-10" style={{ filter: 'blur(1px)' }} />
            Landlord
          </h2>
          <p className="mb-6 text-center ">
            Upload your PG room images and facilities. Manage your listings and connect with students easily.
          </p>
          <button className="px-6 py-3 bg-lime-100 text-black font-semibold rounded-md hover:bg-yellow-200 transition">
            Go to Landlord Section
          </button>
        </div>

        {/* Student Card */}
        <div
          className={`bg-gradient-to-r from-green-500 to-teal-400 rounded-lg shadow-lg p-10 text-white flex flex-col items-center transition-transform duration-700 ${isVisible ? 'transform translate-x-0 opacity-100' : 'transform translate-x-full opacity-0'}`}
        >
          <div className="mb-6">
            {/* Video placeholder for Student */}
            <video
              className="mx-auto h-50 w-50 object-cover rounded-md"
              src={studentVideo}
              autoPlay
              loop
              muted
              playsInline
              aria-label="Student video demonstration"
            />
          </div>
          <h2 className="text-2xl font-bold text-amber-200 mb-4 relative">
            <span className="absolute inset-0 text-yellow-400 -z-10" style={{ filter: 'blur(1px)' }} />
            Student
          </h2>
          <p className="mb-6 text-center">
            Search PG rooms by location, price, and facilities. Connect directly with landlords.
          </p>
          <button className="px-6 py-3 bg-lime-100 text-black font-semibold rounded-md hover:bg-yellow-200 transition">
            Go to Student Section
          </button>
        </div>
      </div>
    </section>
  );
}
