// src/components/WebcamCapture.js
import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';

const videoConstraints = {
  width: 612,
  height: 381,
  facingMode: "user"
};

const WebcamCap = () => {
  const webcamRef = useRef(null);

  return (
    <div class="player-wrapper">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        mirrored={true}
        videoConstraints={videoConstraints}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '1rem',
        }}
      />
    </div>
  );
};

export default WebcamCap;
