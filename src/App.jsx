import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import PatientSearch from './pages/PatientSearch';
import DoctorDashboard from './pages/DoctorDashboard';

function App() {
  const [role, setRole] = useState(null);
  const [loggedInDoctorId, setLoggedInDoctorId] = useState(null);

  const logout = () => {
    setRole(null);
    setLoggedInDoctorId(null);
  };

  return (
    <Router>
      <div className="app-container">
        <nav>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <h1>MediBridge</h1>
          </Link>
          <div>
             {role ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span className="badge">
                  Role: {role}
                </span>
                <button className="btn btn-outline" onClick={logout} style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>Logout</button>
              </div>
            ) : (
              <span className="badge">Not Logged In</span>
            )}
          </div>
        </nav>
        
        <Routes>
          <Route path="/" element={<Home setRole={setRole} setLoggedInDoctorId={setLoggedInDoctorId} />} />
          <Route path="/search" element={role === 'patient' ? <PatientSearch /> : <Home setRole={setRole} setLoggedInDoctorId={setLoggedInDoctorId} />} />
          <Route path="/dashboard" element={role === 'doctor' ? <DoctorDashboard doctorId={loggedInDoctorId} /> : <Home setRole={setRole} setLoggedInDoctorId={setLoggedInDoctorId} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
