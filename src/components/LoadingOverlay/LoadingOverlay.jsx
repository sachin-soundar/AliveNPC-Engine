import React from 'react';
import './LoadingOverlay.css';

const LoadingOverlay = ({ isVisible, message = "Processing..." }) => {
  if (!isVisible) return null;

  return (
    <div className="loading-overlay">
      <div className="loading-spinner"></div>
      <div className="loading-text">{message}</div>
    </div>
  );
};

export default LoadingOverlay;