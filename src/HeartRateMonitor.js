import React, { useState, useEffect } from 'react';
import "./App.css"

const HeartRateMonitor = () => {

  const [data, setData] = useState('');

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onopen = () => {
      console.log('Connected to WebSocket');
    };

    ws.onmessage = (event) => {
      // Update state with data received from WebSocket server
      setData(event.data + " ");
      updateHeartRate(event.data);
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
  }, []);

  const [points, setPoints] = useState([]);
  const maxX = 150; // Width of the SVG
  let lastX = -10; // Initial x-coordinate for the first point

  const updateHeartRate = (newHeartRate) => {
    lastX += 10; // Move 10 units to the right for each new data point
    if (lastX > maxX) {
      lastX = 0; // Reset to start when reaching the end of the SVG
      setPoints([]); // Clear points to start over
    }
    const y = newHeartRate/90 * 73; // Simulate a y-coordinate for demonstration
    setPoints(prevPoints => [...prevPoints, `${lastX},${y}`]);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      updateHeartRate(data);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="heart-rate">
      <h4>Heart Rate (BPM)</h4>
      <div className="mx-auto pt-3"></div>
      <svg version="1.0" x="0px" y="0px" width="150px" height="83px" viewBox="0 0 150 73">
        <polyline fill="none" stroke="#AD1C1C" stroke-width="3" stroke-miterlimit="10" points={points.join(' ')} />
      </svg>
      </div>
    
  );
};

export default HeartRateMonitor;
