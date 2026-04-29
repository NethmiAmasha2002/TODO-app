import React from 'react';
import s from './Sidebar.module.css';

const NAV = [
  { key: 'all', label: 'All Tasks', icon: '◉' },
  { key: 'active', label: 'Active', icon: '○' },
  { key: 'done', label: 'Completed', icon: '✓' },
  { key: 'high', label: 'High Priority', icon: '▲' },
];

export default function Sidebar({ filter, onFilter, stats, onAdd }) {
  const pct = stats.all > 0 ? Math.round((stats.done / stats.all) * 100) : 0;

  return (
    <aside className={s.sidebar}>
      <div className={s.brand}>
        <span className={s.brandIcon}>T</span>
        <span className={s.brandName}>Taskr</span>
      </div>

      <button className={s.addBtn} onClick={onAdd}>
        <span className={s.addIcon}>+</span>
        New Task
      </button>

      <nav className={s.nav}>
        <p className={s.navLabel}>Views</p>
        {NAV.map(n => (
          <button
            key={n.key}
            className={`${s.navItem} ${filter === n.key ? s.active : ''}`}
            onClick={() => onFilter(n.key)}
          >
            <span className={s.navIcon}>{n.icon}</span>
            <span className={s.navText}>{n.label}</span>
            <span className={s.badge}>{stats[n.key] ?? 0}</span>
          </button>
        ))}
      </nav>

      <div className={s.footer}>
        <div className={s.progressWrap}>
          <div className={s.progressHeader}>
            <span className={s.progressLabel}>Overall Progress</span>
            <span className={s.progressPct}>{pct}%</span>
          </div>
          <div className={s.track}><div className={s.fill} style={{ width: `${pct}%` }} /></div>
          <p className={s.progressSub}>{stats.done} of {stats.all} tasks done</p>
        </div>
      </div>
    </aside>
  );
}
