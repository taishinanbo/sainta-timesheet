import React from 'react';
import 'ldrs/dotSpinner';
import { FaInfoCircle } from 'react-icons/fa';
import { dotSpinner } from 'ldrs';

// Register spinner once
dotSpinner.register();

export default function LoadingModal() {
  return (
    <div className="modal-container">
      <div className="modal loading">
        <div className="modal-body">
          <div className="modal-loading-horizontal">
            <l-dot-spinner size="32" speed="0.75" color="black" />

            <div className="modal-loading-texts">
              <div className="modal-title-with-icon">
                <FaInfoCircle className="modal-icon" />
                <h2 className="modal-title">報告</h2>
              </div>
              <span className="modal-message">
                データをロード中です。少しお待ちください。
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
