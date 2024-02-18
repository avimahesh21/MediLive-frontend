import React, { useState, useEffect } from 'react';

const AlertSystem = ({ newAlert }) => {
  const [alerts, setAlerts] = useState([]);

  // Listener for new alerts (could be a WebSocket or similar)
  useEffect(() => {
    if (newAlert) {
      setAlerts((previousAlerts) => [newAlert, ...previousAlerts]);
    }
  }, [newAlert]);  

  return (
    <div style={{ overflowY: 'auto', maxHeight: '400px' }}>
      {alerts.map((alert) => (
        <div 
        key={alert.id} 
          style={{ 
            padding: '10px', 
            borderBottom: '1px solid #ccc',
            marginBottom: '10px', // Adds space between alerts
            backgroundColor: '#222222', // Optional: adds a background color to each alert
            borderRadius: '4px', // Optional: rounds the corners of the alert boxes
          }}
        >
          {alert.message}
        </div>
      ))}
    </div>
  );
};

export default AlertSystem;