import React from 'react';
import FlatCard from '../../components/FlatComponents/FlatCard';
import FlatHowItWorks from '../../components/FlatComponents/FlatHowItWorks';
import FlatFaq from '../../components/FlatComponents/FlatFaq';
import FlatTestimonials from '../../components/FlatComponents/FlatTestimonials';
import FlatTrustSection from '../../components/FlatComponents/FlatTrustSection';

export default function FlatPage() {
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

    </main>
  );
}
