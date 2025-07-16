/**
 * @file Fetch.js
 * @description
 * APIエンドポイントにリクエストを送信するための汎用関数を定義しています。
 */

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5050/api'; // APIのURL

/**
 * @function fetchData
 * @description
 * 指定されたメソッドでAPIリクエストを送信します。
 * @param {string} method - HTTPメソッド ('get', 'post', 'put', 'delete'など)
 * @param {string} endpoint - エンドポイントのパス（例: '/auth/login'）
 * @param {Object} [data] - リクエストボディ（GET/DELETEには不要）
 * @param {Object} [options] - その他のaxiosオプション（headersなど）
 * @returns {Promise<Object>} - レスポンスデータ
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
