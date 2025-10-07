import React, { useState, useEffect } from 'react';
import '../styles/PickupForm.css';

const PickupForm = () => {
  const clothingItems = [
    { id: 'tshirt', name: 'T-Shirt', price: 12, icon: 'tshirt' },
    { id: 'shirt', name: 'Shirt', price: 10, icon: 'tshirt' },
    { id: 'jeans', name: 'Jeans', price: 15, icon: 'user' },
    { id: 'pant', name: 'Pant', price: 12, icon: 'user' },
    { id: 'undergarment', name: 'Undergarment', price: 15, icon: 'user' },
    { id: 'bedsheet', name: 'Bedsheet', price: 25, icon: 'bed' },
    { id: 'shoes', name: 'Shoes', price: 170, icon: 'shoe-prints' },
    { id: 'sweater', name: 'Sweater', price: 70, icon: 'tshirt' }
  ];

  const initialState = {
    studentName: '',
    phoneNumber: '',
    hostel: '',
    roomNumber: '',
    clothes: clothingItems.reduce((acc, item) => ({
      ...acc,
      [item.id]: 0
    }), {})
  };

  const [formData, setFormData] = useState(initialState);
  const [total, setTotal] = useState(0);

  const hostels = ['A Block', 'B Block', 'C Block', 'D Block', 'E Block'];

  useEffect(() => {
    calculateTotal();
  }, [formData.clothes]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClothesChange = (item, value) => {
    const numValue = parseInt(value) || 0;
    setFormData(prev => ({
      ...prev,
      clothes: {
        ...prev.clothes,
        [item]: numValue
      }
    }));
  };

  const calculateTotal = () => {
    const totalAmount = clothingItems.reduce((sum, item) => {
      return sum + (item.price * formData.clothes[item.id]);
    }, 0);
    setTotal(totalAmount);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const timestamp = new Date().toISOString();
    const newOrder = {
      ...formData,
      total,
      timestamp,
      status: 'pending',
      id: Date.now()
    };

    // Get existing orders from localStorage
    const existingOrders = JSON.parse(localStorage.getItem('laundryOrders') || '[]');
    
    // Add new order
    const updatedOrders = [...existingOrders, newOrder];
    
    // Save to localStorage
    localStorage.setItem('laundryOrders', JSON.stringify(updatedOrders));

    // Reset form
    setFormData(initialState);
    alert('Order saved successfully!');
  };

  return (
    <div className="pickup-page">
      <div className="page-tabs">
        <button className="tab active">
          <i className="fas fa-shopping-basket"></i> Pickup
        </button>
        <button className="tab">
          <i className="fas fa-exchange-alt"></i> Return
        </button>
      </div>

      <form onSubmit={handleSubmit} className="pickup-form">
        <div className="form-row">
          <div className="form-group">
            <label>Student Name</label>
            <input
              type="text"
              name="studentName"
              value={formData.studentName}
              onChange={handleInputChange}
              required
              placeholder="Enter student name"
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              required
              placeholder="Enter phone number"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Hostel Name</label>
            <select
              name="hostel"
              value={formData.hostel}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Hostel</option>
              {hostels.map(hostel => (
                <option key={hostel} value={hostel}>{hostel}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Hostel Room</label>
            <input
              type="text"
              name="roomNumber"
              value={formData.roomNumber}
              onChange={handleInputChange}
              required
              placeholder="Enter room number"
            />
          </div>
        </div>

        <div className="clothes-selection">
          <h3>Select Clothes</h3>
          <div className="clothes-grid">
            {clothingItems.map((item) => (
              <div key={item.id} className="clothes-item">
                <div className="item-header">
                  <i className={`fas fa-${item.icon}`}></i>
                  <span className="item-name">{item.name}</span>
                  <span className="item-price">₹{item.price}</span>
                </div>
                <div className="item-counter">
                  <button 
                    type="button" 
                    className="counter-btn"
                    onClick={() => handleClothesChange(item.id, Math.max(0, formData.clothes[item.id] - 1))}
                  >
                    <i className="fas fa-minus"></i>
                  </button>
                  <span className="count">{formData.clothes[item.id]}</span>
                  <button 
                    type="button" 
                    className="counter-btn"
                    onClick={() => handleClothesChange(item.id, formData.clothes[item.id] + 1)}
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
                <div className="item-total">
                  Total: ₹{item.price * formData.clothes[item.id]}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="order-summary">
          <div className="summary-row">
            <span>Total Items:</span>
            <span className="summary-value">{Object.values(formData.clothes).reduce((a, b) => a + b, 0)}</span>
          </div>
          <div className="summary-row">
            <span>Total Amount:</span>
            <span className="summary-value">₹{total}</span>
          </div>
        </div>

        <div className="form-group">
          <label>Notes</label>
          <textarea
            name="notes"
            rows="3"
            placeholder="Add any special instructions or notes"
          ></textarea>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-clear" onClick={() => setFormData(initialState)}>
            <i className="fas fa-times"></i> Clear
          </button>
          <button type="submit" className="btn-save">
            <i className="fas fa-save"></i> Save & Next
          </button>
        </div>
      </form>

      <div className="pickup-list">
        <h3>Today's Pickups</h3>
        <table>
          <thead>
            <tr>
              <th>NAME</th>
              <th>PHONE</th>
              <th>HOSTEL</th>
              <th>ROOM</th>
              <th>CLOTHES</th>
              <th>AMOUNT</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {/* List will be populated from the LiveList component */}
            <tr>
              <td colSpan="7" className="empty-message">No pickups recorded today</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PickupForm;