import React, { useState } from 'react';
import Layout from './layout'; 
import './home.css';

export default function Home() {
  const centerContent = (
    <div className="home">
      <div className="home-welcome">
        <h1>😊 태경님, 반가워요!</h1>
        <p>오늘의 소비 감정을 돌아볼 준비 되셨나요?</p>
      </div>

      <div className="home-summary">
        <h2>📊 오늘의 소비 요약</h2>
        <div className="home-summary-cards">
          <div className="home-card">
            <span>총 소비 금액</span>
            <strong>25,000원</strong>
          </div>
          <div className="home-card">
            <span>소비 건수</span>
            <strong>3건</strong>
          </div>
          <div className="home-card">
            <span>주요 감정</span>
            <strong>😊 만족</strong>
          </div>
        </div>
      </div>

      <div className="home-actions">
        <h2>🧭 빠른 이동</h2>
        <div className="home-buttons">
          <a href="/analysis">감정 분석</a>
          <a href="/chat">챗봇 대화</a>
          <a href="/diary">소비 일기</a>
        </div>
      </div>

      <div className="home-tip">
        💡 <em>지금의 감정이 내 소비를 어떻게 바꾸었는지 살펴보는 건 어때요?</em>
      </div>
    </div>
  );

  return <Layout center={centerContent} />;
}
