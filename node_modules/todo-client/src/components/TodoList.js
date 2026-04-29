import React from 'react';
import TodoItem from './TodoItem';
import styles from './TodoList.module.css';

export default function TodoList({ todos, loading, error, onToggle, onUpdate, onDelete, filter, search }) {
  if (loading) return (
    <div className={styles.list}>
      {[1,2,3,4].map(i => <div key={i} className={styles.skeleton} style={{ animationDelay: `${i*120}ms` }} />)}
    </div>
  );

  if (error) return (
    <div className={styles.errorBox}>
      <div className={styles.errorIcon}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M10 6V10M10 13.5V14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      </div>
      <div>
        <p className={styles.errorTitle}>Could not connect to server</p>
        <p className={styles.errorMsg}>Make sure the backend is running on port 5000. ({error})</p>
      </div>
    </div>
  );

  if (todos.length === 0) {
    const isSearch = search && search.trim() !== '';
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIllustration}>
          {isSearch ? (
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="22" cy="22" r="14" stroke="var(--text-3)" strokeWidth="2"/>
              <path d="M32 32L42 42" stroke="var(--text-3)" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M16 22H28M22 16V28" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
            </svg>
          ) : filter === 'done' ? (
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="18" stroke="var(--text-3)" strokeWidth="2"/>
              <path d="M16 24L21 29L32 18" stroke="var(--text-3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect x="8" y="12" width="32" height="8" rx="3" stroke="var(--text-3)" strokeWidth="1.5"/>
              <rect x="8" y="24" width="22" height="8" rx="3" stroke="var(--text-3)" strokeWidth="1.5"/>
              <path d="M32 28L36 32L44 24" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
        <p className={styles.emptyTitle}>
          {isSearch ? `No results for "${search}"` : filter === 'done' ? 'No completed tasks' : filter === 'active' ? 'Nothing active right now' : 'No tasks yet'}
        </p>
        <p className={styles.emptySub}>
          {isSearch ? 'Try different keywords' : filter === 'done' ? 'Complete some tasks and they\'ll show here' : 'Add your first task above to get started'}
        </p>
      </div>
    );
  }

  return (
    <ul className={styles.list}>
      {todos.map((todo, i) => (
        <li key={todo._id} className={styles.item} style={{ animationDelay: `${i * 35}ms` }}>
          <TodoItem todo={todo} onToggle={onToggle} onUpdate={onUpdate} onDelete={onDelete} />
        </li>
      ))}
    </ul>
  );
}
