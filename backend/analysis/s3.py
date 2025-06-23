import boto3
import os
import json
import re
from datetime import datetime, timedelta
from dotenv import load_dotenv
from pathlib import Path

# 📌 .env 로드
BASE_DIR = Path(__file__).resolve().parent.parent
env_path = BASE_DIR / ".env"
load_dotenv(dotenv_path=env_path)

# 🔐 환경변수 기반 설정
s3 = boto3.client(
    's3',
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    region_name=os.getenv("AWS_DEFAULT_REGION")
)

BUCKET_NAME = os.getenv("S3_BUCKET_NAME")
PREFIX = "project/"

def get_user_data(real_name: str, year: str = None, month: str = None, mode: str = None, today: datetime = None):
    try:
        response = s3.list_objects_v2(Bucket=BUCKET_NAME, Prefix=PREFIX)
        if 'Contents' not in response:
            return None

        all_files = [obj['Key'] for obj in response['Contents'] if obj['Key'].endswith('.json')]
        selected_keys = []

        print(f"✅ 사용자 이름: {real_name}")
        print(f"📅 year: {year}, month: {month}, mode: {mode}")
        print(f"📂 전체 파일 개수: {len(all_files)}")

        if mode == "recent":
            # 📌 기준 날짜 설정 (기본: 오늘)
            if today is None:
                today = datetime.today()

            start_date = today - timedelta(days=6)
            end_date = today

            # 최근 모드는 모든 사용자 파일을 전부 가져와 내부에서 날짜 필터링
            selected_keys = [key for key in all_files if real_name in key]

        elif year and month:
            target_ym = f"{year}{month.zfill(2)}"
            for key in all_files:
                if real_name not in key:
                    continue
                match = re.search(r'_(\d{8})~(\d{8})\.json', key)
                if match:
                    start_date_str, end_date_str = match.groups()
                    if start_date_str[:6] <= target_ym <= end_date_str[:6]:
                        selected_keys.append(key)

        else:
            user_files = [k for k in all_files if real_name in k]
            if user_files:
                selected_keys = [sorted(user_files)[-1]]

        print(f"🎯 선택된 파일 키: {selected_keys}")

        if not selected_keys:
            return None

        merged_data = {
            "expenses": {},
            "emotions": {}
        }

        for key in selected_keys:
            obj = s3.get_object(Bucket=BUCKET_NAME, Key=key)
            file_content = obj['Body'].read().decode('utf-8')
            file_data = json.loads(file_content)

            if not isinstance(file_data, list):
                print(f"⚠️ 예상치 못한 구조: {type(file_data)}. 리스트 형식만 처리.")
                continue

            for day in file_data:
                date_str = day.get("날짜")
                if not date_str:
                    continue

                try:
                    date = datetime.strptime(date_str, "%Y-%m-%d")
                except:
                    continue

                # ✅ 최근 7일 분석 모드일 경우
                if mode == "recent" and today:
                    if not (0 <= (today - date).days <= 6):
                        continue

                # ✅ 월간 분석 모드일 경우
                elif mode != "recent" and year and month:
                    if date.year != int(year) or date.month != int(month):
                        continue

                for item in day.get("소비목록", []):
                    category = item.get("항목")
                    amount = item.get("금액", 0)
                    emotion = item.get("감정개입")

                    if category:
                        merged_data["expenses"][category] = merged_data["expenses"].get(category, 0) + amount
                    if emotion:
                        merged_data["emotions"][emotion] = merged_data["emotions"].get(emotion, 0) + 1

        # 감정 비율 계산
        total_emotions = sum(merged_data["emotions"].values())
        if total_emotions > 0:
            for k in merged_data["emotions"]:
                merged_data["emotions"][k] = round(merged_data["emotions"][k] / total_emotions * 100, 1)
        else:
            merged_data["emotions"] = {}

        return merged_data

    except Exception as e:
        print(f"❌ 오류 발생: {e}")
        return None
