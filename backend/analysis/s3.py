import boto3
import json
import re
import os
from datetime import datetime
from dotenv import load_dotenv

# ✅ .env에서 AWS 키 로드
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env"))

# ✅ 버킷 이름은 코드에 직접 입력 (변수명은 그대로 유지)
S3_BUCKET_NAME = "kibwa-10"
FOLDER = "project/"  # 예: project/김소연_20250401~20250430.json

# ✅ boto3 클라이언트 (키는 .env에서 불러오고, 리전은 명시)
s3 = boto3.client(
    "s3",
    region_name="ap-southeast-2"  # ← 시드니 리전 (버킷과 일치해야 함)
)

def find_and_merge_s3_data(name: str, start_date: str, end_date: str):
    s = datetime.strptime(start_date, "%Y-%m-%d")
    e = datetime.strptime(end_date, "%Y-%m-%d")

    response = s3.list_objects_v2(Bucket=S3_BUCKET_NAME, Prefix=FOLDER)
    matched_files = []

    for obj in response.get("Contents", []):
        key = obj["Key"]
        if key.startswith(f"{FOLDER}{name}_"):
            match = re.search(r"_(\d{8})~(\d{8})\.json", key)
            if match:
                file_start = datetime.strptime(match.group(1), "%Y%m%d")
                file_end = datetime.strptime(match.group(2), "%Y%m%d")
                if file_end >= s and file_start <= e:
                    matched_files.append(key)

    merged_data = []
    for key in matched_files:
        obj = s3.get_object(Bucket=S3_BUCKET_NAME, Key=key)
        content = obj["Body"].read().decode("utf-8")
        json_data = json.loads(content)

        if isinstance(json_data, list):
            for entry in json_data:
                entry_date = entry.get("날짜")
                if not entry_date or not (s <= datetime.strptime(entry_date, "%Y-%m-%d") <= e):
                    continue
                for item in entry.get("소비목록", []):
                    try:
                        amount_raw = item.get("금액", 0)
                        if isinstance(amount_raw, str):
                            amount = int(amount_raw.replace(",", "").replace("원", "").strip())
                        else:
                            amount = amount_raw
                    except:
                        amount = 0

                    merged_data.append({
                        "date": entry_date,
                        "amount": amount,
                        "category": item.get("항목", "기타"),
                        "emotion": item.get("감정개입", "기타")
                    })

    return merged_data
