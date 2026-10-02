import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ClientDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'client') {
      navigate('/'); // Redirect to login page if the user is not client
    }
  }, [navigate]);

  const navigateToStorePage = () => {
    navigate('/store'); // Redirect to the Store page
  };

  return (
    <div>
      <h2>Client Dashboard</h2>
      <button onClick={navigateToStorePage}>Go to Store</button>
    </div>
  );
};

export default ClientDashboard;
