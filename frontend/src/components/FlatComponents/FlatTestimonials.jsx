import React, { useEffect, useRef, useState } from 'react';

const testimonials = [
  {
    name: 'John Doe',
    feedback: 'Findoorz made renting my flat so easy and hassle-free. Highly recommended!',
    photo: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    name: 'Jane Smith',
    feedback: 'Excellent service and support throughout the renting process. Very professional.',
    photo: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    name: 'Michael Johnson',
    feedback: 'The broker assigned was very helpful and made the whole experience smooth.',
    photo: 'https://randomuser.me/api/portraits/men/65.jpg',
  },
];

export default function FlatTestimonials() {
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

  return (
    <section
      ref={sectionRef}
      className=" max-w-7xl mx-auto p-8 my-20 transition-opacity duration-700"
    >
      <h2 className="text-4xl font-bold text-center mb-12">
        What Our Customers Say
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className={`bg-white rounded-xl p-6 shadow-xl flex flex-col items-center text-center transform transition-transform duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <img
              src={testimonial.photo}
              alt={testimonial.name}
              className="w-24 h-24 rounded-full mb-4 object-cover shadow-md"
            />
            <p className="text-gray-700 italic mb-4">"{testimonial.feedback}"</p>
            <h3 className="text-yellow-700 font-semibold text-lg">{testimonial.name}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}
