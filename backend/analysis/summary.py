from fastapi import APIRouter, HTTPException, Query
from analysis.s3 import list_user_files, load_json_from_s3
from analysis.openai import summarize_expenses
from datetime import datetime

router = APIRouter()

@router.get("/{username}")
def get_summary(
    username: str,
    mode: str = Query("range", description="분석 모드: recent 또는 range"),
    start: str = Query(None, description="시작일 (YYYY-MM-DD)"),
    end: str = Query(None, description="종료일 (YYYY-MM-DD)")
):
    if mode != "range" or not start or not end:
        raise HTTPException(status_code=400, detail="시작일과 종료일이 필요합니다")

    try:
        start_dt = datetime.strptime(start, "%Y-%m-%d")
        end_dt = datetime.strptime(end, "%Y-%m-%d")

        files = list_user_files(username)
        total_expenses = {}
        emotion_counts = {}

        for file_key in files:
            try:
                date_str = file_key.split("_")[-1].replace(".json", "")
                file_date = datetime.strptime(date_str, "%Y-%m-%d")
                if not (start_dt <= file_date <= end_dt):
                    continue
            except:
                continue

            data = load_json_from_s3(file_key)
            for day in data:
                for item in day.get("소비목록", []):
                    category = item.get("항목", "기타")
                    total_expenses[category] = total_expenses.get(category, 0) + item.get("금액", 0)
                    emotion = item.get("감정키워드", "기타")
                    emotion_counts[emotion] = emotion_counts.get(emotion, 0) + 1

        ai_summary = summarize_expenses(total_expenses, emotion_counts)

        return {
            "data": {
                "expenses": total_expenses,
                "emotions": emotion_counts
            },
            "ai_summary": ai_summary
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"요약 분석 실패: {e}")
