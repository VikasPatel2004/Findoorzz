import React, { useEffect } from 'react';
import PgCard from '../../components/PGComponents/PGCard';
import PgHowItWorks from "../../components/PGComponents/PGHowItWorks";
import PgFaq from '../../components/PGComponents/PGFaq';

export default function PGPage() {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className=" min-h-screen">
      {/* Landing section with Landlord and Student cards */}
      <PgCard/>

      {/* How it works section */}
      <div className="mt-20">
        <PgHowItWorks/>
      </div>

      {/* FAQ section */}
      <div className="mt-20 mb-20">
        <PgFaq />
      </div>
    </main>
  );
}
