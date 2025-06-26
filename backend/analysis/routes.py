from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from database import get_db
from login.models import User
from .s3 import find_and_merge_s3_data
from .openai import generate_summary
from collections import defaultdict

router = APIRouter()


# ✅ username을 통해 사용자 name 조회
def get_name_by_username(username: str, db: Session) -> str:
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="사용자 이름을 찾을 수 없습니다.")
    return user.name


# ✅ 시계열 소비 데이터 조회 API
@router.post("/timeseries")
def get_timeseries(
    data: dict = Body(...),
    db: Session = Depends(get_db)
):
    username = data.get("username")
    start_date = data.get("start_date")
    end_date = data.get("end_date")

    if not username or not start_date or not end_date:
        raise HTTPException(status_code=400, detail="username, start_date, end_date는 필수입니다.")

    # 사용자 이름 가져오기
    name = get_name_by_username(username, db)

    # S3에서 데이터 조회 및 병합
    result = find_and_merge_s3_data(name, start_date, end_date)

    # 날짜 오름차순 정렬
    result.sort(key=lambda x: x["date"])

    # category, emotion 통계 집계
    category_sum = defaultdict(int)
    emotion_sum = defaultdict(int)
    for item in result:
        category_sum[item["category"]] += item["amount"]
        emotion_sum[item["emotion"]] += 1

    return {
        "timeseries": result,        # 라인 차트
        "details": result,           # 테이블
        "categorySum": category_sum, # 바 차트
        "emotionSum": emotion_sum    # 파이 차트
    }


# ✅ AI 소비 요약 요청 API
@router.post("/summary")
def get_ai_summary(data: dict = Body(...)):
    timeseries = data.get("data", [])

    if not isinstance(timeseries, list):
        raise HTTPException(status_code=400, detail="올바른 데이터 형식이 아닙니다.")

    summary = generate_summary(timeseries)
    return {"summary": summary}
