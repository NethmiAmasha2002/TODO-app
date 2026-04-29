import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

export const useTodos = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    try { setError(null); const r = await api.getAll(); setTodos(r.data); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const create = async (data) => {
    const tmp = `tmp-${Date.now()}`;
    const opt = { _id: tmp, done: false, createdAt: new Date().toISOString(), priority: 'medium', ...data };
    setTodos(p => [opt, ...p]);
    try {
      const r = await api.create(data);
      setTodos(p => p.map(t => t._id === tmp ? r.data : t));
      return { success: true };
    } catch (e) {
      setTodos(p => p.filter(t => t._id !== tmp));
      return { success: false, error: e.message };
    }
  };

  const update = async (id, data) => {
    const prev = todos.find(t => t._id === id);
    setTodos(p => p.map(t => t._id === id ? { ...t, ...data } : t));
    try {
      const r = await api.update(id, data);
      setTodos(p => p.map(t => t._id === id ? r.data : t));
      return { success: true };
    } catch (e) {
      setTodos(p => p.map(t => t._id === id ? prev : t));
      return { success: false, error: e.message };
    }
  };

  const toggle = async (id) => {
    setTodos(p => p.map(t => t._id === id ? { ...t, done: !t.done } : t));
    try { const r = await api.toggleDone(id); setTodos(p => p.map(t => t._id === id ? r.data : t)); }
    catch { setTodos(p => p.map(t => t._id === id ? { ...t, done: !t.done } : t)); }
  };

  const remove = async (id) => {
    const prev = todos;
    setTodos(p => p.filter(t => t._id !== id));
    try { await api.delete(id); return { success: true }; }
    catch (e) { setTodos(prev); return { success: false, error: e.message }; }
  };

  return { todos, loading, error, create, update, toggle, remove, refetch: fetch };
};
