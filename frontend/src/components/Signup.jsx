import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Signup.css';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [showModal, setShowModal] = useState(false);       // ✅ 가입 완료 모달
  const [showErrorModal, setShowErrorModal] = useState(false); // ✅ 에러 모달
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!username || !name || !email || !password) {
      setErrorMessage('모든 칸을 입력해주세요.');
      setShowErrorModal(true);
      return;
    }

    if (password.length < 6) {
      setErrorMessage('비밀번호는 최소 6자 이상이어야 합니다.');
      setShowErrorModal(true);
      return;
    }

    try {
      await axios.post('https://advanced-closely-garfish.ngrok-free.app/auth/signup', {
        username,
        name,
        email,
        password,
      });

      setUsername('');
      setName('');
      setEmail('');
      setPassword('');
      setShowModal(true);
    } catch (error) {
      console.error('❌ 회원가입 오류:', error);
      setErrorMessage('회원가입 실패: ' + (error.response?.data?.detail || '서버 오류'));
      setShowErrorModal(true);
    }
  };

  const handleModalConfirm = () => {
    setShowModal(false);
    navigate('/login');
  };

  const handleErrorConfirm = () => {
    setShowErrorModal(false);
  };

  return (
    <>
      <div className="signup-container">
        <h2>회원가입</h2>
        <input
          type="text"
          placeholder="아이디"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="text"
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleSignup}>가입하기</button>
      </div>

      {/* ✅ 가입 완료 모달 */}
      {showModal && (
        <div className="modal-overlay">
          <div className="login-success-modal">
            <p>🎉 회원가입이 완료되었습니다!</p>
            <button onClick={handleModalConfirm}>확인</button>
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
