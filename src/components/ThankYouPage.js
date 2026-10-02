import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; 
import { jsPDF } from 'jspdf'; 
import { QRCodeCanvas } from 'qrcode.react'; 
import './ThankYouPage.css';

const ThankYouPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const order = location.state?.order; 
  const [qrData, setQrData] = useState('');

  const handleShopMore = () => {
    navigate('/store');  
  };

  const handleGenerateInvoice = () => {
    if (order) {
      const doc = new jsPDF();

      // Add logo or company name at the top
      doc.setFontSize(25);
      doc.setTextColor(0, 0, 255); 
      doc.text('Zipkartt', 20, 20); 

      // Add company address and contact details
      doc.setFontSize(12);
      doc.text('Zipkartt Pvt. Ltd.', 20, 30);
      doc.text('123, ABC Street, XYZ City, 400001', 20, 35);
      doc.text('Phone: +91 123 456 XXXX', 20, 40);
      doc.text('Email: support@zipkartt.com', 20, 45);

      // Add a separator line
      doc.setDrawColor(0, 0, 0); 
      doc.line(20, 50, 190, 50); 

      // Add invoice title
      doc.setFontSize(15);
      doc.setTextColor(0, 0, 0); 
      doc.text('Invoice', 20, 60);

      // Order Details
      doc.setFontSize(12);
      doc.text(`Order ID: ${order.orderId}`, 20, 70);
      doc.text(`Date: ${order.date}`, 20, 80);
      doc.text(`Payment Method: ${order.paymentMethod}`, 20, 90);
      doc.text(`Status: ${order.status}`, 20, 100);

      // UPI ID details 
      if (order.paymentMethod === 'UPI') {
        doc.text('UPI ID: support@zipkartt', 20, 110);
      }

      // Add Tax and Discount (if applicable)
      doc.text(`Tax: ₹${order.tax ? order.tax.toFixed(2) : '0.00'}`, 20, 120);
      doc.text(`Discount: ₹${order.discount ? order.discount.toFixed(2) : '0.00'}`, 20, 130);

      
      doc.line(20, 140, 190, 140);

      // Add table headers for item details
      doc.setFontSize(10);
      doc.text('Item', 20, 150);
      doc.text('Quantity', 100, 150);
      doc.text('Price', 150, 150);

      // Add item details
      let yOffset = 160;
      let qrDataString = ''; // Define qrData string here
      order.items.forEach((item) => {
        doc.text(item.name, 20, yOffset);
        doc.text(item.quantity.toString(), 100, yOffset);
        doc.text(`₹${(item.price * item.quantity).toFixed(2)}`, 150, yOffset);
        qrDataString += `${item.name} (${item.quantity} x ₹${item.price})\n`; // Add item info to qrData
        yOffset += 10;
      });

      // Add total price
      doc.line(20, yOffset + 5, 190, yOffset + 5); // Line before total price
      yOffset += 10;
      doc.setFontSize(12);
      doc.text(`Total Price: ₹${order.totalPrice.toFixed(2)}`, 20, yOffset);

      // Define base URL for QR codes
      const baseUrl = 'https://zipkartt.com/scan';  // This should be the URL where you want to show the order details

      // Generate a URL with order details as query params
      const qrUrl = `${baseUrl}?orderId=${order.orderId}&totalPrice=${order.totalPrice}&paymentMethod=${encodeURIComponent(order.paymentMethod)}&status=${encodeURIComponent(order.status)}&items=${encodeURIComponent(qrDataString)}`;

      // Set the URL as qrData
      setQrData(qrUrl);

      // Save the PDF as an invoice
      doc.save(`Invoice_${order.orderId}.pdf`);
    }
  };

  return (
    <div className="thank-you-container">
      <h2>Thank You for Your Order!</h2>
      {order && (
        <>
          <p>Order ID: {order.orderId}</p>
          <p>Total Price: ₹{order.totalPrice}</p>
          <p>Payment Method: {order.paymentMethod}</p>
          <p>Status: {order.status}</p>

          {/* UPI ID Section */}
          <div className="upi-details">
            <p><strong>UPI ID for Payment:</strong> support@zipkartt</p>
          </div>

          {/* Tax and Discount Section */}
          {order.tax || order.discount ? (
            <>
              <p><strong>Tax:</strong> ₹{order.tax ? order.tax.toFixed(2) : '0.00'}</p>
              <p><strong>Discount:</strong> ₹{order.discount ? order.discount.toFixed(2) : '0.00'}</p>
            </>
          ) : null}

          {/* Generate Buttons */}
          <button onClick={handleShopMore}>Shop More</button>
          <button onClick={handleGenerateInvoice}>Generate Invoice</button>

          {/* Render QR Code for Order */}
          {qrData && (
            <div className="qr-code-container">
              <QRCodeCanvas value={qrData} size={150} />
              <p>Scan this QR to view order details</p>
            </div>
          )}

          {/* Footer with Terms and Conditions */}
          <div className="footer">
            <p>Terms and Conditions apply. For more details, visit our website.</p>
            <p>Thank you for choosing Zipkartt!</p>
          </div>
        </>
      )}
    </div>
  );
};

export default ThankYouPage;
