// frontend/utils/FetchService.jsx

/**
 * @file FetchService.jsx
 * @description APIエンドポイントにリクエストを送信するための汎用関数
 */

import axios from 'axios';

// ✅ Viteでは `import.meta.env.VITE_〇〇` を使う！
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050/api';

/**
 * @function fetchData
 * @param {string} method - 'get' | 'post' | 'put' | 'delete'
 * @param {string} endpoint - APIのエンドポイント（例: '/auth/login'）
 * @param {Object} [data={}] - リクエストデータ
 * @param {Object} [options={}] - axiosの追加オプション（headersなど）
 */
export const fetchData = (method, endpoint, data = {}, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  const token = localStorage.getItem('sainta-token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'sainta-token': token }),
    ...options.headers
  };

  return axios({ method, url, data, headers, ...options })
    .then(res => res.data)
    .catch(error => {
      console.error(`[${method.toUpperCase()}] ${url} Error:`, error.response || error);
      throw error;
    });
};