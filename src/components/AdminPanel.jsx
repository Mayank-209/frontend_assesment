import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Doughnut, Bar } from "react-chartjs-2";
import axios from "axios";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartDataLabels
);

const AdminPanel = () => {
  const baseuri = process.env.REACT_APP_BASE_URL;
  const [dealStats, setDealStats] = useState(null);
  const [userEngagement, setUserEngagement] = useState(null);
  const [topUsers, setTopUsers] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const authUser = JSON.parse(localStorage.getItem("authUser"));
        const token = authUser?.token;

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        };

        const [dealRes, engagementRes, topUsersRes] = await Promise.all([
          axios.get(`${baseuri}/admin/dealstats`, config),
          axios.get(`${baseuri}/admin/userengagement`, config),
          axios.get(`${baseuri}/admin/topusers`, config),
        ]);

        setDealStats(dealRes.data);
        setUserEngagement(engagementRes.data);
        setTopUsers(topUsersRes.data);
      } catch (err) {
        console.error("Error fetching admin stats:", err);
      }
    };

    fetchStats();
  }, []);

  if (!dealStats || !userEngagement || !topUsers) {
    return <div className="p-10 text-center">Loading admin dashboard...</div>;
  }

  const statusCounts = [
    dealStats.pendingDeals,
    dealStats.inProgressDeals,
    dealStats.completedDeals,
    dealStats.cancelledDeals,
  ];

  const totalDeals = statusCounts.reduce((sum, val) => sum + val, 0);

  const statusData = {
    labels: ["Pending", "In Progress", "Completed", "Cancelled"],
    datasets: [
      {
        label: "Deals",
        data: statusCounts,
        backgroundColor: ["#facc15", "#3b82f6", "#22c55e", "#ef4444"],
        borderWidth: 1,
      },
    ],
  };

  const statusOptions = {
    plugins: {
      datalabels: {
        formatter: (value) => {
          const percentage = ((value / totalDeals) * 100).toFixed(1);
          return `${percentage}%`;
        },
        color: "#fff",
        font: {
          weight: "bold",
          size: 14,
        },
      },
      legend: {
        position: "bottom",
      },
    },
  };

  const engagementData = {
    labels: ["Buyers", "Sellers"],
    datasets: [
      {
        label: "Messages Sent",
        data: [userEngagement.buyerMessages, userEngagement.sellerMessages],
        backgroundColor: ["#0ea5e9", "#8b5cf6"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">Admin Dashboard</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-base-100 shadow-md rounded-box p-4">
          <h3 className="text-xl font-semibold mb-2">Deal Status Overview</h3>
          <Doughnut data={statusData} options={statusOptions} />
        </div>

        <div className="bg-base-100 shadow-md rounded-box p-4">
          <h3 className="text-xl font-semibold mb-2">User Engagement</h3>
          <Bar data={engagementData} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-10">
        <div className="bg-base-100 shadow-md rounded-box p-4">
          <h3 className="text-xl font-semibold mb-4">Top Buyers</h3>
          <ul className="space-y-2">
            {topUsers.topBuyers.map((buyer) => (
              <li
                key={buyer.userId}
                className="p-2 border rounded-lg flex justify-between items-center"
              >
                <span>{buyer.name}</span>
                <span className="text-sm text-gray-500">
                  {buyer.dealCount} deals
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-base-100 shadow-md rounded-box p-4">
          <h3 className="text-xl font-semibold mb-4">Top Sellers</h3>
          <ul className="space-y-2">
            {topUsers.topSellers.map((seller) => (
              <li
                key={seller.userId}
                className="p-2 border rounded-lg flex justify-between items-center"
              >
                <span>{seller.name}</span>
                <span className="text-sm text-gray-500">
                  {seller.dealCount} deals
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
