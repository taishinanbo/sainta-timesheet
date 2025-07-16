import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingModal from '../components/LoadingModal';
import { fetchData } from '../../utils/FetchService';
import { showSuccess, showError } from '../../utils/ToastService';

const Login = () => {
  const [identifier, setIdentifier] = useState(''); // email or userId
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // fetchDataを使ってログインAPIを呼び出す
            const response = await fetchData(
                'post',
                '/auth/login',
                { identifier, password }
            );

            localStorage.setItem('token', response.token);
            localStorage.setItem('userId', response.user.userId);
            showSuccess('ログインに成功しました！');

            navigate('/');
        } catch (err) {
            showError(err.response?.data?.message || 'ログインに失敗しました');
        } finally {
            setLoading(false);
        }
    };

  return (
    <>
      {loading && <LoadingModal />}

      <div className="application-wrapper">
        <div className="login-container">
          <h1 className="login-title">ログイン</h1>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="identifier">メールアドレスまたはユーザーID</label>
              <input
                type="text"
                id="identifier"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="example@example.com または user123"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">パスワード</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'ログイン中...' : 'ログイン'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
