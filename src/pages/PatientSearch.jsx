import React, { useState, useEffect } from 'react';
import { getDoctors, createRequest } from '../services/api';
import DoctorCard from '../components/DoctorCard';

const PatientSearch = () => {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [patientName, setPatientName] = useState('');
  const [symptoms, setSymptoms] = useState('');
  
  const [requestLoading, setRequestLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [requestError, setRequestError] = useState(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = (query = '') => {
    setLoading(true);
    setError(null);
    getDoctors(query)
      .then(data => {
        setDoctors(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to fetch doctors. Please check your connection.');
        setLoading(false);
      });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDoctors(search);
  };

  const submitRequest = async (e) => {
    e.preventDefault();
    setRequestLoading(true);
    setRequestError(null);
    setSuccessMsg('');
    try {
      await createRequest({
        patientName,
        patientSymptom: symptoms,
        doctorId: selectedDoctor._id
      });
      setSuccessMsg('Request sent successfully!');
      setTimeout(() => {
        setSelectedDoctor(null);
        setSuccessMsg('');
        setPatientName('');
        setSymptoms('');
      }, 3000);
    } catch (err) {
      console.error(err);
      setRequestError('Failed to send request. Please try again.');
    } finally {
      setRequestLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="glass-panel" style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Find a Specialist</h2>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem' }}>
          <input 
            type="text" 
            placeholder="Search by specialty (e.g. Cardiologist)" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ marginBottom: 0 }}
          />
          <button type="submit" className="btn" style={{ whiteSpace: 'nowrap' }}>Search</button>
        </form>
      </div>

      {error && <div className="alert-error animate-fade-in">{error}</div>}

      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="grid">
          {doctors.map(doc => (
            <DoctorCard key={doc._id} doctor={doc} onRequestClick={setSelectedDoctor} />
          ))}
          {doctors.length === 0 && !error && <p style={{ textAlign: 'center', gridColumn: '1 / -1' }}>No doctors found.</p>}
        </div>
      )}

      {selectedDoctor && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '500px', margin: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0 }}>Request Consultation</h3>
              <button 
                onClick={() => { setSelectedDoctor(null); setSuccessMsg(''); setRequestError(null); }} 
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-light)' }}
              >&times;</button>
            </div>
            
            {successMsg ? (
              <div className="alert-success animate-fade-in">
                <p>✅ {successMsg}</p>
              </div>
            ) : (
              <form onSubmit={submitRequest}>
                {requestError && <div className="alert-error animate-fade-in">{requestError}</div>}
                <p style={{ marginBottom: '1rem', color: 'var(--primary)', fontWeight: '500' }}>
                  Doctor: {selectedDoctor.name} ({selectedDoctor.specialty})
                </p>
                <label>Your Name</label>
                <input required value={patientName} onChange={e => setPatientName(e.target.value)} placeholder="e.g. Jane Doe" />
                
                <label>Symptoms / Reason for Visit</label>
                <textarea required rows="4" value={symptoms} onChange={e => setSymptoms(e.target.value)} placeholder="Describe briefly..."></textarea>
                
                <button type="submit" className="btn" style={{ width: '100%', marginTop: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '48px' }} disabled={requestLoading}>
                  {requestLoading ? <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px', margin: 0, borderLeftColor: 'white' }}></div> : 'Send Request'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientSearch;
