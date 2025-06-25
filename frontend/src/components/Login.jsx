import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

export default function Login({ setIsLoggedIn }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false); // 로그인 성공 모달
  const [showErrorModal, setShowErrorModal] = useState(false); // 에러 모달
  const [errorMessage, setErrorMessage] = useState(''); // 에러 메시지
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      setErrorMessage('아이디와 비밀번호를 입력하세요.');
      setShowErrorModal(true);
      return;
    }

    try {
      const response = await axios.post('https://advanced-closely-garfish.ngrok-free.app/auth/login', {
        username,
        password,
      });

      const { token, user } = response.data;
      if (!user || !user.name) {
        setErrorMessage('서버 응답에 사용자 정보가 없습니다.');
        setShowErrorModal(true);
        return;
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('username', user.username);
      localStorage.setItem('name', user.name);

      setIsLoggedIn(true);
      setShowModal(true); // 성공 모달 띄움
    } catch (error) {
      console.error('❌ 로그인 에러:', error);
      setErrorMessage('로그인 실패: ' + (error.response?.data?.detail || '서버 오류'));
      setShowErrorModal(true); // 에러 모달 띄움
    }
  };

  const handleConfirm = () => {
    setShowModal(false);
    navigate('/');
  };

  const handleErrorConfirm = () => {
    setShowErrorModal(false);
  };

  return (
    <>
      <div className="login-container">
        <h2>로그인</h2>
        <input
          type="text"
          placeholder="아이디"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>로그인</button>
      </div>

      {/* ✅ 로그인 성공 모달 */}
      {showModal && (
        <div className="modal-overlay">
          <div className="login-success-modal">
            <p>😎 로그인 되었습니다!</p>
            <button onClick={handleConfirm}>확인</button>
          </div>
        </div>
      )}

      {/* ✅ 에러 모달 */}
      {showErrorModal && (
        <div className="modal-overlay">
          <div className="login-success-modal">
            <p>{errorMessage}</p>
            <button onClick={handleErrorConfirm}>확인</button>
          </div>
        </div>
      )}
    </>
  );
}
