from fastapi import APIRouter, HTTPException, Query, Depends
from sqlalchemy.orm import Session
from datetime import datetime

from .s3 import get_user_data
from .openai import analyze_data
from database import get_db
from login.crud import get_user_by_username

# 📦 이 라우터는 main.py에서 prefix="/analysis"로 붙습니다.
router = APIRouter()

@router.get("/{username}")  # 최종 URL: /analysis/{username}
async def get_analysis(
    username: str,
    year: str = Query(None),
    month: str = Query(None),
    mode: str = Query("month"),  # "month" 또는 "recent"
    db: Session = Depends(get_db)
):
    # 🔐 사용자 확인
    user = get_user_by_username(db, username)
    if not user:
        raise HTTPException(status_code=404, detail="해당 유저가 존재하지 않습니다.")

    real_name = user.name

    # 📅 최근 7일 모드일 경우 기준 날짜 고정
    fixed_today = datetime.strptime("2025-06-26", "%Y-%m-%d") if mode == "recent" else None

    # 📦 사용자 소비 데이터 가져오기
    user_data = get_user_data(
        real_name,
        year=year,
        month=month,
        mode=mode,
        today=fixed_today  # 👈 전달
    )

    if not user_data:
        raise HTTPException(status_code=404, detail="해당 소비 데이터를 찾을 수 없습니다.")

    # 🤖 AI 요약 분석 요청 — mode 값도 함께 전달
    ai_summary = analyze_data(real_name, user_data, year=year, month=month, mode=mode)

    # ✅ 응답 반환
    return {
        "username": username,
        "real_name": real_name,
        "year": year,
        "month": month,
        "data": user_data,
        "ai_summary": ai_summary
    }
