import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDoctors } from '../services/api';

const Home = ({ setRole, setLoggedInDoctorId }) => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    getDoctors().then(setDoctors).catch(console.error);
  }, []);

  const loginAsPatient = () => {
    setRole('patient');
    navigate('/search');
  };

  const loginAsDoctor = (e) => {
    e.preventDefault();
    const docId = e.target.doctorId.value;
    if (docId) {
      setLoggedInDoctorId(docId);
      setRole('doctor');
      navigate('/dashboard');
    }
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ maxWidth: '700px', margin: '3rem auto' }}>
      <h2 style={{ marginBottom: '1rem', textAlign: 'center', fontSize: '2.5rem', color: 'var(--text-dark)' }}>MediBridge</h2>
      <p style={{ color: 'var(--text-light)', marginBottom: '3rem', textAlign: 'center', fontSize: '1.1rem' }}>
        Connecting patients with the right specialists quickly.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ marginBottom: '0.5rem', color: 'var(--primary)' }}>Patient Access</h3>
            <p style={{ marginBottom: '2rem', fontSize: '0.9rem', color: 'var(--text-light)' }}>
              Search for available doctors by specialty and request an appointment instantly.
            </p>
          </div>
          <button className="btn" onClick={loginAsPatient} style={{ width: '100%', fontSize: '1rem', padding: '0.75rem' }}>Login as Patient</button>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '0.5rem', color: 'var(--primary)' }}>Doctor Access</h3>
          <p style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-light)' }}>
            View your incoming consultation requests.
          </p>
          <form onSubmit={loginAsDoctor}>
            <label style={{ fontSize: '0.8rem' }}>Mock Profiles:</label>
            <select name="doctorId" required>
              <option value="">-- Choose Profile --</option>
              {doctors.map(doc => (
                <option key={doc._id} value={doc._id}>
                  {doc.name} ({doc.specialty})
                </option>
              ))}
            </select>
            <button type="submit" className="btn btn-outline" style={{ width: '100%', padding: '0.75rem' }}>Login as Doctor</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;
