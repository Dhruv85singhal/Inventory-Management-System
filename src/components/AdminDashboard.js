import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [totalStockCount, setTotalStockCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
      navigate('/'); 
    }

    // Fetch orders from localStorage
    const savedOrders = JSON.parse(localStorage.getItem('orders')) || [];
    setOrders(savedOrders);

    // Calculate total revenue from orders
    const revenue = savedOrders.reduce((sum, order) => sum + order.totalPrice, 0);
    setTotalRevenue(revenue);

    // Fetch stock data from backend
    axios
      .get('http://localhost:5000/api/stock') // Backend API to fetch stock
      .then((response) => {
        const products = response.data;
        const totalCount = products.reduce((sum, product) => sum + product.quantity, 0);
        const lowStock = products.filter((product) => product.quantity < 10); 
        setTotalStockCount(totalCount);
        setLowStockProducts(lowStock);

        // notification for low stock
        if (lowStock.length > 0) {
          setNotifications((prev) => [
            ...prev,
            { message: 'Low stock alert: Some products are running low.', type: 'warning' },
          ]);
        }
      })
      .catch((error) => {
        console.error('Error fetching stock data:', error);
        setTotalStockCount(0);
        setLowStockProducts([]);
      });
  }, [navigate]);

  const navigateToStockPage = () => {
    navigate('/stock');
  };

  const navigateToStore = () => {
    navigate('/store');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Admin Dashboard</h2>
        <div className="dashboard-buttons">
          <button onClick={navigateToStockPage}>Go to Stock Page</button>
          <button onClick={navigateToStore}>Visit Store</button>
        </div>
      </div>

      {/* Notifications Section */}
      {notifications.length > 0 && (
        <div className="notifications">
          {notifications.map((notification, index) => (
            <div
              key={index}
              className={`notification ${notification.type === 'alert' ? 'alert' : 'warning'}`}
            >
              {notification.message}
            </div>
          ))}
        </div>
      )}

      {/* Highlights Section */}
      <div className="dashboard-stats">
        <h3>Dashboard Highlights</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <h4>Total Stock</h4>
            <p>{totalStockCount}</p>
          </div>
          <div className="stat-card">
            <h4>Total Orders</h4>
            <p>{orders.length}</p>
          </div>
          <div className="stat-card">
            <h4>Total Revenue</h4>
            <p>₹{totalRevenue.toFixed(2)}</p>
          </div>
          <div className="stat-card">
            <h4>Low Stock Products</h4>
            <p>{lowStockProducts.length}</p>
          </div>
        </div>
      </div>

      {/* Low Stock Alert Section */}
      {lowStockProducts.length > 0 && (
        <div className="low-stock-alert">
          <h3>Low Stock Alert</h3>
          <ul>
            {lowStockProducts.map((product) => (
              <li key={product.id}>
                {product.name} - {product.quantity} left
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recent Orders Section */}
      <div className="dashboard-orders">
        <h3>Recent Orders</h3>
        {orders.length === 0 ? (
          <p className="no-orders">No recent orders found.</p>
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Total Price</th>
                  <th>Status</th>
                  <th>Products Sold</th> {/* Added column for products sold */}
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.orderId}>
                    <td>{order.orderId}</td>
                    <td>{order.date}</td>
                    <td>₹{order.totalPrice.toFixed(2)}</td>
                    <td>{order.status}</td>
                    <td>
                      {/* Show product names from order items */}
                      {order.items.map((item) => (
                        <div key={item.productId}>
                          {item.name} (x{item.quantity})
                        </div>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: '1rem', textAlign: 'right', fontWeight: 'bold' }}>
              Total Payments: ₹{totalRevenue.toFixed(2)}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
