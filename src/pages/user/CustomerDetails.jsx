import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Stepper from '../../components/Stepper';
import { usePolicy } from '../../context/PolicyContext';
import { Link } from 'react-router-dom';

const CustomerDetails = () => {
  const navigate = useNavigate();
  const { currentPolicy, updateCustomerDetails } = usePolicy();

  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    address: '',
    phoneNumber: '',
    city: '',
    vehicleNumber: '',
    termsAccepted: false
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!currentPolicy.policyType) {
      navigate('/');
      return;
    }

    setFormData({
      customerName: currentPolicy.customerName || '',
      email: currentPolicy.email || '',
      address: currentPolicy.address || '',
      phoneNumber: currentPolicy.phoneNumber || '',
      city: currentPolicy.city || '',
      vehicleNumber: currentPolicy.vehicleNumber || '',
      termsAccepted: currentPolicy.termsAccepted || false
    });
  }, [currentPolicy, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.customerName.trim()) newErrors.customerName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    else if (!/^\d{10}$/.test(formData.phoneNumber.replace(/\D/g, '')))
      newErrors.phoneNumber = 'Phone number must be 10 digits';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.vehicleNumber.trim()) newErrors.vehicleNumber = 'Vehicle registration number is required';
    if (!formData.termsAccepted) newErrors.termsAccepted = 'You must accept the terms and conditions';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    updateCustomerDetails(formData);
      navigate('/payment');

    // try {
    //   const res = await fetch('http://localhost:5000/api/customers/create', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //       customerName: formData.customerName,
    //       email: formData.email,
    //       phoneNumber: formData.phoneNumber,
    //       address: formData.address,
    //       city: formData.city,
    //       vehicleNumber: formData.vehicleNumber
    //     })
    //   });

    //   const data = await res.json();
    //   if (!res.ok) throw new Error(data.message || 'Something went wrong while saving customer data.');
    //   navigate('/payment');
    // } catch (error) {
    //   alert(error.message);
    // }
  };

  const handleBack = () => navigate('/');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <Stepper />

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-10">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Customer Details</h1>
          <p className="text-gray-600 mb-6 bg-green-100 p-3 rounded-md text-sm sm:text-base">
            You selected: <span className="font-semibold">{currentPolicy.policyType}</span> - ₹{currentPolicy.amount}
          </p>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="col-span-1 md:col-span-2">
                <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  id="customerName"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-md ${errors.customerName ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.customerName && <p className="text-sm text-red-600">{errors.customerName}</p>}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-md ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.phoneNumber && <p className="text-sm text-red-600">{errors.phoneNumber}</p>}
              </div>

              {/* Address */}
              <div className="col-span-1 md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-md ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.address && <p className="text-sm text-red-600">{errors.address}</p>}
              </div>

              {/* City */}
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-md ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.city && <p className="text-sm text-red-600">{errors.city}</p>}
              </div>

              {/* Vehicle Number */}
              <div>
                <label htmlFor="vehicleNumber" className="block text-sm font-medium text-gray-700 mb-1">Vehicle Registration Number</label>
                <input
                  type="text"
                  id="vehicleNumber"
                  name="vehicleNumber"
                  value={formData.vehicleNumber}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-md ${errors.vehicleNumber ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.vehicleNumber && <p className="text-sm text-red-600">{errors.vehicleNumber}</p>}
              </div>

              {/* Terms Checkbox */}
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="termsAccepted"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleChange}
                    className={`h-5 w-5 mt-1 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ${errors.termsAccepted ? 'border-red-500' : ''}`}
                  />
                  <label htmlFor="termsAccepted" className="ml-2 text-sm text-gray-700">
                    I accept the{' '}
                    <Link to="/terms-and-conditions" className="text-blue-600 underline hover:text-blue-800">
                      Terms and Conditions
                    </Link>
                  </label>
                </div>
                {errors.termsAccepted && <p className="text-sm text-red-600">{errors.termsAccepted}</p>}
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4">
              <button
                type="button"
                onClick={handleBack}
                className="w-full sm:w-auto px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Back
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Proceed to Payment
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CustomerDetails;
