import React, { useState } from 'react';

function TimesheetForm({ onAdd }) {
  const [userId, setUserId] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newSheet = { userId, date, startTime, endTime, description };

    // バックエンドにPOST
    const res = await fetch('/api/timesheets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSheet),
    });

    if (res.ok) {
      const created = await res.json();
      onAdd(created);

      // フォームをリセット
      setUserId('');
      setDate('');
      setStartTime('');
      setEndTime('');
      setDescription('');
    } else {
      alert('エラーが発生しました');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 40 }}>
      <div>
        <label>ユーザーID: </label>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        />
      </div>
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