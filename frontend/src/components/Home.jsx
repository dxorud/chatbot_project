import React, { useRef } from 'react';
import './Home.css';
import chatbotImage from '../assets/chatbot.png'; 

// 아이콘 예시 (직접 파일 import하거나 SVG 사용 가능)
import icon1 from '../assets/icon-analysis.png';
import icon2 from '../assets/icon-stats.png';
import icon3 from '../assets/icon-ai.png';
import icon4 from '../assets/icon-diary.png';
import icon5 from '../assets/icon-habit.png';

export default function Home() {
  const cardRef = useRef(null);

  const scrollLeft = () => {
    cardRef.current.scrollBy({ left: -320, behavior: 'smooth' });
  };

  const scrollRight = () => {
    cardRef.current.scrollBy({ left: 320, behavior: 'smooth' });
  };

  const features = [
    { title: '감정 분석', description: '소비와 감정을 연결해보세요.', icon: icon1 },
    { title: '소비 통계', description: '월별 소비 현황을 시각화합니다.', icon: icon2 },
    { title: 'AI 요약', description: '소비 패턴을 AI가 요약해드려요.', icon: icon3 },
    { title: '다이어리 기록', description: '감정 소비 다이어리를 작성해요.', icon: icon4 },
    { title: '추천 소비 습관', description: '당신에게 맞는 소비 습관을 제안해요.', icon: icon5 },
  ];

  return (
    <div className="home-container">
      {/* 상단 Hero */}
      <section className="hero-section">
        <div className="hero-text">
          <h1>감정 소비 챗봇에 오신 것을 환영합니다 💡</h1>
          <p>소비를 기록하고 분석하는 새로운 경험을 시작해보세요!</p>
        </div>
        <img src={chatbotImage} alt="감정 다이어리 챗봇" className="hero-image" />
      </section>

      {/* 카드 슬라이드 */}
      <section className="card-section">
        <button className="arrow left" onClick={scrollLeft}>{'<'}</button>
        <div className="card-container no-scrollbar" ref={cardRef}>
          {features.map((feature, index) => (
            <div className="feature-card" key={index}>
              <img src={feature.icon} alt={feature.title} className="card-icon" />
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
        <button className="arrow right" onClick={scrollRight}>{'>'}</button>
      </section>
    </div>
  );
}
