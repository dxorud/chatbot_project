import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './components/login'
import Analysis from './components/analysis'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/analysis" element={<Analysis />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
