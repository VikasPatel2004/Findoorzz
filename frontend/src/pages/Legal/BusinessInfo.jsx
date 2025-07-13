import React from 'react';
import { Link } from 'react-router-dom';

const BusinessInfo = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <Link to="/" className="text-blue-600 hover:underline mb-4 inline-block">
              ← Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Business Information</h1>
            <p className="text-gray-600">FinDoorz - Your Trusted Property Rental Platform</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Company Details */}
            <div className="space-y-6">
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Company Details</h2>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div>
                    <span className="font-medium text-gray-700">Company Name:</span>
                    <p className="text-gray-900">FinDoorz Private Limited</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Legal Entity:</span>
                    <p className="text-gray-900">Private Limited Company</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">GST Number:</span>
                    <p className="text-gray-900">[Your GST Number]</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">PAN Number:</span>
                    <p className="text-gray-900">[Your PAN Number]</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Registration Date:</span>
                    <p className="text-gray-900">[Registration Date]</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div>
                    <span className="font-medium text-gray-700">Email:</span>
                    <p className="text-gray-900">
                      <a href="mailto:info@findoorz.com" className="text-blue-600 hover:underline">
                        info@findoorz.com
                      </a>
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Phone:</span>
                    <p className="text-gray-900">+91-XXXXXXXXXX</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Support Email:</span>
                    <p className="text-gray-900">
                      <a href="mailto:support@findoorz.com" className="text-blue-600 hover:underline">
                        support@findoorz.com
                      </a>
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Business Hours:</span>
                    <p className="text-gray-900">Monday - Friday: 9:00 AM - 6:00 PM IST</p>
                  </div>
                </div>
              </section>
            </div>

            {/* Address & Additional Info */}
            <div className="space-y-6">
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Registered Address</h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-900">
                    [Your Business Address Line 1]<br />
                    [Your Business Address Line 2]<br />
                    [City], [State] - [PIN Code]<br />
                    India
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Business Description</h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 leading-relaxed">
                    FinDoorz is a comprehensive property rental platform that connects property owners, 
                    tenants, and brokers. We facilitate secure property listings, bookings, and payments 
                    through our integrated platform, making the rental process seamless and trustworthy 
                    for all parties involved.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Services Offered</h2>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <ul className="list-disc pl-6 space-y-1 text-gray-700">
                    <li>Property listing and management</li>
                    <li>Secure payment processing</li>
                    <li>Booking management</li>
                    <li>User verification services</li>
                    <li>Customer support</li>
                    <li>Document management</li>
                  </ul>
                </div>
              </section>
            </div>
          </div>

          {/* Compliance & Certifications */}
          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Compliance & Certifications</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Payment Security</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• PCI DSS Compliant</li>
                  <li>• Razorpay Integration</li>
                  <li>• SSL Encryption</li>
                  <li>• Secure Data Handling</li>
                </ul>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-2">Legal Compliance</h3>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• GST Registered</li>
                  <li>• Company Act Compliance</li>
                  <li>• Data Protection</li>
                  <li>• Consumer Protection</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Team Information */}
          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Key Personnel</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-white font-semibold">CEO</span>
                </div>
                <h3 className="font-semibold text-gray-900">[CEO Name]</h3>
                <p className="text-gray-600 text-sm">Chief Executive Officer</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-white font-semibold">CTO</span>
                </div>
                <h3 className="font-semibold text-gray-900">[CTO Name]</h3>
                <p className="text-gray-600 text-sm">Chief Technology Officer</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-white font-semibold">CFO</span>
                </div>
                <h3 className="font-semibold text-gray-900">[CFO Name]</h3>
                <p className="text-gray-600 text-sm">Chief Financial Officer</p>
              </div>
            </div>
          </section>

          {/* Contact Form */}
          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-4">
                For business inquiries, partnerships, or verification requests, please contact us:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">General Inquiries</h4>
                  <p className="text-gray-600">Email: info@findoorz.com</p>
                  <p className="text-gray-600">Phone: +91-XXXXXXXXXX</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Support</h4>
                  <p className="text-gray-600">Email: support@findoorz.com</p>
                  <p className="text-gray-600">Phone: +91-XXXXXXXXXX</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default BusinessInfo; 