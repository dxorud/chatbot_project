import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Signup.css'; // ✅ CSS 파일 분리

export default function Signup() {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate(); // ✅ 페이지 이동을 위한 훅

  const handleSignup = async () => {
    if (!username || !name || !email || !password) {
      alert('모든 칸을 입력해 주세요.');
      return;
    }

    if (password.length < 6) {
      alert('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    try {
      await axios.post('https://advanced-closely-garfish.ngrok-free.app/auth/signup', {
        username,
        name,
        email,
        password,
      });

      alert(`${name}님, 회원가입이 완료되었습니다!`);
      
      // ✅ 입력 필드 초기화
      setUsername('');
      setName('');
      setEmail('');
      setPassword('');

      // ✅ 로그인 페이지로 이동
      navigate('/login');

    } catch (error) {
      console.error('❌ 회원가입 오류:', error);
      alert('회원가입 실패: ' + (error.response?.data?.detail || '서버 오류'));
    }
  };

  return (
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
  );
}
