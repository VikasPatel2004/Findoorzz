import React, { useEffect, useRef, useState } from 'react';
import { FaShieldAlt, FaUndoAlt, FaHandshake, FaLock } from 'react-icons/fa';

export default function FlatTrustSection() {
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

  const trustPoints = [
    {
      icon: <FaShieldAlt className="text-yellow-500 w-12 h-12 mb-4" />,
      title: 'Money Secured',
      description: 'Your money is safe with us through secure payment gateways.',
    },
    {
      icon: <FaUndoAlt className="text-yellow-500 w-12 h-12 mb-4" />,
      title: 'Full Refunds',
      description: 'We offer full refunds in case of any issues or cancellations.',
    },
    {
      icon: <FaHandshake className="text-yellow-500 w-12 h-12 mb-4" />,
      title: 'Trusted Service',
      description: 'We build trust by providing transparent and reliable services.',
    },
    {
      icon: <FaLock className="text-yellow-500 w-12 h-12 mb-4" />,
      title: 'Data Privacy',
      description: 'Your personal information is protected with strict privacy policies.',
    },
  ];

  return (
    <section ref={sectionRef} className="bg-gradient-to-r bg-amber-50  py-18 px-4 sm:px-6 lg:px-8 rounded-lg shadow-lg mt-20">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-12">
          Why You Can Trust Us
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 max-w-5xl mx-auto">
          {trustPoints.map((point, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl p-8 shadow-xl flex flex-col items-center transform transition-transform duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
              {point.icon}
              <h3 className="font-semibold text-xl mb-2 text-stone-700">{point.title}</h3>
              <p className="text-green-900">{point.description}</p>
            </div>
          ))}
        </div>
        
        {/* Legal Links Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Legal Information</h3>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <a 
              href="/privacy" 
              className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
            >
              Privacy Policy
            </a>
            <a 
              href="/terms" 
              className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
            >
              Terms of Service
            </a>
            <a 
              href="/refund-policy" 
              className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
            >
              Refund Policy
            </a>
            <a 
              href="/cancellation-policy" 
              className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
            >
              Cancellation Policy
            </a>

          </div>
        </div>
      </div>
    </section>
  );
}
