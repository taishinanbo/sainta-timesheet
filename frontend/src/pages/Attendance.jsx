import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PasswordModal from '../components/PasswordModal';
import './Attendance.css';

const getToken = () => {
  return localStorage.getItem('token') || '';
};

function AttendanceApp() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [lastMessage, setLastMessage] = useState('');
  const [timeRecords, setTimeRecords] = useState({});

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = getToken();
      if (!token) {
        console.warn('トークンが存在しないためユーザー取得をスキップ');
        return;
      }

      try {
        const res = await fetch('/api/auth/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const text = await res.text();
          console.error('APIエラー応答:', text);
          throw new Error('ユーザー取得に失敗しました');
        }

        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error('ユーザー取得エラー:', err);
      }
    };

    fetchUsers();
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

  const postClockAction = async (userMongoId, action) => {
    const token = getToken();
    if (!token) throw new Error('トークンが見つかりません');

    let endpoint = '';
    if (action === '出勤') endpoint = 'clock-in';
    else if (action === '退勤') endpoint = 'clock-out';
    else if (action === '休憩開始') endpoint = 'break-start';
    else if (action === '休憩終了') endpoint = 'break-end';
    else throw new Error('不明な操作です');

    const res = await fetch(`/api/timesheets/${userMongoId}/${endpoint}`, {
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
    return data.log;
  };

  const onPasswordConfirmSuccess = async () => {
    setPasswordModalOpen(false);
    try {
      const log = await postClockAction(selectedUser._id, selectedAction);
      updateTimeRecords(selectedUser._id, log);
      const timeText = new Date().toLocaleTimeString();
      setLastMessage(`${selectedUser.userName} さんの${selectedAction}が${timeText}に完了しました。`);
    } catch (err) {
      setLastMessage(`エラー: ${err.message}`);
    }
  };

  const updateTimeRecords = (mongoId, log) => {
    setTimeRecords((prev) => {
      const newRecords = { ...prev };
      newRecords[mongoId] = {
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
      <button onClick={() => navigate('/register')} className="btn btn-secondary">
        新規登録
      </button>

      <h1 className="attendance-title">出勤管理</h1>
      <div className="clock-display">現在時刻：{currentTime.toLocaleTimeString()}</div>

      <div className="attendance-grid">
        {users.map((user) => {
          const record = timeRecords[user._id] || {};
          const isWorking = record.出勤 && !record.退勤;
          const isResting =
            isWorking && record.休憩開始 && (!record.休憩終了 || record.休憩終了 < record.休憩開始);

          let classNames = 'attendance-card';
          if (isResting) classNames += ' resting';
          else if (isWorking) classNames += ' working';

          return (
            <button key={user._id} className={classNames} onClick={() => openActionModal(user)}>
              {user.userName}
            </button>
          );
        })}
      </div>

      {actionModalOpen && selectedUser && (
        <Modal onClose={closeActionModal}>
          <h2 className="modal-title">{selectedUser.userName} さんの操作</h2>
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