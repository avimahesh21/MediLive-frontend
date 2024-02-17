import logo from './logo.svg';
import './App.css';
import WebcamCap from './WebcamCap';
import Nurse from './Nurse'; // Ensure this is correctly imported
import 'bootstrap/dist/css/bootstrap.min.css';
import Typewriter from "typewriter-effect";
import Footer from './Footer';
import React, { useState, useEffect, useRef } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

function App() {
  const [isListening, setIsListening] = useState(true);
  const [trigger, setTrigger] = useState(true);
  const [speaking, setSpeaking] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [voiceText, setVoiceText] = useState(null);
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    finalTranscript,
  } = useSpeechRecognition();
  const startListening = () =>
    SpeechRecognition.startListening({ continuous: true });

    
  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      console.error("Browser does not support speech recognition.");
      return;
    }

    if (trigger == true) {
      fetchFirstQuestion();
    }
  }, [trigger]);


  const fetchFirstQuestion = async () => {
    try {
      const response = await fetch('http://localhost:3001/firstQuestion');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setVoiceText(data.question);
      //make audio url
      //set audio url
      setSpeaking(true);
      startListening();// Start listening after setting the question
    } catch (error) {
      console.error('Failed to fetch question:', error);
    }
  };

  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const silenceTimer = useRef(null);
  useEffect(() => {
    if (transcript) {
      setIsUserSpeaking(true);
      clearTimeout(silenceTimer.current);

      silenceTimer.current = setTimeout(() => {
        setIsUserSpeaking(false);
        console.log(transcript)
        fetchFollowUp(transcript);
      }, 3000); // 4 sec of silence untill it auto submits
    }
  }, [transcript]);


  const fetchFollowUp = async (userResponse) => {
    try {
      const response = await fetch('http://localhost:3001/followUp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userResponse: userResponse }),
    });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setVoiceText(data.question);
      //make audio url
      //set audio url
      setSpeaking(true);
      //start lisetning
      setIsListening(true);
      resetTranscript();
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
        startListening();
      }
      // Ensure that the audio is loaded before attempting to play it
      audio.addEventListener("canplaythrough", () => {
        setSpeaking(true);
        //SpeechRecognition.stopListening();
        audio.play();
      });
    }
  }, [audioUrl]);




  return (
    <div className="App container-fluid vh-100 d-flex flex-column">
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
              <Nurse speaking={speaking} />
              <div className="question text-center mt-auto">
                <Typewriter
                  key={voiceText} // Add this line
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
          {trigger && (
            <div className="webcam-overlay">
              <WebcamCap />
            </div>
          )}
        </div>
        <div className="col-md-4">
          Action Log
        </div>
      </main>

      < Footer />
    </div>
  );
}

export default App;
