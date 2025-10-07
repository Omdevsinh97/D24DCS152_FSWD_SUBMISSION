import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import PickupForm from './components/PickupForm';
import LiveList from './components/LiveList';
import WashStatus from './components/WashStatus';
import ReturnStatus from './components/ReturnStatus';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="app-header">
          <div className="logo">
            <i className="fas fa-tshirt"></i>
            <h1>Smart Laundry Manager</h1>
          </div>
          <div className="top-nav">
            <Link to="/" className="nav-btn dashboard-btn">
              <i className="fas fa-chart-bar"></i> Dashboard
            </Link>
            <Link to="/pickup" className="nav-btn pickup-btn">
              <i className="fas fa-shopping-basket"></i> Pickup
            </Link>
            <Link to="/return-status" className="nav-btn return-btn">
              <i className="fas fa-exchange-alt"></i> Return
            </Link>
            <Link to="/wash-status" className="nav-btn wash-btn">
              <i className="fas fa-soap"></i> Wash Status
            </Link>
            <div className="nav-btn-group">
              <Link to="/live-list" className="nav-btn export-btn">
                <i className="fas fa-file-export"></i> Export
              </Link>
              <Link to="/live-list" className="nav-btn import-btn">
                <i className="fas fa-file-import"></i> Import
              </Link>
            </div>
          </div>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/pickup" element={<PickupForm />} />
            <Route path="/live-list" element={<LiveList />} />
            <Route path="/wash-status" element={<WashStatus />} />
            <Route path="/return-status" element={<ReturnStatus />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
