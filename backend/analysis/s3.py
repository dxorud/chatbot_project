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

# 🔐 환경변수 기반 S3 설정
s3 = boto3.client(
    's3',
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    region_name=os.getenv("AWS_DEFAULT_REGION")
)

BUCKET_NAME = os.getenv("S3_BUCKET_NAME")
PREFIX = "project/"

# ✅ 날짜 겹침 여부 확인
def date_ranges_overlap(start1, end1, start2, end2):
    return end1 >= start2 and end1 >= start1 and end2 >= start1

def get_user_data(real_name: str, mode: str, today: datetime = None, start_date: str = None, end_date: str = None):
    try:
        response = s3.list_objects_v2(Bucket=BUCKET_NAME, Prefix=PREFIX)
        if 'Contents' not in response:
            return None

        all_files = [obj['Key'] for obj in response['Contents'] if obj['Key'].endswith('.json') and real_name in obj['Key']]
        selected_keys = []

        # ✅ 날짜 기준 정의
        if mode == "recent":
            if today is None:
                today = datetime.today()
            start_dt = today - timedelta(days=6)
            end_dt = today
        elif mode == "range":
            if not start_date or not end_date:
                return None
            try:
                start_dt = datetime.strptime(start_date, "%Y-%m-%d")
                end_dt = datetime.strptime(end_date, "%Y-%m-%d")
            except ValueError:
                return None
        else:
            return None

        # ✅ 파일명에 포함된 날짜 범위 기준으로 필터링
        for key in all_files:
            match = re.search(r'_(\d{8})~(\d{8})\.json', key)
            if match:
                file_start = datetime.strptime(match.group(1), "%Y%m%d")
                file_end = datetime.strptime(match.group(2), "%Y%m%d")
                if date_ranges_overlap(file_start, file_end, start_dt, end_dt):
                    selected_keys.append(key)

        if not selected_keys:
            return None

        print(f"📁 선택된 파일 수: {len(selected_keys)}")

        # ✅ 데이터 병합
        merged_data = {
            "expenses": {},
            "emotions": {}
        }

        for key in selected_keys:
            obj = s3.get_object(Bucket=BUCKET_NAME, Key=key)
            content = obj['Body'].read().decode('utf-8')
            file_data = json.loads(content)

            if not isinstance(file_data, list):
                continue

            for day in file_data:
                date_str = day.get("날짜")
                if not date_str:
                    continue
                try:
                    record_date = datetime.strptime(date_str, "%Y-%m-%d")
                except:
                    continue

                # ✅ 범위 내 데이터만 포함
                if not (start_dt <= record_date <= end_dt):
                    continue

                for item in day.get("소비목록", []):
                    category = item.get("항목")
                    amount = item.get("금액", 0)
                    emotion = item.get("감정개입")

                    if category:
                        merged_data["expenses"][category] = merged_data["expenses"].get(category, 0) + amount
                    if emotion:
                        merged_data["emotions"][emotion] = merged_data["emotions"].get(emotion, 0) + 1

        # ✅ 감정 비율 계산
        total = sum(merged_data["emotions"].values())
        if total > 0:
            for k in merged_data["emotions"]:
                merged_data["emotions"][k] = round(merged_data["emotions"][k] / total * 100, 1)
        else:
            merged_data["emotions"] = {}

        return merged_data

    except Exception as e:
        print(f"❌ 오류 발생: {e}")
        return None
