import os
from dotenv import load_dotenv # 다른 .env 변수를 위해 이 줄은 유지합니다.
from openai import OpenAI

# 먼저 os.environ (Docker의 -e 옵션으로 전달된 환경 변수)에서 API 키를 가져옵니다.
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# 만약 os.environ에 API 키가 없다면, 그 다음에 .env 파일을 로드하여 시도합니다.
# 이 조건은 Docker -e 옵션을 사용하지 않을 때 .env 파일에서 키를 찾을 때 유용합니다.
if not OPENAI_API_KEY:
    load_dotenv() # .env 파일을 로드합니다.
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY") # .env 파일에서 다시 가져옵니다.

# 최종적으로 API 키가 설정되었는지 확인
if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY 환경 변수가 설정되지 않았습니다. GitHub Secrets, Dockerfile, 또는 .env 파일 설정을 확인하세요.")

client = OpenAI(api_key=OPENAI_API_KEY)

# 🔍 AI 소비 분석 요약 함수
def analyze_data(real_name: str, data: dict, year: str = "", month: str = "", mode: str = "month") -> str:
    if mode == "recent":
        date_info = "최근 7일간"
    elif year and month:
        date_info = f"{year}년 {month}월"
    else:
        date_info = "최근 한 달간"

    # 🧠 분석 요청 프롬프트 구성
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