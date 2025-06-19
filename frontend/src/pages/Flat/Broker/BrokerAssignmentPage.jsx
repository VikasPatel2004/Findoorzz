import React, { useState } from 'react';

// Inline SVG Icons
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a7 7 0 100 14 7 7 0 000-14zm0 0l6 6" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m2 10a10 10 0 11-20 0 10 10 0 0120 0z" />
  </svg>
);

const XCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default function BrokerAssignmentPage() {
  const [selectedBroker, setSelectedBroker] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sample data - in a real app, this would come from your backend
  const brokers = [
    { id: 1, name: 'Rajesh Kumar', rating: 4.8, experience: '5 years', areas: ['Andheri', 'Bandra'], available: true },
    { id: 2, name: 'Priya Sharma', rating: 4.5, experience: '3 years', areas: ['Khar', 'Santacruz'], available: false },
    { id: 3, name: 'Amit Patel', rating: 4.9, experience: '7 years', areas: ['Juhu', 'Versova'], available: true },
    { id: 4, name: 'Neha Gupta', rating: 4.7, experience: '4 years', areas: ['Malad', 'Goregaon'], available: true },
  ];

  const filteredBrokers = brokers.filter(broker => 
    broker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    broker.areas.some(area => area.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAssign = (brokerId) => {
    // In a real app, this would call your backend to assign the broker
    console.log(`Assigned broker with ID: ${brokerId}`);
    setSelectedBroker(brokerId);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-6">Assign Broker to Listing</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Search Brokers</label>
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon />
          </div>
          <input
            type="text"
            className="focus:ring-yellow-500 focus:border-yellow-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 px-4 border"
            placeholder="Search by name or area..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="space-y-4">
        {filteredBrokers.map((broker) => (
          <div 
            key={broker.id} 
            className={`p-4 border rounded-lg ${selectedBroker === broker.id ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200'}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{broker.name}</h3>
                <p className="text-sm text-gray-600">Rating: {broker.rating} | Experience: {broker.experience}</p>
                <p className="text-sm text-gray-600">Areas: {broker.areas.join(', ')}</p>
              </div>
              <div className="flex items-center">
                {broker.available ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircleIcon />
                    Available
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <XCircleIcon />
                    Busy
                  </span>
                )}
              </div>
            </div>
            <div className="mt-3 flex justify-end">
              <button
                onClick={() => handleAssign(broker.id)}
                disabled={!broker.available || selectedBroker !== null}
                className={`px-3 py-1 text-sm rounded-md ${broker.available && !selectedBroker ? 'bg-yellow-500 text-white hover:bg-yellow-600' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
              >
                {selectedBroker === broker.id ? 'Assigned' : 'Assign'}
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {selectedBroker && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center">
            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
            <p className="text-green-800">Broker assigned successfully!</p>
          </div>
        </div>
      )}
    </div>
  );
}
