import React, { useState } from 'react';
import s from './TodoCard.module.css';

const PRIORITY_COLOR = { high: s.high, medium: s.medium, low: s.low };
const PRIORITY_LABEL = { high: 'High', medium: 'Med', low: 'Low' };

function formatDate(d) {
  if (!d) return null;
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function isOverdue(d) {
  if (!d) return false;
  return new Date(d) < new Date() && !isNaN(new Date(d));
}

export default function TodoCard({ todo, onToggle, onEdit, onDelete, style }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    setTimeout(() => onDelete(todo._id), 250);
  };

  const overdue = !todo.done && isOverdue(todo.dueDate);

  return (
    <div className={`${s.card} ${todo.done ? s.done : ''} ${deleting ? s.exit : ''}`} style={style}>
      <button
        className={`${s.checkbox} ${todo.done ? s.checked : ''}`}
        onClick={() => onToggle(todo._id)}
        aria-label={todo.done ? 'Mark undone' : 'Mark done'}
      >
        {todo.done && (
          <svg viewBox="0 0 12 10" fill="none">
            <path d="M1 5L4.5 8.5L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>

      <div className={s.content}>
        <div className={s.titleRow}>
          <span className={s.title}>{todo.title}</span>
          <span className={`${s.priority} ${PRIORITY_COLOR[todo.priority] || s.medium}`}>
            {PRIORITY_LABEL[todo.priority] || 'Med'}
          </span>
        </div>
        {todo.description && <p className={s.desc}>{todo.description}</p>}
        <div className={s.meta}>
          <span className={s.date}>{formatDate(todo.createdAt)}</span>
          {todo.dueDate && (
            <span className={`${s.due} ${overdue ? s.overdue : ''}`}>
              {overdue ? '⚠ ' : ''}Due {formatDate(todo.dueDate)}
            </span>
          )}
          {todo.tags?.map(tag => (
            <span key={tag} className={s.tag}>{tag}</span>
          ))}
        </div>
      </div>

      <div className={s.actions}>
        <button className={s.actionBtn} onClick={() => onEdit(todo)} title="Edit" aria-label="Edit">
          <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
            <path d="M11.5 2.5L13.5 4.5L5.5 12.5H3.5V10.5L11.5 2.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
          </svg>
        </button>
        <button className={`${s.actionBtn} ${s.deleteBtn}`} onClick={handleDelete} title="Delete" aria-label="Delete">
          <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
            <path d="M3 5H13M6 5V3.5C6 3.22 6.22 3 6.5 3H9.5C9.78 3 10 3.22 10 3.5V5M4 5L4.9 13.1C4.96 13.6 5.42 14 5.97 14H10.03C10.58 14 11.04 13.6 11.1 13.1L12 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
