import React, { useState } from 'react';
import axios from 'axios';
import './login.css';
import diaryImage from '../assets/chatbot_image_2.png';

export default function DiaryLandingPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleAction = async () => {
    try {
      if (isRegister) {
        if (!name || !email || !username || !password) {
          alert("회원가입이 불가능합니다. 모든 칸을 입력해 주세요.");
          return;
        }
        await axios.post('http://13.239.184.39:5000/signup', {
          username, name, email, password
        });
        alert("회원가입 성공!");
        setIsRegister(false);
      } else {
        if (!username || !password) {
          alert("아이디와 비밀번호를 입력해 주세요.");
          return;
        }
        const response = await axios.post('http://13.239.184.39:5000/login', {
          username, password
        });
        alert(response.data.message);
      }
    } catch (err) {
      alert("오류: " + (err.response?.data?.detail || "서버 오류 발생"));
    }
  };

  return (
    <div className="diary-container">
      <div className="left-panel">
        <h1>감정소비 다이어리</h1>
        <p>오늘의 소비와 감정을 기록하고 돌아볼 수 있는<br />나만의 감정소비 일기장</p>
        <img src={diaryImage} alt="다이어리 일러스트" className="diary-image" />
      </div>

      <div className="right-panel">
        <div className="tab-buttons">
          <button onClick={() => setIsRegister(false)} className={!isRegister ? 'active' : ''}>로그인</button>
          <button onClick={() => setIsRegister(true)} className={isRegister ? 'active' : ''}>회원가입</button>
        </div>

        <div className="form">
          {isRegister && (
            <>
              <input type="text" placeholder="이름" value={name} onChange={e => setName(e.target.value)} />
              <input type="email" placeholder="이메일" value={email} onChange={e => setEmail(e.target.value)} />
            </>
          )}
          <input type="text" placeholder="아이디" value={username} onChange={e => setUsername(e.target.value)} />
          <input type="password" placeholder="비밀번호" value={password} onChange={e => setPassword(e.target.value)} />
        </div>

        <button className="start-btn" onClick={handleAction}>
          {isRegister ? "가입하기" : "시작하기"}
        </button>
      </div>
    </div>
  );
}
