import React, { useState, useEffect } from 'react';
import './Attendance.css';

const users = [
  { id: 'user1', name: 'リシサンタナむ' },
  { id: 'user2', name: '難波 泰世' },
  { id: 'user3', name: '村岡 小夏' },
];

function AttendanceApp() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [lastMessage, setLastMessage] = useState('');
  const [timeRecords, setTimeRecords] = useState({}); // { userId: { 出勤: Date, 退勤: Date, 休憩開始: Date, 休憩終了: Date } }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const openActionModal = (user) => {
    setSelectedUser(user);
    setSelectedAction(null);
    setActionModalOpen(true);
  };

  const closeActionModal = () => {
    setActionModalOpen(false);
    setSelectedUser(null);
  };

  const openConfirmModal = (action) => {
    setSelectedAction(action);
    setConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setConfirmModalOpen(false);
    setSelectedAction(null);
  };

  const confirmAction = () => {
    const now = new Date();
    const timeText = `${now.getHours()}時${now.getMinutes()}分`;

    setTimeRecords(prev => {
      const userRecord = prev[selectedUser.id] || {};
      let newRecord = { ...userRecord };

      if (selectedAction === '出勤') {
        newRecord.出勤 = now;
        delete newRecord.退勤;
        delete newRecord.休憩開始;
        delete newRecord.休憩終了;
        setLastMessage(`${selectedUser.name} さんは ${timeText} に出勤しました。`);
      } else if (selectedAction === '退勤') {
        newRecord.退勤 = now;
        if (userRecord.出勤) {
          const diffMs = now - userRecord.出勤;
          const hours = Math.floor(diffMs / (1000 * 60 * 60));
          const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
          setLastMessage(`${selectedUser.name} さんは ${timeText} に退勤しました。勤務時間は ${hours} 時間 ${minutes} 分です。`);
        } else {
          setLastMessage(`${selectedUser.name} さんは ${timeText} に退勤しました。`);
        }
      } else if (selectedAction === '休憩開始') {
        newRecord.休憩開始 = now;
        delete newRecord.休憩終了;
        setLastMessage(`${selectedUser.name} さんは ${timeText} に休憩を開始しました。`);
      } else if (selectedAction === '休憩終了') {
        newRecord.休憩終了 = now;
        setLastMessage(`${selectedUser.name} さんは ${timeText} に休憩を終了しました。`);
      }

      return { ...prev, [selectedUser.id]: newRecord };
    });

    closeConfirmModal();
    closeActionModal();
  };

  return (
    <div className="attendance-page">
      <h1 className="attendance-title">出勤管理</h1>

      {/* 現在時刻 */}
      <div className="clock-display">
        現在時刻：{currentTime.toLocaleTimeString()}
      </div>

      <div className="attendance-grid">
        {users.map((user) => {
          const record = timeRecords[user.id] || {};
          const isWorking = record.出勤 && !record.退勤;
          const isResting = isWorking && record.休憩開始 && (!record.休憩終了 || record.休憩終了 < record.休憩開始);
          let classNames = 'attendance-card';
          if (isResting) {
            classNames += ' resting';
          } else if (isWorking) {
            classNames += ' working';
          }
          return (
            <button
              key={user.id}
              className={classNames}
              onClick={() => openActionModal(user)}
            >
              {user.name}
            </button>
          );
        })}
      </div>

      {actionModalOpen && (
        <Modal onClose={closeActionModal}>
          <h2 className="modal-title">{selectedUser.name} さんの操作</h2>
          <div className="modal-actions">
            <button onClick={() => openConfirmModal('出勤')}>出勤</button>
            <button onClick={() => openConfirmModal('休憩開始')}>休憩開始</button>
            <button onClick={() => openConfirmModal('休憩終了')}>休憩終了</button>
            <button onClick={() => openConfirmModal('退勤')}>退勤</button>
            <button className="modal-cancel" onClick={closeActionModal}>キャンセル</button>
          </div>
        </Modal>
      )}

      {confirmModalOpen && (
        <Modal onClose={closeConfirmModal}>
          <p className="confirm-text">
            {selectedUser.name} さんを <strong>{selectedAction}</strong> します。よろしいですか？
          </p>
          <div className="confirm-actions">
            <button onClick={confirmAction}>はい</button>
            <button className="modal-cancel" onClick={closeConfirmModal}>いいえ</button>
          </div>
        </Modal>
      )}

      {/* メッセージ表示 */}
      {lastMessage && <div className="action-message">{lastMessage}</div>}
    </div>
  );
}

function Modal({ children, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

export default AttendanceApp;