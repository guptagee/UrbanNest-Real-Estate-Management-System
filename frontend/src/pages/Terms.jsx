import React from 'react';
import { FiCheckCircle, FiAlertCircle, FiInfo } from 'react-icons/fi';

const Terms = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Terms & Conditions</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Please read these terms carefully before using our platform.
            </p>
          </div>

          <div className="space-y-8 text-gray-700">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiInfo className="text-primary-600" />
                1. Introduction
              </h2>
              <p className="mb-4">
                Welcome to Urbannest. By accessing or using our website, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree with any part of these terms, you must not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiCheckCircle className="text-primary-600" />
                2. User Accounts
              </h2>
              <p className="mb-4">
                To access certain features, you may be required to create an account. You agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Accept responsibility for all activities that occur under your account</li>
                <li>Notify us immediately of any unauthorized use</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiAlertCircle className="text-primary-600" />
                3. Acceptable Use
              </h2>
              <p className="mb-4">
                You agree not to misuse the platform. Prohibited activities include:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Posting false or misleading property information</li>
                <li>Attempting to bypass security measures</li>
                <li>Scraping or collecting data without permission</li>
                <li>Harassing other users or agents</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">4. Property Listings</h2>
              <p className="mb-4">
                Urbannest acts as a platform for connecting buyers, sellers, and agents. We do not own or manage the properties listed unless explicitly stated. We are not responsible for the accuracy of user-generated content, although we strive to verify listings.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">5. Limitation of Liability</h2>
              <p className="mb-4">
                To the fullest extent permitted by law, Urbannest shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">6. Changes to Terms</h2>
              <p className="mb-4">
                We reserve the right to modify these terms at any time. We will notify users of any significant changes. Your continued use of the platform constitutes acceptance of the modified terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">7. Contact Information</h2>
              <p className="mb-4">
                For any questions regarding these Terms & Conditions, please contact us at <a href="mailto:support@urbannest.com" className="text-primary-600 hover:underline">support@urbannest.com</a>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;

