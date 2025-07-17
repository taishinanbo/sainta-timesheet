// src/components/AttendanceApp.jsx
import React, { useState, useEffect } from 'react';
import PasswordModal from '../components/PasswordModal'; // パスワード入力モーダル
import './Attendance.css';

const users = [
  { id: 'user1', name: 'リシサンタナむ' },
  { id: 'user2', name: '難波 泰世' },
  { id: 'user3', name: '村岡 小夏' },
];

// ログイン後に保存したJWTトークンをlocalStorageから取得する想定
const getToken = () => localStorage.getItem('token') || '';

function AttendanceApp() {
  const token = getToken();

  const [selectedUser, setSelectedUser] = useState(null);
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [lastMessage, setLastMessage] = useState('');
  const [timeRecords, setTimeRecords] = useState({}); // { userId: { 出勤, 退勤, 休憩開始, 休憩終了 }}

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
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

  const onSelectAction = (action) => {
    setSelectedAction(action);
    setActionModalOpen(false);
    setPasswordModalOpen(true);
  };

  // APIへ打刻アクションを送信
  const postClockAction = async (userId, action) => {
    let endpoint = '';
    if (action === '出勤') endpoint = 'clock-in';
    else if (action === '退勤') endpoint = 'clock-out';
    else if (action === '休憩開始') endpoint = 'break-start';
    else if (action === '休憩終了') endpoint = 'break-end';
    else throw new Error('不明な操作です');

    const res = await fetch(`/api/timesheets/${userId}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || '打刻に失敗しました');
    }

    const data = await res.json();
    return data.log; // バックエンドから返る最新ログ
  };

  // パスワード認証成功時の処理
  const onPasswordConfirmSuccess = async () => {
    setPasswordModalOpen(false);
    try {
      const log = await postClockAction(selectedUser.id, selectedAction);
      updateTimeRecords(selectedUser.id, log);
      const timeText = new Date().toLocaleTimeString();
      setLastMessage(`${selectedUser.name} さんの${selectedAction}が${timeText}に完了しました。`);
    } catch (err) {
      setLastMessage(`エラー: ${err.message}`);
    }
  };

  // サーバーの勤怠ログを画面の状態に反映
  const updateTimeRecords = (userId, log) => {
    setTimeRecords((prev) => {
      const newRecords = { ...prev };
      newRecords[userId] = {
        出勤: log.clockIn ? new Date(log.clockIn) : null,
        退勤: log.clockOut ? new Date(log.clockOut) : null,
        休憩開始:
          log.breaks && log.breaks.length > 0 && log.breaks[log.breaks.length - 1].start
            ? new Date(log.breaks[log.breaks.length - 1].start)
            : null,
        休憩終了:
          log.breaks && log.breaks.length > 0 && log.breaks[log.breaks.length - 1].end
            ? new Date(log.breaks[log.breaks.length - 1].end)
            : null,
      };
      return newRecords;
    });
  };

  return (
    <div className="attendance-page">
      <h1 className="attendance-title">出勤管理</h1>

      <div className="clock-display">現在時刻：{currentTime.toLocaleTimeString()}</div>

      <div className="attendance-grid">
        {users.map((user) => {
          const record = timeRecords[user.id] || {};
          const isWorking = record.出勤 && !record.退勤;
          const isResting =
            isWorking && record.休憩開始 && (!record.休憩終了 || record.休憩終了 < record.休憩開始);
          let classNames = 'attendance-card';
          if (isResting) classNames += ' resting';
          else if (isWorking) classNames += ' working';

          return (
            <button key={user.id} className={classNames} onClick={() => openActionModal(user)}>
              {user.name}
            </button>
          );
        })}
      </div>

      {actionModalOpen && selectedUser && (
        <Modal onClose={closeActionModal}>
          <h2 className="modal-title">{selectedUser.name} さんの操作</h2>
          <div className="modal-actions">
            <button onClick={() => onSelectAction('出勤')}>出勤</button>
            <button onClick={() => onSelectAction('休憩開始')}>休憩開始</button>
            <button onClick={() => onSelectAction('休憩終了')}>休憩終了</button>
            <button onClick={() => onSelectAction('退勤')}>退勤</button>
            <button className="modal-cancel" onClick={closeActionModal}>
              キャンセル
            </button>
          </div>
        </Modal>
      )}

      {passwordModalOpen && selectedUser && selectedAction && (
        <PasswordModal
          user={selectedUser}
          action={selectedAction}
          onClose={() => setPasswordModalOpen(false)}
          onSuccess={onPasswordConfirmSuccess}
        />
      )}

      {lastMessage && <div className="action-message">{lastMessage}</div>}
    </div>
  );
}

// シンプルなモーダルコンポーネント
function Modal({ children, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

export default AttendanceApp;