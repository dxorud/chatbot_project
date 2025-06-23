import React, { useState, useRef, useEffect } from 'react';
import './Dropdown.css';

export default function Dropdown({ options, selected, setSelected, label }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="dropdown-wrapper" ref={wrapperRef}>
      <div className="dropdown-header" onClick={() => setOpen(!open)}>
        {selected ? `${selected}${label}` : `선택하세요`}
        <span className="dropdown-arrow">▼</span>
      </div>
      {open && (
        <div className="dropdown-list">
          {options.map((option) => (
            <div
              key={option}
              className="dropdown-item"
              onClick={() => {
                setSelected(option);
                setOpen(false);
              }}
            >
              {option}{label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
