import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import FeatureImage from "../../assets/Features.svg"; // Placeholder for single feature image

const features = [
  {
    title: "Easy Property Listing",
    description: "Landlords can effortlessly list PG rooms and flats with images and detailed descriptions.",
  },
  {
    title: "Direct Communication",
    description: "Students and renters connect directly with landlords without intermediaries.",
  },
  {
    title: "Broker Facilitation",
    description: "Trusted brokers assist renters by arranging viewings and managing bookings.",
  },
  {
    title: "Fair and Transparent Charges",
    description: "Charges are distributed fairly among lenders, brokers, and the platform for flat bookings.",
  },
];

const FeatureSection = () => {
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

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.2, when: "beforeChildren" },
    },
  };

  const featureVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <section id="feature-section" ref={sectionRef} className="max-w-md w-full mx-auto px-2 py-12 bg-white rounded-lg shadow md:max-w-6xl md:bg-transparent md:shadow-none md:p-0 md:rounded-none md:mx-auto md:px-4 md:py-12">
      {/* Centered Heading */}
      <motion.h2 
        className="text-2xl md:text-3xl font-extrabold text-gray-900 text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
       <h1 className="text-3xl sm:text-4xl md:text-4xl font-bold leading-tight">
              <span className="text-yellow-400">Why </span>Findoorz ?
                    </h1>
      </motion.h2>

      <motion.div 
        className="flex flex-col-reverse md:flex-row items-center gap-8"
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        variants={containerVariants}
      >
        {/* Features List on Left (on mobile, below image) */}
        <motion.div 
          className="w-full md:w-1/2 space-y-4"
          variants={featureVariants}
        >
          <div className="space-y-4">
            {features.map((feature, index) => (
              <motion.div 
                key={index} 
                className="flex flex-col md:flex-row md:items-start gap-4 p-4 border rounded-lg shadow-md bg-white"
                custom={index}
                variants={featureVariants}
              >
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-yellow-400 text-white flex items-center justify-center font-bold text-lg shadow-md">
                    {index + 1}
                  </div>
                </div>
                <div>
                  <h3 className="text-xs md:text-sm font-semibold text-gray-800">{feature.title}</h3>
                  <p className="text-gray-600 text-xs leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Image on Right (on mobile, above features) */}
        <motion.div 
          className="w-full md:w-1/2 flex justify-center mb-6 md:mb-0"
          variants={featureVariants}
        >
          <img 
            src={FeatureImage} 
            alt="Findoorz Features Illustration" 
            className="w-full max-w-xs md:max-w-md rounded-lg object-cover"
            loading="lazy"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default FeatureSection;
