import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CartPage.css';

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]); // Holds all product details
  const [totalPrice, setTotalPrice] = useState(0); // To calculate total price
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch products from backend to get current stock
    axios.get('http://localhost:5000/api/stock')
      .then(response => {
        setProducts(response.data); // Set products with stock info
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });

    // Load cart from localStorage when component mounts
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);

    // Calculate total price
    const total = savedCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalPrice(total);
  }, []);

  // Helper function to get the product by ID
  const getProductById = (id) => products.find(p => p.id === id);

  const handleQuantityChange = (e, productId) => {
    const updatedQuantity = parseInt(e.target.value);
    if (updatedQuantity < 1) return;

    const product = getProductById(productId);
    if (!product) return;

    // Get the cart item for this product
    const currentCartItem = cart.find(item => item.id === productId);
    const currentCartQuantity = currentCartItem ? currentCartItem.quantity : 0;

    // Maximum quantity allowed: stock left + current cart quantity
    const maxQuantity = product.quantity + currentCartQuantity;

    // Restrict to available stock
    if (updatedQuantity > maxQuantity) {
      alert(`Only ${maxQuantity} items are available in stock!`);
      e.target.value = currentCartQuantity; // Reset to the current cart quantity
      return;
    }

    // Update the cart with new quantity
    const updatedCart = cart.map(item => 
      item.id === productId ? { ...item, quantity: updatedQuantity } : item
    );

    // Update cart in localStorage and React state
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCart(updatedCart);

    // Update stock in the backend by calculating the new stock
    const updatedStock = product.quantity - (updatedQuantity - currentCartQuantity);
    axios.put(`http://localhost:5000/api/stock/update/${productId}`, { quantity: updatedStock })
      .then(response => {
        console.log('Stock updated:', response.data);
        // Fetch updated stock data from the backend
        axios.get('http://localhost:5000/api/stock')
          .then(response => {
            setProducts(response.data); // Update product stock data from backend
          })
          .catch(error => {
            console.error('Error fetching updated stock:', error);
          });
      })
      .catch(error => {
        console.error('Error updating stock:', error);
        alert('Failed to update stock');
      });
  };

  const handleRemoveFromCart = (productId) => {
    const itemToRemove = cart.find(item => item.id === productId);
    if (itemToRemove) {
      // Get the product and update stock on removal
      const product = getProductById(productId);
      if (product) {
        const updatedStock = product.quantity + itemToRemove.quantity; // Return the quantity to stock
        axios.put(`http://localhost:5000/api/stock/update/${productId}`, { quantity: updatedStock })
          .then(response => {
            console.log('Stock updated after removal:', response.data);
            // Fetch updated stock data from the backend
            axios.get('http://localhost:5000/api/stock')
              .then(response => {
                setProducts(response.data); // Update product stock data from backend
              })
              .catch(error => {
                console.error('Error fetching updated stock after removal:', error);
              });
          })
          .catch(error => {
            console.error('Error updating stock after removal:', error);
            alert('Failed to update stock');
          });
      }

      // Remove from cart in localStorage and state
      const updatedCart = cart.filter(item => item.id !== productId);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      setCart(updatedCart);
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty. Add some items to proceed to checkout.');
      return;
    }
    alert('Proceeding to checkout...');
    navigate('/checkout');
  };

  const calculateTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  return (
    <div className="cart-container">
      <button onClick={() => navigate(-1)} className="back-button">Back</button>

      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="cart-items">
          {cart.map(item => {
            const product = getProductById(item.id); // Get the product details for cart item
            return (
              <div key={item.id} className="cart-item">
                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <p>Price: ₹{item.price}</p>
                  <div className="quantity-selector">
                    <label htmlFor={`quantity-${item.id}`}>Quantity:</label>
                    <input
                      type="number"
                      id={`quantity-${item.id}`}
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(e, item.id)}
                      min="1"
                      max={product ? product.quantity + item.quantity : 0}  // Correct max logic
                    />
                  </div>
                </div>
                <button onClick={() => handleRemoveFromCart(item.id)}>Remove</button>
              </div>
            );
          })}
        </div>
      )}

      <div className="checkout-section">
        <h3>Total Price: ₹{calculateTotalPrice()}</h3>
        <button onClick={handleCheckout} disabled={cart.length === 0}>Proceed to Checkout</button>
      </div>
    </div>
  );
};

export default CartPage;
