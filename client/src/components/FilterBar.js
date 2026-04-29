import React from 'react';
import styles from './FilterBar.module.css';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'done', label: 'Done' },
];

export default function FilterBar({ filter, onFilter, counts }) {
  return (
    <div className={styles.bar}>
      {FILTERS.map((f) => (
        <button
          key={f.key}
          className={`${styles.btn} ${filter === f.key ? styles.active : ''}`}
          onClick={() => onFilter(f.key)}
        >
          {f.label}
          <span className={styles.count}>{counts[f.key]}</span>
        </button>
      ))}
    </div>
  );
}
