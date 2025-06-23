
import React, { useEffect, useRef, useState } from 'react';
import { FaListAlt, FaSearch, FaHandshake, FaLock } from 'react-icons/fa';

export default function FlatHowItWorks() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

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

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const steps = [
    {
      icon: <FaListAlt className="text-yellow-500 w-12 h-12 mb-4" />,
      title: 'List the Flat',
      description: 'Lenders add their flat listings with images and detailed amenities.',
    },
    {
      icon: <FaSearch className="text-yellow-500 w-12 h-12 mb-4" />,
      title: 'Search & Book',
      description: 'Renters browse available flats, apply filters, and book their preferred flat.',
    },
    {
      icon: <FaHandshake className="text-yellow-500 w-12 h-12 mb-4" />,
      title: 'Broker Assigned',
      description: 'A trusted broker is assigned to coordinate viewings and facilitate communication.',
    },
    {
      icon: <FaLock className="text-yellow-500 w-12 h-12 mb-4" />,
      title: 'Secure Payment',
      description: 'Payments are processed securely and split transparently between lender, broker, and Findoorz.',
    },
  ];

  return (
    <section ref={sectionRef} className="bg-gradient-to-r bg-amber-50 py-18 px-4 sm:px-6 lg:px-8 rounded-lg shadow-lg">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold mb-12 ">
          How Flat Section Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl p-8 shadow-xl flex flex-col items-center transform transition-transform duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
              {step.icon}
              <h3 className="font-semibold text-xl mb-2 text-yellow-700">{step.title}</h3>
              <p className="text-cyan-900">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
