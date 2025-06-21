import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { ArrowUp } from 'lucide-react';
import { format } from 'date-fns';
import axios from 'axios'; // Import axios

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

const AdminDashboard = () => {
  const navigate = useNavigate();
  // Remove usePolicy hook, as we will fetch data directly
  const [dashboardData, setDashboardData] = useState({
    activePolicies: 0,
    totalRevenue: 0,
    expiringSoon: 0,
    recentPolicies: [],
    policyDistribution: { oneYear: 0, twoYear: 0, threeYear: 0 },
    totalPolicies: 0, // Add totalPolicies
    totalCustomers: 0 // Add totalCustomers
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const backendUrl = import.meta.env.VITE_APP_BACKEND_URL || 'http://localhost:5000';
        
        // Fetch main dashboard stats
        const dashboardResponse = await axios.get(`${backendUrl}/api/dashboard`);
        
        // Fetch all policies to calculate revenue and distribution
        const policiesResponse = await axios.get(`${backendUrl}/api/policies`);
        const policies = policiesResponse.data;

        const totalRevenue = policies.reduce((sum, policy) => sum + (policy.amount || 0), 0);
        
        const policyDistribution = {
          oneYear: policies.filter(p => p.duration && p.duration.startsWith('1')).length,
          twoYear: policies.filter(p => p.duration && p.duration.startsWith('2')).length,
          threeYear: policies.filter(p => p.duration && p.duration.startsWith('3')).length,
        };

        setDashboardData({
          ...dashboardResponse.data,
          totalRevenue,
          policyDistribution
        });

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Create data for pie chart
  const chartData = {
    labels: ['1 Year Policies', '2 Year Policies', '3 Year Policies'],
    datasets: [
      {
        data: [
          dashboardData.policyDistribution.oneYear,
          dashboardData.policyDistribution.twoYear,
          dashboardData.policyDistribution.threeYear,
        ],
        backgroundColor: ['#3B82F6', '#10B981', '#F59E0B'],
        borderColor: ['#2563EB', '#059669', '#D97706'],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600">Overview of your RSA business</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Active Policies Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Active Policies</h2>
            <p className="text-3xl font-bold mb-2">{loading ? '...' : dashboardData.activePolicies}</p>
            <p className="text-green-600 flex items-center text-sm">
              <ArrowUp className="h-4 w-4 mr-1" />
              {/* Static text */}
            </p>
          </div>

          {/* Revenue Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Revenue</h2>
            <p className="text-3xl font-bold mb-2">₹{loading ? '...' : dashboardData.totalRevenue.toLocaleString()}</p>
            <p className="text-green-600 flex items-center text-sm">
              <ArrowUp className="h-4 w-4 mr-1" />
              {/* Static text */}
            </p>
          </div>

          {/* Expiring Soon Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Expiring Soon</h2>
            <p className="text-3xl font-bold mb-2">{loading ? '...' : dashboardData.expiringSoon}</p>
            <p className="text-gray-600 text-sm">Policies expiring in 30 days</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Policies Table */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Recent Policies</h2>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vehicle
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {dashboardData.recentPolicies.map((policy, index) => (
                    <tr key={policy._id || index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        {policy.customerName}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {policy.vehicleNumber}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {/* Format startDate which is now a Date object */}
                        {policy.createdAt ? format(new Date(policy.createdAt), 'dd/MM/yyyy') : 'N/A'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${policy.status === 'Active' ? 'bg-green-100 text-green-800' :
                          policy.status === 'Expiring Soon' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'}`}>
                          {policy.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Policy Distribution Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Policy Distribution</h2>

            <div className="h-64">
              <Pie data={chartData} options={chartOptions} />
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-sm text-gray-600">1 Year Policies</p>
                {/* Policy distribution percentages based on counts, not actual percentages */}
                <p className="font-semibold">{dashboardData.policyDistribution.oneYear}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">2 Year Policies</p>
                <p className="font-semibold">{dashboardData.policyDistribution.twoYear}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">3 Year Policies</p>
                <p className="font-semibold">{dashboardData.policyDistribution.threeYear}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
