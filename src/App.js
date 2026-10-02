import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import ClientDashboard from './components/ClientDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import StockPage from './components/StockPage'; 
import StorePage from './components/StorePage'; 
import CartPage from './components/CartPage';
import CheckoutPage from './components/CheckoutPage';
import ThankYouPage from './components/ThankYouPage';
//import Navbar from './components/Navbar';
function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for user session in localStorage
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  return (
    <Router>
      
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/stock" element={<StockPage />} /> {/* Add Stock Page route */}
        <Route path="/store" element={<StorePage />} /> {/* Add Store Page route */}
        <Route path="/cart" element={<CartPage />} /> {/* Corrected Cart Page route */}
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/thank-you" element={<ThankYouPage />} />

        {/* Admin Protected Route */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              {user?.role === 'admin' ? (
                <AdminDashboard />
              ) : (
                <Login /> // Redirect to login if not an admin
              )}
            </ProtectedRoute>
          }
        />

        {/* Client Protected Route */}
        <Route
          path="/client-dashboard"
          element={
            <ProtectedRoute>
              {user?.role === 'client' ? (
                <ClientDashboard />
              ) : (
                <Login /> // Redirect to login if not a client
              )}
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
