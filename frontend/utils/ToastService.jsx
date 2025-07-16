/**
 * トーストサービス
 * 他のコンポーネントからトースト通知を表示するためのユーティリティ
 */
import { toast } from 'react-toastify';
import { SuccessToast, ErrorToast, InfoToast } from '../src/components/functional/CustomToast';

export const showSuccess = (message) => {
  toast(<SuccessToast message={message} />, {
    className: 'toast-base toast-success',
  });
};

export const showError = (message) => {
  toast(<ErrorToast message={message} />, {
    className: 'toast-base toast-error',
  });
};

export const showInfo = (message) => {
  toast(<InfoToast message={message} />, {
    className: 'toast-base toast-info',
  });
};
