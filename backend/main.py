from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
from login.router import router as login_router
from analysis.routes import router as analysis_router
from dotenv import load_dotenv
import os


load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env"))


app = FastAPI()

# ✅ CORS 설정 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,  # ✅ 이때는 credentials 사용 불가 (쿠키/세션 등)
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ DB 테이블 자동 생성
Base.metadata.create_all(bind=engine)

# ✅ 라우터 등록
app.include_router(login_router, prefix="/auth", tags=["Authentication"])
app.include_router(analysis_router, prefix="/analysis", tags=["Analysis"])

# ✅ 서버 상태 확인용 기본 엔드포인트
@app.get("/")
def health_check():
    return {"status": "✅ Emotion FastAPI Server Running!"}
