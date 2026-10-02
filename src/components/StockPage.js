import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './StockPage.css';
import BackButton from './BackButton'; // Import the BackButton component

const StockPage = () => {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(''); // ID of the selected product
  const [addQuantity, setAddQuantity] = useState('');
  const [updatePrice, setUpdatePrice] = useState(''); // New state for updating price
  const [searchQuery, setSearchQuery] = useState(''); // State to store the search query

  // Fetch products from the backend
  useEffect(() => {
    axios.get('http://localhost:5000/api/stock')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  }, []);

  // Filter products based on search query and sort alphabetically
  const filteredProducts = products
    .filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically by name

  // Add new product
  const handleAddProduct = (e) => {
    e.preventDefault();
    // Ensure price and quantity are non-negative
    if (price <= 0 || quantity <= 0) {
      alert('Price and Quantity must be positive values');
      return;
    }

    axios.post('http://localhost:5000/api/stock/add', { name, price, quantity })
      .then(response => {
        setProducts([...products, { name, price, quantity }]); // Add new product to the state
        setName('');
        setPrice('');
        setQuantity('');
        alert(response.data.message); // Success message
      })
      .catch(error => {
        console.error('Error adding product:', error);
        alert('Failed to add product');
      });
  };

  // Delete product
  const handleDeleteProduct = (id) => {
    axios.delete(`http://localhost:5000/api/stock/delete/${id}`)
      .then(response => {
        setProducts(products.filter(product => product.id !== id)); // Remove product from state
        alert(response.data.message); // Success message
      })
      .catch(error => {
        console.error('Error deleting product:', error);
        alert('Failed to delete product');
      });
  };

  // Update product quantity
  const handleUpdateQuantity = (e) => {
    e.preventDefault();

    // Ensure a product is selected
    if (!selectedProduct) {
      alert('Please select a valid product');
      return;
    }

    const selectedProductObj = products.find(product => product.id === parseInt(selectedProduct)); // Find product by ID

    if (!selectedProductObj) {
      alert('Product not found');
      return;
    }

    const newQuantity = parseInt(selectedProductObj.quantity) + parseInt(addQuantity);

    if (isNaN(newQuantity) || newQuantity <= 0) {
      alert('Please enter a valid quantity');
      return;
    }

    axios.put(`http://localhost:5000/api/stock/update/${selectedProduct}`, { quantity: newQuantity })
      .then(response => {
        // Update the product in the state after the quantity is updated in the backend
        setProducts(products.map(product =>
          product.id === parseInt(selectedProduct) ? { ...product, quantity: newQuantity } : product
        ));
        setAddQuantity('');
        alert(response.data.message); // Success message
      })
      .catch(error => {
        console.error('Error updating quantity:', error);
        alert('Failed to update quantity');
      });
  };

  // Update product price
  const handleUpdatePrice = (e) => {
    e.preventDefault();

    // Ensure a product is selected
    if (!selectedProduct) {
      alert('Please select a valid product');
      return;
    }

    // Ensure the new price is valid (greater than zero)
    if (!updatePrice || updatePrice <= 0) {
      alert('Please enter a valid price');
      return;
    }

    // Sending the updated price to the backend
    axios.put(`http://localhost:5000/api/stock/updatePrice/${selectedProduct}`, { price: updatePrice })
      .then(response => {
        // Successfully updated the price, update the state
        setProducts(products.map(product =>
          product.id === parseInt(selectedProduct) ? { ...product, price: updatePrice } : product
        ));
        setUpdatePrice(''); // Reset the price field after success
        alert(response.data.message); // Show success message
      })
      .catch(error => {
        console.error('Error updating price:', error);
        alert('Failed to update price');
      });
  };

  // Auto capitalize product name (entire words)
  const handleNameChange = (e) => {
    const value = e.target.value;
    const capitalizedName = value
      .split(' ') // Split by spaces
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
      .join(' '); // Join the words back together
    setName(capitalizedName);
  };

  // Ensure price and quantity are non-negative numbers
  const handlePriceChange = (e) => {
    const value = e.target.value;
    if (value >= 0) {
      setPrice(value);
    }
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    if (value >= 0) {
      setQuantity(value);
    }
  };

  const handleAddQuantityChange = (e) => {
    const value = e.target.value;
    if (value >= 0) {
      setAddQuantity(value);
    }
  };

  const handleUpdatePriceChange = (e) => {
    const value = e.target.value;
    if (value >= 0) {
      setUpdatePrice(value);
    }
  };

  return (
    <div>
      <BackButton /> {/* Add Back button at the top */}
      <h2>Admin Stock Management</h2>

      <form onSubmit={handleAddProduct}>
        <input
          type="text"
          value={name}
          onChange={handleNameChange}
          placeholder="Product Name"
          required
        />
        <input
          type="number"
          value={price}
          onChange={handlePriceChange}
          placeholder="Price"
          required
        />
        <input
          type="number"
          value={quantity}
          onChange={handleQuantityChange}
          placeholder="Quantity"
          required
        />
        <button type="submit">Add Product</button>
      </form>

      <h3>Update Existing Product</h3>
      {/* Update Quantity Form */}
      <form onSubmit={handleUpdateQuantity}>
        <select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
          required
        >
          <option value="">Select Product</option>
          {products.map(product => (
            <option key={product.id} value={product.id}>
              {product.name} - Current Quantity: {product.quantity}
            </option>
          ))}
        </select>

        <input
          type="number"
          value={addQuantity}
          onChange={handleAddQuantityChange}
          placeholder="Quantity to Add"
          required
        />
        <button type="submit">Update Quantity</button>
      </form>

      {/* Update Price Form */}
      <form onSubmit={handleUpdatePrice}>
        <select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
          required
        >
          <option value="">Select Product</option>
          {products.map(product => (
            <option key={product.id} value={product.id}>
              {product.name} - Current Price: ₹{product.price}
            </option>
          ))}
        </select>

        <input
          type="number"
          value={updatePrice}
          onChange={handleUpdatePriceChange}
          placeholder="New Price"
          required
        />
        <button type="submit">Update Price</button>
      </form>

      {/* Search Bar - Added just below the Update Quantity form */}
      <input
        type="text"
        placeholder="Search Products"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)} // Update search query state
        className="search-bar"
      />

      <h3>Product List</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map(product => ( // Display only filtered and sorted products
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>₹{product.price}</td>
              <td>{product.quantity}</td>
              <td>
                <button className="delete-button" onClick={() => handleDeleteProduct(product.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockPage;
