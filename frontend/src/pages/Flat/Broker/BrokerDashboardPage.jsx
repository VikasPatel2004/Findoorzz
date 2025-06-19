import React from 'react';

// Inline SVG Icons
const ChartBarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3v18h18" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h3v3H9z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 8h3v3h-3z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 16h3v3H6z" />
  </svg>
);

const ClipboardListIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h8M8 11h8M8 15h8M4 7h.01M4 11h.01M4 15h.01M4 19h16a2 2 0 002-2V5a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const CashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h18v18H3V3z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9h6v6H9z" />
  </svg>
);

export default function BrokerDashboardPage() {
  // Sample data - in a real app, this would come from your backend
  const stats = [
    { name: 'Total Deals', value: '16', icon: ClipboardListIcon },
    { name: 'Completed Listings', value: '24', icon: CashIcon },
    { name: 'Earnings', value: '₹42,500', icon: CashIcon },
  ];

  const recentActivities = [
    { id: 1, type: 'New Listing', description: '2BHK Flat in Andheri', time: '2 hours ago' },
    { id: 2, type: 'Client Meeting', description: 'With Mr. Sharma at 4 PM', time: 'Today' },
    { id: 3, type: 'Deal Closed', description: 'PG in Bandra for ₹15,000/month', time: 'Yesterday' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900">Broker Dashboard</h1>
        
        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <stat.icon className="h-6 w-6 text-yellow-500" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">{stat.value}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Recent Activities */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg lg:col-span-2">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Activities</h3>
            </div>
            <ul className="divide-y divide-gray-200">
              {recentActivities.map((activity) => (
                <li key={activity.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-yellow-600 truncate">{activity.type}</p>
                      <p className="mt-1 text-sm text-gray-500">{activity.description}</p>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Broker ID Card */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Your Broker ID</h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="border-2 border-yellow-500 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-bold">Findoorz Certified Broker</h4>
                    <p className="text-sm text-gray-500">ID: BROK-2023-0012</p>
                  </div>
                  <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
                    {/* Broker photo would go here */}
                    <div className="w-full h-full bg-yellow-100 flex items-center justify-center">
                      <span className="text-2xl font-bold text-yellow-600">JS</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="font-medium">John Smith</p>
                  <p className="text-sm text-gray-600">Andheri, Bandra, Khar</p>
                  <p className="text-sm text-gray-600">Mobile: 9876543210</p> {/* Added Mobile Number */}
                </div>
                <div className="mt-4 pt-2 border-t border-gray-200">
                  <p className="text-xs text-gray-500">Valid until: 31/12/2023</p>
                  <p className="text-xs text-gray-500">Verified by Findoorz</p>
                </div>
              </div>
              <div className="mt-4 flex justify-center">
                <button className="text-sm font-medium text-yellow-600 hover:text-yellow-500">
                  Download ID Card
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
