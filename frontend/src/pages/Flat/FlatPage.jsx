import React, { useEffect } from 'react';
import FlatCard from '../../components/FlatComponents/FlatCard';
import FlatHowItWorks from '../../components/FlatComponents/FlatHowItWorks';
import FlatFaq from '../../components/FlatComponents/FlatFaq';
import FlatTestimonials from '../../components/FlatComponents/FlatTestimonials';
import FlatTrustSection from '../../components/FlatComponents/FlatTrustSection';

export default function FlatPage() {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className=" min-h-screen">
      {/* Landing section with Landlord and Student cards */}
      <FlatCard/>

      {/* How it works section */}
      <div className="mt-20">
        <FlatHowItWorks/>
      </div>
      {/* FAQ section */}
      <div className="mt-20 mb-20">
        <FlatFaq/>
      </div>

      {/* Trust section */}
      <FlatTrustSection />

      {/* Testimonials section */}
      <div className="mt-20">
        <FlatTestimonials/>
      </div>

      {/* Legal Links Section */}
      <div className="mt-20 mb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r bg-amber-50 rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
              Legal Information
            </h2>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <a 
                href="/privacy" 
                className="text-blue-600 hover:text-blue-800 hover:underline transition-colors px-4 py-2 bg-white rounded-lg shadow-sm"
              >
                Privacy Policy
              </a>
              <a 
                href="/terms" 
                className="text-blue-600 hover:text-blue-800 hover:underline transition-colors px-4 py-2 bg-white rounded-lg shadow-sm"
              >
                Terms of Service
              </a>
              <a 
                href="/refund-policy" 
                className="text-blue-600 hover:text-blue-800 hover:underline transition-colors px-4 py-2 bg-white rounded-lg shadow-sm"
              >
                Refund Policy
              </a>
              <a 
                href="/cancellation-policy" 
                className="text-blue-600 hover:text-blue-800 hover:underline transition-colors px-4 py-2 bg-white rounded-lg shadow-sm"
              >
                Cancellation Policy
              </a>
            </div>
          </div>
        </div>
      </div>

    </main>
  );
}
