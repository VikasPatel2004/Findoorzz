import React from 'react';
import PgCard from '../../components/FlatComponents/FlatCard';
import PgHowItWorks from "../../components/PGComponents/PGHowItWorks";
import PgFaq from '../../components/FlatComponents/FlatFaq';

export default function FlatPage() {
  return (
    <main className="bg-gray-50 min-h-screen">
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
