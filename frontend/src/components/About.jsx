import React from 'react';
import myPhoto from '../../src/assets/MyPhoto.jpeg'; // Replace with your actual photo filename

const About = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div className="bg-white p-8 rounded-xl shadow-lg max-w-xl w-full text-center">
      <h1 className="text-3xl font-bold mb-10 text-amber-800">About Me</h1>
      <img
        src={myPhoto}
        alt="Vikas Patel"
        className="mx-auto mb-6 w-100 h-100 rounded-full object-cover border-4 border-amber-300 shadow"
      />
       <h1 className="text-3xl font-bold mb-2 text-gray-800">Vikas Patel</h1>
      <h2 className="text-lg text-gray-600 mb-4">B.Tech (IT), Madhav Institute of Technology & Science, Gwalior</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        The idea for this business came to me when I took admission in college. While searching for PGs and flats near my campus, I noticed that no website provided proper accommodation information for students. From that day, I was determined to create a platform that truly helps students find the right place to stay. Today, I am proud to deploy this solution for the benefit of all students.
      </p>
      <p className="text-gray-500 text-sm">Empowering students to find better accommodation, one listing at a time.</p>
    </div>
  </div>
);

export default About; 