import React, { useState, useEffect } from 'react';

const ArduinoData = () => {
  const [data, setData] = useState('');

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onopen = () => {
      console.log('Connected to WebSocket');
    };

    ws.onmessage = (event) => {
      // Update state with data received from WebSocket server
      setData(event.data + " ");
      console.log(data)
    };

    ws.onerror = (error) => {
      console.log('WebSocket error: ', error);
    };

    ws.onclose = () => {
      console.log('Disconnected from WebSocket');
    };

    // Clean up WebSocket connection when component unmounts
    return () => {
      ws.close();
    };
  }, []); // Empty dependency array means this effect runs only once on mount

  return (
    <div>
      <h3>Arduino Data:</h3>
      <p>{data}</p>
    </div>
  );
};

export default ArduinoData;