import React from 'react';
import Header from '../components/Header'

const TermsConditions = () => {
  const terms = [
    {
      title: '1) City Tax and Other Charges',
      description:
        'In case the vehicle is being towed from one state to another or from one city to another, any local tax or toll tax, like green tax in Delhi-NCR and etc. has to be borne by the Customer.',
    },
    {
      title: '2) Adverse Weather',
      description:
        'In event of adverse weather conditions such as floods, heavy rain, thunder / lightning or other external factors may affect our ability to provide services and it may become physically impossible to assist you until the weather improves. Our main priority will be to ensure your and your passengers\' safety. Vehicle recovery may be delayed.',
    },
    {
      title: '3) Coverage',
      description:
        'Roadside assistance is a nationwide service provided to mobilize a vehicle disabled due to an unexpected breakdown. Temporary repairs are done, not regular maintenance.',
    },
    {
      title: '4) Program Start Date',
      description:
        'Coverage begins from the program purchase date and is valid from that same date.',
    },
    {
      title: '5) Program End Date',
      description:
        'Coverage under the Roadside Assistance Program shall be valid for 30 days from the program start date mentioned in the certificate.',
    },
    {
      title: '6) Un-located or Unattended Vehicle',
      description:
        'Correct vehicle location must be provided during a breakdown. You or an authorized person must be present at the meeting point. Services cannot be provided if the vehicle is unattended.',
    },
    {
      title: '7) Covered Vehicle is Off-Road',
      description:
        'If the vehicle is off the gazetted road and needs special equipment, the cost of such equipment is not included in the program. Damages during extraction will be the sole responsibility of the Customer.',
    },
    {
      title: '8) Cooling Period',
      description:
        'Benefits under the roadside assistance program become available 30 days after the purchase date.',
    },
    {
      title: '9) External Factors',
      description:
        'Efforts will be made to reach you quickly. However, response time may vary depending on location, traffic, and demand.',
    },
    {
      title: '10) Special Conditions (Applicable to all Coverage)',
      description: `
a) Expenses for parts, extra fuel, and non-standard services are chargeable.\n
b) Certificate is valid from payment realization date or issue date, whichever is later.\n
c) Claims are subject to payment realization.\n
d) This plan is applicable only to private cars.\n
e) Service applies if breakdown occurs at least 2 KM away from the registered address.
      `,
    },
  ];

  return (
    <>
    <Header/>
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Terms & Conditions</h2>
      <div className="space-y-6">
        {terms.map((term, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{term.title}</h3>
            <p className="text-gray-700 whitespace-pre-line">{term.description}</p>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default TermsConditions;
