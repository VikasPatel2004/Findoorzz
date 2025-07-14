
import React, { useEffect, useRef, useState } from 'react';
import { FaListAlt, FaSearch, FaHandshake, FaMoneyBillWave } from 'react-icons/fa';

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
      icon: <FaListAlt className="text-orange-300 w-14 h-14 mb-6 " />,
      title: 'List the Flat',
      description: 'Lenders add their flat listings with images and detailed amenities.',
    },
    {
      icon: <FaSearch className="text-orange-300 w-14 h-14 mb-6 " />,
      title: 'Search & Book',
      description: 'Renters browse available flats, apply filters, and book their preferred flat.',
    },
    {
      icon: <FaHandshake className="text-orange-300 w-14 h-14 mb-6 " />,
      title: 'Broker Assigned',
      description: 'A trusted broker is assigned to coordinate viewings and facilitate communication.',
    },
    {
      icon: <FaMoneyBillWave className="text-orange-300 w-14 h-14 mb-6 " />,
      title: 'Secure Payment',
      description: 'Payments are processed securely and split transparently between lender, broker, and Findoorz.',
    },
  ];

  return (
    <section ref={sectionRef} className="bg-gradient-to-br py-10 px-4 sm:px-8 lg:px-16 rounded-3xl my-16">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold mb-14  tracking-tight">
          How Flat Section Works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`bg-white rounded-3xl p-10 shadow-2xl flex flex-col items-center border border-amber-100 transform transition-transform duration-700 hover:-translate-y-2 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
              {step.icon}
              <h3 className="font-bold text-2xl mb-3 text-yellow-700 tracking-wide">{step.title}</h3>
              <p className="text-gray-700 text-base leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
