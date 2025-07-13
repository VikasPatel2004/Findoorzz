import React from 'react';
import { Link } from 'react-router-dom';

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <Link to="/" className="text-blue-600 hover:underline mb-4 inline-block">
              ← Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Refund Policy</h1>
            <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Overview</h2>
              <div className="space-y-4 text-gray-700">
                <p>At FinDoorz, we strive to provide excellent service and ensure customer satisfaction. This refund policy outlines the circumstances under which refunds may be issued and the process for requesting them.</p>
                <p>All refunds are processed in accordance with this policy and applicable laws.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Refund Eligibility</h2>
              <div className="space-y-4 text-gray-700">
                <p><strong>Eligible for Refund:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Property not available as advertised</li>
                  <li>Significant property damage or safety issues</li>
                  <li>Owner cancellation without valid reason</li>
                  <li>Technical errors in payment processing</li>
                  <li>Duplicate payments</li>
                  <li>Unauthorized transactions</li>
                </ul>
                
                <p><strong>Not Eligible for Refund:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Change of mind after booking confirmation</li>
                  <li>Personal circumstances preventing stay</li>
                  <li>Minor property issues that don't affect habitability</li>
                  <li>Late arrival or no-show</li>
                  <li>Violation of property rules leading to eviction</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Refund Process</h2>
              <div className="space-y-4 text-gray-700">
                <p><strong>Step 1: Request Submission</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Submit refund request through our platform or email</li>
                  <li>Include booking details and reason for refund</li>
                  <li>Provide supporting documentation if required</li>
                </ul>
                
                <p><strong>Step 2: Review Process</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>We review your request within 2-3 business days</li>
                  <li>May request additional information or documentation</li>
                  <li>Contact property owner for verification if needed</li>
                </ul>
                
                <p><strong>Step 3: Refund Processing</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Approved refunds are processed within 5-7 business days</li>
                  <li>Refund is issued to the original payment method</li>
                  <li>You receive confirmation email with refund details</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Refund Amounts</h2>
              <div className="space-y-4 text-gray-700">
                <p><strong>Full Refund:</strong> Issued for:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Property not available as advertised</li>
                  <li>Significant safety or habitability issues</li>
                  <li>Owner cancellation</li>
                  <li>Technical errors or duplicate payments</li>
                </ul>
                
                <p><strong>Partial Refund:</strong> May be issued for:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Minor issues that partially affect the stay</li>
                  <li>Early termination with valid reason</li>
                  <li>Service fee adjustments</li>
                </ul>
                
                <p><strong>No Refund:</strong> For:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Change of mind after confirmation</li>
                  <li>Personal circumstances</li>
                  <li>Rule violations</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Processing Time</h2>
              <div className="space-y-4 text-gray-700">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p><strong>Request Review:</strong> 2-3 business days</p>
                  <p><strong>Refund Processing:</strong> 5-7 business days</p>
                  <p><strong>Bank Processing:</strong> 3-5 business days (varies by bank)</p>
                  <p><strong>Total Time:</strong> 10-15 business days</p>
                </div>
                <p><em>Note: Processing times may vary during peak periods or holidays.</em></p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Payment Method Refunds</h2>
              <div className="space-y-4 text-gray-700">
                <p><strong>Credit/Debit Cards:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Refunded to the original card</li>
                  <li>May take 5-10 business days to appear</li>
                  <li>Contact your bank if not received within 10 days</li>
                </ul>
                
                <p><strong>UPI Payments:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Refunded to the original UPI ID</li>
                  <li>Usually processed within 24-48 hours</li>
                  <li>Check your UPI app for confirmation</li>
                </ul>
                
                <p><strong>Net Banking:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Refunded to the original bank account</li>
                  <li>Processing time varies by bank</li>
                  <li>Check your bank statement for confirmation</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Service Fees</h2>
              <div className="space-y-4 text-gray-700">
                <p><strong>Platform Service Fees:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Service fees are generally non-refundable</li>
                  <li>May be refunded in case of platform errors</li>
                  <li>Processing fees charged by payment gateways are non-refundable</li>
                </ul>
                
                <p><strong>Broker Fees:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Broker fees are subject to individual broker policies</li>
                  <li>Contact the broker directly for refund inquiries</li>
                  <li>We facilitate communication but don't control broker refunds</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Dispute Resolution</h2>
              <div className="space-y-4 text-gray-700">
                <p>If you disagree with our refund decision:</p>
                <ol className="list-decimal pl-6 space-y-2">
                  <li><strong>Contact Support:</strong> Email us with additional details</li>
                  <li><strong>Escalation:</strong> Request review by senior team member</li>
                  <li><strong>Mediation:</strong> We may suggest third-party mediation</li>
                  <li><strong>Legal Action:</strong> As a last resort, legal proceedings</li>
                </ol>
                <p>We aim to resolve all disputes amicably and fairly.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Special Circumstances</h2>
              <div className="space-y-4 text-gray-700">
                <p><strong>Natural Disasters:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Full refunds for natural disasters affecting the property</li>
                  <li>No cancellation fees</li>
                  <li>Priority processing for affected bookings</li>
                </ul>
                
                <p><strong>Government Restrictions:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Full refunds for government-imposed travel restrictions</li>
                  <li>Documentation may be required</li>
                  <li>Processing time may be extended</li>
                </ul>
                
                <p><strong>Medical Emergencies:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Case-by-case consideration with medical documentation</li>
                  <li>May offer partial refunds or rescheduling</li>
                  <li>Compassionate handling of genuine emergencies</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contact Information</h2>
              <div className="space-y-4 text-gray-700">
                <p>To request a refund or for refund-related inquiries:</p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p><strong>Email:</strong> <a href="mailto:refunds@findoorz.com" className="text-blue-600 hover:underline">refunds@findoorz.com</a></p>
                  <p><strong>Phone:</strong> +91-XXXXXXXXXX</p>
                  <p><strong>Support Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM IST</p>
                  <p><strong>Address:</strong> [Your Business Address]</p>
                </div>
                <p><em>Please include your booking ID and reason for refund in your communication.</em></p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Policy Updates</h2>
              <div className="space-y-4 text-gray-700">
                <p>We may update this refund policy from time to time. Changes will be effective immediately upon posting on our website.</p>
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

export default RefundPolicy; 