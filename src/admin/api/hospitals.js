// src/admin/api/hospitals.js
const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

export const fetchHospitals = async (q = '', page = 1, limit = 10) => {
  const res = await fetch(`${BASE}/admin/hospitals?q=${q}&page=${page}&limit=${limit}`, {
    credentials: 'include'
  });
  return res.json();
};

export const createHospital = async (payload) => {
  const res = await fetch(`${BASE}/admin/hospitals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw await res.json();
  return res.json();
};

export const updateHospital = async (id, payload) => {
  const res = await fetch(`${BASE}/admin/hospitals/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw await res.json();
  return res.json();
};

export const deleteHospital = async (id) => {
  const res = await fetch(`${BASE}/admin/hospitals/${id}`, {
    method: 'DELETE',
    credentials: 'include'
  });
  if (!res.ok) throw await res.json();
};
