import React from 'react';

const DoctorCard = ({ doctor, onRequestClick }) => {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1 }}>
        {doctor.imageUrl && (
          <img 
            src={doctor.imageUrl} 
            alt={doctor.name} 
            style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }} 
          />
        )}
        <h3 style={{ marginBottom: '0.25rem' }}>{doctor.name}</h3>
        <p style={{ color: 'var(--primary)', fontWeight: '500', marginBottom: '0.5rem' }}>{doctor.specialty}</p>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '1rem' }}>
          Experience: {doctor.experience} years
        </p>
        <span className={doctor.availability ? 'badge success' : 'badge'}>
          {doctor.availability ? 'Available' : 'Unavailable'}
        </span>
      </div>
      <button 
        className="btn" 
        style={{ marginTop: '1.5rem', width: '100%' }}
        onClick={() => onRequestClick(doctor)}
        disabled={!doctor.availability}
      >
        Request Consultation
      </button>
    </div>
  );
};

export default DoctorCard;
