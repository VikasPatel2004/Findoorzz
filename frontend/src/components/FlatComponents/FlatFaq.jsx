import React, { useState } from 'react';

const faqs = [
  {
    question: 'How can lenders list their flats?',
    answer:
      'Lenders can create an account and upload images and details of their flats along with amenities. Listings will be visible to renters immediately.',
  },
  {
    question: 'How does the booking and broker assignment work?',
    answer:
      'When a renter books a flat, a broker from our app will be assigned to facilitate the viewing and transaction, ensuring smooth communication.',
  },
  {
    question: 'How is the payment shared among lender, broker, and Findoorz?',
    answer:
      'The amount charged to the renter is split between the lender, the broker facilitating the deal, and Findoorz as per the agreed commission model.',
  },
];

export default function FlatFaq() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleOpen = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="max-w-3xl mx-auto p-8 bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">Frequently Asked Questions</h2>
      <dl className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-amber-300 rounded-lg p-5 cursor-pointer bg-amber-50 hover:bg-amber-100 transition duration-300 ease-in-out transform hover:scale-[1.03]"
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
                    className="h-5 w-5 text-amber-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-yellow-600"
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
              <dd className="mt-3 text-gray-800 bg-yellow-50 p-3 rounded-md shadow-inner">
                {faq.answer}
              </dd>
            )}
          </div>
        ))}
      </dl>
    </section>
  );
}

