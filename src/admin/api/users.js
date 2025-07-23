const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const BASE = `${API}/api/admin/users`;

async function handle(res, msg) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${msg}: ${res.status} ${text}`);
  }
  return res.json();
}

export const fetchUsers = async (params = {}) => {
  const q = new URLSearchParams(params).toString();
  return handle(await fetch(`${BASE}?${q}`, { credentials: 'include' }), 'Fetch failed');
};

export const getUser = async id =>
  handle(await fetch(`${BASE}/${id}`, { credentials: 'include' }), 'Fetch one failed');

export const createUser = async data =>
  handle(await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type':'application/json' },
    credentials: 'include',
    body: JSON.stringify(data)
  }), 'Create failed');

export const updateUser = async (id, data) =>
  handle(await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type':'application/json' },
    credentials: 'include',
    body: JSON.stringify(data)
  }), 'Update failed');

export const deleteUser = async id =>
  handle(await fetch(`${BASE}/${id}`, {
    method: 'DELETE',
    credentials: 'include'
  }), 'Delete failed');
