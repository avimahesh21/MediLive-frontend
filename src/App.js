import logo from './visioncare-logo.png'; //'./crosslogo.png';
import patientProfilePic from './patientProfilePic.jpg';
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
import ArduinoData from './ArduinoData';
import Face from './Face'
import HeartRateMonitor from './HeartRateMonitor';

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


  useEffect(() => {
    if (trigger) {
      sendMessage();
      simulateAlert("Sent Info Text to Paramedics");
    }
  }, [trigger]);



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
  let patientData = '{  "patient_name": "${patientName}",  "daily_medications": [    {      "name": "Atorvastatin",      "dose": "20mg",      "frequency": "once a day"    },    {      "name": "Lisinopril",      "dose": "10mg",      "frequency": "once a day"    }  ],  "current_medical_issues": [    {      "issue": "Hypertension",      "diagnosis_date": "2023-01-15"    },    {      "issue": "High Cholesterol",      "diagnosis_date": "2023-02-20"    }  ],  "at_risk_data": {    "smoking_status": "Former smoker",    "family_history": [      "Heart Disease",      "Diabetes"    ],    "BMI": 28.5  },  "previous_appointment_data": [    {      "date": "2023-03-10",      "reason": "Routine check-up",      "notes": "Blood pressure slightly elevated. Recommended dietary changes."    },    {      "date": "2023-04-22",      "reason": "Follow-up for hypertension",      "notes": "Blood pressure improved. Continue current medication."    }  ]}'

  const simulateAlert = (alert) => {
    const newAlert = {
      id: Date.now(), // Ensure a unique ID for each alert
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
      let trigDetails = "Fainted"; //todo
      setTriggerDetails(trigDetails);
      fetchFirstQuestion(trigDetails);
      simulateAlert(trigDetails);
    }
  }, [trigger]);

  const patientInfo = JSON.parse(patientData);

  const sendMessage = async () => {


    // Construct the message
    const message = `

    We have an update regarding your patient, ${patientName}. They have unexpectedly fainted and require immediate assistance!
    ---
    Current Medical Issues:
    ${patientInfo.current_medical_issues.map(issue => `- ${issue.issue} - Diagnosed on ${issue.diagnosis_date}`).join('\n')}
    ---
    Daily Medications:
    ${patientInfo.daily_medications.map(med => `- ${med.name} ${med.dose}, ${med.frequency}`).join('\n')}
    ---
    At Risk Data:
    - Smoking Status: ${patientInfo.at_risk_data.smoking_status}
    - Family History: ${patientInfo.at_risk_data.family_history.join(', ')}
    - BMI: ${patientInfo.at_risk_data.BMI}
    ---
    Previous Appointment Data:
    ${patientInfo.previous_appointment_data.map(appointment => `- Date: ${appointment.date}, Reason: ${appointment.reason}, Notes: ${appointment.notes}`).join('\n')}
    
    Please review this information and advise on any further actions.
    
    `;


    try {
      const response = await fetch('http://localhost:3001/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message }) // Assuming the backend only needs the message text
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Message sent:', data.sid);
        // Handle success - update UI or show a message to the user
      } else {
        // Handle errors - response.ok is false if status code is not in the range 200-299
        const errorData = await response.json();
        console.error('Failed to send message:', errorData.error);
        // Update UI to show the error message
      }
    } catch (error) {
      // Catch network errors or issues with the fetch call itself
      console.error('Network error or issue with fetch:', error);
      // Update UI to show the network error message
    }
  };


  const fetchFirstQuestion = async (triggerDetails) => {
    if (!speaking) {
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
        simulateAlert("Contacted Medical Help");
      } catch (error) {
        console.error('Failed to fetch question:', error);
      }
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
    if (!speaking) {
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
    }
  };



  useEffect(() => {
    let audio;

    if (audioUrl) {
      // Stop any currently playing audio
      if (audio && !audio.ended) {
        audio.pause();
        audio.currentTime = 0; // Optionally reset the audio playback to the start
      }

      audio = new Audio(audioUrl);
      audio.playbackRate = 1.17;

      // Event handler for when audio stops playing
      audio.onended = () => {
        setSpeaking(false);
        resetTranscript();
        startListening();
      };

      // Ensure that the audio is loaded before attempting to play it
      audio.addEventListener("canplaythrough", () => {
        setSpeaking(true);
        audio.play().catch((e) => console.error("Error playing audio:", e));
      });
    }

    // Cleanup function to stop audio when the component unmounts or audioUrl changes
    return () => {
      if (audio) {
        audio.pause();
      }
    };
  }, [audioUrl, resetTranscript]);

  console.log(trigger)
  return (
    <div className="App container-fluid vh-100 d-flex flex-column">
      {/* <header className="row align-items-center">
        <div className="col bg-gray-800">
          <div className="d-flex align-items-center py-2">
            <img src={logo} alt="Company Logo" className="me-2" style={{ height: '50px' }} />
            <span className="h4 mb-0">MediLive</span>
          </div>
        </div>
        <div className="col text-end">
        </div>
      </header> */}

      {/* Header */}
      <header className="bg-gray-800 w-full">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center">
            <img src={logo} alt="Company Logo" className="h-10 mr-2" />
            <span className="text-white text-lg font-medium">MediLive</span>
          </div>
          <div className="flex items-center">
            <img src={patientProfilePic} alt="Patient Profile" className="h-10 w-10 rounded-full mr-2" />
            <span className="text-white text-lg font-medium">{patientName}</span>
          </div>
        </div>
      </header>


      <main className="row flex-grow-1">

        {/* Video/Nurse */}
        <div className="col-md-8 position-relative d-flex flex-column">
          {trigger ? (
            <>
              <div className="nurse-container">
                <Nurse speaking={speaking} />
                {trigger && (
                  <div className="webcam-overlay">
                    <WebcamCap></WebcamCap>
                  </div>
                )}
              </div>
              <div className="question text-center">
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
          ) : <div className='faceStyle'>
            <Face trigger={trigger} setTrigger={setTrigger} />
          </div>
          }
        </div> 
        
        {/* Action Log */}
        <div className="col-md-4 p-5">
          <h4>Action Log</h4>
          <div className="p-2.5 mb-2.5 rounded-md">
            <ActionLog newAlert={alert} />
          </div>

          <div>
            < HeartRateMonitor />
          </div>
          
        </div>


      </main>
    </div>
  );
}

export default App;
