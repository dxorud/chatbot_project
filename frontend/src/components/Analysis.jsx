import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer
} from 'recharts';
import './Analysis.css';

const BACKEND_URL = 'https://advanced-closely-garfish.ngrok-free.app';

const EMOTION_COLORS = {
  '기쁨': '#fff176',
  '불안': '#81d4fa',
  '분노': '#ef9a9a',
  '슬픔': '#9575cd',
  '스트레스': '#ffcc80',
  '자기보상': '#b39ddb',
  '기타': '#e0e0e0'
};

const EMOTION_ICONS = {
  '기쁨': '😊', '불안': '😟', '분노': '😠',
  '슬픔': '😢', '스트레스': '😣', '자기보상': '🥹', '기타': '🙂'
};

const CATEGORY_ICONS = {
  '식비': '🍽️', '패션': '👗', '교통': '🚌',
  '카페': '☕', '스트레스 쇼핑': '🛍️', '점심식사': '🍱',
  '기타': '🛒'
};

export default function Analysis() {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [data, setData] = useState(null);
  const [summary, setSummary] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedName = localStorage.getItem('name');
    if (storedUsername) setUsername(storedUsername);
    if (storedName) setName(storedName);
  }, []);

  const handleAnalyze = async () => {
    if (!startDate || !endDate || !username) {
      setError('날짜를 선택해주세요.');
      return;
    }

    setLoading(true);
    setError('');
    setData(null);
    setSummary('');
    setRecommendation('');

    try {
      const res = await axios.post(`${BACKEND_URL}/analysis/timeseries`, {
        username,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0]
      });
      setData(res.data);

      const summaryRes = await axios.post(`${BACKEND_URL}/analysis/summary`, {
        data: res.data.timeseries,
        username
      });
      setSummary(summaryRes.data.summary);

      const mostSpent = Object.entries(res.data.categorySum).sort((a, b) => b[1] - a[1])[0];
      if (mostSpent) {
        setRecommendation(`${name}님은 '${mostSpent[0]}' 항목에 가장 많은 소비를 하셨어요. 조금 줄여보는 건 어떨까요?`);
      }
    } catch (err) {
      setError('분석에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount) => amount.toLocaleString('ko-KR') + '원';
  const totalEmotion = data ? Object.values(data.emotionSum).reduce((acc, val) => acc + val, 0) : 0;

  return (
    <div className="analysis-container">
      <h2>나의 소비 패턴은 어떻게 이루어졌을까?</h2>

      <div className="analysis-control">
        <label>시작일</label>
        <DatePicker
          selected={startDate}
          onChange={setStartDate}
          placeholderText="시작일"
          dateFormat="yyyy년 MM월 dd일"
          className="custom-datepicker"
        />
        <label>종료일</label>
        <DatePicker
          selected={endDate}
          onChange={setEndDate}
          placeholderText="종료일"
          dateFormat="yyyy년 MM월 dd일"
          className="custom-datepicker"
        />
        <button className="analyze-button" onClick={handleAnalyze}>분석하기</button>
      </div>

      {error && <p className="error-msg">{error}</p>}

      {loading && (
        <div className="loading-box">
          <div className="spinner" />
          <p>마음이가 분석 중이에요... 💭</p>
        </div>
      )}

      {recommendation && (
        <div className="recommendation-box">
          <h4>💡 마음이의 한마디</h4>
          <p>{recommendation}</p>
        </div>
      )}

      {data && (
        <>
          <div className="summary-cards">
            <div className="card card-emotion">
              <h4>🔥 주요 소비 항목</h4>
              <ul className="card-list emotion-list">
                {Object.entries(data.categorySum)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 3)
                  .map(([cat, amt]) => (
                    <li key={cat} className="card-item hover-card">
                      {CATEGORY_ICONS[cat] || '🛒'} {cat} - {formatAmount(amt)}
                    </li>
                  ))}
              </ul>
            </div>

            <div className="card card-emotion">
              <h4>😌 주요 감정</h4>
              <ul className="card-list emotion-list">
                {Object.entries(data.emotionSum)
                  .map(([emo, count]) => [emo || '기타', count])
                  .slice(0, 3)
                  .map(([emo, count]) => (
                    <li key={emo} className="card-item hover-card" style={{ backgroundColor: EMOTION_COLORS[emo] || '#eee' }}>
                      {EMOTION_ICONS[emo] || '🙂'} {emo} - {count}회
                    </li>
                  ))}
              </ul>
            </div>
          </div>

          <div className="chart chart-box">
            <h4>📊 소비 금액 그래프</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={data.timeseries}
                margin={{ top: 20, right: 30, left: 40, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  angle={-45}
                  textAnchor="end"
                  height={70}
                  interval={0}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  width={80}
                  tickFormatter={(v) => v.toLocaleString()}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value) => `${formatAmount(value)} (금액)`}
                  labelFormatter={(label) => label}
                />
                <Bar dataKey="amount" fill="#7c4dff" name="금액" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart chart-box">
            <h4>🧠 감정 비율</h4>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={Object.entries(data.emotionSum).map(([name, value]) => ({ name: name || '기타', value }))}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {Object.entries(data.emotionSum).map(([emo], i) => (
                    <Cell key={`cell-${i}`} fill={EMOTION_COLORS[emo || '기타'] || '#ccc'} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}회`} />
                <Legend />
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="16"
                  fill="#4b0082"
                >
                  총 {totalEmotion}회
                </text>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="ai-summary">
            <h4>💬 마음이가 말해줘요</h4>
            <blockquote>
              <p>
                <strong>{name}님</strong>
                {summary.replace(`${name}님`, '')}
              </p>
            </blockquote>
          </div>

          <div className="details-table">
            <h4>📋 소비 내역</h4>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>날짜</th>
                    <th>항목</th>
                    <th>금액</th>
                    <th>감정</th>
                  </tr>
                </thead>
                <tbody>
                  {data.details.map((item, i) => (
                    <tr key={i}>
                      <td>{item.date}</td>
                      <td>{item.category}</td>
                      <td>{formatAmount(item.amount)}</td>
                      <td style={{ backgroundColor: EMOTION_COLORS[item.emotion || '기타'] || '#eee' }}>
                        {EMOTION_ICONS[item.emotion || '기타'] || '🙂'} {item.emotion || '기타'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
