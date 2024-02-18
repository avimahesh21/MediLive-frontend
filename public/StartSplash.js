import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import "./StartSplash.css";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf";

// Worker URL for PDF.js (change the path to the worker script)
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function StartSplash({ onSelections, onFileSelect, isValidationFailed, onEmailSubmit }) {
  const [cameraPermission, setCameraPermission] = useState(false);
  const [micPermission, setMicPermission] = useState(false);
  const [cameraDevices, setCameraDevices] = useState([]);
  const [micDevices, setMicDevices] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState("");
  const [selectedMic, setSelectedMic] = useState("");
  const [candidateEmail, setCandidateEmail] = useState(null);

  let addToDB = false;
  let recruiterEmail = "";
  const currentUrl = window.location.href;
  const urlParams = new URL(currentUrl).searchParams;
  if (urlParams.has('recruiterEmail') && urlParams.has('position')) {
    addToDB = true;
    recruiterEmail = urlParams.get('recruiterEmail');
  }

  useEffect(() => {
    const requestPermissions = async () => {
      try {
        const cameraStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        cameraStream.getTracks().forEach((track) => track.stop());
        setCameraPermission(true);

        const micStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        micStream.getTracks().forEach((track) => track.stop());
        setMicPermission(true);

        // Now that permissions are granted, fetch the devices
        fetchDevices();
      } catch (error) {
        console.error("Error requesting permissions:", error);
        setCameraPermission(false);
        setMicPermission(false);
      }
    };

    const fetchDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(
          (device) => device.kind === "videoinput"
        );
        const microphones = devices.filter(
          (device) => device.kind === "audioinput"
        );
        setCameraDevices(cameras);
        setMicDevices(microphones);
      } catch (error) {
        console.error("Error fetching devices:", error);
      }
    };

    requestPermissions();
  }, []); // Empty dependency array ensures that this effect runs once when the component mounts

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a new FileReader to read the PDF file as an ArrayBuffer
      const reader = new FileReader();
      reader.onload = async () => {
        const arrayBuffer = reader.result;
        const pdfData = new Uint8Array(arrayBuffer);

        // Initialize PDF.js
        const pdf = await pdfjs.getDocument({ data: pdfData }).promise;

        // Extract text from all pages
        const textContent = [];
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const pageText = await page.getTextContent();
          pageText.items.forEach((item) => {
            textContent.push(item.str);
          });
        }

        const pdfText = textContent.join("\n");
        onFileSelect(pdfText);
      };

      reader.readAsArrayBuffer(file);
    }
  };

  const handleCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      stream.getTracks().forEach((track) => track.stop());
      setCameraPermission(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const handleMicPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      stream.getTracks().forEach((track) => track.stop());
      setMicPermission(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const handleCameraSelection = (e) => {
    const newCamera = e.target.value;
    setSelectedCamera(newCamera);
    onSelections(newCamera, selectedMic);
  };

  const handleMicSelection = (e) => {
    const newMic = e.target.value;
    setSelectedMic(newMic);
    onSelections(selectedCamera, newMic);
  };

  const handleEmailChange = (e) => {
    setCandidateEmail(e.target.value);
    onEmailSubmit(candidateEmail);
  };

  return (
    <div>
      <img
        src="firstround.png"
        style={{
          width: "15rem",
          position: "relative",
          top: "0rem",
          left: "1rem",
        }}
      />
      <div className="page">
        <div className="bubble">
          <div className="container">
            <div className="row">
              <div className="welcome">
                Welcome to your interview with FirstRound 👋
              </div>
            </div>
            <div className="row align-items-center">
              {addToDB && (
                <div className="row">
                  <div className="col-12">
                    <div className="email-verification-box" style={{ backgroundColor: "#e8f5e9", padding: "15px", borderRadius: "5px" }}>
                      <div className="email-invite-label mb-2">
                        {recruiterEmail} invites you to take a FirstRound. Please verify your email:
                      </div>
                      <Form.Control
                        type="email"
                        placeholder="Enter your email"
                        value={candidateEmail}
                        onChange={handleEmailChange}
                        style={{ width: "100%" }}
                      />
                    </div>
                  </div>
                </div>
              )}
              <div className="col-4 label">Upload your resume (.pdf)</div>
              <div className="col-8">
                <Form.Control
                  accept=".pdf"
                  type="file"
                  size="md"
                  class="text-white"
                  onChange={handleFileChange}
                />
              </div>
            </div>
            <hr className="hr" />
            <div class="row">
              <div class="instructionsHeader">Setup</div>
            </div>
            <div className="row">
              <div className="col-6">
                <div className="">
                  <Form.Select
                    as="select"
                    value={selectedCamera}
                    onChange={handleCameraSelection}
                    className={
                      isValidationFailed && !selectedCamera ? "red-outline" : ""
                    }
                  >
                    <option value="">Select Camera</option>
                    {cameraDevices.map((device) => (
                      <option key={device.deviceId} value={device.deviceId}>
                        {device.label ||
                          `Camera ${cameraDevices.indexOf(device) + 1}`}
                      </option>
                    ))}
                  </Form.Select>
                </div>
              </div>
              <div className="col-6">
                <div className="">
                  <Form.Select
                    as="select"
                    value={selectedMic}
                    onChange={handleMicSelection}
                    className={
                      isValidationFailed && !selectedMic ? "red-outline" : ""
                    }
                  >
                    <option value="">Select Microphone</option>
                    {micDevices.map((device) => (
                      <option key={device.deviceId} value={device.deviceId}>
                        {device.label ||
                          `Microphone ${micDevices.indexOf(device) + 1}`}
                      </option>
                    ))}
                  </Form.Select>
                </div>
              </div>
            </div>
            <hr className="hr" />
            <div class="row">
              <div class="instructionsHeader">Instructions</div>
            </div>
            <div class="instructions">
              <li>
                Start this interview when you're in a quiet location with a reliable internet
                connection.
              </li>
            </div>
            <div class="instructions">
              <li>
                The AI interviewer will ask you a series of questions, both
                generic and personal. Reply to each question within the provided
                time limit.
              </li>
            </div>
            <div class="instructions">
              <li>
                Once you've answered every question, we'll process your
                interview and give you scores & tips on each of your responses.
              </li>
            </div>
            <div class="instructions">
              <li>This interview should take roughly 10 minutes. Good luck!</li>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StartSplash;
