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
        className="p-2.5 mb-2.5 bg-cyan-950 rounded-md"
        >
          {alert.message}
        </div>
      ))}
    </div>
  );
};

export default AlertSystem;