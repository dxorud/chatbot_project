FROM python:3.10-slim

# 시스템 패키지 업데이트 및 설치 (필요 시)
RUN apt-get update && apt-get install -y build-essential

# 작업 디렉토리 생성
WORKDIR /app

# 의존성 설치
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 프로젝트 전체 복사
COPY . .

# 환경변수 설정 (예: UTF-8 처리, 필요 시)
ENV PYTHONUNBUFFERED=1

# FastAPI 서버 실행
EXPOSE 5000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "5000"]
