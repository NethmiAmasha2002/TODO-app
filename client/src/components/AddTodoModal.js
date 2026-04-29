import React, { useState, useEffect, useRef } from 'react';
import s from './AddTodoModal.module.css';

const PRIORITIES = ['low', 'medium', 'high'];

function MiniCalendar({ value, onChange }) {
  const today = new Date();
  const [view, setView] = useState(() => value ? new Date(value) : new Date(today));

  const year = view.getFullYear();
  const month = view.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const DAYS = ['Su','Mo','Tu','We','Th','Fr','Sa'];

  const prev = () => setView(new Date(year, month - 1, 1));
  const next = () => setView(new Date(year, month + 1, 1));

  const selected = value ? new Date(value + 'T00:00:00') : null;

  const isSelected = (d) => selected &&
    selected.getFullYear() === year &&
    selected.getMonth() === month &&
    selected.getDate() === d;

  const isToday = (d) =>
    today.getFullYear() === year &&
    today.getMonth() === month &&
    today.getDate() === d;

  const isPast = (d) => new Date(year, month, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const pick = (d) => {
    if (isPast(d)) return;
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    onChange(`${year}-${mm}-${dd}`);
  };

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className={s.calendar}>
      <div className={s.calHeader}>
        <button type="button" className={s.calNav} onClick={prev}>‹</button>
        <span className={s.calTitle}>{MONTHS[month]} {year}</span>
        <button type="button" className={s.calNav} onClick={next}>›</button>
      </div>
      <div className={s.calGrid}>
        {DAYS.map(d => <span key={d} className={s.calDay}>{d}</span>)}
        {cells.map((d, i) => (
          <button
            key={i}
            type="button"
            className={`${s.calCell} ${!d ? s.calEmpty : ''} ${d && isSelected(d) ? s.calSelected : ''} ${d && isToday(d) && !isSelected(d) ? s.calToday : ''} ${d && isPast(d) ? s.calPast : ''}`}
            onClick={() => d && pick(d)}
            disabled={!d || isPast(d)}
          >
            {d || ''}
          </button>
        ))}
      </div>
      {value && (
        <button type="button" className={s.clearDate} onClick={() => onChange('')}>
          Clear date
        </button>
      )}
    </div>
  );
}

export default function AddTodoModal({ todo, onSubmit, onClose }) {
  const isEdit = !!todo;
  const [title, setTitle] = useState(todo?.title || '');
  const [desc, setDesc] = useState(todo?.description || '');
  const [priority, setPriority] = useState(todo?.priority || 'medium');
  const [dueDate, setDueDate] = useState(todo?.dueDate ? todo.dueDate.slice(0, 10) : '');
  const [tags, setTags] = useState(todo?.tags?.join(', ') || '');
  const [showCal, setShowCal] = useState(false);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [visible, setVisible] = useState(false);
  const titleRef = useRef(null);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    titleRef.current?.focus();
    const handleKey = (e) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 250);
  };

  const validate = () => {
    const errs = {};
    if (!title.trim()) errs.title = 'Title is required';
    else if (title.length > 200) errs.title = 'Max 200 characters';
    if (desc.length > 1000) errs.desc = 'Max 1000 characters';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    const tagList = tags.split(',').map(t => t.trim()).filter(Boolean);
    const result = await onSubmit({
      title: title.trim(), description: desc.trim(),
      priority, dueDate: dueDate || null, tags: tagList,
    });
    setSaving(false);
    if (result?.success === false) setErrors({ submit: result.error });
  };

  const formatDisplay = (d) => {
    if (!d) return '';
    return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className={`${s.overlay} ${visible ? s.overlayVisible : ''}`} onClick={e => { if (e.target === e.currentTarget) handleClose(); }}>
      <div className={`${s.modal} ${visible ? s.modalVisible : ''}`}>
        <div className={s.modalHeader}>
          <div className={s.modalTitleWrap}>
            <span className={s.modalIcon}>{isEdit ? '✎' : '+'}</span>
            <h2 className={s.modalTitle}>{isEdit ? 'Edit Task' : 'New Task'}</h2>
          </div>
          <button className={s.closeBtn} onClick={handleClose} aria-label="Close">×</button>
        </div>

        <form onSubmit={handleSubmit} noValidate className={s.form}>
          <div className={s.field}>
            <label className={s.label}>Title <span className={s.req}>*</span></label>
            <input
              ref={titleRef}
              className={`${s.input} ${errors.title ? s.inputErr : ''}`}
              value={title}
              onChange={e => { setTitle(e.target.value); setErrors(p => ({ ...p, title: '' })); }}
              placeholder="What needs to be done?"
              maxLength={200}
            />
            {errors.title && <p className={s.err}>{errors.title}</p>}
            <span className={s.counter}>{title.length}/200</span>
          </div>

          <div className={s.field}>
            <label className={s.label}>Description</label>
            <textarea
              className={`${s.textarea} ${errors.desc ? s.inputErr : ''}`}
              value={desc}
              onChange={e => { setDesc(e.target.value); setErrors(p => ({ ...p, desc: '' })); }}
              placeholder="Add details (optional)..."
              maxLength={1000}
              rows={3}
            />
            {errors.desc && <p className={s.err}>{errors.desc}</p>}
          </div>

          <div className={s.row}>
            <div className={s.field}>
              <label className={s.label}>Priority</label>
              <div className={s.priorities}>
                {PRIORITIES.map(p => (
                  <button
                    key={p} type="button"
                    className={`${s.pBtn} ${s[p]} ${priority === p ? s.pActive : ''}`}
                    onClick={() => setPriority(p)}
                  >
                    {p === 'high' ? '▲ ' : p === 'medium' ? '● ' : '▼ '}
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className={s.field}>
              <label className={s.label}>Due Date</label>
              <button
                type="button"
                className={`${s.dateBtn} ${dueDate ? s.dateBtnFilled : ''}`}
                onClick={() => setShowCal(v => !v)}
              >
                <span className={s.dateIcon}>📅</span>
                {dueDate ? formatDisplay(dueDate) : 'Pick a date'}
                {dueDate && <span className={s.dateClear} onClick={e => { e.stopPropagation(); setDueDate(''); }}>×</span>}
              </button>
              {showCal && (
                <div className={s.calWrap}>
                  <MiniCalendar value={dueDate} onChange={d => { setDueDate(d); setShowCal(false); }} />
                </div>
              )}
            </div>
          </div>

          <div className={s.field}>
            <label className={s.label}>Tags <span className={s.hint}>(comma separated)</span></label>
            <input
              className={s.input}
              value={tags}
              onChange={e => setTags(e.target.value)}
              placeholder="design, frontend, urgent"
            />
          </div>

          {errors.submit && <p className={s.submitErr}>{errors.submit}</p>}

          <div className={s.footer}>
            <button type="button" className={s.cancelBtn} onClick={handleClose}>Cancel</button>
            <button type="submit" className={s.submitBtn} disabled={saving}>
              {saving ? <span className={s.spinner} /> : (isEdit ? 'Save Changes' : 'Create Task')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}