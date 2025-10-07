import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  React.useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="home-container">
      <div className="home-card">
        {/* <h1 className="welcome-title"></h1> */}
        {user && (
          <h2 className="username-display">
            Hello, {user.username}!
          </h2>
        )}
        <p className="welcome-message">
          Looged in successfully
        </p>
      </div>
    </div>
  );
};

export default Home;