import os
from dotenv import load_dotenv
from openai import OpenAI

# 🔐 환경 변수 로드
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if not OPENAI_API_KEY:
    load_dotenv()
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY 환경 변수가 설정되지 않았습니다. .env 또는 Docker 설정을 확인하세요.")

client = OpenAI(api_key=OPENAI_API_KEY)

# ✅ AI 소비 분석 요약 함수
def analyze_data(
    real_name: str,
    data: dict,
    mode: str = "recent",
    start_date: str = "",
    end_date: str = ""
) -> str:
    # ✅ 날짜 설명 구성
    if mode == "recent":
        date_info = "최근 7일간"
    elif mode == "range" and start_date and end_date:
        date_info = f"{start_date}부터 {end_date}까지"
    else:
        date_info = "최근 기간"

    # ✅ 빈 데이터 처리
    if not data.get("expenses") and not data.get("emotions"):
        return "분석할 소비 기록이 없습니다."

    # 🧠 프롬프트 구성
    content = f"""
    다음은 {real_name} 사용자의 {date_info} 소비 기록입니다.

    ▶ 소비 항목 요약:
    {data.get('expenses', {})}

    ▶ 감정 분포 요약:
    {data.get('emotions', {})}

    위 내용을 바탕으로 이 사용자의 소비 패턴과 감정 경향을 간결하고 명확하게 1~2문장으로 요약해줘.
    """

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "너는 소비와 감정 데이터를 분석하는 전문가야."},
                {"role": "user", "content": content.strip()}
            ]
        )

        result = response.choices[0].message.content.strip()
        print(f"✅ AI 소비 분석 결과:\n{result}")
        return result

    except Exception as e:
        print(f"❌ OpenAI 호출 오류: {e}")
        return "AI 분석을 불러오지 못했습니다. 다시 시도해 주세요."
