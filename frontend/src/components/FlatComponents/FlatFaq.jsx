import React, { useState } from 'react';

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

  const toggleOpen = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">Frequently Asked Questions</h2>
      <dl className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-300 rounded-lg p-5 cursor-pointer"
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
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </span>
            </dt>
            {openIndex === index && <dd className="mt-3 text-gray-700">{faq.answer}</dd>}
          </div>
        ))}
      </dl>
    </section>
  );
}
