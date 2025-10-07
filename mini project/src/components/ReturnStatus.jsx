import React, { useState, useEffect } from 'react';
import '../styles/ReturnStatus.css';

const ReturnStatus = () => {
  const [washedOrders, setWashedOrders] = useState([]);

  useEffect(() => {
    loadWashedOrders();
  }, []);

  const loadWashedOrders = () => {
    const allOrders = JSON.parse(localStorage.getItem('laundryOrders') || '[]');
    const washed = allOrders.filter(order => order.status === 'washed');
    setWashedOrders(washed);
  };

  const markAsReturned = (orderId) => {
    const allOrders = JSON.parse(localStorage.getItem('laundryOrders') || '[]');
    const updatedOrders = allOrders.map(order => 
      order.id === orderId 
        ? { ...order, status: 'completed', returnedAt: new Date().toISOString() }
        : order
    );

    localStorage.setItem('laundryOrders', JSON.stringify(updatedOrders));
    loadWashedOrders();
  };

  return (
    <div className="return-status">
      <h2>Washed Clothes Ready for Return</h2>
      <table>
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Hostel</th>
            <th>Room</th>
            <th>Items</th>
            <th>Washed Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {washedOrders.map(order => (
            <tr key={order.id}>
              <td>{order.studentName}</td>
              <td>{order.hostel}</td>
              <td>{order.roomNumber}</td>
              <td>
                {Object.entries(order.clothes).map(([item, quantity]) => (
                  quantity > 0 && <div key={item}>{item}: {quantity}</div>
                ))}
              </td>
              <td>{new Date(order.washedAt).toLocaleDateString()}</td>
              <td>
                <button onClick={() => markAsReturned(order.id)}>Mark as Returned</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReturnStatus;