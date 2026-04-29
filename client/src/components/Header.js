import React from 'react';
import styles from './Header.module.css';

export default function Header({ counts, search, onSearch, onMenuOpen }) {
  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <header className={styles.header}>
      <div className={styles.top}>
        <button className={styles.menuBtn} onClick={onMenuOpen} aria-label="Open menu">
          <span /><span /><span />
        </button>
        <div className={styles.greeting}>
          <h1 className={styles.title}>{greeting()} <span className={styles.wave}>👋</span></h1>
          <p className={styles.sub}>
            {counts.active > 0
              ? <><strong>{counts.active}</strong> task{counts.active !== 1 ? 's' : ''} remaining today</>
              : counts.all > 0
              ? <span className={styles.allDone}>All caught up! 🎉</span>
              : 'Ready to get things done?'}
          </p>
        </div>
      </div>

      <div className={styles.searchWrap}>
        <svg className={styles.searchIcon} width="15" height="15" viewBox="0 0 15 15" fill="none">
          <path d="M10 6.5C10 8.43 8.43 10 6.5 10C4.57 10 3 8.43 3 6.5C3 4.57 4.57 3 6.5 3C8.43 3 10 4.57 10 6.5Z" stroke="currentColor" strokeWidth="1.3"/>
          <path d="M9 9L13 13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
        <input
          className={styles.search}
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={e => onSearch(e.target.value)}
          aria-label="Search tasks"
        />
        {search && (
          <button className={styles.clearSearch} onClick={() => onSearch('')} aria-label="Clear search">×</button>
        )}
      </div>
    </header>
  );
}
