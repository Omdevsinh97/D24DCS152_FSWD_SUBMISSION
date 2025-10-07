import React, { useState, useEffect } from 'react';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [monthlyStats, setMonthlyStats] = useState({
    totalEarnings: 0,
    totalClothes: 0
  });

  useEffect(() => {
    calculateMonthlyStats();
  }, []);

  const calculateMonthlyStats = () => {
    const allOrders = JSON.parse(localStorage.getItem('laundryOrders') || '[]');
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyOrders = allOrders.filter(order => {
      const orderDate = new Date(order.timestamp);
      return orderDate.getMonth() === currentMonth && 
             orderDate.getFullYear() === currentYear;
    });

    const earnings = monthlyOrders.reduce((sum, order) => sum + order.total, 0);
    const clothes = monthlyOrders.reduce((sum, order) => {
      return sum + Object.values(order.clothes).reduce((a, b) => a + b, 0);
    }, 0);

    setMonthlyStats({
      totalEarnings: earnings,
      totalClothes: clothes
    });
  };

  return (
    <div className="dashboard">
      <h2>Monthly Dashboard</h2>
      <div className="stats-container">
        <div className="stat-card earnings-card">
          <div className="stat-icon">
            <i className="fas fa-rupee-sign"></i>
          </div>
          <h3>Total Earnings</h3>
          <div className="stat-value">₹{monthlyStats.totalEarnings}</div>
          <div className="stat-label">Revenue from all services</div>
        </div>
        <div className="stat-card clothes-card">
          <div className="stat-icon">
            <i className="fas fa-tshirt"></i>
          </div>
          <h3>Clothes Washed</h3>
          <div className="stat-value">{monthlyStats.totalClothes}</div>
          <div className="stat-label">Total pieces processed</div>
        </div>
        <div className="stat-card pending-card">
          <div className="stat-icon">
            <i className="fas fa-clock"></i>
          </div>
          <h3>Pending Orders</h3>
          <div className="stat-value">12</div>
          <div className="stat-label">Awaiting processing</div>
        </div>
        <div className="stat-card completed-card">
          <div className="stat-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <h3>Completed Orders</h3>
          <div className="stat-value">45</div>
          <div className="stat-label">Successfully delivered</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;