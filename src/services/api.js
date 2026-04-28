const API_URL = 'http://localhost:5000/api';

export const getDoctors = async (specialty = '') => {
  const url = specialty ? `${API_URL}/doctors?specialty=${specialty}` : `${API_URL}/doctors`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch doctors');
  return response.json();
};

export const createRequest = async (requestData) => {
  const response = await fetch(`${API_URL}/requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestData)
  });
  if (!response.ok) throw new Error('Failed to create request');
  return response.json();
};

export const getIncomingRequests = async (doctorId) => {
  const url = doctorId ? `${API_URL}/requests?doctorId=${doctorId}` : `${API_URL}/requests`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch requests');
  return response.json();
};

export const updateRequestStatus = async (id, status) => {
  const response = await fetch(`${API_URL}/requests/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  if (!response.ok) throw new Error('Failed to update request');
  return response.json();
};
