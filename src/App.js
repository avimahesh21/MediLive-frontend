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
  const [trigger, setTrigger] = useState(true);
  const [speaking, setSpeaking] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [voiceText, setVoiceText] = useState(null);
  const [response, setResponse] = useState(null);
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
    if (trigger == true){
      //call backend (openai) and get question
      //call backend (openai) and get tts file

      //set audio url
      setSpeaking(true);
      setVoiceText("Hi, this is from openAi")
      //setSpeaking(true);
      //set voice text
      //start lisetning
    }
  }, [trigger]);

  useEffect(() => {
    //use response and get voice text from openai
    
    //set audio url
    setSpeaking(true);
    setVoiceText("Follow up question")
    //start listening

  }, [response]);


  useEffect(() => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.playbackRate = 1.17;

      
      // Event handler for when audio stops playing
      audio.onended = () => {
        setSpeaking(false);
      }
        
          startListening();
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
