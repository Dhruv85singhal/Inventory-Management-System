import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  return (
    <button onClick={handleBack} style={backButtonStyle}>
      Back
    </button>
  );
};

const backButtonStyle = {
  padding: '10px 20px',
  margin: '10px 0',
  backgroundColor: '#000', // ✅ black background
  color: '#fff',           // white text
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

export default BackButton;
