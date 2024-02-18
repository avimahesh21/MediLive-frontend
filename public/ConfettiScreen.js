import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';


function ConfettiScreen() {
  const [confettiActive, setConfettiActive] = useState(true);

  // Disable confetti after a certain duration (e.g., 5 seconds)
  useEffect(() => {
    const confettiTimer = setTimeout(() => {
      setConfettiActive(false);
    }, 5000);

    return () => {
      clearTimeout(confettiTimer);
    };
  }, []);

  return (
    <div>
      {confettiActive && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={200} // Adjust the number of confetti pieces
          className="confetti-fade" // Add a class for styling
        />
      )}
    </div>
  );
}

export default ConfettiScreen;
