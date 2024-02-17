import React from 'react';
import logo from './logo.svg'; // Ensure this path is correct
import './App.css';
import WebcamCap from './WebcamCap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

function App() {
  return (
    <div className="App container-fluid">
      <header className="row">
        <div className="col-12">
          <div className="d-flex align-items-center py-2">
            <img src={logo} alt="Company Logo" className="me-2" style={{ height: '50px' }} />
            <span className="h4 mb-0">MediCare</span>
          </div>
        </div>
      </header>

      <main className="row mt-4">
        <div className="col-md-8">
          <WebcamCap />
        </div>
        <div className="col-md-4">
          <h3>Action Log</h3>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Action</th>
                <th scope="col">Time</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">1</th>
                <td>Login</td>
                <td>12:00 PM</td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>Viewed Page</td>
                <td>12:05 PM</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>

      <footer className="row mt-4">
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
