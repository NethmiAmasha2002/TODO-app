import React from 'react';
import TodoCard from './TodoCard';
import s from './TodoBoard.module.css';

export default function TodoBoard({ todos, loading, error, onToggle, onEdit, onDelete }) {
  if (loading) return (
    <div className={s.board}>
      {[1,2,3,4].map(i => <div key={i} className={s.skeleton} style={{ animationDelay: `${i*120}ms` }} />)}
    </div>
  );

  if (error) return (
    <div className={s.errorState}>
      <div className={s.errorIcon}>!</div>
      <h3>Connection Error</h3>
      <p>{error}</p>
      <p className={s.errorHint}>Make sure the backend server is running on port 5000.</p>
    </div>
  );

  if (!todos.length) return (
    <div className={s.empty}>
      <div className={s.emptyIllustration}>
        <div className={s.emptyLine} />
        <div className={s.emptyLine} style={{ width: '70%' }} />
        <div className={s.emptyLine} style={{ width: '50%' }} />
      </div>
      <p className={s.emptyTitle}>Nothing here</p>
      <p className={s.emptySub}>Add a task or change your filter.</p>
    </div>
  );

  return (
    <div className={s.board}>
      {todos.map((todo, i) => (
        <TodoCard
          key={todo._id}
          todo={todo}
          style={{ animationDelay: `${i * 40}ms` }}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
