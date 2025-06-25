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

  // 사용자 정보를 URL 파라미터로 전달하는 함수들
  const handleChatClick = () => {
    const username = localStorage.getItem('username') || localStorage.getItem('name');
    if (username && isLoggedIn) {
      window.open(`https://eunbie.site/chat?user=${encodeURIComponent(username)}`, '_blank');
    } else {
      alert('먼저 로그인해주세요.');
    }
  };

  const handleDiaryClick = () => {
    const username = localStorage.getItem('username') || localStorage.getItem('name');
    if (username && isLoggedIn) {
      window.open(`https://eunbie.site/diary?user=${encodeURIComponent(username)}`, '_blank');
    } else {
      alert('먼저 로그인해주세요.');
    }
  };

  const handleBudgetClick = () => {
    const username = localStorage.getItem('username') || localStorage.getItem('name');
    if (username && isLoggedIn) {
      window.open(`https://eunbie.site/budgetA?user=${encodeURIComponent(username)}`, '_blank');
    } else {
      alert('먼저 로그인해주세요.');
    }
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
          
          {/* 기존 a 태그를 button으로 변경하여 사용자 정보 전달 */}
          <button onClick={handleChatClick} className="nav-button">
            Chat
          </button>
          
          <button onClick={handleDiaryClick} className="nav-button">
            Diary
          </button>
          
          <button onClick={handleBudgetClick} className="nav-button">
            Budget
          </button>
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