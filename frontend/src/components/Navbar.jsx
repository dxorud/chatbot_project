import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import chatbotLogo from '../assets/chatbot_image_1.png';
import './Navbar.css';

export default function Navbar({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const name = localStorage.getItem('name');
    if (name) {
      setUserName(name);
    } else {
      setUserName('');
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('username'); 
    localStorage.removeItem('name');     
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left-group">
        <Link to="/" className="logo">
          <img src={chatbotLogo} alt="로고" className="logo-image" />
        </Link>
        <div className="navbar-center">
          <Link to="/">Home</Link>
          <Link to="/analysis">Analysis</Link>
          <a href="https://eunbie.site/chat" target="_blank" rel="noopener noreferrer">Chat</a>
          <a href="https://eunbie.site/diary" target="_blank" rel="noopener noreferrer">Diary</a>
          <a href="https://eunbie.site/budgetA" target="_blank" rel="noopener noreferrer">Budget</a>
        </div>
      </div>

      <div className="navbar-right">
        <a
          href="https://preferably-united-wren.ngrok-free.app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button className="fetch-btn">금융 데이터 가져오기</button>
        </a>
        {isLoggedIn ? (
          <>
            <span className="welcome-text">{userName} 님</span>
            <button className="auth-btn" onClick={handleLogout}>로그아웃</button>
          </>
        ) : (
          <>
            <Link to="/login" className="auth-link">로그인</Link>
            <Link to="/signup" className="auth-link">회원가입</Link>
          </>
        )}
      </div>
    </nav>
  );
}
