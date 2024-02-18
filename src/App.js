import logo from './logo.svg';
import './App.css';
import WebcamCap from './WebcamCap';
import Nurse from './Nurse';
import 'bootstrap/dist/css/bootstrap.min.css';
import Typewriter from "typewriter-effect";
import Footer from './Footer';
import ActionLog from './ActionLog';
import React, { useState, useEffect, useRef } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import Face from './Face'

function App() {
  const [isListening, setIsListening] = useState(true);
  const [trigger, setTrigger] = useState(false);
  const [triggerDetails, setTriggerDetails] = useState(null);
  const [alert, setAlert] = useState(null);
  const [speaking, setSpeaking] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [voiceText, setVoiceText] = useState(null);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const silenceTimer = useRef(null);
  let fetched = false;
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    finalTranscript,
  } = useSpeechRecognition();
  const startListening = () =>
    SpeechRecognition.startListening({ continuous: true });

  //todo
  let patientName = 'John Doe';
  let patientData = '{  "patient_name": ' + patientName + ',  "daily_medications": [    {      "name": "Atorvastatin",      "dose": "20mg",      "frequency": "once a day"    },    {      "name": "Lisinopril",      "dose": "10mg",      "frequency": "once a day"    }  ],  "current_medical_issues": [    {      "issue": "Hypertension",      "diagnosis_date": "2023-01-15"    },    {      "issue": "High Cholesterol",      "diagnosis_date": "2023-02-20"    }  ],  "at_risk_data": {    "smoking_status": "Former smoker",    "family_history": [      "Heart Disease",      "Diabetes"    ],    "BMI": 28.5  },  "previous_appointment_data": [    {      "date": "2023-03-10",      "reason": "Routine check-up",      "notes": "Blood pressure slightly elevated. Recommended dietary changes."    },    {      "date": "2023-04-22",      "reason": "Follow-up for hypertension",      "notes": "Blood pressure improved. Continue current medication."    }  ]}'

  const simulateAlert = (alert) => {
    const newAlert = {
      message: alert + ` at ${new Date().toLocaleTimeString()}`,
    };
    setAlert(newAlert);
  };

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      console.error("Browser does not support speech recognition.");
      return;
    }

    if (trigger && !fetched) {
      fetched = true;
      let trigDetails = "Fallen to the ground"; //todo
      setTriggerDetails(trigDetails);
      fetchFirstQuestion(trigDetails);
      simulateAlert(trigDetails);
    }
  }, [trigger]);


  const fetchFirstQuestion = async (triggerDetails) => {
    try {
      const response = await fetch('http://localhost:3001/firstQuestion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ triggerDetails: triggerDetails, patientData: patientData }),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setVoiceText(data.question);
      createAudioURL(data.buffer);
      setSpeaking(true);
      resetTranscript();
      startListening();// Start listening after setting the question
    } catch (error) {
      console.error('Failed to fetch question:', error);
    }
  };

  async function createAudioURL(audioBuffer) {
    const blob = new Blob(
      [new Uint8Array(audioBuffer.data)],
      { type: "audio/mp3" }
    );
    const url = URL.createObjectURL(blob);
    console.log(url);
    setAudioUrl(url);
  }

  useEffect(() => {
    if (transcript) {
      setIsUserSpeaking(true);
      clearTimeout(silenceTimer.current);

      silenceTimer.current = setTimeout(() => {
        setIsUserSpeaking(false);
        console.log(transcript)
        fetchFollowUp(transcript);
      }, 2500); // 3.5 sec of silence untill it auto submits
    }
  }, [transcript]);


  const fetchFollowUp = async (userResponse) => {
    try {
      const response = await fetch('http://localhost:3001/followUp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ patientData: patientData, triggerDetails: triggerDetails, previousQuestion: voiceText, userResponse: userResponse }),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setVoiceText(data.question);
      createAudioURL(data.buffer);
      setSpeaking(true);
      resetTranscript();
      setIsListening(true);
    } catch (error) {
      console.error('Failed to fetch question:', error);
    }
  };



  useEffect(() => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.playbackRate = 1.17;

      // Event handler for when audio stops playing
      audio.onended = () => {
        setSpeaking(false);
        resetTranscript();
      }

      // Ensure that the audio is loaded before attempting to play it
      audio.addEventListener("canplaythrough", () => {
        setSpeaking(true);
        audio.play();
      });
    }
  }, [audioUrl]);
  console.log(trigger)
  return (
    <div className="App container-fluid vh-100 d-flex flex-column">
      <Face trigger={trigger} setTrigger={setTrigger} />
      <header className="row">
        <div className="col-12">
          <div className="d-flex align-items-center py-2">
            <img src={logo} alt="Company Logo" className="me-2" style={{ height: '50px' }} />
            <span className="h4 mb-0">MediLive</span>
          </div>
        </div>
      </header>

      <main className="row flex-grow-1">
        <div className="col-md-8 position-relative d-flex flex-column">
          {trigger ? (
            <>
              <div className="nurse-container">
                <Nurse speaking={speaking} />
                {trigger && (
                  <div className="webcam-overlay">
                    <WebcamCap />
                  </div>
                )}
              </div>
              <div className="question text-center mt-auto">
                <Typewriter
                  key={voiceText}
                  options={{
                    delay: 20,
                  }}
                  onInit={(typewriter) => {
                    typewriter
                      .typeString(voiceText)
                      .start();
                  }}
                />
              </div>
            </>
          ) : <WebcamCap />}
         
        </div>

        <div className="col-md-4">
          <h3>Action Log</h3>
          <ActionLog newAlert={alert} />
        </div>

      </main>

      < Footer />
    </div>
  );
}

export default App;
