import React, { useState, useEffect } from 'react';
import '../styles/WashStatus.css';

const WashStatus = () => {
  const [pendingOrders, setPendingOrders] = useState([]);

  useEffect(() => {
    loadPendingOrders();
  }, []);

  const loadPendingOrders = () => {
    const allOrders = JSON.parse(localStorage.getItem('laundryOrders') || '[]');
    const pending = allOrders.filter(order => order.status === 'pending');
    setPendingOrders(pending);
  };

  const markAsWashed = (orderId) => {
    const allOrders = JSON.parse(localStorage.getItem('laundryOrders') || '[]');
    const updatedOrders = allOrders.map(order => 
      order.id === orderId 
        ? { ...order, status: 'washed', washedAt: new Date().toISOString() }
        : order
    );

    localStorage.setItem('laundryOrders', JSON.stringify(updatedOrders));
    loadPendingOrders();
  };

  return (
    <div className="wash-status">
      <div className="wash-status-header">
        <h2>Laundry Status Overview</h2>
        <p>Track and manage all laundry orders</p>
      </div>

      <div className="status-cards">
        <div className="status-card pending-wash">
          <div className="status-icon">
            <i className="fas fa-clock"></i>
          </div>
          <h3>Pending Wash</h3>
          <div className="status-value">{pendingOrders.length}</div>
          <div className="status-label">Orders awaiting wash</div>
        </div>

        <div className="status-card in-progress">
          <div className="status-icon">
            <i className="fas fa-soap"></i>
          </div>
          <h3>In Progress</h3>
          <div className="status-value">5</div>
          <div className="status-label">Currently being washed</div>
        </div>

        <div className="status-card completed">
          <div className="status-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <h3>Completed Today</h3>
          <div className="status-value">8</div>
          <div className="status-label">Ready for pickup</div>
        </div>
      </div>

      <div className="wash-list">
        <h3>Pending Orders</h3>
        <table>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Hostel</th>
              <th>Room</th>
              <th>Items</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingOrders.map(order => (
              <tr key={order.id}>
                <td>{order.studentName}</td>
                <td>{order.hostel}</td>
                <td>{order.roomNumber}</td>
                <td>
                  {Object.entries(order.clothes).map(([item, quantity]) => (
                    quantity > 0 && <div key={item}>{item}: {quantity}</div>
                  ))}
                </td>
                <td>
                  <span className="status-badge pending">Pending</span>
                </td>
                <td>
                  <button className="action-btn wash-btn" onClick={() => markAsWashed(order.id)}>
                    <i className="fas fa-soap"></i> Mark as Washed
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WashStatus;