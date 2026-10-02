import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaShoppingCart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './StorePage.css';

const StorePage = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // New search input state
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/stock')
      .then(response => {
        const inStockProducts = response.data.filter(product => product.quantity > 0);
        setProducts(inStockProducts);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });

    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);
  }, []);

  const handleQuantityChange = (e, productId) => {
    const updatedProducts = products.map(product =>
      product.id === productId ? { ...product, selectedQuantity: e.target.value } : product
    );
    setProducts(updatedProducts);
  };

  const addToCart = (product) => {
    const quantity = product.selectedQuantity ? parseInt(product.selectedQuantity, 10) : 1;
    if (isNaN(quantity) || quantity <= 0) {
      alert('Please select a valid quantity');
      return;
    }

    const newCartItem = { ...product, quantity };
    let currentCart = JSON.parse(localStorage.getItem('cart')) || [];

    const existingCartItem = currentCart.find(item => item.id === newCartItem.id);
    if (existingCartItem) {
      currentCart = currentCart.map(item =>
        item.id === existingCartItem.id
          ? { ...item, quantity: item.quantity + newCartItem.quantity }
          : item
      );
    } else {
      currentCart.push(newCartItem);
    }

    localStorage.setItem('cart', JSON.stringify(currentCart));
    setCart(currentCart);

    if (product.quantity >= quantity) {
      const updatedStock = product.quantity - quantity;

      axios.put(`http://localhost:5000/api/stock/update/${product.id}`, { quantity: updatedStock })
        .then(response => {
          console.log('Stock updated:', response.data);
          setProducts(products.map(p =>
            p.id === product.id ? { ...p, quantity: updatedStock } : p
          ));
          alert(`${product.name} added to cart with quantity: ${quantity}`);
        })
        .catch(error => {
          console.error('Error updating stock:', error);
          alert('Failed to update stock');
        });
    } else {
      alert('Not enough stock available');
    }
  };

  const handleCheckout = () => {
    navigate('/cart');
  };

  const handleBack = () => {
    navigate(-1);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="store-page-container">
      <button onClick={handleBack} className="back-button">Back</button>

      <h2>Zipkartt</h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      {/* Cart Icon */}
      <div className="cart-icon" onClick={() => navigate('/cart')}>
  <FaShoppingCart size={30} />
  {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
</div>

     

      {/* Product List */}
      <ul className="product-list">
        {filteredProducts.length === 0 ? (
          <p className="no-products">No products available.</p>
        ) : (
          filteredProducts.map(product => (
            <li key={product.id} className="product-item">
              <div className="product-details">
                <h3>{product.name}</h3>
                <p><strong>Price:</strong> ₹{product.price}</p>
                <p><strong>Available Quantity:</strong> {product.quantity}</p>

                <div className="quantity-selector">
                  <label htmlFor={`quantity-${product.id}`}>Qty:</label>
                  <input
                    type="number"
                    id={`quantity-${product.id}`}
                    value={product.selectedQuantity || ''}
                    onChange={(e) => handleQuantityChange(e, product.id)}
                    min="1"
                    max={product.quantity}
                  />
                </div>
              </div>
              <button className="add-to-cart-btn" onClick={() => addToCart(product)}>Add to Cart</button>
            </li>
          ))
        )}
      </ul>

      <button className="checkout-button" onClick={handleCheckout}>
        Proceed to Checkout
      </button>
    </div>
    
  );
  
};

export default StorePage;
