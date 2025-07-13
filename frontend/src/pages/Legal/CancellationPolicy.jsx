import React from 'react';
import { Link } from 'react-router-dom';

const CancellationPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <Link to="/" className="text-blue-600 hover:underline mb-4 inline-block">
              ← Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Cancellation Policy</h1>
            <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Overview</h2>
              <div className="space-y-4 text-gray-700">
                <p>This cancellation policy outlines the terms and conditions for cancelling bookings on FinDoorz. The policy is designed to be fair to both property owners and tenants while ensuring smooth operations.</p>
                <p>All cancellations are subject to this policy and the specific terms of individual property listings.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Cancellation by Tenant</h2>
              <div className="space-y-4 text-gray-700">
                <p><strong>Cancellation Timeframes and Refunds:</strong></p>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-3">Standard Cancellation Policy</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span><strong>7+ days before check-in:</strong></span>
                      <span className="text-green-600">100% refund</span>
                    </div>
                    <div className="flex justify-between">
                      <span><strong>3-7 days before check-in:</strong></span>
                      <span className="text-yellow-600">50% refund</span>
                    </div>
                    <div className="flex justify-between">
                      <span><strong>Less than 3 days before check-in:</strong></span>
                      <span className="text-red-600">No refund</span>
                    </div>
                    <div className="flex justify-between">
                      <span><strong>No-show or late arrival:</strong></span>
                      <span className="text-red-600">No refund</span>
                    </div>
                  </div>
                </div>
                
                <p><strong>How to Cancel:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Log into your FinDoorz account</li>
                  <li>Go to "My Bookings" section</li>
                  <li>Select the booking you want to cancel</li>
                  <li>Click "Cancel Booking" and provide reason</li>
                  <li>Confirm cancellation</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Cancellation by Property Owner</h2>
              <div className="space-y-4 text-gray-700">
                <p><strong>Owner Cancellation Policy:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Owners must provide at least 7 days notice for cancellations</li>
                  <li>Full refund to tenant for owner cancellations</li>
                  <li>Owner may be charged a cancellation fee</li>
                  <li>Repeated cancellations may result in account suspension</li>
                </ul>
                
                <p><strong>Valid Reasons for Owner Cancellation:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Property damage or maintenance issues</li>
                  <li>Personal emergency affecting property availability</li>
                  <li>Legal or regulatory requirements</li>
                  <li>Natural disasters or force majeure events</li>
                </ul>
                
                <p><strong>Invalid Reasons (may result in penalties):</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Found a better-paying tenant</li>
                  <li>Change of mind</li>
                  <li>Personal convenience</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Special Circumstances</h2>
              <div className="space-y-4 text-gray-700">
                <p><strong>Force Majeure Events:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Natural disasters (floods, earthquakes, etc.)</li>
                  <li>Government restrictions or lockdowns</li>
                  <li>War, civil unrest, or terrorism</li>
                  <li>Pandemics or health emergencies</li>
                </ul>
                <p>In such cases, full refunds are provided regardless of cancellation timing.</p>
                
                <p><strong>Medical Emergencies:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Requires medical documentation</li>
                  <li>Case-by-case consideration</li>
                  <li>May offer partial refunds or rescheduling</li>
                </ul>
                
                <p><strong>Technical Issues:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Platform errors or payment processing issues</li>
                  <li>Full refunds provided</li>
                  <li>No cancellation fees</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Cancellation Fees</h2>
              <div className="space-y-4 text-gray-700">
                <p><strong>Tenant Cancellation Fees:</strong></p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Processing fee (all cancellations):</span>
                      <span>₹100</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Late cancellation fee (3-7 days):</span>
                      <span>₹500</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Very late cancellation (less than 3 days):</span>
                      <span>₹1000</span>
                    </div>
                  </div>
                </div>
                
                <p><strong>Owner Cancellation Fees:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>First cancellation: ₹500</li>
                  <li>Subsequent cancellations: ₹1000 each</li>
                  <li>Repeated cancellations may result in higher fees</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Refund Processing</h2>
              <div className="space-y-4 text-gray-700">
                <p><strong>Refund Timeline:</strong></p>
                <ol className="list-decimal pl-6 space-y-2">
                  <li><strong>Cancellation Confirmation:</strong> Immediate</li>
                  <li><strong>Refund Processing:</strong> 2-3 business days</li>
                  <li><strong>Bank Processing:</strong> 3-5 business days</li>
                  <li><strong>Total Time:</strong> 5-8 business days</li>
                </ol>
                
                <p><strong>Refund Method:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Refunds are processed to the original payment method</li>
                  <li>Credit/debit cards: 5-10 business days</li>
                  <li>UPI: 24-48 hours</li>
                  <li>Net banking: 3-5 business days</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Rescheduling</h2>
              <div className="space-y-4 text-gray-700">
                <p><strong>Rescheduling Options:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Available up to 7 days before check-in</li>
                  <li>Subject to property availability</li>
                  <li>No additional fees for rescheduling</li>
                  <li>Must be within 6 months of original booking</li>
                </ul>
                
                <p><strong>Rescheduling Process:</strong></p>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Contact property owner for availability</li>
                  <li>Submit rescheduling request through platform</li>
                  <li>Owner approves or suggests alternative dates</li>
                  <li>Booking is updated with new dates</li>
                </ol>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Dispute Resolution</h2>
              <div className="space-y-4 text-gray-700">
                <p>If you disagree with a cancellation decision:</p>
                <ol className="list-decimal pl-6 space-y-2">
                  <li><strong>Contact Support:</strong> Email us with details</li>
                  <li><strong>Provide Documentation:</strong> Submit relevant evidence</li>
                  <li><strong>Review Process:</strong> We investigate within 3-5 days</li>
                  <li><strong>Resolution:</strong> We provide a decision and explanation</li>
                  <li><strong>Appeal:</strong> If unsatisfied, request further review</li>
                </ol>
                <p>We aim to resolve all disputes fairly and promptly.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Long-term Bookings</h2>
              <div className="space-y-4 text-gray-700">
                <p><strong>Monthly/Yearly Rentals:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>30-day notice required for cancellation</li>
                  <li>Pro-rated refunds for unused periods</li>
                  <li>Security deposit handled separately</li>
                  <li>May require written notice</li>
                </ul>
                
                <p><strong>Security Deposits:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Returned within 15 days of check-out</li>
                  <li>Deductions for damages or outstanding charges</li>
                  <li>Detailed breakdown provided for any deductions</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contact Information</h2>
              <div className="space-y-4 text-gray-700">
                <p>For cancellation-related inquiries:</p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p><strong>Email:</strong> <a href="mailto:cancellations@findoorz.com" className="text-blue-600 hover:underline">cancellations@findoorz.com</a></p>
                  <p><strong>Phone:</strong> +91-XXXXXXXXXX</p>
                  <p><strong>Support Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM IST</p>
                  <p><strong>Emergency:</strong> +91-XXXXXXXXXX (24/7 for urgent matters)</p>
                  <p><strong>Address:</strong> [Your Business Address]</p>
                </div>
                <p><em>Please include your booking ID when contacting us about cancellations.</em></p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Policy Updates</h2>
              <div className="space-y-4 text-gray-700">
                <p>We may update this cancellation policy from time to time. Changes will be effective immediately upon posting on our website.</p>
                <p>For existing bookings, the policy in effect at the time of booking will apply.</p>
                <p>We will notify users of significant changes via email or platform notification.</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancellationPolicy; 