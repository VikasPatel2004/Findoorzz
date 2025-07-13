import React from 'react';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <Link to="/" className="text-blue-600 hover:underline mb-4 inline-block">
              ← Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Terms of Service</h1>
            <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <div className="space-y-4 text-gray-700">
                <p>By accessing and using FinDoorz ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.</p>
                <p>These Terms of Service ("Terms") govern your use of our website and services. By using our platform, you agree to these terms in full.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
              <div className="space-y-4 text-gray-700">
                <p>FinDoorz is a property rental platform that connects:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Property Owners/Landlords:</strong> Who list their properties for rent</li>
                  <li><strong>Tenants/Renters:</strong> Who search and book properties</li>
                  <li><strong>Brokers:</strong> Who facilitate property transactions</li>
                </ul>
                <p>Our services include property listings, booking management, payment processing, and related support services.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts and Registration</h2>
              <div className="space-y-4 text-gray-700">
                <p><strong>Account Creation:</strong> To use certain features, you must create an account. You agree to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain and update your account information</li>
                  <li>Keep your password secure and confidential</li>
                  <li>Accept responsibility for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized use</li>
                </ul>
                <p><strong>Account Termination:</strong> We reserve the right to terminate accounts that violate these terms or engage in fraudulent activities.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Property Listings and Bookings</h2>
              <div className="space-y-4 text-gray-700">
                <p><strong>Property Listings:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>All property information must be accurate and up-to-date</li>
                  <li>Property owners are responsible for maintaining listing accuracy</li>
                  <li>We reserve the right to remove or modify listings that violate our policies</li>
                  <li>Photos and descriptions must represent the actual property</li>
                </ul>
                
                <p><strong>Bookings:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Bookings are subject to availability and owner approval</li>
                  <li>Payment must be completed to confirm bookings</li>
                  <li>Cancellation policies apply as specified in individual listings</li>
                  <li>We are not responsible for disputes between users</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Payment Terms</h2>
              <div className="space-y-4 text-gray-700">
                <p><strong>Payment Processing:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>All payments are processed securely through Razorpay</li>
                  <li>Payment amounts are displayed in Indian Rupees (INR)</li>
                  <li>Additional charges may apply for certain services</li>
                  <li>Payment confirmation will be sent via email</li>
                </ul>
                
                <p><strong>Refunds:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Refunds are processed according to our refund policy</li>
                  <li>Processing time may take 5-7 business days</li>
                  <li>Refunds are subject to terms and conditions</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. User Conduct</h2>
              <div className="space-y-4 text-gray-700">
                <p>You agree not to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Use the platform for any illegal or unauthorized purpose</li>
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe on intellectual property rights</li>
                  <li>Harass, abuse, or harm other users</li>
                  <li>Provide false or misleading information</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Interfere with the platform's operation</li>
                  <li>Use automated systems to access the platform</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Intellectual Property</h2>
              <div className="space-y-4 text-gray-700">
                <p><strong>Our Rights:</strong> The platform and its content are owned by FinDoorz and protected by copyright, trademark, and other intellectual property laws.</p>
                <p><strong>Your Rights:</strong> You retain ownership of content you submit, but grant us a license to use it for platform operations.</p>
                <p><strong>Restrictions:</strong> You may not copy, modify, distribute, or create derivative works without our permission.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Privacy and Data Protection</h2>
              <div className="space-y-4 text-gray-700">
                <p>Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference.</p>
                <p>By using our platform, you consent to the collection and use of your information as described in our Privacy Policy.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Disclaimers and Limitations</h2>
              <div className="space-y-4 text-gray-700">
                <p><strong>Service Availability:</strong> We strive to maintain platform availability but do not guarantee uninterrupted access.</p>
                <p><strong>Property Information:</strong> We do not verify all property information and are not responsible for inaccuracies.</p>
                <p><strong>User Disputes:</strong> We are not responsible for disputes between users and do not provide legal advice.</p>
                <p><strong>Limitation of Liability:</strong> Our liability is limited to the amount paid for our services in the 12 months preceding the claim.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Indemnification</h2>
              <div className="space-y-4 text-gray-700">
                <p>You agree to indemnify and hold harmless FinDoorz, its officers, directors, employees, and agents from any claims, damages, or expenses arising from:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Your use of the platform</li>
                  <li>Your violation of these terms</li>
                  <li>Your violation of any third-party rights</li>
                  <li>Any content you submit</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Termination</h2>
              <div className="space-y-4 text-gray-700">
                <p>We may terminate or suspend your account and access to the platform at any time, with or without cause, with or without notice.</p>
                <p>Upon termination, your right to use the platform ceases immediately, and we may delete your account and data.</p>
                <p>Provisions that should survive termination include those relating to intellectual property, disclaimers, indemnification, and limitations of liability.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Governing Law</h2>
              <div className="space-y-4 text-gray-700">
                <p>These Terms are governed by and construed in accordance with the laws of India. Any disputes arising from these terms or your use of the platform will be subject to the exclusive jurisdiction of the courts in [Your City], India.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Changes to Terms</h2>
              <div className="space-y-4 text-gray-700">
                <p>We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting on the platform.</p>
                <p>Your continued use of the platform after changes constitutes acceptance of the modified terms.</p>
                <p>We will notify users of material changes via email or platform notification.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Contact Information</h2>
              <div className="space-y-4 text-gray-700">
                <p>If you have any questions about these Terms of Service, please contact us:</p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p><strong>Email:</strong> <a href="mailto:legal@findoorz.com" className="text-blue-600 hover:underline">legal@findoorz.com</a></p>
                  <p><strong>Phone:</strong> +91-XXXXXXXXXX</p>
                  <p><strong>Address:</strong> [Your Business Address]</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService; 