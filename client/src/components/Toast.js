import React, { useEffect, useState } from 'react';
import s from './Toast.module.css';

const ICONS = { success: '✓', error: '!', info: 'i' };

export default function Toast({ msg, type = 'error', onClose }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { requestAnimationFrame(() => setVis(true)); }, []);
  const close = () => { setVis(false); setTimeout(onClose, 250); };
  return (
    <div className={`${s.toast} ${s[type]} ${vis ? s.visible : ''}`}>
      <span className={s.icon}>{ICONS[type] || '!'}</span>
      <span className={s.msg}>{msg}</span>
      <button className={s.close} onClick={close}>×</button>
    </div>
  );
}
