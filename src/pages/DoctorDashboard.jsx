import React, { useState, useEffect } from 'react';
import { getIncomingRequests, updateRequestStatus } from '../services/api';

const DoctorDashboard = ({ doctorId }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchRequests = () => {
    setLoading(true);
    setError(null);
    getIncomingRequests(doctorId)
      .then(data => {
        setRequests(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load requests. Please try again later.');
        setLoading(false);
      });
  };

  useEffect(() => {
    if (doctorId) {
      fetchRequests();
    }
  }, [doctorId]);

  const handleUpdateStatus = async (requestId, newStatus) => {
    setActionLoadingId(requestId);
    setError(null);
    setSuccessMsg('');
    try {
      await updateRequestStatus(requestId, newStatus);
      setSuccessMsg(`Request successfully marked as ${newStatus}.`);
      fetchRequests(); // Refresh list after update
    } catch (err) {
      console.error(err);
      setError(`Failed to mark request as ${newStatus}.`);
    } finally {
      setActionLoadingId(null);
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  if (!doctorId) {
    return <p>Please login as a doctor.</p>;
  }

  return (
    <div className="animate-fade-in">
      <div className="glass-panel" style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '0.5rem' }}>Doctor Dashboard</h2>
        <p style={{ color: 'var(--text-light)' }}>Manage your incoming consultation requests.</p>
      </div>

      {successMsg && <div className="alert-success animate-fade-in">{successMsg}</div>}
      {error && <div className="alert-error animate-fade-in">{error}</div>}

      <h3 style={{ marginBottom: '1.5rem' }}>Incoming Requests ({requests.length})</h3>
      
      {loading ? (
        <div className="spinner"></div>
      ) : requests.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
          <p>No requests at the moment.</p>
        </div>
      ) : (
        <div className="grid">
          {requests.map(req => {
            const isPending = req.status === 'pending';
            const isActionLoading = actionLoadingId === req._id;

            return (
              <div key={req._id} className="card" style={{ borderLeft: `4px solid ${isPending ? '#D97706' : (req.status === 'accepted' ? '#059669' : '#DC2626')}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <h4 style={{ margin: 0 }}>{req.patientName}</h4>
                  <span className={`badge ${req.status}`}>{req.status}</span>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '0.5rem' }}>
                  <strong>Symptoms:</strong>
                </p>
                <p style={{ background: '#F8FAFC', padding: '0.75rem', borderRadius: '6px', fontSize: '0.9rem', marginBottom: '1rem' }}>
                  {req.patientSymptom}
                </p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '1rem' }}>
                  Received: {new Date(req.createdAt).toLocaleDateString()}
                </p>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    className="btn btn-accept" 
                    onClick={() => handleUpdateStatus(req._id, 'accepted')}
                    disabled={!isPending || isActionLoading}
                    style={{ flex: 1 }}
                  >
                    {isActionLoading && req.status === 'pending' ? '...' : 'Accept'}
                  </button>
                  <button 
                    className="btn btn-reject" 
                    onClick={() => handleUpdateStatus(req._id, 'rejected')}
                    disabled={!isPending || isActionLoading}
                    style={{ flex: 1 }}
                  >
                    {isActionLoading && req.status === 'pending' ? '...' : 'Reject'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
