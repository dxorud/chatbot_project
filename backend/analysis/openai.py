from openai import OpenAI
import os
from dotenv import load_dotenv
from pathlib import Path

# 📌 .env 로드
BASE_DIR = Path(__file__).resolve().parent.parent
env_path = BASE_DIR / ".env"
load_dotenv(dotenv_path=env_path)

# ✅ OpenAI 클라이언트 초기화
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# 🔍 AI 소비 분석 요약 함수
def analyze_data(real_name: str, data: dict, year: str = "", month: str = "", mode: str = "month") -> str:
    # ⏱️ 날짜 정보 문구 설정
    if mode == "recent":
        date_info = "최근 7일간"
    elif year and month:
        date_info = f"{year}년 {month}월"
    else:
        date_info = "최근 한 달간"

    # 🧠 분석 요청 프롬프트
    content = f"""
    다음은 {real_name} 사용자의 {date_info} 소비 기록입니다.

    ▶ 소비 항목 요약:
    {data.get('expenses', {})}

    ▶ 감정 분포 요약:
    {data.get('emotions', {})}

    위 내용을 바탕으로 이 사용자의 소비 패턴과 감정 경향을 간결하고 명확하게 1~2문장으로 요약해줘.
    """

    try:
        # 🗣️ OpenAI API 호출
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "너는 소비와 감정 데이터를 분석하는 전문가야."},
                {"role": "user", "content": content.strip()}
            ]
        )

        result = response.choices[0].message.content.strip()
        print(f"✅ AI 소비 분석 결과:\n{result}")  # 🔎 디버깅 로그
        return result

    except Exception as e:
        print(f"❌ OpenAI 호출 오류: {e}")
        return "AI 분석을 불러오지 못했습니다. 다시 시도해 주세요."
