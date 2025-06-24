import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Dropdown from './Dropdown';
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import './Analysis.css';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#ffbb28'];

export default function Analysis() {
  const [username, setUsername] = useState('');
  const [data, setData] = useState(null);
  const [summary, setSummary] = useState('');
  const [year, setYear] = useState('2025');
  const [month, setMonth] = useState('06');
  const [error, setError] = useState('');

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2010 + 1 }, (_, i) => (2010 + i).toString());
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        setUsername(parsed.username);
      } catch {
        setError('사용자 정보 파싱에 실패했습니다.');
      }
    } else {
      setError('로그인된 사용자 정보를 찾을 수 없습니다.');
    }
  }, []);

  useEffect(() => {
    if (username) {
      fetchMonthAnalysis();
    }
  }, [username, year, month]);

  const fetchMonthAnalysis = async () => {
    try {
      setError('');
      const url = `https://advanced-closely-garfish.ngrok-free.app/analysis/${username}?year=${year}&month=${month}&mode=month`;
      const res = await axios.get(url);
      setData(res.data.data);
      setSummary(res.data.ai_summary);
    } catch (err) {
      console.error('월간 데이터 불러오기 실패:', err);
      setError('해당 기간의 데이터를 찾을 수 없습니다.');
    }
  };

  const handleRecent7Analysis = async () => {
    try {
      setError('');
      const url = `https://advanced-closely-garfish.ngrok-free.app/analysis/${username}?mode=recent&today=2025-06-26`;
      const res = await axios.get(url);
      setData(res.data.data);
      setSummary(res.data.ai_summary);
    } catch (err) {
      console.error('최근 7일 분석 실패:', err);
      setError('최근 7일 데이터를 찾을 수 없습니다.');
    }
  };

  const expenseData = data?.expenses
    ? Object.entries(data.expenses).map(([name, value]) => ({ name, value }))
    : [];

  const emotionData = data?.emotions
    ? Object.entries(data.emotions).map(([name, value]) => ({ name, value }))
    : [];

  const getIcon = (name) => {
    const icons = {
      '점심식사': '🍱',
      '카페': '☕',
      '패션': '🛍️',
      '스트레스 쇼핑': '🛒',
      '업무비품': '📎',
      '월급': '💰',
      '스트레스': '😣',
      '자기보상': '🎁'
    };
    return icons[name] || '💡';
  };

  return (
    <div className="analysis-container">
      <h2>📊 나의 소비 패턴은 어떻게 이루어졌을까?</h2>

      <div className="analysis-control">
        <Dropdown options={years} selected={year} setSelected={setYear} label="년" />
        <Dropdown options={months} selected={month} setSelected={setMonth} label="월" />
        <button onClick={fetchMonthAnalysis}>월간 분석</button>
        <button onClick={handleRecent7Analysis}>최근 7일 분석</button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!data && !error ? (
        <p>분석 데이터를 불러오는 중입니다...</p>
      ) : data ? (
        <>
          <div className="analysis-card-row">
            <div className="analysis-card">
              <h3>💳 주요 지출 항목</h3>
              <ul>
                {expenseData.map(item => (
                  <li key={item.name}><span>{getIcon(item.name)}</span> {item.name}: {item.value.toLocaleString()}원</li>
                ))}
              </ul>
            </div>
            <div className="analysis-card">
              <h3>😊 주요 감정</h3>
              {emotionData.length > 0 ? (
                <ul>
                  {emotionData.map(item => (
                    <li key={item.name}><span>{getIcon(item.name)}</span> {item.name}: {item.value}%</li>
                  ))}
                </ul>
              ) : (
                <p className="empty-emotion-message">감정 소비가 없습니다.</p>
              )}
            </div>
          </div>

          <div className="graph-row">
            <div className="graph-box">
              <h3>📊 지출 항목 그래프</h3>
              {expenseData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={expenseData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => value.toLocaleString()} />
                    <Tooltip formatter={(value) => `${value.toLocaleString()}원`} />
                    <Bar dataKey="value" fill="#8884d8">
                      <LabelList dataKey="value" position="top" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p>지출 데이터가 없습니다.</p>
              )}
            </div>

            <div className="graph-box">
              <h3>🍡 감정 비율 그래프</h3>
              {emotionData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={emotionData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}>
                      {emotionData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p>감정 데이터가 없습니다.</p>
              )}
            </div>
          </div>

          <div className="graph-row">
            <div className="graph-box ai-summary-card">
              <h3>✨ AI 분석 인사이트</h3>
              <p>{summary}</p>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
