/**
 * カスタムトーストコンポーネント
 * 他のコンポーネントで使用するために、トーストのスタイルを定義します。
 */
import React from 'react';
import { FaCheckCircle, FaTimesCircle, FaInfoCircle } from 'react-icons/fa';

const baseStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  fontFamily: `'Hiragino Kaku Gothic ProN', 'Hiragino Sans', 'Noto Sans JP', 'Yu Gothic', sans-serif`,
  fontSize: '15px',
};

export const SuccessToast = ({ message }) => (
  <div style={{ ...baseStyle, color: '#10b981' }}>
    <FaCheckCircle size={20} />
    <span>{message}</span>
  </div>
);

export const ErrorToast = ({ message }) => (
  <div style={{ ...baseStyle, color: '#ef4444' }}>
    <FaTimesCircle size={20} />
    <span>{message}</span>
  </div>
);

export const InfoToast = ({ message }) => (
  <div style={{ ...baseStyle, color: '#3b82f6' }}>
    <FaInfoCircle size={20} />
    <span>{message}</span>
  </div>
);
