import React, { useState, useEffect } from 'react';

const HeartRateMonitor = () => {
  const [points, setPoints] = useState([]);
  const maxX = 150; // Width of the SVG
  let lastX = -10; // Initial x-coordinate for the first point

  const updateHeartRate = (newHeartRate) => {
    lastX += 10; // Move 10 units to the right for each new data point
    if (lastX > maxX) {
      lastX = 0; // Reset to start when reaching the end of the SVG
      setPoints([]); // Clear points to start over
    }
    const y = Math.random() * 73; // Simulate a y-coordinate for demonstration
    setPoints(prevPoints => [...prevPoints, `${lastX},${y}`]);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const newHeartRate = Math.random() * (120 - 60) + 60; // Random heart rate for demonstration
      updateHeartRate(newHeartRate);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="heart-rate">
      <svg version="1.0" x="0px" y="0px" width="100px" height="43px" viewBox="0 0 150 73">
        <polyline fill="none" stroke="#009B9E" stroke-width="3" stroke-miterlimit="10" points={points.join(' ')} />
      </svg>
    </div>
  );
};

export default HeartRateMonitor;
