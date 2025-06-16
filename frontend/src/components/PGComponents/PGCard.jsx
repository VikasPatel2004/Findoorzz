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
    <section className="bg-white flex flex-col items-center justify-center pt-12">
      <h1 className="text-3xl sm:text-4xl md:text-3xl font-bold leading-tight pb-12 text-center">
        "Find your <span className="text-yellow-400">perfect</span> PG: where <span className="text-yellow-400">comfort</span> meets convenience!"
      </h1>
      <div ref={cardRef} className="max-w-4xl w-full grid gap-4 md:grid-cols-2">
        {/* Landlord Card */}
        <div
          className={`bg-sky-100 rounded-2xl shadow-lg p-6 text-amber-900 flex flex-col items-center w-full md:w-96 transition-transform duration-1000 ${isVisible ? 'transform translate-x-0 opacity-100' : 'transform -translate-x-full opacity-0'}`}
        >
          <div className="mb-1 ">
            <video
              className="mx-auto h-70 w-70 object-cover  rounded-full" // Changed to rounded-full for circular video
              src={landlordVideo}
              autoPlay
              loop
              muted
              playsInline
              aria-label="Landlord video demonstration"
            />
          </div>
          <h3 className="text-stone-500 font-extrabold mb-4 text-3xl">Landlord</h3>
          <button className="px-8 py-3 bg-amber-200 text-black font-semibold rounded-md hover:bg-amber-100 transition" >
            Explore
          </button>
        </div>

        {/* Student Card */}
        <div
          className={`bg-green-100 rounded-2xl shadow-lg p-6 text-amber-900 flex flex-col items-center w-full md:w-96 transition-transform duration-1000 ${isVisible ? 'transform translate-x-0 opacity-100' : 'transform translate-x-full opacity-0'}`}
        >
          <div className="mb-1">
            <video
              className="mx-auto h-70 w-70 object-cover rounded-full" // Changed to rounded-full for circular video
              src={studentVideo}
              autoPlay
              loop
              muted
              playsInline
              aria-label="Student video demonstration"
            />
          </div>
          <h3 className="text-stone-500 font-extrabold mb-4 text-3xl">Student</h3>
          <button className="px-8 py-3 bg-amber-200 text-black font-semibold rounded-md hover:bg-amber-100 transition">
            Explore
          </button>
        </div>
      </div>
    </section>
  );
}
