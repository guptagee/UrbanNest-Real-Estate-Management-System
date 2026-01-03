import React from 'react';
import { FiShield, FiLock, FiFileText } from 'react-icons/fi';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          <div className="space-y-8 text-gray-700">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiShield className="text-primary-600" />
                1. Information We Collect
              </h2>
              <p className="mb-4">
                We collect information you provide directly to us when you register, search for properties, or communicate with agents. This includes:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Personal identification information (Name, email address, phone number)</li>
                <li>Property preferences and search history</li>
                <li>Communication history with agents and other users</li>
                <li>Usage data and device information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiLock className="text-primary-600" />
                2. How We Use Your Information
              </h2>
              <p className="mb-4">
                We use the information we collect to provide, maintain, and improve our services, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Facilitating property bookings and inquiries</li>
                <li>Personalizing your experience and property recommendations</li>
                <li>Sending administrative information and updates</li>
                <li>Detecting and preventing fraud</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiFileText className="text-primary-600" />
                3. Information Sharing
              </h2>
              <p className="mb-4">
                We do not sell your personal data. We may share your information with:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Real estate agents and property owners when you make an inquiry</li>
                <li>Service providers who assist our operations</li>
                <li>Law enforcement when required by law</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">4. Data Security</h2>
              <p className="mb-4">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no internet transmission is completely secure.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">5. Your Rights</h2>
              <p className="mb-4">
                You have the right to access, correct, or delete your personal information. You can manage your profile settings directly through your account dashboard or contact us for assistance.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">6. Contact Us</h2>
              <p className="mb-4">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold">Urbannest Support</p>
                <p>Email: support@urbannest.com</p>
                <p>Address: 150 Feet Ring Road, Rajkot, Gujarat, India 360005</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;

