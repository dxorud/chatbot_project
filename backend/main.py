from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
from login.router import router as login_router
from analysis.routes import router as analysis_router
from dotenv import load_dotenv
load_dotenv()


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],           # 모든 도메인에서 접근 허용
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ DB 테이블 생성
Base.metadata.create_all(bind=engine)

# ✅ 라우터 등록
app.include_router(login_router, prefix="/auth")           # 로그인/회원가입 라우터
app.include_router(analysis_router, prefix="/analysis")    # 소비 분석 라우터

# ✅ 서버 상태 확인용 라우터
@app.get("/")
def health_check():
    return {"status": "Emotion FastAPI Server Running!"}
