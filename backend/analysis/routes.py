from fastapi import APIRouter, HTTPException, Query, Depends
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import Optional

from .s3 import get_user_data
from .openai import analyze_data
from database import get_db
from login.crud import get_user_by_username

router = APIRouter()

@router.get("/{username}")  # 최종 URL: /analysis/{username}
async def get_analysis(
    username: str,
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    mode: str = Query("range"),  # "recent" 또는 "range"
    db: Session = Depends(get_db)
):
    # 🔐 사용자 확인
    user = get_user_by_username(db, username)
    if not user:
        raise HTTPException(status_code=404, detail="해당 유저가 존재하지 않습니다.")

    real_name = user.name

    # 📅 날짜 설정
    fixed_today = None
    if mode == "recent":
        fixed_today = datetime.now()  # ✅ 현재 날짜로 자동 설정
        start_date = (fixed_today - timedelta(days=6)).strftime("%Y-%m-%d")
        end_date = fixed_today.strftime("%Y-%m-%d")

    elif mode == "range":
        if not start_date or not end_date:
            raise HTTPException(status_code=400, detail="날짜 범위가 누락되었습니다.")
        try:
            datetime.strptime(start_date, "%Y-%m-%d")
            datetime.strptime(end_date, "%Y-%m-%d")
        except ValueError:
            raise HTTPException(status_code=400, detail="날짜 형식은 YYYY-MM-DD여야 합니다.")
    else:
        raise HTTPException(status_code=400, detail="mode는 'recent' 또는 'range'만 가능합니다.")

    # 📦 사용자 소비 데이터 가져오기
    user_data = get_user_data(
        real_name,
        start_date=start_date,
        end_date=end_date,
        mode=mode,
        today=fixed_today
    )

    if not user_data:
        raise HTTPException(status_code=404, detail="해당 소비 데이터를 찾을 수 없습니다.")

    # 🤖 AI 분석 결과 가져오기
    ai_summary = analyze_data(
        real_name,
        user_data,
        start_date=start_date,
        end_date=end_date,
        mode=mode
    )

    # ✅ 최종 응답
    return {
        "username": username,
        "real_name": real_name,
        "mode": mode,
        "start_date": start_date,
        "end_date": end_date,
        "data": user_data,
        "ai_summary": ai_summary
    }
