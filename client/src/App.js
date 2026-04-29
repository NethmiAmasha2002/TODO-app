import React, { useState, useMemo } from 'react';
import { useTodos } from './hooks/useTodos';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import TodoBoard from './components/TodoBoard';
import AddTodoModal from './components/AddTodoModal';
import Toast from './components/Toast';
import styles from './App.module.css';

export default function App() {
  const { todos, loading, error, create, update, toggle, remove } = useTodos();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showModal, setShowModal] = useState(false);
  const [editTodo, setEditTodo] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleCreate = async (data) => {
    const r = await create(data);
    if (!r.success) showToast(r.error);
    else { showToast('Task created!', 'success'); setShowModal(false); }
  };

  const handleUpdate = async (id, data) => {
    const r = await update(id, data);
    if (!r.success) showToast(r.error);
    else { showToast('Task updated!', 'success'); setEditTodo(null); }
    return r;
  };

  const handleDelete = async (id) => {
    const r = await remove(id);
    if (!r.success) showToast(r.error);
    else showToast('Task deleted', 'info');
  };

  const stats = useMemo(() => ({
    all: todos.length,
    active: todos.filter(t => !t.done).length,
    done: todos.filter(t => t.done).length,
    high: todos.filter(t => t.priority === 'high' && !t.done).length,
  }), [todos]);

  const filtered = useMemo(() => {
    let list = [...todos];
    if (filter === 'active') list = list.filter(t => !t.done);
    else if (filter === 'done') list = list.filter(t => t.done);
    else if (filter === 'high') list = list.filter(t => t.priority === 'high');
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(t => t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q));
    }
    if (sortBy === 'newest') list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    else if (sortBy === 'oldest') list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    else if (sortBy === 'priority') {
      const p = { high: 0, medium: 1, low: 2 };
      list.sort((a, b) => (p[a.priority] ?? 1) - (p[b.priority] ?? 1));
    } else if (sortBy === 'alpha') list.sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [todos, filter, search, sortBy]);

  return (
    <div className={styles.app}>
      <Sidebar
        filter={filter}
        onFilter={setFilter}
        stats={stats}
        onAdd={() => setShowModal(true)}
      />
      <main className={styles.main}>
        <TopBar
          search={search}
          onSearch={setSearch}
          sortBy={sortBy}
          onSort={setSortBy}
          filter={filter}
          count={filtered.length}
        />
        <TodoBoard
          todos={filtered}
          loading={loading}
          error={error}
          onToggle={toggle}
          onEdit={setEditTodo}
          onDelete={handleDelete}
        />
      </main>

      {(showModal || editTodo) && (
        <AddTodoModal
          todo={editTodo}
          onSubmit={editTodo ? (d) => handleUpdate(editTodo._id, d) : handleCreate}
          onClose={() => { setShowModal(false); setEditTodo(null); }}
        />
      )}

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
