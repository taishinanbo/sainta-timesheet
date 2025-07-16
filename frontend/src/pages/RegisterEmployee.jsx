import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingModal from '../components/LoadingModal';
import { fetchData } from '../../utils/FetchService';
import { showSuccess, showError } from '../../utils/ToastService';

const Register = () => {
    const [userInfo, setUserInfo] = useState({
        userId: '',
        userName: '',
        userEmail: '',
        userPassword: ''
    });

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserInfo({
            ...userInfo,
            [name]: value
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetchData(
                'post',
                '/auth/register',
                userInfo
            );

            showSuccess('ユーザー登録に成功しました！');
            navigate('/login');
        } catch (err) {
            showError(err.response?.data?.message || 'ユーザー登録に失敗しました');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {loading && <LoadingModal />}

            <div className="application-wrapper">
                <div className="register-container">
                    <h1 className="register-title">ユーザー登録</h1>

                    <form onSubmit={handleRegister} className="register-form">
                        <div className="form-group">
                            <label htmlFor="userId">ユーザーID</label>
                            <input
                                type="text"
                                id="userId"
                                name="userId"
                                value={userInfo.userId}
                                onChange={handleChange}
                                placeholder="user123"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="userName">ユーザー名</label>
                            <input
                                type="text"
                                id="userName"
                                name="userName"
                                value={userInfo.userName}
                                onChange={handleChange}
                                placeholder="山田太郎"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="userEmail">メールアドレス</label>
                            <input
                                type="email"
                                id="userEmail"
                                name="userEmail"
                                value={userInfo.userEmail}
                                onChange={handleChange}
                                placeholder="yamada@sainta.co.jp"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="userPassword">パスワード</label>
                            <input
                                type="password"
                                id="userPassword"
                                name="userPassword"
                                value={userInfo.userPassword}
                                onChange={handleChange}
                                placeholder="********"
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? '登録中...' : '登録'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Register;


// router.post('/register', async (req, res) => {
//   const { userId, userName, userEmail, userPassword } = req.body;

//   try {
//     const existing = await User.findOne({ $or: [{ userId }, { userEmail }] });
//     if (existing) return res.status(400).json({ message: 'User already exists' });

//     const hashedPassword = await bcrypt.hash(userPassword, 10);
//     const newUser = new User({
//       userId,
//       userName,
//       userEmail,
//       userPassword: hashedPassword,
//     });

//     await newUser.save();
//     res.status(201).json({ message: 'User registered', user: newUser });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });