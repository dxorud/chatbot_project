import React, { useState } from 'react';
import Layout from './layout';
import './home.css';

export default function Home() {
  const LeftSection = (
    <div className="left-section">
      <h3>오늘의 감정소비 요약</h3>
      <div className="emotion-summary">
        <div className="emotion-item">😢 우울 소비: 60%</div>
        <div className="emotion-item">😰 불안 소비: 25%</div>
        <div className="emotion-item">😊 기쁨 소비: 15%</div>
      </div>
    </div>
  );

  const CenterSection = (
    <div className="center-section">
      <h3>AI 감정소비 피드백</h3>
      <div className="feedback-box">
        오늘은 약간의 충동구매가 있었어요.  
        감정소비를 줄이기 위해 산책이나 독서를 추천합니다 🌿
      </div>

      <div className="monthly-chart">
        <h4>월간 소비감정 추이</h4>
        <div className="chart-placeholder">📈 그래프 자리</div>
      </div>

      <div className="quick-menu">
        <button>감정소비 분석</button>
        <button>챗봇 대화</button>
        <button>소비일기 작성</button>
        <button>미래소비 예측</button>
      </div>
    </div>
  );

  const RightSection = (
    <div className="right-section">
      <h3>오늘의 응원메세지</h3>
      <p>당신은 오늘도 감정소비를 잘 관리하고 있습니다 💪</p>

      <div className="saving-box">
        <h4>이번달 저축 누적</h4>
        <p>₩ 28,000</p>
      </div>
    </div>
  );

  return <Layout left={LeftSection} center={CenterSection} right={RightSection} />;
}
