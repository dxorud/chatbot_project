from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
from login.router import router as login_router            
from analysis.routes import router as analysis_router    

app = FastAPI()

# ✅ CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",       # 로컬 개발용
        "http://3.104.128.7:5173"      # 배포 서버용
    ],
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
