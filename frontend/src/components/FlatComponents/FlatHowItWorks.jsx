import React, { useEffect, useRef, useState } from 'react';

export default function FlatHowItWorks() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

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

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold mb-12">
          How Flat Section Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 max-w-5xl mx-auto">
          {/* Step 1 */}
          <div className={`bg-amber-50 rounded-xl p-8 shadow-lg flex flex-col items-center transform transition-transform duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex items-center justify-center h-16 w-16 mb-4 rounded-full bg-yellow-400 text-amber-900 font-bold text-xl">
              1
            </div>
            <h3 className="font-semibold text-xl mb-2">List the Flat</h3>
            <p className="text-cyan-900">
              Lenders add their flat listings with images and detailed amenities.
            </p>
          </div>

          {/* Step 2 */}
          <div className={`bg-amber-50 rounded-xl p-8 shadow-lg flex flex-col items-center transform transition-transform duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex items-center justify-center h-16 w-16 mb-4 rounded-full bg-yellow-400 text-amber-900 font-bold text-xl">
              2
            </div>
            <h3 className="font-semibold text-xl mb-2">Search & Book</h3>
            <p className="text-cyan-900">
              Renters browse available flats, apply filters, and book their preferred flat.
            </p>
          </div>

          {/* Step 3 */}
          <div className={`bg-amber-50 rounded-xl p-8 shadow-lg flex flex-col items-center transform transition-transform duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex items-center justify-center h-16 w-16 mb-4 rounded-full bg-yellow-400 text-amber-900 font-bold text-xl">
              3
            </div>
            <h3 className="font-semibold text-xl mb-2">Broker Assigned</h3>
            <p className="text-cyan-900">
              A trusted broker is assigned to coordinate viewings and facilitate communication.
            </p>
          </div>

          {/* Step 4 */}
          <div className={`bg-amber-50 rounded-xl p-8 shadow-lg flex flex-col items-center transform transition-transform duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex items-center justify-center h-16 w-16 mb-4 rounded-full bg-yellow-400 text-amber-900 font-bold text-xl">
              4
            </div>
            <h3 className="font-semibold text-xl mb-2">Secure Payment</h3>
            <p className="text-cyan-900">
              Payments are processed securely and split transparently between lender, broker, and Findoorz.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
