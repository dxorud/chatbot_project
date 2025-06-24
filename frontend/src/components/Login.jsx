import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

export default function Login({ setIsLoggedIn }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      alert('아이디와 비밀번호를 입력하세요.');
      return;
    }

    try {
      const response = await axios.post('https://advanced-closely-garfish.ngrok-free.app/auth/login', {
        username,
        password,
      });

      const { token, user } = response.data;

      if (!user || !user.name) {
        alert('서버 응답에 사용자 정보가 없습니다.');
        return;
      }

      // ✅ 사용자 정보를 안전하게 저장 (이름과 아이디 분리 저장)
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('username', user.username); // ✅ 예: soyeon123
      localStorage.setItem('name', user.name);         // ✅ 예: 김소연

      console.log('✅ 로그인 성공:', user);

      setIsLoggedIn(true);
      alert(`${user.name}님, 로그인 성공!`);
      navigate('/');
    } catch (error) {
      console.error('❌ 로그인 에러:', error);
      alert('로그인 실패: ' + (error.response?.data?.detail || '서버 오류'));
    }
  };

  return (
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
  );
}
