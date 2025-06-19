import React, { useState } from 'react';
import './analysis.css';
import Layout from './layout';
import robot from '../assets/chatbot_image_3.png';

export default function Analysis() {
  const [date, setDate] = useState('');

  const LeftSection = (
    <div className="left-box">
      <h3>감정별 소비 분포</h3>
      <div className="emotion-bars">
        <div className="bar-container"><div className="bar bar-1" style={{ height: '70%' }}></div><span>우울</span></div>
        <div className="bar-container"><div className="bar bar-2" style={{ height: '40%' }}></div><span>불안</span></div>
        <div className="bar-container"><div className="bar bar-3" style={{ height: '30%' }}></div><span>기쁨</span></div>
        <div className="bar-container"><div className="bar bar-4" style={{ height: '20%' }}></div><span>슬픔</span></div>
      </div>
      <img src={robot} alt="robot" className="robot-img" />
    </div>
  );

  const CenterSection = (
    <div className="center-box">
      <div className="summary">
        <h3>최근 우울한 감정에 의해 소비가 반복됐어요!</h3>
        <p>앞으로의 소비 계획을 세워볼까요?</p>
        <div className="line-chart">5일간 소비추이 그래프</div>
      </div>

      <div className="recommendation">
        <div className="card good">
          <h4>감정소비 대안</h4>
          <p>명상 앱 실행</p>
          <button>좋은 소비</button>
        </div>
        <div className="card saving">
          <h4>저축하기</h4>
          <p>나쁜 소비한 날 1000원 저축하기</p>
          <button>나쁜 소비</button>
        </div>
        <div className="card worry">
          <h4>불안</h4>
          <p>강연보기, 책 읽기</p>
          <button>나쁜 소비</button>
        </div>
      </div>
    </div>
  );

  return <Layout left={LeftSection} center={CenterSection} right={null} />;
}
