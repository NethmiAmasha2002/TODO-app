import React from 'react';
import s from './TopBar.module.css';

const SORTS = [
  { v: 'newest', l: 'Newest first' },
  { v: 'oldest', l: 'Oldest first' },
  { v: 'priority', l: 'By priority' },
  { v: 'alpha', l: 'A → Z' },
];

const TITLES = {
  all: 'All Tasks', active: 'Active Tasks',
  done: 'Completed', high: 'High Priority',
};

export default function TopBar({ search, onSearch, sortBy, onSort, filter, count }) {
  return (
    <div className={s.bar}>
      <div className={s.left}>
        <h1 className={s.title}>{TITLES[filter] || 'Tasks'}</h1>
        <span className={s.count}>{count} {count === 1 ? 'task' : 'tasks'}</span>
      </div>
      <div className={s.right}>
        <div className={s.searchWrap}>
          <span className={s.searchIcon}>⌕</span>
          <input
            className={s.search}
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={e => onSearch(e.target.value)}
          />
          {search && <button className={s.clearSearch} onClick={() => onSearch('')}>×</button>}
        </div>
        <select className={s.sort} value={sortBy} onChange={e => onSort(e.target.value)}>
          {SORTS.map(s => <option key={s.v} value={s.v}>{s.l}</option>)}
        </select>
      </div>
    </div>
  );
}
