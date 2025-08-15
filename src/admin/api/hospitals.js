// src/admin/api/hospitals.js
const BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5050";

export const fetchHospitals = async (q = "", page = 1, limit = 10) => {
  const res = await fetch(
    `${BASE}/api/admin/hospitals?q=${q}&page=${page}&limit=${limit}`,
    {
      credentials: "include",
    }
  );
  return res.json();
};

export const createHospital = async (hospital) => {
  const res = await fetch(`${BASE}/api/admin/hospitals`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(hospital),
  });
  if (!res.ok) throw await res.json();
  return res.json();
};

export const updateHospital = async (id, payload) => {
  const res = await fetch(`${BASE}/api/admin/hospitals/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw await res.json();
  return res.json();
};

export const deleteHospital = async (id) => {
  const res = await fetch(`${BASE}/api/admin/hospitals/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw await res.json();
};
