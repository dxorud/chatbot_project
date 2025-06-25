# backend/analysis/openai.py
from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_summary(timeseries):
    if not timeseries:
        return "데이터가 없습니다."

    sample = timeseries[:10]  # 너무 많으면 잘림 방지
    prompt = f"""
다음은 개인의 소비 내역과 감정 데이터입니다. 주요 소비 패턴과 감정 흐름을 간단히 요약해주세요.

{sample}

요약:
"""
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
    )

    return response.choices[0].message.content.strip()
