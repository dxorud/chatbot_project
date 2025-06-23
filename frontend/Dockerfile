# Node.js 기반 이미지 사용 (Vite 개발 서버 용도)
FROM node:18-alpine

# 작업 디렉토리 설정
WORKDIR /app

# package.json, package-lock.json만 먼저 복사하여 캐시 활용
COPY package*.json ./

# 의존성 설치
RUN npm install

# 소스 전체 복사 (여기에는 .env도 포함 가능)
COPY . .

# Vite 개발 서버가 사용할 포트
EXPOSE 5173

# Vite dev 서버 실행 - 반드시 0.0.0.0으로 외부 접근 허용
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "8505"]
