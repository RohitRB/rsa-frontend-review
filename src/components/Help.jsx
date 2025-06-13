import React from 'react';
import Header from './Header';


const Help = () => {
  return (
    <div>
      <Header />
    <div className="min-h-screen bg-gray-100 p-8">
    
      {/* Top Heading */}
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Help & Documentation</h1>

      {/* Getting Started */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Getting Started</h2>
        <p className="text-sm text-gray-700 mb-4">
          Welcome to the RSA Policy Manager plugin for WordPress. This plugin helps you manage Road Side Assistance policies for your automotive business.
        </p>
        <h3 className="text-sm font-semibold mb-2">Quick Start Guide:</h3>
        <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
          <li>Configure your business details in the <strong>Settings</strong> tab</li>
          <li>Set up your policy pricing and options</li>
          <li>Use shortcodes to add policy forms to your pages</li>
          <li>Start managing your RSA policies!</li>
        </ol>
      </div>

      {/* FAQs */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Frequently Asked Questions</h2>

        <div className="space-y-4 text-sm text-gray-700">
          <div>
            <strong>How do I add a policy purchase form to my page?</strong>
            <p>Use the shortcode <code>[rsa_policy_form]</code> on any page or post where you want the form to appear.</p>
          </div>

          <div>
            <strong>Can I customize the email notifications?</strong>
            <p>Yes, you can customize all email templates in the Settings tab under Email Notification Settings.</p>
          </div>

          <div>
            <strong>How do I export policy data?</strong>
            <p>In the Policies tab, click on the "Export" button to download your policy data as a CSV file.</p>
          </div>

          <div>
            <strong>Is payment gateway integration available?</strong>
            <p>
              Yes, the plugin supports integration with popular payment gateways like Razorpay, PayU, and PayTM. Configure these in the Settings tab.
            </p>
          </div>
        </div>
      </div>

      {/* Support Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Need More Help?</h2>
        <p className="text-sm text-gray-700 mb-4">
          If you need additional assistance with the RSA Policy Manager plugin, please contact our support team.
        </p>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700">Documentation</button>
          <button className="px-4 py-2 border border-gray-300 text-sm rounded hover:bg-gray-100">Contact Support</button>
        </div>
      </div>
    </div>
    </div>
  );
};


export default Help;