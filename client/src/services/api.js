const BASE = process.env.REACT_APP_API_URL || '/api';

const req = async (url, opts = {}) => {
  const res = await fetch(`${BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
  return data;
};

export const api = {
  getAll: () => req('/todos'),
  create: (body) => req('/todos', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => req(`/todos/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  toggleDone: (id) => req(`/todos/${id}/done`, { method: 'PATCH' }),
  delete: (id) => req(`/todos/${id}`, { method: 'DELETE' }),
};
