import React, { useRef, useEffect } from 'react';
import './Face.css';
import * as faceapi from 'face-api.js';

function Face(props) {
  const videoRef = useRef();
  const canvasRef = useRef();

  useEffect(() => {
    startVideo();
  }, []);

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((currentStream) => {
        videoRef.current.srcObject = currentStream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().then(() => {
            loadModels();
          });
        };
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const loadModels = () => {
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
    ]).then(() => {
      faceMyDetect();
    });
  };

  const faceMyDetect = () => {
    setInterval(async () => {
      if (!videoRef.current || videoRef.current.paused || videoRef.current.ended) return;
      const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();

      if (canvasRef.current) {
        const canvas = faceapi.createCanvasFromMedia(videoRef.current);
        if (canvasRef.current.firstChild) {
          canvasRef.current.removeChild(canvasRef.current.firstChild);
        }
        canvasRef.current.appendChild(canvas);
      }

      faceapi.matchDimensions(canvasRef.current, {
        width: 708,
        height: 490,
      });

      const resizedDetections = faceapi.resizeResults(detections, {
        width: 708,
        height: 490,
      });

      faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
  
      // Check the vertical position of the middle of the face
      if (detections.length > 0) {
        // Assuming there's only one face detected and taking the first detection
        const face = detections[0];
        const midY = (face.detection.box.top + face.detection.box.bottom) / 2;
        const videoHeight = 490; // replace with videoRef.current.offsetHeight if dynamic
  
        if (midY > videoHeight / 2) {
          console.log('Fallen'); // The middle of the face is in the bottom half
          props.setTrigger(true);
        } else {
          console.log('Not fallen'); // The middle of the face is in the top half
        }
      }
    }, 1000)
  }

  return (
<div className="myapp">
  <div className="video-container">
    <video crossOrigin="anonymous" ref={videoRef} autoPlay></video>
    <canvas ref={canvasRef} width="708" height="490" className="appcanvas" />
  </div>
</div>
    )
}

export default Face;