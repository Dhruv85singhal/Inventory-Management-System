import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showPaymentWindow, setShowPaymentWindow] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // UPI & PIN input by user
  const [upiId, setUpiId] = useState('');
  const [paytmPin, setPaytmPin] = useState('');

  // Card details input by user
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');

  const navigate = useNavigate();

  // Hardcoded valid UPI credentials array
  const VALID_UPI_CREDENTIALS = [
    { upiId: 'user@upi', pin: '1234' },
    { upiId: 'demo@upi', pin: '5678' },
    // Add more valid UPI credentials here
  ];

  // Hardcoded valid cards array
  const VALID_CARDS = [
    {
      number: '1234123412341234',
      expiry: '12/25',
      cvv: '123',
      name: 'John Doe',
    },
    {
      number: '4321432143214321',
      expiry: '11/24',
      cvv: '321',
      name: 'Jane Smith',
    },
    // Add more valid cards here
  ];

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);
    const total = savedCart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotalPrice(total);
  }, []);

  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.value);
    setShowPaymentWindow(false);
  };

  const placeOrder = () => {
    const orderData = {
      orderId: new Date().getTime(),
      items: cart,
      totalPrice,
      paymentMethod,
      date: new Date().toLocaleString(),
      status: 'Completed',
    };
    const savedOrders = JSON.parse(localStorage.getItem('orders')) || [];
    savedOrders.push(orderData);
    localStorage.setItem('orders', JSON.stringify(savedOrders));
    localStorage.removeItem('cart');
    setCart([]);
    navigate('/thank-you', { state: { order: orderData } });
  };

  const handlePlaceOrder = () => {
    if (paymentMethod === 'Paytm') {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setShowPaymentWindow(true);
        setPaymentDetails({
          method: 'Paytm',
          description: `Pay ₹${totalPrice} using your UPI linked with Paytm.`,
          onSuccess: () => {
            alert('Payment successful via Paytm!');
            placeOrder();
          },
          onCancel: () => {
            alert('Payment cancelled.');
            setShowPaymentWindow(false);
          },
        });
      }, 3000);
    } else if (paymentMethod === 'Debit Card' || paymentMethod === 'Credit Card') {
      setIsProcessing(false);
      setTimeout(() => {
        setIsProcessing(false);
        setShowPaymentWindow(true);
        setPaymentDetails({
          method: paymentMethod,
          description: `Pay ₹${totalPrice} using your ${paymentMethod}.`,
          onSuccess: () => {
            alert(`Payment successful via ${paymentMethod}!`);
            placeOrder();
          },
          onCancel: () => {
            alert('Payment cancelled.');
            setShowPaymentWindow(false);
          },
        });
      }, 3000);
    } else if (paymentMethod === 'Cash on Delivery') {
      alert('Payment successful via Cash on Delivery!');
      placeOrder();
    }
  };

  const handlePaymentValidation = () => {
    if (paymentMethod === 'Paytm') {
      // Check if entered UPI ID and PIN match any valid pair
      const isValidUpi = VALID_UPI_CREDENTIALS.some(
        (cred) => cred.upiId === upiId && cred.pin === paytmPin
      );
      if (isValidUpi) {
        alert(`✅ Payment successful via ${paymentMethod}!`);
        placeOrder();
      } else {
        alert('❌ Invalid UPI ID or PIN');
      }
    } else if (paymentMethod === 'Debit Card' || paymentMethod === 'Credit Card') {
      // Check if entered card details match any valid card
      const isValidCard = VALID_CARDS.some(
        (card) =>
          card.number === cardNumber &&
          card.expiry === expiry &&
          card.cvv === cvv &&
          card.name.toLowerCase() === cardHolder.toLowerCase()
      );
      if (isValidCard) {
        alert(`✅ Payment successful via ${paymentMethod}!`);
        placeOrder();
      } else {
        alert('❌ Invalid card details');
      }
    }
  };

  return (
    <div className="checkout-container">
      <button onClick={() => navigate(-1)} className="back-button">Back</button>
      <h2>Checkout Page</h2>

      <div className="order-summary">
        <h3>Order Summary</h3>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div className="order-items">
            {cart.map((item) => (
              <div key={item.id} className="order-item">
                <p>{item.name} x {item.quantity}</p>
                <p>₹{item.price * item.quantity}</p>
              </div>
            ))}
          </div>
        )}
        <div className="total-price">
          <h4>Total: ₹{totalPrice}</h4>
        </div>
      </div>

      <div className="payment-options">
        <h3>Select Payment Method</h3>
        {['Paytm', 'Debit Card', 'Credit Card', 'Cash on Delivery'].map((method) => (
          <div key={method}>
            <input
              type="radio"
              id={method}
              name="paymentMethod"
              value={method}
              checked={paymentMethod === method}
              onChange={handlePaymentChange}
            />
            <label htmlFor={method}>{method}</label>
          </div>
        ))}
      </div>

      <button onClick={handlePlaceOrder} disabled={!paymentMethod} className="place-order-btn">
        Place Order
      </button>

      {/* Paytm Loader */}
      {isProcessing && (
        <div className="payment-modal">
          <div className="payment-modal-content">
            <h3>Connecting to Paytm...</h3>
            <p>Please wait while we securely redirect you</p>
            <div className="paytm-loader"></div>
          </div>
        </div>
      )}

      {/* Payment Modal with User Input */}
      {showPaymentWindow && paymentDetails && (
        <div className="payment-modal">
          <div className="payment-modal-content">
            <h3>{paymentDetails.method} Payment</h3>
            <p>{paymentDetails.description}</p>

            {/* UPI Fields for Paytm */}
            {paymentMethod === 'Paytm' && (
              <>
                <input
                  type="text"
                  placeholder="Enter your UPI ID"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="paytm-input"
                />
                <input
                  type="password"
                  placeholder="Enter Paytm PIN"
                  value={paytmPin}
                  onChange={(e) => setPaytmPin(e.target.value)}
                  className="paytm-input"
                />
              </>
            )}

            {/* Card Fields for Debit/Credit Card */}
            {(paymentMethod === 'Debit Card' || paymentMethod === 'Credit Card') && (
              <>
                <input
                  type="text"
                  placeholder="Card Number"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="paytm-input"
                />
                <input
                  type="text"
                  placeholder="Expiry (MM/YY)"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  className="paytm-input"
                />
                <input
                  type="password"
                  placeholder="CVV"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  className="paytm-input"
                />
                <input
                  type="text"
                  placeholder="Cardholder Name"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  className="paytm-input"
                />
              </>
            )}

            <button className="pay-btn" onClick={handlePaymentValidation}>
              Confirm Payment
            </button>
            <button className="cancel-btn" onClick={paymentDetails.onCancel}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
