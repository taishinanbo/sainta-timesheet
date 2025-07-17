// src/components/PasswordModal.jsx
import React, { useState } from 'react';
import '../assets/css/PasswordModal.css';

export default function PasswordModal({ user, action, onClose, onSuccess }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/auth/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || 'パスワードが違います');
        return;
      }

      onSuccess();
    } catch {
      setError('通信エラーが発生しました');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h3>{user.name} さんの {action} 操作にパスワード確認が必要です</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="パスワードを入力"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoFocus
            required
          />
          {error && <p className="error-text">{error}</p>}
          <div className="modal-actions">
            <button type="submit">確認</button>
            <button type="button" className="cancel" onClick={onClose}>キャンセル</button>
          </div>
        </form>
      </div>
    </div>
  );
}