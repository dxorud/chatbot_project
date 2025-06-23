import React, { useState } from 'react';
import axios from 'axios';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');         // 이름 상태 추가
  const [email, setEmail] = useState('');       // 이메일 상태 추가
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    if (!username || !name || !email || !password) {
      alert('모든 칸을 입력해 주세요.');
      return;
    }

    try {
      await axios.post('http://13.239.184.39:5000/auth/signup', {
        username,
        name,
        email,
        password,
      });
      alert('회원가입 성공!');
      // 필요시 초기화나 페이지 이동 처리
    } catch (error) {
      alert('회원가입 실패: ' + (error.response?.data?.detail || '서버 오류'));
    }
  };

  return (
    <div className="signup-container">
      <h2>회원가입</h2>
      <input
        type="text"
        placeholder="아이디"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="text"
        placeholder="이름"
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="이메일"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="비밀번호"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSignup}>회원가입</button>
    </div>
  );
}
