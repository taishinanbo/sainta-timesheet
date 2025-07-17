import React, { useState } from 'react';

function TimesheetForm({ onAdd }) {
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (!userId || !token) {
      alert('ログインしてください');
      return;
    }

    const newSheet = { userId, date, startTime, endTime, description };

    const res = await fetch('/api/timesheets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(newSheet),
    });

    if (res.ok) {
      const created = await res.json();
      onAdd(created);

      // フォームをリセット
      setDate('');
      setStartTime('');
      setEndTime('');
      setDescription('');
    } else {
      const err = await res.json();
      alert('エラー: ' + (err.message || '送信できませんでした'));
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 40 }}>
      <div>
        <label>日付: </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      <div>
        <label>開始時間: </label>
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
        />
      </div>
      <div>
        <label>終了時間: </label>
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
        />
      </div>
      <div>
        <label>内容: </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>
      <button type="submit" style={{ marginTop: 10 }}>
        追加
      </button>
    </form>
  );
}

export default TimesheetForm;