import React, { useState, useRef, useEffect } from 'react';
import styles from './TodoItem.module.css';

const PRIORITY_CONFIG = {
  high:   { color: '#ff5c7a', label: 'High' },
  medium: { color: '#ffaa44', label: 'Medium' },
  low:    { color: '#00d4aa', label: 'Low' },
};

const PRIORITIES = ['low', 'medium', 'high'];

export default function TodoItem({ todo, onToggle, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description || '');
  const [priority, setPriority] = useState(todo.priority || 'medium');
  const [dueDate, setDueDate] = useState(todo.dueDate ? todo.dueDate.split('T')[0] : '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const titleRef = useRef(null);

  useEffect(() => { if (editing && titleRef.current) titleRef.current.focus(); }, [editing]);
  useEffect(() => {
    setTitle(todo.title);
    setDescription(todo.description || '');
    setPriority(todo.priority || 'medium');
    setDueDate(todo.dueDate ? todo.dueDate.split('T')[0] : '');
  }, [todo]);

  const handleSave = async () => {
    if (!title.trim()) { setError('Title cannot be empty'); return; }
    setSaving(true); setError('');
    const result = await onUpdate(todo._id, { title: title.trim(), description: description.trim(), priority, dueDate: dueDate || null });
    setSaving(false);
    if (result.success) setEditing(false);
    else setError(result.error);
  };

  const handleCancel = () => {
    setTitle(todo.title); setDescription(todo.description || '');
    setPriority(todo.priority || 'medium'); setDueDate(todo.dueDate ? todo.dueDate.split('T')[0] : '');
    setError(''); setEditing(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete(todo._id);
  };

  const isOverdue = todo.dueDate && !todo.done && new Date(todo.dueDate) < new Date();
  const isDueSoon = todo.dueDate && !todo.done && !isOverdue &&
    (new Date(todo.dueDate) - new Date()) < 86400000 * 2;

  const cfg = PRIORITY_CONFIG[todo.priority] || PRIORITY_CONFIG.medium;

  const formatDate = (d) => {
    if (!d) return null;
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (editing) {
    return (
      <div className={`${styles.card} ${styles.editMode}`}>
        <div className={styles.editPriorityBar} style={{ background: PRIORITY_CONFIG[priority].color }} />
        <div className={styles.editBody}>
          <input ref={titleRef} className={`${styles.editTitleInput} ${error ? styles.inputErr : ''}`}
            value={title} onChange={e => { setTitle(e.target.value); setError(''); }}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSave(); } if (e.key === 'Escape') handleCancel(); }}
            maxLength={200} placeholder="Task title..." />
          <textarea className={styles.editDescInput} value={description}
            onChange={e => setDescription(e.target.value)} placeholder="Description (optional)..." maxLength={1000} rows={2} />
          {error && <p className={styles.errMsg}>{error}</p>}
          <div className={styles.editRow}>
            <div className={styles.editPriority}>
              {PRIORITIES.map(p => (
                <button key={p} type="button"
                  className={`${styles.pBtn} ${priority === p ? styles.pActive : ''}`}
                  style={priority === p ? { borderColor: PRIORITY_CONFIG[p].color, color: PRIORITY_CONFIG[p].color } : {}}
                  onClick={() => setPriority(p)}>
                  <span className={styles.pDot} style={{ background: PRIORITY_CONFIG[p].color }} />
                  {PRIORITY_CONFIG[p].label}
                </button>
              ))}
            </div>
            <input type="date" className={styles.editDate} value={dueDate}
              onChange={e => setDueDate(e.target.value)} />
          </div>
          <div className={styles.editActions}>
            <button className={styles.cancelEditBtn} onClick={handleCancel}>Cancel</button>
            <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
              {saving ? <span className={styles.spinner} /> : 'Save changes'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.card} ${todo.done ? styles.done : ''} ${deleting ? styles.exit : ''}`}>
      <div className={styles.priorityBar} style={{ background: cfg.color, opacity: todo.done ? 0.3 : 1 }} />

      <button className={`${styles.checkbox} ${todo.done ? styles.checked : ''}`}
        onClick={() => onToggle(todo._id)} aria-label={todo.done ? 'Mark undone' : 'Mark done'}
        style={todo.done ? {} : { '--hover-color': cfg.color }}>
        {todo.done && (
          <svg viewBox="0 0 12 10" fill="none"><path d="M1 5L4.5 8.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        )}
      </button>

      <div className={styles.body}>
        <div className={styles.titleRow}>
          <p className={styles.titleTxt}>{todo.title}</p>
          <div className={styles.badges}>
            <span className={styles.badge} style={{ color: cfg.color, background: `${cfg.color}15`, border: `1px solid ${cfg.color}30` }}>
              <span className={styles.bDot} style={{ background: cfg.color }} />
              {cfg.label}
            </span>
            {todo.dueDate && (
              <span className={`${styles.badge} ${isOverdue ? styles.badgeOverdue : isDueSoon ? styles.badgeDueSoon : styles.badgeDate}`}>
                {isOverdue ? '⚠ Overdue' : isDueSoon ? `⏰ ${formatDate(todo.dueDate)}` : `📅 ${formatDate(todo.dueDate)}`}
              </span>
            )}
          </div>
        </div>

        {todo.description && (
          <div className={styles.descWrap}>
            <p className={`${styles.descTxt} ${expanded ? styles.descExpanded : ''}`}>{todo.description}</p>
            {todo.description.length > 80 && (
              <button className={styles.moreBtn} onClick={() => setExpanded(p => !p)}>
                {expanded ? 'Less' : 'More'}
              </button>
            )}
          </div>
        )}
      </div>

      <div className={styles.actions}>
        <button className={styles.iconBtn} onClick={() => setEditing(true)} title="Edit">
          <EditIcon />
        </button>
        <button className={`${styles.iconBtn} ${styles.delBtn}`} onClick={handleDelete} disabled={deleting} title="Delete">
          {deleting ? <span className={styles.smallSpinner} /> : <TrashIcon />}
        </button>
      </div>
    </div>
  );
}

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M9.5 1.5L12.5 4.5L4.5 12.5H1.5V9.5L9.5 1.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    <path d="M7.5 3.5L10.5 6.5" stroke="currentColor" strokeWidth="1.3"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2 3.5H12M5 3.5V2.5C5 2.22 5.22 2 5.5 2H8.5C8.78 2 9 2.22 9 2.5V3.5M5.5 6V10.5M8.5 6V10.5M3 3.5L3.75 11.5C3.78 11.82 4.05 12.07 4.38 12.07H9.62C9.95 12.07 10.22 11.82 10.25 11.5L11 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
