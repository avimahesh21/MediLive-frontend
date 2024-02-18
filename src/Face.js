import {useRef,useEffect} from 'react'
import './Face.css'
import * as faceapi from 'face-api.js'

function Face(props){
  const videoRef = useRef()
  const canvasRef = useRef()

  // LOAD FROM USEEFFECT
  useEffect(()=>{
    startVideo()
    videoRef && loadModels()

  },[])



  // OPEN YOU FACE WEBCAM
  const startVideo = ()=>{
    navigator.mediaDevices.getUserMedia({video:true})
    .then((currentStream)=>{
      videoRef.current.srcObject = currentStream
    })
    .catch((err)=>{
      console.log(err)
    })
  }
  // LOAD MODELS FROM FACE API

  const loadModels = ()=>{
    Promise.all([
      // THIS FOR FACE DETECT AND LOAD FROM YOU PUBLIC/MODELS DIRECTORY
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),


      ]).then(()=>{
      faceMyDetect()
    })
  }

  const faceMyDetect = () => {
    setInterval(async () => {
      if (!videoRef.current || videoRef.current.paused || videoRef.current.ended) return;
      const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks()
  
      // DRAW YOU FACE IN WEBCAM
      canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(videoRef.current)
      faceapi.matchDimensions(canvasRef.current, {
        width: 940,
        height: 650
      })
  
      const resized = faceapi.resizeResults(detections, {
        width: 940,
        height: 650
      })
  
      faceapi.draw.drawDetections(canvasRef.current, resized)
      faceapi.draw.drawFaceLandmarks(canvasRef.current, resized)
  
      // Check the vertical position of the middle of the face
      if (detections.length > 0) {
        // Assuming there's only one face detected and taking the first detection
        const face = detections[0];
        const midY = (face.detection.box.top + face.detection.box.bottom) / 2;
        const videoHeight = 650; // replace with videoRef.current.offsetHeight if dynamic
  
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
    <canvas ref={canvasRef} width="940" height="650" className="appcanvas" />
  </div>
</div>
    )
}

export default Face;