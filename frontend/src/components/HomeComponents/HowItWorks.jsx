import React from 'react';
import { motion } from 'framer-motion';
import Works from "../../assets/Works.svg";

const steps = [
  {
    title: "List Your Property",
    description: "Landlords list PG rooms with images and facilities for students. Lenders list flats available for rent.",
  },
  {
    title: "Search & Connect",
    description: "Students search for PGs and connect directly with landlords. Renters browse flats and request viewings.",
  },
  {
    title: "Broker Facilitation",
    description: "Our trusted brokers coordinate flat viewings and assist renters through the booking process.",
  },
  {
    title: "Secure Your Booking",
    description: "Finalize your booking with landlords or via brokers for flats with transparent and fair charges.",
  },
];

const HowItWorksSection = ({ isVisible }) => {
  // Animation variants for steps
  const stepVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.4,
        duration: 0.5,
      },
    }),
  };

  return (
    <section id="works-section" className="max-w-6xl mx-auto px-4  bg-white">
      {/* Card Container */}
      <motion.div 
        className="border rounded-lg shadow-lg p-6 bg-amber-50" // Changed background to light yellow
        initial={{ opacity: 0, y: 20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        {/* Centered Heading */}
        <motion.h2 
          className="text-lg md:text-3xl font-bold text-gray-800 text-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
         "How it Works"

        </motion.h2>

        <div className="flex flex-col md:flex-row items-center gap-6">
          <motion.div
            className="flex-1 max-w-xs md:max-w-sm flex justify-center" // Center the image container
            initial={{ opacity: 0, x: -100 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <img
              src={Works}
              alt="How Findoorz Works"
              className="rounded-lg w-48 h-auto object-cover shadow-md" // Set a fixed width for the image
              loading="lazy"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </motion.div>
          
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, x: 100 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="space-y-3">
              {steps.map((step, idx) => (
                <motion.div
                  key={idx}
                  className="flex items-start gap-4 p-4 border rounded-lg bg-white shadow-sm"
                  custom={idx}
                  initial="hidden"
                  animate={isVisible ? "visible" : "hidden"}
                  variants={stepVariants}
                >
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-teal-400 text-white flex items-center justify-center font-bold text-lg shadow-md">
                      {idx + 1}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-md font-semibold text-gray-900 mb-1">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-xs">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default HowItWorksSection;
