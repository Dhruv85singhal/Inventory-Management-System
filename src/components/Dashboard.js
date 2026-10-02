import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // Add a loading state to wait for user data

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
      navigate('/'); // Redirect to login page if the user is not admin
    } else {
      setLoading(false); // If user is admin, stop loading
    }
  }, [navigate]);

  // Show a loading message until the user's role is checked
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p>Welcome to the Admin Dashboard!</p>
      {/* Add more components or admin functionalities here */}
    </div>
  );
};

export default AdminDashboard;
