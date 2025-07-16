import React, { useState } from 'react';
import './Attendance.css'; // スタイルシートをインポート

const users = [
  { id: 'user1', name: '山田 太郎' },
  { id: 'user2', name: '佐藤 花子' },
  { id: 'user3', name: '鈴木 次郎' },
  { id: 'user4', name: '田中 美咲' },
  { id: 'user5', name: '高橋 一郎' },
  { id: 'user6', name: '伊藤 玲奈' },
];

function Attendance() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

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
    console.log(
      `${selectedUser.name} が ${selectedAction} を ${now.toLocaleTimeString()} に実行しました。`
    );

    // ここにAPI送信処理を書く

    closeConfirmModal();
    closeActionModal();
  };

  return (
    <div className="attendance-page">
      <h1 className="attendance-title">出勤管理</h1>

      <div className="attendance-grid">
        {users.map((user) => (
          <button
            key={user.id}
            className="attendance-card"
            onClick={() => openActionModal(user)}
          >
            {user.name}
          </button>
        ))}
      </div>

      {actionModalOpen && selectedUser && (
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

      {confirmModalOpen && selectedUser && selectedAction && (
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

export default Attendance;