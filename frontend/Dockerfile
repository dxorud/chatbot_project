# ✅ 1단계: 빌드용 이미지
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# ✅ 2단계: 빌드 결과만 사용하여 serve로 정적 호스팅
FROM node:18-alpine

WORKDIR /app
COPY --from=builder /app/dist ./dist
RUN npm install -g serve

EXPOSE 5173
CMD ["serve", "-s", "dist", "-l", "5173"]
