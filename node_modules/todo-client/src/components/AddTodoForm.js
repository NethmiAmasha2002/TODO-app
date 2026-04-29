import React, { useState } from 'react';
import styles from './AddTodoForm.module.css';

const PRIORITIES = [
  { key: 'low', label: 'Low', color: '#00d4aa' },
  { key: 'medium', label: 'Medium', color: '#ffaa44' },
  { key: 'high', label: 'High', color: '#ff5c7a' },
];

export default function AddTodoForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!title.trim()) errs.title = 'Title is required';
    else if (title.trim().length > 200) errs.title = 'Max 200 characters';
    if (description.length > 1000) errs.description = 'Max 1000 characters';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setSubmitting(true);
    const result = await onAdd({ title: title.trim(), description: description.trim(), priority, dueDate: dueDate || null });
    setSubmitting(false);
    if (result.success) { setTitle(''); setDescription(''); setPriority('medium'); setDueDate(''); setExpanded(false); }
  };

  return (
    <form className={`${styles.form} ${expanded ? styles.formExpanded : ''}`} onSubmit={handleSubmit} noValidate>
      <div className={styles.row1}>
        <div className={styles.inputWrap}>
          <input
            className={`${styles.titleInput} ${errors.title ? styles.hasError : ''}`}
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={e => { setTitle(e.target.value); setErrors(p => ({...p, title: ''})); }}
            onFocus={() => setExpanded(true)}
            disabled={submitting}
            maxLength={200}
          />
          {errors.title && <span className={styles.errorTip}>{errors.title}</span>}
        </div>
        <button type="submit" className={styles.addBtn} disabled={submitting || !title.trim()}>
          {submitting ? <span className={styles.spinner} /> : <>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1V13M1 7H13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>Add</span>
          </>}
        </button>
      </div>

      <div className={`${styles.extra} ${expanded ? styles.extraOpen : ''}`}>
        <textarea
          className={styles.descInput}
          placeholder="Add a description (optional)..."
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={2}
          maxLength={1000}
        />

        <div className={styles.row2}>
          <div className={styles.priorityGroup}>
            <span className={styles.fieldLabel}>Priority</span>
            <div className={styles.priorityBtns}>
              {PRIORITIES.map(p => (
                <button key={p.key} type="button"
                  className={`${styles.priorityBtn} ${priority === p.key ? styles.priorityActive : ''}`}
                  style={priority === p.key ? { borderColor: p.color, color: p.color, background: `${p.color}18` } : {}}
                  onClick={() => setPriority(p.key)}
                >
                  <span className={styles.priorityDot} style={{ background: p.color }} />
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.dueDateGroup}>
            <span className={styles.fieldLabel}>Due date</span>
            <input
              type="date"
              className={styles.dateInput}
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        <div className={styles.formFooter}>
          <span className={styles.charCount}>{title.length}/200</span>
          <button type="button" className={styles.cancelBtn} onClick={() => { setExpanded(false); setDescription(''); setDueDate(''); setErrors({}); }}>
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
