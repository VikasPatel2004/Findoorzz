import React, { useEffect, useRef, useState } from 'react';
import faqImage from "../../assets/FAQ.svg";

const faqs = [
  {
    question: 'How can landlords list their PG rooms?',
    answer:
      'Landlords can easily create an account and upload images and details of their PG rooms along with facilities. The listing will be visible to students for free.',
  },
  {
    question: 'Do students have to pay to search or contact landlords?',
    answer:
      'No, initially students can search and contact landlords freely. Charges may apply later based on engagement.',
  },
  {
    question: 'How do students book or connect with a PG landlord?',
    answer:
      'Students can browse listings, select a room they like, and connect directly with the landlord through the app for further discussion.',
  },
];

export default function PgFaq() {
  const [openIndex, setOpenIndex] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const toggleOpen = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

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
      observer.observe(sectionRef.current);//this actually help to obser the observer for scroll based animation animatino will only applied when it observe the html enttities of animated function 
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="flex flex-col md:flex-row max-w-5xl mx-auto p-8 bg-white rounded-lg shadow-md transition-opacity duration-700">
      
      <div className={`flex-1 md:w-1/2 transform transition-transform duration-700 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
        <img src={faqImage} alt="FAQ Illustration" className="w-full h-auto" />
      </div>

      <div className={`flex-1 md:w-1/2 transform transition-transform duration-700 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">Frequently Asked Questions</h2>
        <dl className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-300 rounded-lg p-5 cursor-pointer transition duration-300 ease-in-out transform hover:scale-105"
              onClick={() => toggleOpen(index)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  toggleOpen(index);
                }
              }}
              role="button"
              aria-expanded={openIndex === index}
            >
              <dt className="flex justify-between items-center text-lg font-medium text-gray-900">
                <span>{faq.question}</span>
                <span className="ml-4">
                  {openIndex === index ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-yellow-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-amber-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </span>
              </dt>
              {openIndex === index && (
                <dd className="mt-3 text-gray-700 bg-lime-50 p-3 rounded-md shadow-inner">
                  {faq.answer}
                </dd>
              )}
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
