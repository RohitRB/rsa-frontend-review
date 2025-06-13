import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Shield, Users, AlertTriangle, Check, FileText } from 'lucide-react';
import Layout from '../components/Layout';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPolicies: 0,
    activePolicies: 0,
    expiringPolicies: 0,
    expiredPolicies: 0,
    totalCustomers: 0,
    recentPolicies: []
  });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('/api/dashboard');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout title="Dashboard" subtitle="Overview of your RSA business">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Policies"
          value={stats.totalPolicies}
          icon={<Shield size={24} />}
          color="bg-blue-500"
        />
        <StatCard 
          title="Active Policies"
          value={stats.activePolicies}
          icon={<Check size={24} />}
          color="bg-green-500"
        />
        <StatCard 
          title="Expiring Soon"
          value={stats.expiringPolicies}
          icon={<AlertTriangle size={24} />}
          color="bg-yellow-500"
        />
        <StatCard 
          title="Total Customers"
          value={stats.totalCustomers}
          icon={<Users size={24} />}
          color="bg-purple-500"
        />
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Recent Policies</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 uppercase">
              <tr>
                <th className="px-6 py-3">Policy ID</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Vehicle</th>
                <th className="px-6 py-3">Start Date</th>
                <th className="px-6 py-3">Expiry Date</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {stats.recentPolicies.length > 0 ? (
                stats.recentPolicies.map((policy) => (
                  <tr key={policy._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{policy.policyId}</td>
                    <td className="px-6 py-4">{policy.customerName}</td>
                    <td className="px-6 py-4">{policy.vehicleNumber}</td>
                    <td className="px-6 py-4">{new Date(policy.startDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4">{new Date(policy.expiryDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`status-badge ${
                        policy.status === 'Active' ? 'status-active' : 
                        policy.status === 'Expired' ? 'status-expired' : 'status-expiring'
                      }`}>
                        {policy.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No recent policies found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <Link to="/policies" className="text-primary hover:text-primary-dark font-medium">
            View all policies
          </Link>
        </div>
      </div>
    </Layout>
  );
};

const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex">
      <div className={`${color} text-white p-4 rounded-lg mr-4`}>
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{value}</h3>
        <p className="text-gray-500">{title}</p>
      </div>
    </div>
  );
};

export default Dashboard;