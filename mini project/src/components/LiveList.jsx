import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import '../styles/LiveList.css';

const LiveList = () => {
  const [orders, setOrders] = useState([]);
  const [editingOrder, setEditingOrder] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    const savedOrders = JSON.parse(localStorage.getItem('laundryOrders') || '[]');
    // Filter for today's orders
    const today = new Date().toDateString();
    const todayOrders = savedOrders.filter(order => 
      new Date(order.timestamp).toDateString() === today
    );
    setOrders(todayOrders);
  };

  const handleEdit = (order) => {
    setEditingOrder({ ...order });
  };

  const handleSave = () => {
    if (!editingOrder) return;

    const allOrders = JSON.parse(localStorage.getItem('laundryOrders') || '[]');
    const updatedOrders = allOrders.map(order => 
      order.id === editingOrder.id ? editingOrder : order
    );

    localStorage.setItem('laundryOrders', JSON.stringify(updatedOrders));
    loadOrders();
    setEditingOrder(null);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(orders);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laundry Orders");
    XLSX.writeFile(workbook, `LaundryOrders_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="live-list">
      <h2>Today's Orders</h2>
      <button onClick={exportToExcel}>Export to Excel</button>
      
      <table>
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Phone</th>
            <th>Hostel</th>
            <th>Room</th>
            <th>Items</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              {editingOrder?.id === order.id ? (
                <>
                  <td>
                    <input
                      value={editingOrder.studentName}
                      onChange={e => setEditingOrder({
                        ...editingOrder,
                        studentName: e.target.value
                      })}
                    />
                  </td>
                  <td>
                    <input
                      value={editingOrder.phoneNumber}
                      onChange={e => setEditingOrder({
                        ...editingOrder,
                        phoneNumber: e.target.value
                      })}
                    />
                  </td>
                  <td>
                    <input
                      value={editingOrder.hostel}
                      onChange={e => setEditingOrder({
                        ...editingOrder,
                        hostel: e.target.value
                      })}
                    />
                  </td>
                  <td>
                    <input
                      value={editingOrder.roomNumber}
                      onChange={e => setEditingOrder({
                        ...editingOrder,
                        roomNumber: e.target.value
                      })}
                    />
                  </td>
                  <td>
                    {Object.entries(editingOrder.clothes).map(([item, quantity]) => (
                      quantity > 0 && <div key={item}>{item}: {quantity}</div>
                    ))}
                  </td>
                  <td>₹{editingOrder.total}</td>
                  <td>
                    <button onClick={handleSave}>Save</button>
                    <button onClick={() => setEditingOrder(null)}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{order.studentName}</td>
                  <td>{order.phoneNumber}</td>
                  <td>{order.hostel}</td>
                  <td>{order.roomNumber}</td>
                  <td>
                    {Object.entries(order.clothes).map(([item, quantity]) => (
                      quantity > 0 && <div key={item}>{item}: {quantity}</div>
                    ))}
                  </td>
                  <td>₹{order.total}</td>
                  <td>
                    <button onClick={() => handleEdit(order)}>Edit</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LiveList;