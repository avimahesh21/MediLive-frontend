import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import WebcamCap from './WebcamCap';
import Nurse from './Nurse'; // Ensure this is correctly imported
import 'bootstrap/dist/css/bootstrap.min.css';
import Typewriter from "typewriter-effect";

function App() {
  const [trigger, setTrigger] = useState(true);

  return (
    <div className="App container-fluid vh-100 d-flex flex-column">
      <header className="row">
        <div className="col-12">
          <div className="d-flex align-items-center py-2">
            <img src={logo} alt="Company Logo" className="me-2" style={{ height: '50px' }} />
            <span className="h4 mb-0">MediCare</span>
          </div>
        </div>
      </header>

      <main className="row flex-grow-1">
        <div className="col-md-8 position-relative d-flex flex-column">
          {trigger ? (
            <>
              <Nurse />
              <div className="question text-center mt-auto">
                <Typewriter
                  options={{
                    delay: 20,
                  }}
                  onInit={(typewriter) => {
                    typewriter
                      .typeString("Hi, I see that you have fallen down, please tell me your symptoms.")
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

      <footer className="row">
        <div className="col-12">
          <div className="py-3 text-center">
            Footer content goes here
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
